const { validationResult } = require('express-validator');
const { ItineraryTemplate, ItineraryRequest } = require('../models');
const { matchItineraries } = require('../utils/itineraryMatcher');

const VALID_LOCATIONS = ['coastal', 'hill_country', 'traditional'];
const VALID_MODES = ['public_transport', 'tuk_tuk', 'car', 'van'];

/**
 * POST /api/itineraries/build
 * Accepts the "Create Your Own Itinerary" form, scores it against the
 * seeded ItineraryTemplate catalog and returns the 5 best matches.
 * Works for both guests and logged-in users (optionalAuth). When a user
 * is logged in, the request + matches are linked to their account so they
 * can revisit it from the dashboard.
 */
exports.build = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const {
      name,
      adults,
      children = 0,
      hasDrivingLicense = false,
      locationPreferences = [],
      travelMode,
      budget,
    } = req.body;

    const cleanedLocations = (Array.isArray(locationPreferences) ? locationPreferences : [locationPreferences])
      .filter((loc) => VALID_LOCATIONS.includes(loc));

    if (!VALID_MODES.includes(travelMode)) {
      return res.status(400).json({ message: `travelMode must be one of ${VALID_MODES.join(', ')}` });
    }

    const templates = await ItineraryTemplate.findAll();

    const preferences = {
      adults: Number(adults),
      children: Number(children),
      hasDrivingLicense: Boolean(hasDrivingLicense),
      locationPreferences: cleanedLocations,
      travelMode,
      budget: Number(budget),
    };

    const matches = matchItineraries(templates, preferences, 5);

    const matchedTemplateIds = matches.map((m) => m.template.id);

    const savedRequest = await ItineraryRequest.create({
      userId: req.user ? req.user.id : null,
      name,
      adults: preferences.adults,
      children: preferences.children,
      hasDrivingLicense: preferences.hasDrivingLicense,
      locationPreferences: cleanedLocations,
      travelMode,
      budget: preferences.budget,
      matchedTemplateIds,
    });

    res.status(201).json({
      requestId: savedRequest.id,
      totalHeadcount: preferences.adults + preferences.children,
      matches: matches.map((m) => ({
        ...m.template,
        matchScore: m.score,
        matchBreakdown: m.breakdown,
      })),
    });
  } catch (err) {
    next(err);
  }
};

exports.getTemplates = async (req, res, next) => {
  try {
    const templates = await ItineraryTemplate.findAll();
    res.json(templates);
  } catch (err) {
    next(err);
  }
};

exports.createTemplate = async (req, res, next) => {
  try {
    const template = await ItineraryTemplate.create(req.body);
    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const template = await ItineraryTemplate.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Itinerary template not found.' });
    await template.update(req.body);
    res.json(template);
  } catch (err) {
    next(err);
  }
};

exports.removeTemplate = async (req, res, next) => {
  try {
    const template = await ItineraryTemplate.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: 'Itinerary template not found.' });
    await template.destroy();
    res.json({ message: 'Itinerary template deleted.' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/itineraries/mine - requires auth. Returns the logged-in user's
 * past "Create Your Own Itinerary" requests along with the matched
 * templates resolved back into full objects.
 */
exports.getMine = async (req, res, next) => {
  try {
    const requests = await ItineraryRequest.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    const allTemplateIds = [...new Set(requests.flatMap((r) => r.matchedTemplateIds))];
    const templates = await ItineraryTemplate.findAll({ where: { id: allTemplateIds } });
    const templateMap = new Map(templates.map((t) => [t.id, t]));

    const result = requests.map((r) => ({
      id: r.id,
      name: r.name,
      adults: r.adults,
      children: r.children,
      hasDrivingLicense: r.hasDrivingLicense,
      locationPreferences: r.locationPreferences,
      travelMode: r.travelMode,
      budget: r.budget,
      createdAt: r.createdAt,
      matches: r.matchedTemplateIds.map((id) => templateMap.get(id)).filter(Boolean),
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

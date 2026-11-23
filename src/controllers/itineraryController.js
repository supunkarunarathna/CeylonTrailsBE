const { validationResult } = require('express-validator');
const { ItineraryTemplate, ItineraryRequest, User } = require('../models');
const { matchItineraries } = require('../utils/itineraryMatcher');

const VALID_LOCATIONS = ['coastal', 'hill_country', 'traditional'];
const VALID_MODES = ['public_transport', 'tuk_tuk', 'car', 'van'];

/**
 * POST /api/itineraries/build
 * Requires login (protect middleware). Accepts the "Create Your Own
 * Itinerary" form, scores it against the seeded ItineraryTemplate catalog
 * and returns the 5 best matches. The request + matches are linked to the
 * logged-in user's account so they can revisit it from the dashboard.
 */
exports.build = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const {
      name,
      contactNumber,
      passportNo,
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
      userId: req.user.id,
      name,
      contactNumber: contactNumber.trim(),
      passportNo: passportNo.trim().toUpperCase(),
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

/**
 * GET /api/itineraries/admin - admin only. Paginated, filterable listing of
 * every "Create Your Own Itinerary" submission (guests included).
 *
 * Filtering happens in-memory after one bounded query rather than as
 * per-column SQL WHERE clauses. That's a deliberate trade-off: several
 * columns here (locationPreferences, matchedTemplateIds) are JSON arrays,
 * and this project also runs on MariaDB, where JSON is just a LONGTEXT
 * alias with no native array-containment operators - so a single filtering
 * strategy that works identically on both plain columns and JSON-array
 * columns, and on both MySQL and MariaDB, is worth more here than raw SQL
 * push-down. The `limit: 5000` cap keeps this bounded; if this table grows
 * far beyond that in production, the flat-column filters (name, contact
 * number, passport no, travel mode, etc.) should move to real SQL WHERE
 * clauses first.
 */
exports.adminList = async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '10',
      name = '',
      contactNumber = '',
      passportNo = '',
      travelMode = '',
      hasDrivingLicense = '', // 'true' | 'false' | ''
      locationPreference = '', // coastal | hill_country | traditional | ''
      adults = '',
      children = '',
      minBudget = '',
      maxBudget = '',
      dateFrom = '',
      dateTo = '',
      submittedBy = '',
    } = req.query;

    const requests = await ItineraryRequest.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 5000,
    });

    const norm = (v) => String(v ?? '').toLowerCase();

    const filtered = requests.filter((r) => {
      if (name && !norm(r.name).includes(norm(name))) return false;
      if (contactNumber && !norm(r.contactNumber).includes(norm(contactNumber))) return false;
      if (passportNo && !norm(r.passportNo).includes(norm(passportNo))) return false;
      if (travelMode && r.travelMode !== travelMode) return false;
      if (hasDrivingLicense !== '' && r.hasDrivingLicense !== (hasDrivingLicense === 'true')) return false;
      if (locationPreference && !(r.locationPreferences || []).includes(locationPreference)) return false;
      if (adults !== '' && Number(r.adults) !== Number(adults)) return false;
      if (children !== '' && Number(r.children) !== Number(children)) return false;
      if (minBudget !== '' && Number(r.budget) < Number(minBudget)) return false;
      if (maxBudget !== '' && Number(r.budget) > Number(maxBudget)) return false;
      if (dateFrom && new Date(r.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(r.createdAt) > new Date(new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1)) return false;
      if (submittedBy) {
        const submitterText = r.user ? `${r.user.name} ${r.user.email}` : 'guest';
        if (!norm(submitterText).includes(norm(submittedBy))) return false;
      }
      return true;
    });

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    const start = (pageNum - 1) * limitNum;
    const pageItems = filtered.slice(start, start + limitNum);

    // Resolve the matched itinerary template ids on this page into titles.
    const templateIds = [...new Set(pageItems.flatMap((r) => r.matchedTemplateIds || []))];
    const templates = templateIds.length
      ? await ItineraryTemplate.findAll({ where: { id: templateIds }, attributes: ['id', 'title'] })
      : [];
    const templateMap = new Map(templates.map((t) => [t.id, t.title]));

    const data = pageItems.map((r) => ({
      id: r.id,
      name: r.name,
      contactNumber: r.contactNumber,
      passportNo: r.passportNo,
      adults: r.adults,
      children: r.children,
      hasDrivingLicense: r.hasDrivingLicense,
      locationPreferences: r.locationPreferences,
      travelMode: r.travelMode,
      budget: r.budget,
      matchedTitles: (r.matchedTemplateIds || []).map((id) => templateMap.get(id)).filter(Boolean),
      submittedBy: r.user ? `${r.user.name} (${r.user.email})` : 'Guest',
      createdAt: r.createdAt,
    }));

    res.json({ data, total, page: pageNum, limit: limitNum, totalPages });
  } catch (err) {
    next(err);
  }
};

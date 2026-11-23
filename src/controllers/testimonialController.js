const { validationResult } = require('express-validator');
const { Testimonial } = require('../models');

const DUPLICATE_TOUR_CODE_MESSAGE = 'Sorry, only one review can be posted per tour code.';

exports.getAll = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll({ order: [['createdAt', 'DESC']] });
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { name, country, rating, message, tourCode } = req.body;
    // Normalize to uppercase so "abc123" and "ABC123" are treated as the
    // same code - prevents trivially reusing a code by changing its case.
    const normalizedTourCode = tourCode.trim().toUpperCase();

    const existing = await Testimonial.findOne({ where: { tourCode: normalizedTourCode } });
    if (existing) {
      return res.status(409).json({ message: DUPLICATE_TOUR_CODE_MESSAGE });
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      country: country ? country.trim() : null,
      rating: Number(rating),
      message: message.trim(),
      tourCode: normalizedTourCode,
    });

    res.status(201).json(testimonial);
  } catch (err) {
    // Guard against a race condition: two requests with the same tour code
    // submitted at nearly the same instant could both pass the findOne
    // check above before either INSERT completes. The database's unique
    // constraint is the real source of truth here - translate its
    // violation into the same friendly message instead of a raw SQL error.
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: DUPLICATE_TOUR_CODE_MESSAGE });
    }
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found.' });
    await testimonial.destroy();
    res.json({ message: 'Testimonial deleted.' });
  } catch (err) {
    next(err);
  }
};

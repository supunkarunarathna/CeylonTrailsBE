const { Testimonial } = require('../models');

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
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (err) {
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

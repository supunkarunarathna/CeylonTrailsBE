const { Op } = require('sequelize');
const { Tour } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, minDays, maxDays, featured, search } = req.query;
    const where = {};
    if (category) where.category = category;
    if (featured) where.featured = featured === 'true';
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }
    if (minDays || maxDays) {
      where.durationDays = {};
      if (minDays) where.durationDays[Op.gte] = Number(minDays);
      if (maxDays) where.durationDays[Op.lte] = Number(maxDays);
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { summary: { [Op.like]: `%${search}%` } },
      ];
    }

    const tours = await Tour.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(tours);
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const tour = await Tour.findOne({ where: { slug: req.params.slug } });
    if (!tour) return res.status(404).json({ message: 'Tour not found.' });
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found.' });
    await tour.update(req.body);
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found.' });
    await tour.destroy();
    res.json({ message: 'Tour deleted.' });
  } catch (err) {
    next(err);
  }
};

const { Op } = require('sequelize');
const { Hotel } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { region, minPrice, maxPrice, search } = req.query;
    const where = {};
    if (region) where.region = region;
    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight[Op.gte] = Number(minPrice);
      if (maxPrice) where.pricePerNight[Op.lte] = Number(maxPrice);
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }
    const hotels = await Hotel.findAll({ where, order: [['rating', 'DESC']] });
    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ where: { slug: req.params.slug } });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found.' });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found.' });
    await hotel.update(req.body);
    res.json(hotel);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found.' });
    await hotel.destroy();
    res.json({ message: 'Hotel deleted.' });
  } catch (err) {
    next(err);
  }
};

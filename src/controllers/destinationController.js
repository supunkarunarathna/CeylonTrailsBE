const { Destination } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { region } = req.query;
    const where = region ? { region } : undefined;
    const destinations = await Destination.findAll({ where, order: [['name', 'ASC']] });
    res.json(destinations);
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const destination = await Destination.findOne({ where: { slug: req.params.slug } });
    if (!destination) return res.status(404).json({ message: 'Destination not found.' });
    res.json(destination);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json(destination);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found.' });
    await destination.update(req.body);
    res.json(destination);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found.' });
    await destination.destroy();
    res.json({ message: 'Destination deleted.' });
  } catch (err) {
    next(err);
  }
};

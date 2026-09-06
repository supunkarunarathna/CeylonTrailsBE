const { BlogPost } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const posts = await BlogPost.findAll({ order: [['publishedAt', 'DESC']] });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ message: 'Blog post not found.' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found.' });
    await post.destroy();
    res.json({ message: 'Blog post deleted.' });
  } catch (err) {
    next(err);
  }
};

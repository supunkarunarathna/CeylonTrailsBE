const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BlogPost = sequelize.define('BlogPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(220),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(240),
    allowNull: false,
    unique: true,
  },
  excerpt: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  author: {
    type: DataTypes.STRING(120),
    allowNull: false,
    defaultValue: 'Ceylon Trails Team',
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'blog_posts',
});

module.exports = BlogPost;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { jsonGetter } = require('../utils/jsonField');

const Tour = sequelize.define('Tour', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(220),
    allowNull: false,
    unique: true,
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('coastal', 'hill_country', 'cultural', 'wildlife', 'adventure', 'family'),
    allowNull: false,
  },
  durationDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get: jsonGetter('images', []),
  },
  highlights: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get: jsonGetter('highlights', []),
  },
  dayPlan: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get: jsonGetter('dayPlan', []),
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    defaultValue: 4.5,
  },
}, {
  tableName: 'tours',
});

module.exports = Tour;

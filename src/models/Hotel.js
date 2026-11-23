const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { jsonGetter } = require('../utils/jsonField');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(180),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
  },
  location: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  region: {
    type: DataTypes.ENUM('coastal', 'hill_country', 'cultural_triangle', 'wildlife', 'city'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    defaultValue: 4.5,
  },
  amenities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get: jsonGetter('amenities', []),
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get: jsonGetter('images', []),
  },
}, {
  tableName: 'hotels',
});

module.exports = Hotel;

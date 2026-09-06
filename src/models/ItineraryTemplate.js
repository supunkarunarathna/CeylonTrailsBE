const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * ItineraryTemplate represents a pre-built sample itinerary that the
 * "Create Your Own Itinerary" matching engine scores against a visitor's
 * preferences. Seed data covers combinations of location type, travel mode
 * and budget tier so that meaningful top-5 matches can always be produced.
 */
const ItineraryTemplate = sequelize.define('ItineraryTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // One or more of: coastal, hill_country, traditional
  locationTypes: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  // One of: public_transport, tuk_tuk, car, van
  travelMode: {
    type: DataTypes.ENUM('public_transport', 'tuk_tuk', 'car', 'van'),
    allowNull: false,
  },
  requiresLicense: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  minHeadcount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  maxHeadcount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 8,
  },
  durationDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pricePerPerson: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  dayPlan: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: 'itinerary_templates',
});

module.exports = ItineraryTemplate;

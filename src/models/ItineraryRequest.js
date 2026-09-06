const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * ItineraryRequest stores every submission of the "Create Your Own
 * Itinerary" form (from the public form fields) plus the ids of the
 * matched ItineraryTemplate rows that were returned to the visitor.
 */
const ItineraryRequest = sequelize.define('ItineraryRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // guests can use the builder without logging in
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  adults: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  children: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  hasDrivingLicense: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  locationPreferences: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  travelMode: {
    type: DataTypes.ENUM('public_transport', 'tuk_tuk', 'car', 'van'),
    allowNull: false,
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  matchedTemplateIds: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: 'itinerary_requests',
});

module.exports = ItineraryRequest;

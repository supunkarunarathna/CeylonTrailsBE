const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { jsonGetter } = require('../utils/jsonField');

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
  contactNumber: {
    // WhatsApp contact number, so our team can follow up on a match.
    // defaultValue: '' lets `sync({ alter: true })` add this as a NOT NULL
    // column even on a table that already has rows from before this field
    // existed (they backfill to '' instead of the ALTER failing).
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: '',
  },
  passportNo: {
    // Collected up front so visa/permit arrangements can start once a
    // matched itinerary turns into a real booking. Sensitive - only ever
    // exposed to admin accounts (see itineraryController.adminList).
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: '',
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
    get: jsonGetter('locationPreferences', []),
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
    get: jsonGetter('matchedTemplateIds', []),
  },
}, {
  tableName: 'itinerary_requests',
});

module.exports = ItineraryRequest;

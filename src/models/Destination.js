const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { jsonGetter } = require('../utils/jsonField');

const Destination = sequelize.define('Destination', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(160),
    allowNull: false,
    unique: true,
  },
  region: {
    type: DataTypes.ENUM('coastal', 'hill_country', 'cultural_triangle', 'wildlife', 'city'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    // Cover image used on listing cards (Destinations grid, Home page).
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  images: {
    // Gallery images shown on the destination detail page.
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get: jsonGetter('images', []),
  },
  famousFor: {
    // Short bullet points on what the area is known for.
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get: jsonGetter('famousFor', []),
  },
  activities: {
    // Things travelers can do in this area.
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    get: jsonGetter('activities', []),
  },
  emergencyContacts: {
    // { hospital: { name, note }, policeStation: { name, note } } - the
    // nearest main hospital/police station for this area. Nationwide
    // emergency hotlines (Police 119 / Ambulance 1990) are shown alongside
    // this on the frontend rather than stored per destination.
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    get: jsonGetter('emergencyContacts', null),
  },
}, {
  tableName: 'destinations',
});

module.exports = Destination;

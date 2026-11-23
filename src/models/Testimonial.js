const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  tourCode: {
    // The code from a traveler's booking/tour confirmation. Required by
    // the public submission form (enforced in testimonialRoutes.js) and
    // unique in the database, so a given tour code can only be used to
    // post one review. Nullable at the DB level (rather than NOT NULL) so
    // altering an existing table with pre-seeded/admin-added rows that
    // predate this field doesn't fail - MySQL/MariaDB allow multiple NULLs
    // under a UNIQUE constraint, so this doesn't weaken the "one review per
    // code" rule for anything actually submitted through the form.
    type: DataTypes.STRING(40),
    allowNull: true,
    unique: true,
  },
}, {
  tableName: 'testimonials',
});

module.exports = Testimonial;

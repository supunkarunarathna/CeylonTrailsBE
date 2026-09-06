const sequelize = require('../config/db');
const User = require('./User');
const Destination = require('./Destination');
const Tour = require('./Tour');
const Hotel = require('./Hotel');
const Testimonial = require('./Testimonial');
const BlogPost = require('./BlogPost');
const Inquiry = require('./Inquiry');
const ItineraryTemplate = require('./ItineraryTemplate');
const ItineraryRequest = require('./ItineraryRequest');

// Associations
User.hasMany(ItineraryRequest, { foreignKey: 'userId', as: 'itineraryRequests' });
ItineraryRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Destination,
  Tour,
  Hotel,
  Testimonial,
  BlogPost,
  Inquiry,
  ItineraryTemplate,
  ItineraryRequest,
};

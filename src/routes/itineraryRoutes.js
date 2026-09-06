const express = require('express');
const { body } = require('express-validator');
const itineraryController = require('../controllers/itineraryController');
const { protect, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public "Create Your Own Itinerary" form submission (works for guests too)
router.post(
  '/build',
  optionalAuth,
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('adults').isInt({ min: 1 }).withMessage('At least 1 adult is required.'),
    body('children').optional().isInt({ min: 0 }).withMessage('Children must be 0 or more.'),
    body('hasDrivingLicense').optional().isBoolean().withMessage('hasDrivingLicense must be true or false.'),
    body('locationPreferences').isArray({ min: 1 }).withMessage('Select at least one preferred location type.'),
    body('travelMode').notEmpty().withMessage('Travel mode is required.'),
    body('budget').isFloat({ min: 1 }).withMessage('Budget must be a positive number.'),
  ],
  itineraryController.build
);

router.get('/mine', protect, itineraryController.getMine);

// Admin management of the itinerary template catalog used for matching
router.get('/templates', itineraryController.getTemplates);
router.post('/templates', protect, requireAdmin, itineraryController.createTemplate);
router.put('/templates/:id', protect, requireAdmin, itineraryController.updateTemplate);
router.delete('/templates/:id', protect, requireAdmin, itineraryController.removeTemplate);

module.exports = router;

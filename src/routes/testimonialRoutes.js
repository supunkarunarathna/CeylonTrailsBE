const express = require('express');
const { body } = require('express-validator');
const testimonialController = require('../controllers/testimonialController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', testimonialController.getAll);

// Public: any visitor (tourist) can leave a star-rated review, no login
// required. Shown on the Blog page's "Traveler Feedback" section.
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Please enter your name.'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Please select a rating between 1 and 5 stars.'),
    body('message').trim().isLength({ min: 10 }).withMessage('Please write at least 10 characters of feedback.'),
    body('country').optional({ checkFalsy: true }).trim().isLength({ max: 80 }),
    body('tourCode')
      .trim()
      .notEmpty()
      .withMessage('Please enter your tour code.')
      .isLength({ min: 4, max: 40 })
      .withMessage('Tour code must be between 4 and 40 characters.'),
  ],
  testimonialController.create
);

router.delete('/:id', protect, requireAdmin, testimonialController.remove);

module.exports = router;

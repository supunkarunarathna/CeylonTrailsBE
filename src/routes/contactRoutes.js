const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('A valid email is required.'),
    body('message').trim().notEmpty().withMessage('Message is required.'),
  ],
  contactController.submit
);

router.get('/', protect, requireAdmin, contactController.getAll);
router.put('/:id/status', protect, requireAdmin, contactController.updateStatus);

module.exports = router;

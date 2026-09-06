const express = require('express');
const testimonialController = require('../controllers/testimonialController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', testimonialController.getAll);
router.post('/', protect, requireAdmin, testimonialController.create);
router.delete('/:id', protect, requireAdmin, testimonialController.remove);

module.exports = router;

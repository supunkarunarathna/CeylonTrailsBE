const express = require('express');
const hotelController = require('../controllers/hotelController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', hotelController.getAll);
router.get('/:slug', hotelController.getBySlug);
router.post('/', protect, requireAdmin, hotelController.create);
router.put('/:id', protect, requireAdmin, hotelController.update);
router.delete('/:id', protect, requireAdmin, hotelController.remove);

module.exports = router;

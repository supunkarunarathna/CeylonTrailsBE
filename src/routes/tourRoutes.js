const express = require('express');
const tourController = require('../controllers/tourController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', tourController.getAll);
router.get('/:slug', tourController.getBySlug);
router.post('/', protect, requireAdmin, tourController.create);
router.put('/:id', protect, requireAdmin, tourController.update);
router.delete('/:id', protect, requireAdmin, tourController.remove);

module.exports = router;

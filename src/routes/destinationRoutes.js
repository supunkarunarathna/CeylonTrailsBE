const express = require('express');
const destinationController = require('../controllers/destinationController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', destinationController.getAll);
router.get('/:slug', destinationController.getBySlug);
router.post('/', protect, requireAdmin, destinationController.create);
router.put('/:id', protect, requireAdmin, destinationController.update);
router.delete('/:id', protect, requireAdmin, destinationController.remove);

module.exports = router;

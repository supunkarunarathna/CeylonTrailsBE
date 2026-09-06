const express = require('express');
const blogController = require('../controllers/blogController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);
router.post('/', protect, requireAdmin, blogController.create);
router.delete('/:id', protect, requireAdmin, blogController.remove);

module.exports = router;

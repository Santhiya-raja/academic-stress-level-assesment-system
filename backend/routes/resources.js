// ============================================
// Resource Routes
// ============================================
const express = require('express');
const { auth } = require('../middleware/auth');
const { getResources } = require('../controllers/resourceController');

const router = express.Router();

// GET /api/resources — get all help resources (optional ?category= filter)
router.get('/', auth, getResources);

module.exports = router;

// ============================================
// User Routes
// ============================================
const express = require('express');
const { auth } = require('../middleware/auth');
const { getProfile } = require('../controllers/userController');

const router = express.Router();

// GET /api/user/profile
router.get('/profile', auth, getProfile);

module.exports = router;

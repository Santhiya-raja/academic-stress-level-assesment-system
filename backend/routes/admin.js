// ============================================
// Admin Routes
// ============================================
const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const {
    getStats,
    getDepartmentStats,
    getHighRisk,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, adminOnly);

// GET /api/admin/stats — anonymized overview
router.get('/stats', getStats);

// GET /api/admin/department-stats?dept=Engineering
router.get('/department-stats', getDepartmentStats);

// GET /api/admin/high-risk — high-stress alerts
router.get('/high-risk', getHighRisk);

module.exports = router;

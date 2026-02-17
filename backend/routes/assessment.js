// ============================================
// Assessment Routes
// ============================================
const express = require('express');
const { auth } = require('../middleware/auth');
const {
    submitAssessment,
    getHistory,
    getMetrics,
    getTrends,
    getQuestions,
} = require('../controllers/assessmentController');

const router = express.Router();

// GET /api/assessment/questions — get all survey questions
router.get('/questions', auth, getQuestions);

// POST /api/assessment/submit — submit a completed survey
router.post('/submit', auth, submitAssessment);

// GET /api/assessment/history — get past assessments
router.get('/history', auth, getHistory);

// GET /api/assessment/metrics — current/avg/change percentages
router.get('/metrics', auth, getMetrics);

// GET /api/assessment/trends — last 30 days daily data
router.get('/trends', auth, getTrends);

module.exports = router;

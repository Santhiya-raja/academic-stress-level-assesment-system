// ============================================
// Stressor Routes
// ============================================
const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
    createStressor,
    getStressors,
    deleteStressor,
} = require('../controllers/stressorController');

const router = express.Router();

// POST /api/stressors — create a new stressor
router.post(
    '/',
    auth,
    [body('title').trim().notEmpty().withMessage('Title is required.')],
    createStressor
);

// GET /api/stressors — list user's stressors
router.get('/', auth, getStressors);

// DELETE /api/stressors/:id — remove a stressor
router.delete('/:id', auth, deleteStressor);

module.exports = router;

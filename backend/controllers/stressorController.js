// ============================================
// Stressors Controller — CRUD for stress items
// ============================================
const pool = require('../config/db');
const { validationResult } = require('express-validator');

/**
 * POST /api/stressors
 * Create a new stressor for the authenticated user.
 */
const createStressor = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, due_date } = req.body;

        const result = await pool.query(
            'INSERT INTO stressors (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, title, description || null, due_date || null]
        );

        res.status(201).json({ stressor: result.rows[0] });
    } catch (err) {
        console.error('Create stressor error:', err);
        res.status(500).json({ error: 'Server error creating stressor.' });
    }
};

/**
 * GET /api/stressors
 * Get all stressors for the authenticated user, newest first.
 */
const getStressors = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM stressors WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );

        res.json({ stressors: result.rows });
    } catch (err) {
        console.error('Get stressors error:', err);
        res.status(500).json({ error: 'Server error fetching stressors.' });
    }
};

/**
 * DELETE /api/stressors/:id
 * Delete a stressor by ID (only if owned by authenticated user).
 */
const deleteStressor = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM stressors WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stressor not found.' });
        }

        res.json({ message: 'Stressor deleted successfully.' });
    } catch (err) {
        console.error('Delete stressor error:', err);
        res.status(500).json({ error: 'Server error deleting stressor.' });
    }
};

module.exports = { createStressor, getStressors, deleteStressor };

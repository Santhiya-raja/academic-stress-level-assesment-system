// ============================================
// Resources Controller — Help Resources
// ============================================
const pool = require('../config/db');

/**
 * GET /api/resources
 * Returns all help resources, optionally filtered by category.
 * Query params: ?category=Meditation
 */
const getResources = async (req, res) => {
    try {
        const { category } = req.query;

        let query = 'SELECT * FROM resources';
        const params = [];

        if (category) {
            query += ' WHERE LOWER(category) = LOWER($1)';
            params.push(category);
        }

        query += ' ORDER BY category, id';

        const result = await pool.query(query, params);

        // Group by category for convenience
        const grouped = {};
        for (const row of result.rows) {
            if (!grouped[row.category]) {
                grouped[row.category] = [];
            }
            grouped[row.category].push(row);
        }

        res.json({ resources: result.rows, grouped });
    } catch (err) {
        console.error('Resources error:', err);
        res.status(500).json({ error: 'Server error fetching resources.' });
    }
};

module.exports = { getResources };

// ============================================
// User Controller — Profile
// ============================================
const pool = require('../config/db');

/**
 * GET /api/user/profile
 * Returns the authenticated user's profile with department info.
 */
const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.email, u.role, u.created_at,
              d.name AS department
       FROM users u
       LEFT JOIN user_departments ud ON u.id = ud.user_id
       LEFT JOIN departments d ON ud.department_id = d.id
       WHERE u.id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ error: 'Server error fetching profile.' });
    }
};

module.exports = { getProfile };

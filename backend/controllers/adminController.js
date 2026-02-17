// ============================================
// Admin Controller
// — Anonymized stats, Department stats, High-risk alerts
// ============================================
const pool = require('../config/db');

/**
 * GET /api/admin/stats
 * Returns anonymized overview of all stress data.
 */
const getStats = async (req, res) => {
    try {
        const overview = await pool.query(`
      SELECT
        COUNT(DISTINCT user_id) AS total_students,
        COUNT(*) AS total_assessments,
        ROUND(AVG(score::numeric), 1) AS average_score,
        ROUND(AVG(score::numeric / 50 * 100), 1) AS average_percentage,
        COUNT(*) FILTER (WHERE category = 'Low') AS low_count,
        COUNT(*) FILTER (WHERE category = 'Moderate') AS moderate_count,
        COUNT(*) FILTER (WHERE category = 'High') AS high_count
      FROM assessments
    `);

        // Recent trend (last 7 days)
        const trend = await pool.query(`
      SELECT DATE(created_at) AS date,
             COUNT(*) AS assessment_count,
             ROUND(AVG(score::numeric / 50 * 100), 1) AS avg_percentage
      FROM assessments
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

        res.json({
            overview: overview.rows[0],
            weekly_trend: trend.rows,
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ error: 'Server error fetching admin stats.' });
    }
};

/**
 * GET /api/admin/department-stats?dept=Engineering
 * Returns stress statistics filtered by department.
 */
const getDepartmentStats = async (req, res) => {
    try {
        const { dept } = req.query;

        let query = `
      SELECT
        d.name AS department,
        COUNT(DISTINCT a.user_id) AS total_students,
        COUNT(a.id) AS total_assessments,
        ROUND(AVG(a.score::numeric / 50 * 100), 1) AS average_percentage,
        COUNT(a.id) FILTER (WHERE a.category = 'Low') AS low_count,
        COUNT(a.id) FILTER (WHERE a.category = 'Moderate') AS moderate_count,
        COUNT(a.id) FILTER (WHERE a.category = 'High') AS high_count
      FROM departments d
      LEFT JOIN user_departments ud ON d.id = ud.department_id
      LEFT JOIN assessments a ON ud.user_id = a.user_id
    `;

        const params = [];
        if (dept) {
            query += ' WHERE LOWER(d.name) = LOWER($1)';
            params.push(dept);
        }

        query += ' GROUP BY d.name ORDER BY d.name';

        const result = await pool.query(query, params);
        res.json({ department_stats: result.rows });
    } catch (err) {
        console.error('Department stats error:', err);
        res.status(500).json({ error: 'Server error fetching department stats.' });
    }
};

/**
 * GET /api/admin/high-risk
 * Returns users with stress score > 70% threshold (latest assessment).
 */
const getHighRisk = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        a.id AS alert_id,
        a.stress_score,
        ROUND((a.stress_score::numeric / 50) * 100) AS stress_percentage,
        a.created_at AS alert_date,
        u.name AS student_name,
        u.email AS student_email,
        d.name AS department
      FROM alerts a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN user_departments ud ON u.id = ud.user_id
      LEFT JOIN departments d ON ud.department_id = d.id
      ORDER BY a.created_at DESC
      LIMIT 50
    `);

        res.json({ high_risk_alerts: result.rows });
    } catch (err) {
        console.error('High risk error:', err);
        res.status(500).json({ error: 'Server error fetching high-risk data.' });
    }
};

module.exports = { getStats, getDepartmentStats, getHighRisk };

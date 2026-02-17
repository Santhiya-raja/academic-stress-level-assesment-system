// ============================================
// Assessment Controller
// — Submit, History, Metrics, Trends
// ============================================
const pool = require('../config/db');
const { validationResult } = require('express-validator');

// Stress survey questions
const QUESTIONS = [
    'How overwhelmed do you feel by your academic workload?',
    'How often do you struggle to meet assignment deadlines?',
    'How would you rate your sleep quality this week?',
    'How frequently do you feel socially isolated or pressured?',
    'How often do you skip meals due to academic commitments?',
    'How much physical activity have you had this week?',
    'How anxious do you feel about upcoming exams or evaluations?',
    'How often do you feel unable to concentrate on studies?',
    'How satisfied are you with your academic performance?',
    'How often do you feel emotionally drained after a study session?',
];

/**
 * Categorize a raw score (0-50) into Low / Moderate / High.
 */
function categorizeScore(score) {
    if (score <= 20) return 'Low';
    if (score <= 35) return 'Moderate';
    return 'High';
}

/**
 * POST /api/assessment/submit
 * Accepts 10 answers (each 1-5), computes score, stores assessment + responses.
 * Also triggers a high-risk alert if stress percentage > 70%.
 */
const submitAssessment = async (req, res) => {
    const client = await pool.connect();

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { answers } = req.body; // array of 10 integers (1-5)

        if (!Array.isArray(answers) || answers.length !== 10) {
            return res.status(400).json({ error: 'Exactly 10 answers are required.' });
        }

        for (const ans of answers) {
            if (!Number.isInteger(ans) || ans < 1 || ans > 5) {
                return res.status(400).json({ error: 'Each answer must be an integer between 1 and 5.' });
            }
        }

        // Calculate total score
        const score = answers.reduce((sum, a) => sum + a, 0);
        const category = categorizeScore(score);

        await client.query('BEGIN');

        // Insert assessment
        const assessmentResult = await client.query(
            'INSERT INTO assessments (user_id, score, category) VALUES ($1, $2, $3) RETURNING id, score, category, created_at',
            [req.user.id, score, category]
        );

        const assessment = assessmentResult.rows[0];

        // Insert individual responses
        for (let i = 0; i < answers.length; i++) {
            await client.query(
                'INSERT INTO responses (assessment_id, question, answer) VALUES ($1, $2, $3)',
                [assessment.id, QUESTIONS[i], answers[i]]
            );
        }

        // High-risk alert: if stress percentage > 70% (score > 35)
        const stressPercentage = (score / 50) * 100;
        if (stressPercentage > 70) {
            await client.query(
                'INSERT INTO alerts (user_id, stress_score) VALUES ($1, $2)',
                [req.user.id, score]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            assessment: {
                ...assessment,
                stress_percentage: Math.round(stressPercentage),
            },
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Submit assessment error:', err);
        res.status(500).json({ error: 'Server error submitting assessment.' });
    } finally {
        client.release();
    }
};

/**
 * GET /api/assessment/history
 * Returns all past assessments for the authenticated user, newest first.
 */
const getHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, score, category,
              ROUND((score::numeric / 50) * 100) AS stress_percentage,
              created_at
       FROM assessments
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json({ assessments: result.rows });
    } catch (err) {
        console.error('History error:', err);
        res.status(500).json({ error: 'Server error fetching history.' });
    }
};

/**
 * GET /api/assessment/metrics
 * Returns current stress %, average stress %, and % change from previous.
 */
const getMetrics = async (req, res) => {
    try {
        // Get all assessments ordered by date descending
        const result = await pool.query(
            `SELECT score, created_at
       FROM assessments
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [req.user.id]
        );

        const assessments = result.rows;

        if (assessments.length === 0) {
            return res.json({
                current_percentage: 0,
                average_percentage: 0,
                percentage_change: 0,
                total_assessments: 0,
            });
        }

        const latestScore = assessments[0].score;
        const currentPercentage = Math.round((latestScore / 50) * 100);

        // Average across all assessments
        const totalScore = assessments.reduce((sum, a) => sum + a.score, 0);
        const averagePercentage = Math.round((totalScore / (assessments.length * 50)) * 100);

        // Percentage change compared to previous entry
        let percentageChange = 0;
        if (assessments.length >= 2) {
            const previousScore = assessments[1].score;
            const previousPercentage = (previousScore / 50) * 100;
            percentageChange = Math.round(currentPercentage - previousPercentage);
        }

        res.json({
            current_percentage: currentPercentage,
            average_percentage: averagePercentage,
            percentage_change: percentageChange,
            total_assessments: assessments.length,
        });
    } catch (err) {
        console.error('Metrics error:', err);
        res.status(500).json({ error: 'Server error fetching metrics.' });
    }
};

/**
 * GET /api/assessment/trends
 * Returns daily stress scores for the last 30 days.
 */
const getTrends = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT DATE(created_at) AS date,
              ROUND(AVG(score::numeric / 50 * 100)) AS stress_percentage
       FROM assessments
       WHERE user_id = $1
         AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
            [req.user.id]
        );

        res.json({ trends: result.rows });
    } catch (err) {
        console.error('Trends error:', err);
        res.status(500).json({ error: 'Server error fetching trends.' });
    }
};

/**
 * GET /api/assessment/questions
 * Returns the list of survey questions (so the frontend doesn't hardcode them).
 */
const getQuestions = async (req, res) => {
    res.json({
        questions: QUESTIONS.map((q, i) => ({ id: i + 1, text: q })),
    });
};

module.exports = {
    submitAssessment,
    getHistory,
    getMetrics,
    getTrends,
    getQuestions,
};

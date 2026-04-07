// ============================================
// Express Server — Entry Point
// ============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Health Check ----
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Routes ----
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/stressors', require('./routes/stressors'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/admin', require('./routes/admin'));

// ---- Global Error Handler ----
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error.' });
});

// ---- Start Server ----
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

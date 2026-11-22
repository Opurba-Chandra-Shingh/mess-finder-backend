// All the API routes. Every address starts with /api.
const router = require('express').Router();
const { query } = require('../config/db');

router.use('/auth', require('./auth.routes'));
router.use('/messes', require('./mess.routes'));
router.use('/reference', require('./reference.routes'));

// GET /api/health: is the server up and can it reach MySQL?
router.get('/health', async (req, res) => {
    await query('SELECT 1');
    res.json({ status: 'ok' });
});

module.exports = router;

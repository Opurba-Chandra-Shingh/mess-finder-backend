// /api/auth
const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const auth = require('../controllers/auth.controller');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/me', authenticate, auth.me);

module.exports = router;

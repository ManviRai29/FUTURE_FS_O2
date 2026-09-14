const express = require('express');
const router = express.Router();
const { getStats, getFollowUps } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getStats);
router.get('/followups', protect, getFollowUps);

module.exports = router;

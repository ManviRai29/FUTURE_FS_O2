const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateStatus,
  updateNotes,
} = require('../controllers/leadController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public contact form + admin "add lead" both use this route.
// optionalAuth attaches req.admin only if a valid token is present.
router.post('/', optionalAuth, createLead);

// Everything else requires a logged-in admin
router.get('/', protect, getLeads);
router.get('/:id', protect, getLeadById);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);
router.patch('/:id/status', protect, updateStatus);
router.patch('/:id/notes', protect, updateNotes);

module.exports = router;

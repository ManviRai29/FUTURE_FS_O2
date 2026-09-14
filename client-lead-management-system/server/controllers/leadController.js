const Lead = require('../models/Lead');

// @route  GET /api/leads
// @access Private
// Supports: ?search=&status=&source=&page=&limit=
const getLeads = async (req, res, next) => {
  try {
    const { search, status, source, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (source && source !== 'All') {
      query.source = source;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 50, 1);
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Lead.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      leads,
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/leads/:id
// @access Private
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/leads
// @access Public (used by the public contact form) & Private (admin add lead)
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, message, source, status, followUpDate } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email and phone are required' });
    }

    // If the request is coming from the public contact form (no admin attached),
    // force default values regardless of what was submitted.
    const isAdminRequest = Boolean(req.admin);

    const lead = await Lead.create({
      name,
      email,
      phone,
      message: message || '',
      source: isAdminRequest && source ? source : 'Website',
      status: isAdminRequest && status ? status : 'New',
      followUpDate: isAdminRequest && followUpDate ? followUpDate : null,
    });

    res.status(201).json({ success: true, message: 'Lead created successfully', lead });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/leads/:id
// @access Private
const updateLead = async (req, res, next) => {
  try {
    const { name, email, phone, message, source, status, followUpDate } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (message !== undefined) lead.message = message;
    if (source !== undefined) lead.source = source;
    if (status !== undefined) lead.status = status;
    if (followUpDate !== undefined) lead.followUpDate = followUpDate || null;

    await lead.save();

    res.status(200).json({ success: true, message: 'Lead updated successfully', lead });
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/leads/:id
// @access Private
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @route  PATCH /api/leads/:id/status
// @access Private
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Converted', 'Lost'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, message: 'Status updated successfully', lead });
  } catch (error) {
    next(error);
  }
};

// @route  PATCH /api/leads/:id/notes
// @access Private
// Body: { text } -> adds a new note, OR { followUpDate } -> updates follow-up date
const updateNotes = async (req, res, next) => {
  try {
    const { text, followUpDate } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (text && text.trim() !== '') {
      lead.notes.push({ text: text.trim() });
    }

    if (followUpDate !== undefined) {
      lead.followUpDate = followUpDate || null;
    }

    await lead.save();

    res.status(200).json({ success: true, message: 'Lead updated successfully', lead });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateStatus,
  updateNotes,
};

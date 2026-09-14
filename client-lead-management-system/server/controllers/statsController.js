const Lead = require('../models/Lead');

// @route  GET /api/stats
// @access Private
const getStats = async (req, res, next) => {
  try {
    const [total, newCount, contacted, converted, lost, recentLeads] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Converted' }),
      Lead.countDocuments({ status: 'Lost' }),
      Lead.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        new: newCount,
        contacted,
        converted,
        lost,
      },
      recentLeads,
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/stats/followups
// @access Private
const getFollowUps = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const [today, upcoming, overdue] = await Promise.all([
      Lead.find({ followUpDate: { $gte: startOfToday, $lt: endOfToday } }).sort({ followUpDate: 1 }),
      Lead.find({ followUpDate: { $gte: endOfToday } }).sort({ followUpDate: 1 }),
      Lead.find({ followUpDate: { $lt: startOfToday } }).sort({ followUpDate: 1 }),
    ]);

    res.status(200).json({
      success: true,
      followUps: {
        today,
        upcoming,
        overdue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getFollowUps };

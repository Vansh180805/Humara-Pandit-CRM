const Client = require('../models/Client');
const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard metrics & analytics
// @route   GET /api/dashboard/stats
// @access  Public
exports.getDashboardStats = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();

    // Today's Date range
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Today's consultations
    const todayConsultations = await Consultation.countDocuments({
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    // Upcoming scheduled appointments (today onwards)
    const upcomingAppointments = await Appointment.countDocuments({
      date: { $gte: startOfToday },
      status: 'Scheduled'
    });

    // Pending follow-ups
    const pendingFollowups = await Consultation.countDocuments({
      followUpStatus: 'Pending'
    });

    // New stats for Admin / Astrologer distinction
    const totalAppointments = await Appointment.countDocuments();
    const completedConsultations = await Consultation.countDocuments();
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    // Fetch lists for simple dashboards
    const recentClients = await Client.find().sort({ createdAt: -1 }).limit(5);
    const recentConsultations = await Consultation.find()
      .populate('clientId', 'name')
      .sort({ date: -1 })
      .limit(5);

    const upcomingList = await Appointment.find({
      date: { $gte: startOfToday },
      status: 'Scheduled'
    })
      .populate('clientId', 'name phone')
      .sort({ date: 1, time: 1 })
      .limit(5);

    // Aggregate recommended remedies
    const consultations = await Consultation.find();
    const remedyCounts = {};

    consultations.forEach(cons => {
      if (cons.remedies) {
        const gems = cons.remedies.gemstones || [];
        const ruds = cons.remedies.rudrakshas || [];
        const crys = cons.remedies.crystals || [];

        gems.forEach(g => {
          remedyCounts[g] = (remedyCounts[g] || 0) + 1;
        });
        ruds.forEach(r => {
          remedyCounts[r] = (remedyCounts[r] || 0) + 1;
        });
        crys.forEach(c => {
          remedyCounts[c] = (remedyCounts[c] || 0) + 1;
        });
      }
    });

    const sortedRemedies = Object.keys(remedyCounts)
      .map(name => ({ name, count: remedyCounts[name] }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalClients,
          todayConsultations,
          upcomingAppointments,
          pendingFollowups,
          totalAppointments,
          completedConsultations,
          todayAppointments
        },
        recentClients,
        recentConsultations,
        upcomingList,
        remediesAnalytics: sortedRemedies
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

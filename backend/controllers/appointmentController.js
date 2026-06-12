const Appointment = require('../models/Appointment');
const Client = require('../models/Client');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('clientId', 'name phone email')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
exports.createAppointment = async (req, res) => {
  try {
    const { clientId, date, time, status } = req.body;

    if (!clientId || !date || !time) {
      return res.status(400).json({ success: false, error: 'Please provide client ID, date and time' });
    }

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    const appointment = await Appointment.create({
      clientId,
      date,
      time,
      status: status || 'Scheduled'
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

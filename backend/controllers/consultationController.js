const Consultation = require('../models/Consultation');
const Client = require('../models/Client');

// @desc    Get all consultations or filter by client
// @route   GET /api/consultations
// @access  Public
exports.getConsultations = async (req, res) => {
  try {
    const { clientId } = req.query;
    let query = {};

    if (clientId) {
      query.clientId = clientId;
    }

    const consultations = await Consultation.find(query)
      .populate('clientId', 'name phone email')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: consultations.length, data: consultations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new consultation
// @route   POST /api/consultations
// @access  Public
exports.createConsultation = async (req, res) => {
  try {
    const { clientId, notes, remedies, followUpDate, followUpStatus } = req.body;

    if (!clientId || !notes) {
      return res.status(400).json({ success: false, error: 'Please provide client ID and discussion notes' });
    }

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    const consultation = await Consultation.create({
      clientId,
      notes,
      remedies: remedies || { gemstones: [], rudrakshas: [], crystals: [] },
      followUpDate: followUpDate || null,
      followUpStatus: followUpStatus || 'None'
    });

    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

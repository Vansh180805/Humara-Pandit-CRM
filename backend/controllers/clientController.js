const Client = require('../models/Client');
const Consultation = require('../models/Consultation');

// Helper function to calculate Rashi (Moon sign/Zodiac sign approximation)
const getRashi = (dobString) => {
  const dob = new Date(dobString);
  const month = dob.getMonth() + 1; // 0-indexed
  const day = dob.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Mesh (Aries)';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Vrishabha (Taurus)';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Mithuna (Gemini)';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Karka (Cancer)';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Simha (Leo)';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Kanya (Virgo)';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Tula (Libra)';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Vrishchika (Scorpio)';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Dhanu (Sagittarius)';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Makara (Capricorn)';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Kumbha (Aquarius)';
  return 'Meena (Pisces)';
};

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
exports.getClients = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single client with consultation history
// @route   GET /api/clients/:id
// @access  Public
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // Fetch consultation history for this client
    const history = await Consultation.find({ clientId: req.params.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        client,
        history
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Public
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, dob, tob, pob, gender } = req.body;

    if (!name || !phone || !dob || !tob || !pob) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    // Auto calculate Rashi
    const rashi = getRashi(dob);

    const client = await Client.create({
      name,
      email,
      phone,
      dob,
      tob,
      pob,
      gender,
      rashi
    });

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Public
exports.updateClient = async (req, res) => {
  try {
    const { name, email, phone, dob, tob, pob, gender } = req.body;
    let updateFields = { name, email, phone, dob, tob, pob, gender };

    // If DOB is updated, recalculate Rashi
    if (dob) {
      updateFields.rashi = getRashi(dob);
    }

    const client = await Client.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete client and their consultations
// @route   DELETE /api/clients/:id
// @access  Public
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // Delete consultations related to this client
    await Consultation.deleteMany({ clientId: req.params.id });
    
    // Delete the client
    await client.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

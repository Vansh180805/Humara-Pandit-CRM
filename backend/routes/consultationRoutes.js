const express = require('express');
const router = express.Router();
const {
  getConsultations,
  createConsultation
} = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getConsultations)
  .post(protect, createConsultation);

module.exports = router;

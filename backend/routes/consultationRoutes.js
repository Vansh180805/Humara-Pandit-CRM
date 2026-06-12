const express = require('express');
const router = express.Router();
const {
  getConsultations,
  createConsultation
} = require('../controllers/consultationController');

router.route('/')
  .get(getConsultations)
  .post(createConsultation);

module.exports = router;

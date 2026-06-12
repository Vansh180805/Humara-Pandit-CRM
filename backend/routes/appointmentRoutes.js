const express = require('express');
const router = express.Router();
const {
  getAppointments,
  createAppointment
} = require('../controllers/appointmentController');

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

module.exports = router;

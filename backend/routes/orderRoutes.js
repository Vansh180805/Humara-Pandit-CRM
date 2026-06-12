const express = require('express');
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  getIntegrationLogs
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route('/integrations/logs')
  .get(protect, getIntegrationLogs);

router.route('/:id')
  .put(protect, updateOrderStatus);

module.exports = router;

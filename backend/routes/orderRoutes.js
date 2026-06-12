const express = require('express');
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  getIntegrationLogs
} = require('../controllers/orderController');

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/integrations/logs')
  .get(getIntegrationLogs);

router.route('/:id')
  .put(updateOrderStatus);

module.exports = router;

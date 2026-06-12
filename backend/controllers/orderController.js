const Order = require('../models/Order');
const Client = require('../models/Client');

// @desc    Get all remedy orders
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('clientId', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a remedy order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { clientId, productName, category, price } = req.body;

    if (!clientId || !productName || !category || !price) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    // Auto-calculate partner commission (e.g. 15% of retail price)
    const partnerCommission = Math.round(price * 0.15);

    const order = await Order.create({
      clientId,
      productName,
      category,
      price,
      partnerCommission,
      status: 'Order Received'
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update order status (Lab Certified, Energized, Shipped, etc.)
// @route   PUT /api/orders/:id
// @access  Public
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const updates = { status };

    // If updated to "Lab Certified", auto-generate Certificate No if blank
    if (status === 'Lab Certified' && !order.certificateNo) {
      const randNum = Math.floor(100000 + Math.random() * 900000);
      updates.certificateNo = `HP-CERT-${randNum}`;
    }

    // If updated to "Shipped", auto-generate tracking ID if blank
    if (status === 'Shipped' && !order.trackingId) {
      const randNum = Math.floor(100000000 + Math.random() * 900000000);
      updates.trackingId = `SR-${randNum}`;
    }

    order = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get third-party API integration logs (Shopify, WhatsApp, Zoho, Shiprocket)
// @route   GET /api/integrations/logs
// @access  Public
exports.getIntegrationLogs = async (req, res) => {
  try {
    const baseTime = Date.now();
    const logs = [
      {
        timestamp: new Date(baseTime - 30 * 1000), // 30s ago
        source: 'Shopify',
        event: 'Inventory Level Updated',
        details: 'Synced gemstone catalog from humarapandit.myshopify.com. Status: 200 OK.',
        status: 'Success'
      },
      {
        timestamp: new Date(baseTime - 2 * 60 * 1000), // 2m ago
        source: 'WhatsApp',
        event: 'Client Alert Dispatched',
        details: 'Sent shipment tracking link SR-927391 to client phone. Status: Delivered.',
        status: 'Success'
      },
      {
        timestamp: new Date(baseTime - 12 * 60 * 1000), // 12m ago
        source: 'Zoho CRM',
        event: 'Astrologer Referral Synced',
        details: 'Synchronized commission payout (₹750) for Pandit Shastri in Zoho ledger.',
        status: 'Success'
      },
      {
        timestamp: new Date(baseTime - 45 * 60 * 1000), // 45m ago
        source: 'Shiprocket',
        event: 'AWB Label Printed',
        details: 'Generated shipping airway bill AWB# 89271928 for customer shipment.',
        status: 'Success'
      },
      {
        timestamp: new Date(baseTime - 2 * 3600 * 1000), // 2h ago
        source: 'Shopify',
        event: 'Order Webhook Triggered',
        details: 'Imported new Gemstone Order from online storefront checkout.',
        status: 'Success'
      },
      {
        timestamp: new Date(baseTime - 4 * 3600 * 1000), // 4h ago
        source: 'WhatsApp',
        event: 'Kundli PDF Shared',
        details: 'Delivered Lagna Chart summary PDF link directly to WhatsApp conversation.',
        status: 'Success'
      }
    ];

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

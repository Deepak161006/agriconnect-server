const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getIncomingOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, isConsumer, isProducer } = require('../middleware/authMiddleware');

// --- Consumer Routes ---
router.post('/', protect, isConsumer, createOrder);
router.get('/my-orders', protect, isConsumer, getMyOrders);

// --- Producer Routes ---
router.get('/incoming', protect, isProducer, getIncomingOrders);
router.put('/:id/status', protect, isProducer, updateOrderStatus);

module.exports = router;
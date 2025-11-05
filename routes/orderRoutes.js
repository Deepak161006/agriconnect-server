const express = require('express');
const router = express.Router();

// 1. IMPORT the new 'cancelOrder' function
const {
  createOrder,
  getMyOrders,
  getIncomingOrders,
  updateOrderStatus,
  cancelOrder, // <-- ADD THIS
} = require('../controllers/orderController');

const { protect, isConsumer, isProducer } = require('../middleware/authMiddleware');

// --- Consumer Routes ---
router.post('/', protect, isConsumer, createOrder);
router.get('/my-orders', protect, isConsumer, getMyOrders);
router.delete('/:id', protect, isConsumer, cancelOrder); // <-- 2. ADD THIS ROUTE

// --- Producer Routes ---
router.get('/incoming', protect, isProducer, getIncomingOrders);
router.put('/:id/status', protect, isProducer, updateOrderStatus);

module.exports = router;
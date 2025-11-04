const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Consumer)
exports.createOrder = async (req, res) => {
  const { productId, productDetails } = req.body;

  try {
    // Find the product to get its producer's ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const order = new Order({
      consumer: req.user.id,
      customerName: req.user.fullName,
      producer: product.producer, // Get producer ID from the product
      product: productId,
      productDetails: productDetails
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get logged-in user's orders (Consumer)
// @route   GET /api/orders/my-orders
// @access  Private (Consumer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user.id })
      .populate('product', 'name image') // Get product name/image
      .populate('producer', 'fullName'); // Get producer's name
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get incoming orders (Producer)
// @route   GET /api/orders/incoming
// @access  Private (Producer)
exports.getIncomingOrders = async (req, res) => {
  try {
    // Find orders where the producer ID matches the logged-in user's ID
    const orders = await Order.find({ producer: req.user.id })
      .populate('product', 'name'); // Get product name
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update order status (Producer)
// @route   PUT /api/orders/:id/status
// @access  Private (Producer)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body; // New status: "Shipped" or "Delivered"

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Check if this producer owns this order
    if (order.producer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    order.status = status;
    await order.save();
    res.json(order);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Consumer)
exports.createOrder = async (req, res) => {
  // 1. Get deliveryAddress from the body
  const { productId, productDetails, deliveryAddress } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // 2. Check if address was provided
    if (!deliveryAddress) {
      return res.status(400).json({ msg: 'Please provide a delivery address' });
    }

    const order = new Order({
      consumer: req.user.id,
      customerName: req.user.fullName,
      producer: product.producer,
      product: productId,
      productDetails: productDetails,
      deliveryAddress: deliveryAddress // 3. Save the address
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
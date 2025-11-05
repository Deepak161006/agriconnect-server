const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Consumer)
exports.createOrder = async (req, res) => {
  // 1. Get deliveryAddress from the request body
  const { productId, productDetails, deliveryAddress } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // 2. Add a check to make sure the address was sent
    if (!deliveryAddress) {
      return res.status(400).json({ msg: 'Please provide a delivery address' });
    }

    const order = new Order({
      consumer: req.user.id,
      customerName: req.user.fullName,
      producer: product.producer,
      product: productId,
      productDetails: productDetails,
      deliveryAddress: deliveryAddress // 3. Save the new address
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- (The other functions in this file stay the same) ---

// @desc    Get logged-in user's orders (Consumer)
exports.getMyOrders = async (req, res) => {
  // ... (no changes here)
  try {
    const orders = await Order.find({ consumer: req.user.id })
      .populate('product', 'name image')
      .populate('producer', 'fullName');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get incoming orders (Producer)
exports.getIncomingOrders = async (req, res) => {
  // ... (no changes here)
  try {
    const orders = await Order.find({ producer: req.user.id })
      .populate('product', 'name');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update order status (Producer)
exports.updateOrderStatus = async (req, res) => {
  // ... (no changes here)
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }
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

// ... (keep all your other functions)

// @desc    Cancel an order (by consumer)
// @route   DELETE /api/orders/:id
// @access  Private (Consumer only)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Security Check 1: Make sure this user created the order
    if (order.consumer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Security Check 2: Only allow cancel if still processing
    if (order.status !== 'Processing') {
      return res.status(400).json({ msg: 'Order cannot be cancelled once it has been shipped' });
    }

    // Find the product and add the quantity back to the stock
    const product = await Product.findById(order.product);
    if (product) {
      const orderQuantity = parseInt(order.productDetails.quantity.split(' ')[0]);
      product.quantity += orderQuantity;
      await product.save();
    }

    await Order.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Order cancelled and stock restored' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
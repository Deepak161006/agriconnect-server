const Product = require('../models/ProductModel');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Producer only)
exports.createProduct = async (req, res) => {
  const { name, description, price, unit, category, quantity } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      unit,
      category,
      quantity,
      producer: req.user.id // This comes from the authMiddleware
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('producer', 'fullName');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ producer: req.user.id });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'producer',
      'fullName location tel'
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ msg: 'Product not found' });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Producer only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // --- Security Check ---
    // Make sure the user deleting the product is the one who created it
    if (product.producer.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
};
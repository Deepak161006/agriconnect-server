const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
} = require('../controllers/productController');
const { protect, isProducer } = require('../middleware/authMiddleware');

// @route   POST /api/products
// @desc    Create a new product
// We chain the middleware: first check login (protect), then check type (isProducer)
router.post('/', protect, isProducer, createProduct);

// @route   GET /api/products
// @desc    Get all products
router.get('/', getAllProducts);

// @route   GET /api/products/my-products
// @desc    Get products for the logged-in producer
router.get('/my-products', protect, isProducer, getMyProducts);


// @route   GET /api/products/:id
// @desc    Get a single product
router.get('/:id', getProductById);

// This route must be below the '/:id' route
router.get('/my-products', protect, isProducer, getMyProducts);

module.exports = router;
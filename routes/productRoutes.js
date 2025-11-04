const express = require('express');
const router = express.Router();

// 1. IMPORT 'deleteProduct'
const {
  createProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  deleteProduct, // <-- Make sure this is imported
} = require('../controllers/productController');

const { protect, isProducer } = require('../middleware/authMiddleware');
const upload = require('../middleware/fileUpload'); // Make sure upload is imported

// --- POST Route ---
// (This one is for creating a product)
router.post('/', protect, isProducer, upload.single('image'), createProduct);

// --- GET Routes ---
// (Order is very important here)

// @route   GET /api/products
// @desc    Get all products
router.get('/', getAllProducts);

// @route   GET /api/products/my-products
// @desc    Get products for the logged-in producer
// (This MUST come BEFORE the '/:id' route)
router.get('/my-products', protect, isProducer, getMyProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// (This wildcard route MUST be last)
router.get('/:id', getProductById);


// --- 2. ADD THE NEW DELETE ROUTE ---
// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', protect, isProducer, deleteProduct);

module.exports = router;
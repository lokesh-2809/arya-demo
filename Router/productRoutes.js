const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // No file storage -> in memory

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controller/productController');

// Create product (with file)
router.post('/', upload.single('document'), createProduct);

// Get all products (with pagination and filters)
router.get('/', getProducts);

// Get single product
router.get('/:id', getProductById);

// Update product
router.put('/:id', upload.single('document'), updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

module.exports = router;

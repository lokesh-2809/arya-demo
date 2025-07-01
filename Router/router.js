// routes/router.js
const express = require('express');
const router = express.Router();
const logincontroller = require('../controller/logincontroller');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const upload = multer(); // no storage -> memory
const {
  createProduct
} = require('../controller/productController');



// Auth routes
router.post('/register', logincontroller.register);
router.post('/login', logincontroller.login);
// router.post('/add', upload.single('document'), createProduct);



module.exports = router;

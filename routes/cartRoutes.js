const express = require('express');
const router = express.Router();
const {
  getUserCart,
  addItemToCart,
  removeItemFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getUserCart).post(protect, addItemToCart);
router.route('/:id').delete(protect, removeItemFromCart);

module.exports = router;

const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');

const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});


const addItemToCart = asyncHandler(async (req, res) => {
  const { product, name, qty, image, price } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === product
    );

    if (itemIndex >= 0) {
      cart.cartItems[itemIndex].qty += qty;
    } else {
      cart.cartItems.push({ product, name, qty, image, price });
    }
    await cart.save();
  } else {
    const newCart = new Cart({
      user: req.user._id,
      cartItems: [{ product, name, qty, image, price }],
    });
    await newCart.save();
  }
  res.status(201).json({ message: 'Item added to cart' });
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== req.params.id
    );
    await cart.save();
    res.json({ message: 'Item removed from cart' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

module.exports = {
  getUserCart,
  addItemToCart,
  removeItemFromCart,
};

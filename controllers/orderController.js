const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const { processPayment } = require('../services/paymentService');
const { sendEmail } = require('../services/emailService');

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }

  const paymentResult = await processPayment(totalPrice * 100, 'usd', paymentMethod.id, 'Ecommerce Order Payment');

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod.id,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentResult.status === 'succeeded',
    paidAt: paymentResult.status === 'succeeded' ? Date.now() : null,
    paymentResult: {
      id: paymentResult.id,
      status: paymentResult.status,
      update_time: paymentResult.created,
      email_address: paymentResult.receipt_email,
    },
  });

  const createdOrder = await order.save();

  const emailOptions = {
    email: req.user.email, 
    subject: 'Order Confirmation',
    message: `Your order (${order._id}) has been successfully placed.`,
  };

  await sendEmail(emailOptions);

  res.status(201).json(createdOrder);
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
};

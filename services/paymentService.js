const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const processPayment = async (amount, currency = 'usd', source, description) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: source,
      confirm: true,
      description,
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  processPayment,
};

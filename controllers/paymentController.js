const Paystack = require('paystack-api');
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

exports.initiatePayment = async (req, res) => {
  const { email, amount } = req.body;
  try {
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Paystack uses kobo (100 kobo = 1 Naira)
    });
    res.status(200).json({ authorization_url: response.data.authorization_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
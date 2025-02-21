const Paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

// Initialize Payment
exports.initializePayment = async (req, res) => {
  const { email, amount } = req.body; // Get email and amount from frontend

  if (!email || !amount) {
    return res.status(400).json({ error: "Email and amount are required" });
  }

  try {
    const response = await Paystack.transaction.initialize({
      email,
      amount: amount * 100, // Converting  to kobo
      currency: "NGN", // selecting the currency
      callback_url: `${process.env.CLIENT_NAME}/propeneer-checkout`,
    });

    // Returning the payment authorization URL to the frontend
    res.status(200).json({
      authorization_url: response.data.authorization_url,
      reference: response.data.reference,
    });
  } catch (err) {
    console.error(
      "Paystack Initialization Error:",
      err.response?.data || err.message
    );
    res
      .status(500)
      .json({ error: "Payment initialization failed", details: err.message });
  }
};

// Verify Payment (Callback or Webhook)
exports.verifyPayment = async (req, res) => {

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  reference = body.reference;
  if (!reference || typeof reference !== "string") {
    return res.status(400).json({ error: "Invalid payment reference" });
  }

  try {
   
    const response = await Paystack.transaction.verify({ reference });

    // Check if the payment was successful
    if (response.data?.status === "success") {
      return res
        .status(200)
        .json({ message: "Payment successful", data: response.data });
    } else {
      return res
        .status(400)
        .json({ message: "Payment failed", data: response.data });
    }
  } catch (err) {
    console.error(
      "Paystack Verification Error:",
      err.response?.data || err.message
    );
    return res
      .status(500)
      .json({ error: "Payment verification failed", details: err.message });
  }
};

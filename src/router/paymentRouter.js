const express = require('express');
const { userAuth } = require('../middlewares/auth');
const razorpayInstance = require('../utils/razorpay');
const { membershipAmount, generateReceiptId } = require('../utils/constant');
const Payment = require('../model/payment');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const User = require('../model/user');
const { addDays } = require('date-fns');

const paymentRouter = express.Router();

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { _id: userId, firstName, lastName, emailId } = req.loggedInUser;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: 'INR',
      receipt: generateReceiptId(),
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    console.log(order);

    const payment = new Payment({
      userId: userId,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // Return back my order details to frontend
    res.status(200).json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

paymentRouter.post('/payment/webhook', async (req, res) => {
  try {
    const webhookSignature = req.get('X-Razorpay-Signature');
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isWebhookValid) {
      console.log('Invalid Webhook Signature');
      return res.status(400).json({ msg: 'Webhook signature is invalid' });
    }
    console.log('Valid Webhook Signature');

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });

    const expiresAt = user?.subscription?.expiresAt
      ? new Date(user?.subscription?.expiresAt).getTime()
      : null;
    const currentTime = new Date().getTime();
    const currentPlan = user?.subscription?.plan;
    const isPremium = expiresAt > currentTime && currentPlan !== 'free';

    const FIVE_DAYS_IN_MS = 5 * 24 * 60 * 60 * 1000;
    const onlyFiveDaysLeft =
      expiresAt - currentTime > 0 && expiresAt - currentTime < FIVE_DAYS_IN_MS;

    user.subscription.plan = payment.notes.membershipType;

    if (isPremium && onlyFiveDaysLeft && currentPlan === payment.notes.membershipType) {
      user.subscription.expiresAt = addDays(new Date(user?.subscription?.expiresAt), 30);
    } else {
      user.subscription.expiresAt = addDays(new Date(), 30);
    }
    console.log('User saved');

    await user.save();

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay
    return res.status(200).json({ msg: 'Webhook received successfully' });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

paymentRouter.get('/premium/verify', userAuth, async (req, res) => {
  const loggedInUser = req.loggedInUser.toJSON();
  res.status(200).json({ data: loggedInUser });
});

module.exports = paymentRouter;

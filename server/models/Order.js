const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  orderStatus: String,
  paymentMethods: String,
  paymentStatus: String,
  orderDate: Date,
  paymentId: String,
  payerId: String,
  instructorId: String,
  instructorName: String,
  courseId: String,
  courseTitle: String,
  coursePricing: String,
  courseImage: String,
});

module.exports = mongoose.model("Order", OrderSchema);

const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const StudentCourses = require("../../models/StudentCourses");
const Course = require("../../models/Course");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethods,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseId,
      courseTitle,
      coursePricing,
      courseImage,
    } = req.body;

    const existingOrder = await Order.findOne({
      userId,
      courseId,
      $or: [{ orderStatus: "pending" }, { orderStatus: "confirmed" }],
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: "Order already exists for this course and user",
      });
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
      transactions: [
        {
          items_list: {
            items: [
              {
                name: courseTitle,
                price: parseFloat(coursePricing).toFixed(2),
                currency: "USD",
                sku: courseId,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: parseFloat(coursePricing).toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Payment Failed",
        });
      }

      const newCourseOrder = new Order({
        userId,
        userName,
        userEmail,
        orderStatus,
        paymentMethods,
        paymentStatus,
        orderDate,
        paymentId,
        payerId,
        instructorId,
        instructorName,
        courseId,
        courseTitle,
        coursePricing,
        courseImage,
      });
      await newCourseOrder.save();

      const approvalUrl = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      res.status(200).json({
        success: true,
        data: { approvalUrl, orderId: newCourseOrder?._id },
      });
    });
  } catch (err) {
    console.log("Error creating payment: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // Use findOneAndUpdate to atomically check and update the processing status
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        // Only process if not already processing and not paid
        paymentStatus: { $nin: ["processing", "paid"] },
      },
      {
        $set: { paymentStatus: "processing" },
      },
      { new: true }
    );

    if (!order) {
      // Check if order exists but is already paid
      const existingOrder = await Order.findById(orderId);
      if (existingOrder?.paymentStatus === "paid") {
        return res.status(400).json({
          success: false,
          message: "Payment already processed",
        });
      }
      return res.status(404).json({
        success: false,
        message: "Order cannot be found or is being processed",
      });
    }

    // Process the payment and update records
    try {
      // Update order status
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.payerId = payerId;

      await order.save();

      // Update student courses using atomic operation
      const courseData = {
        courseId: order?.courseId,
        title: order?.courseTitle,
        instructorId: order?.instructorId,
        instructorName: order?.instructorName,
        dateOfPurchase: order?.orderDate,
        courseImage: order?.courseImage,
      };

      const studentCourseResult = await StudentCourses.updateOne(
        {
          userId: order.userId,
          "courses.courseId": { $ne: order.courseId }, // Only update if course doesn't exist
        },
        {
          $addToSet: {
            courses: courseData,
          },
        },
        { upsert: true }
      );

      // Update course students
      await Course.findByIdAndUpdate(
        order.courseId,
        {
          $addToSet: {
            students: {
              studentId: order?.userId,
              studentName: order?.userName,
              studentEmail: order?.userEmail,
              paidAmount: order?.coursePricing,
            },
          },
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Order confirmed and course enrolled successfully",
        data: order,
      });
    } catch (error) {
      // If anything fails, revert the processing status
      await Order.findByIdAndUpdate(orderId, {
        $set: { paymentStatus: "initiated" },
      });
      throw error;
    }
  } catch (err) {
    console.log("Error in payment processing:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process payment and finalize order",
    });
  }
};

module.exports = {
  createOrder,
  capturePaymentAndFinalizeOrder,
};

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

    //Check for existing order if with pending or confirmed status
    const existingOrder = await Order.findOne({
      userId,
      courseId,
      $or: [{ orderStatus: "pending" }, { orderStatus: "confirmed" }],
    });

    if (existingOrder)
      return res.status(400).json({
        success: false,
        message: "Order already exists for this course and user",
      });

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
                // price: coursePricing,
                price: parseFloat(coursePricing).toFixed(2),
                currency: "USD",
                sku: courseId,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            // total: coursePricing,
            total: parseFloat(coursePricing).toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, message: "Payment Failed" });
      } else {
        console.log("Payment success: ", paymentInfo);
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
          (link) => link.rel == "approval_url"
        ).href;

        res.status(200).json({
          success: true,
          data: { approvalUrl, orderId: newCourseOrder._id },
        });
      }
    });
  } catch (err) {
    console.log("Error creating payment: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order cannot be found" });

    console.log("paymentStatus: ", order?.paymentStatus);

    // Check if payment is already processed
    if (order?.paymentStatus === "paid")
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
        data: order,
      });

    // update order without payment details
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();

    //update student course enrollment
    let studentCourse = await StudentCourses.findOne({
      userId: order.userId,
    });

    // const courseData = {
    //   courseId: order.courseId,
    //   title: order.courseTitle,
    //   instructorId: order.instructorId,
    //   instructorName: order.instructorName,
    //   dateOfPurchase: order.orderDate,
    //   courseImage: order.courseImage,
    // };

    if (!studentCourse) {
      studentCourse = new StudentCourses({ userId: order.userId, courses: [] });
    }

    //Add course to student's course list if not already enrolled
    if (
      !studentCourse.courses.some(
        (course) => course.courseId === order.courseId
      )
    ) {
      studentCourse.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });
    }

    await studentCourse.save();

    console.log("studentCourse: ", studentCourse);

    // if (studentCourse) {
    //   // Ensure the course is added only once using $addToSet
    //   await StudentCourses.updateOne(
    //     { userId: order?.userId },
    //     { $addToSet: { courses: courseData } },
    //     { upsert: true, new: true }
    //   );
    // } else {
    //   // Create a new entry if no record exists for this user
    //   const newStudentCourse = new StudentCourses({
    //     userId: order.userId,
    //     courses: [
    //       {
    //         courseId: order.courseId,
    //         title: order.courseTitle,
    //         instructorId: order.instructorId,
    //         instructorName: order.instructorName,
    //         dateOfPurchase: order.orderDate,
    //         courseImage: order.courseId,
    //       },
    //     ],
    //   });

    // await newStudentCourse.save();
    // console.log("studentCourse: ", newStudentCourse);
    // }

    //update the course document to include the students
    // await Course.findByIdAndUpdate(order.courseId, {
    //   $addToSet: {
    //     students: {
    //       studentId: order.userId,
    //       studentName: order.userName,
    //       studentEmail: order.userEmail,
    //       paidAmount: order.coursePricing,
    //     },
    //   },
    // });

    res
      .status(200)
      .json({ success: true, message: "Payment Successful", data: order });
  } catch (err) {
    console.log("Error in finalizing: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  capturePaymentAndFinalizeOrder,
};

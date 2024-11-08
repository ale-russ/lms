const express = require("express");

const {
  getAllStudentCourses,
  getStudentCourseDetails,
  checkCoursePurchasedInfo,
} = require("../../controllers/student-controller/course-controller");

const router = express.Router();

router.get("/get", getAllStudentCourses);
router.get("/get/details/:courseId", getStudentCourseDetails);
router.get("/purchase-info/:courseId/:studentId", checkCoursePurchasedInfo);

module.exports = router;

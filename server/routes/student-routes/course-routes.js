const express = require("express");

const {
  getAllStudentCourses,
  getStudentCourseDetails,
} = require("../../controllers/student-controller/course-controller");

const router = express.Router();

router.get("/get", getAllStudentCourses);
router.get("/get/details/:courseId/:studentId", getStudentCourseDetails);

module.exports = router;

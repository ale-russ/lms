const express = require("express");

const {
  addNewCourse,
  getAllCourses,
  getCourseDetails,
  updateCourseById,
} = require("../../controllers/instructor-controller/course-controller");

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetails);
router.put("/update/:id", updateCourseById);

module.exports = router;

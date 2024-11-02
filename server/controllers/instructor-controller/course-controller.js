const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;

    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();

    if (savedCourse) {
      return res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: { course: savedCourse },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create course",
      });
    }
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    return res.status(200).json({ success: true, data: coursesList });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseDetails = await Course.findById(courseId);

    if (!courseDetails)
      return res
        .status(404)
        .json({ success: false, message: "Course Not Found" });

    return res.status(200).json({ success: true, data: courseDetails });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const updateCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourseData = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedCourseData
    );

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course Not Found" });
    }

    return res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
      data: updatedCourse,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  getCourseDetails,
  updateCourseById,
};

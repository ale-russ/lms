const Course = require("../../models/Course");

const getAllStudentCourses = async (req, res) => {
  try {
    const courses = await Course.find({});

    if (courses.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "No Course Found", data: [] });

    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const getStudentCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseDetails = await Course.findById(courseId);
    if (!courseDetails)
      return res
        .status(400)
        .json({
          success: false,
          message: "Course Details Not Found",
          data: null,
        });

    return res.status(200).json({ success: true, data: courseDetails });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllStudentCourses, getStudentCourseDetails };

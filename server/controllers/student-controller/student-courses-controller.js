const StudentCourses = require("../../models/StudentCourses");

const getCoursesByStudentId = async (req, res) => {
  console.log("params: ", req.params);
  try {
    const studentId = req.params.studentId;
    const StudentBoughtCourses = await StudentCourses.find({
      userId: studentId,
    });
    if (!StudentBoughtCourses)
      return res
        .status(404)
        .json({ success: false, message: "No Courses Found" });
    // console.log("StudentBoughtCourses: ", StudentBoughtCourses);
    return res.status(200).json({ success: true, data: StudentBoughtCourses });
  } catch (err) {
    console.log("Error in getCoursesByStudentId: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getCoursesByStudentId };

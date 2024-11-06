const Course = require("../../models/Course");

const getAllStudentCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParams = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParams.pricing = 1;
        break;
      case "price-hightolow":
        sortParams.pricing = -1;
        break;
      case "title-atoz":
        sortParams.title = 1;
        break;
      case "title-ztoa":
        sortParams.title = -1;
        break;
      default:
        sortParams.pricing = 1;
        break;
    }

    const courses = await Course.find(filters).sort(sortParams);

    // if (courses.length === 0)
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "No Course Found", data: [] });

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
      return res.status(400).json({
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

const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    const isCurrentCoursePurchasedByCurrentUser =
      studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId === courseId
      ) > -1;

    if (!isCurrentCoursePurchasedByCurrentUser)
      return res.status(200).json({
        success: true,
        message: "You Need To Purchase This Course To Access It",
        data: { isPurchased: false },
      });

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);

      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "Course Not Found" });

      return res.status(200).json({
        success: true,
        message: "No Progress Found. Please Start The Course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);
    return res.status(200).json({
      success: true,
      message: "Progress Found",
      data: {
        courseDetails,
        progress: currentUserCourseProgress?.lecturesProgress,
        isPurchased: true,
        completed: currentUserCourseProgress?.completed,
        completionDate: currentUserCourseProgress?.completionDate,
      },
    });
  } catch (err) {
    console.log("Error current course Progress: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [{ lectureId, viewed: true, dateViewed: new Date() }],
      });
      await progress.save();
    } else {
      const lecturesProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      console.log("lectureId: ", lectureId);

      if (lecturesProgress) {
        lecturesProgress.viewed = true;
        lecturesProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }

      await progress.save();
    }

    const course = await Course.findById(courseId);

    if (!course)
      return res
        .status(400)
        .json({ success: false, message: "Course Not Found" });

    // check if all lectures are viewed or not
    const allLecturesViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();
      await progress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Lecture Marked As Viewed",
      data: progress,
    });
  } catch (err) {
    console.log("Error mark lecture as viewed: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// reset course progress

const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress)
      return res
        .status(404)
        .json({ success: false, message: "Progress Not Found" });

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course Progress Has Been Reset",
      data: progress,
    });
  } catch (err) {
    console.log("Error reset course progress: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
};

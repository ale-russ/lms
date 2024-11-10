const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  freePreview: Boolean,
  public_id: String,
});

const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  date: Date,
  title: String,
  description: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  pricing: Number,
  image: {},
  welcomeMessage: String,
  objectives: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  curriculum: [LectureSchema],
  isPublished: Boolean,
});

module.exports = mongoose.model("Course", CourseSchema);

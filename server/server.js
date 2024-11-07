require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentCourseRoutes = require("./routes/student-routes/course-routes");
const studentOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesByIdRoute = require("./routes/student-routes/student-courses-routes");

const app = express();
const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

cors({
  origin: process.env.CLIENT_URL,
  method: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.use(express.json());
app.use(cors());

//database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("Error: ", e));

//   Routes configurations
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/courses", instructorCourseRoutes);
app.use("/student/courses", studentCourseRoutes);
app.use("/student/order", studentOrderRoutes);
app.use("/student/courses-bought", studentCoursesByIdRoute);

app.use((err, req, res, next) => {
  console.log(`Error: `, err.stack);
  res.status(500).json({
    success: false,
    msg: "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

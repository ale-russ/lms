const express = require("express");
const multer = require("multer");
const fs = require("fs");

const { uploadMedia, deleteMedia } = require("../../helpers/cloudinary");
const Course = require("../../models/Course");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);

    // Delete the uploaded file from the server
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Error deleting file: ", err);
      else console.log("File deleted successfully");
    });

    res.status(200).json({
      success: true,
      message: "Media Uploaded Successfully",
      data: result,
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ success: false, message: "Unable to Upload Media" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, type } = req.body;

    if (!id)
      res.status(400).json({ success: false, message: "Media Id is required" });

    const response = await deleteMedia(id, type);

    if (response === false) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });
    }

    // update the course, by deleting the lecture and the video from the course after successfully deleting from cloudinary
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        $pull: { curriculum: { public_id: id } },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Media Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Unable to Delete Media" });
  }
});

router.post("/bulk-upload", upload.array("files", 5), async (req, res) => {
  try {
    const uploadPromise = req.files.map((fileItem) =>
      uploadMedia(fileItem.path)
    );

    const results = await Promise.all(uploadPromise);
    // Delete the uploaded files from the server
    req.files.forEach((fileItem) =>
      fs.unlink(fileItem.path, (err) => {
        if (err) console.log("Error deleting file: ", err);
        else console.log("File deleted successfully");
      })
    );

    res.status(200).json({
      success: true,
      message: "Media Uploaded Successfully",
      data: results,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Error uploading bulk files" });
  }
});

module.exports = router;

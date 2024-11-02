// const cloudinary = require(cloudinary);
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMedia = async (filePath) => {
  try {
    const results = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return results;
  } catch (err) {
    console.log("Error: ", err);
  }
};

const deleteMedia = async (publicId, type) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      // resource_type: "video",
      resource_type: type,
    });
    if (response.result === "not found") {
      return false;
    }

    return true;
  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports = { uploadMedia, deleteMedia };

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["user", "admin", "instructor"],
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);

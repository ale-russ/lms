const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ userEmail, userName }] });

    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "User name or user email already exist",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      userEmail,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(`Error: `, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    if (!userEmail || !password)
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required" });

    const user = await User.findOne({ userEmail });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });

    const accessToken = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        role: user.role,
      },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "5d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          _id: user._id,
          userEmail: user.userEmail,
          userName: user.userName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.log(`Error: `, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser };

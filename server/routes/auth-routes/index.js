const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../../controllers/auth-controller");
const { authenticate } = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticate, (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "User Authenticated!",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;

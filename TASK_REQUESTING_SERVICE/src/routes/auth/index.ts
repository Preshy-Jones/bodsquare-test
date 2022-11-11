import express from "express";
const {
  login,
  register,
  handleRefreshToken,
} = require("../../controllers/auth");
const router = express.Router();

router.post("/login", login);
router.get("/refresh", handleRefreshToken);
router.post("/register", register);

module.exports = router;

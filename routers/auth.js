const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { getAccessToRoute } = require("../middlewares/authorization/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);

module.exports = router;

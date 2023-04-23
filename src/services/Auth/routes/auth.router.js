const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

const { registerUser, loginUser } = require("../controllers/auth.controller");

router.post("/register", catchAsync(registerUser));

router.post("/login", catchAsync(loginUser));



module.exports = router;

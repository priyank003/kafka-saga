const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const checkAuth = require("../middleware/check-auth");

const { httpOrderProducts } = require("../controllers/order.controller");
router.use(checkAuth);
router.post("/place", catchAsync(httpOrderProducts));

module.exports = router;

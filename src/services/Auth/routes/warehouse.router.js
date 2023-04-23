const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

const { httpGetProdcuts } = require("../controllers/warehouse.controller");

router.get("/products", catchAsync(httpGetProdcuts));

module.exports = router;

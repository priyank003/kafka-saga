const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const {
  warehouseCheck,
  cacheData,
  compensateAction,
  getProducts,
} = require("../controllers/warehouse.controller");

// router.use(checkAuth);

router.post("/", (req, res) => {
  console.log("req by user", req.userData);
  const data = req.body;

  warehouseCheck(data.product);
  cacheData(data.product);

  res.send({
    ...data,
    warehouseCheck: true,
  });
});

router.post("/compensate", async (req, res) => {
  await compensateAction();
  res.send(`$warehouse service rollback`);
});

router.get("/products", async (req, res) => {
  const products = await getProducts();

  res.send(products);
});

module.exports = router;

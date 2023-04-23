const axios = require("axios");

const WAREHOUSE_API = "http://localhost:8000/warehouse";

const httpGetProdcuts = async (req, res) => {
  console.log(req.user);

  const products = await axios.get(`${WAREHOUSE_API}/products`);
  res.json(products.data);
};

module.exports = {
  httpGetProdcuts,
};

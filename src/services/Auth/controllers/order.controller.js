const axios = require("axios");

const ORDER_API = "http://localhost:9000";

const httpOrderProducts = async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  const payload = {
    product: req.body,
    customer: { name: req.user.fullName, username: req.user.username },
  };

  const products = await axios.post(`${ORDER_API}`, payload);
  res.json(products.data);
};

module.exports = {
  httpOrderProducts,
};

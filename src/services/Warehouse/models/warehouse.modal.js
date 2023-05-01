const { WAREHOUSE_ITEMS } = require("../data/data");
const Warehouse = require("../models/warehouse.mongo");
const axios = require("axios");

const loadWarehouseData = async () => {
  const getProducts = await axios.get("https://fakestoreapi.com/products");

  getProducts.data.map(async (data) => {
    await Warehouse.updateOne(
      { pid: data.id },
      {
        name: data.title,
        price: data.price,
        description: data.description,
        quantity: 100,
        rating: data.rating.rate,
        img: data.image,
      },
      { upsert: true }
    );
  });
};

module.exports = {
  loadWarehouseData,
};

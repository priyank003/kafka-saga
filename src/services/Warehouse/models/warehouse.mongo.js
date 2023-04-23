const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  pid: String,
  name: String,
  price: Number,
  quantity: Number,
  img: String,
  rating: Number,
});

module.exports = mongoose.model("Warehouse", warehouseSchema);

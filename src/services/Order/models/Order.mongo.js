const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    oid: String,
  },
  { strict: false }
);

module.exports = mongoose.model("Order", orderSchema);

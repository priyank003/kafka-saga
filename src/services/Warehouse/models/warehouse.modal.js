const { WAREHOUSE_ITEMS } = require("../data/data");
const Warehouse = require("../models/warehouse.mongo");

const loadWarehouseData = () => {
  WAREHOUSE_ITEMS.map(async (data) => {
    await Warehouse.updateOne({ pid: data.pid }, { ...data }, { upsert: true });
  });
};

module.exports = {
  loadWarehouseData,
};

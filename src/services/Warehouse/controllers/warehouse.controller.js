const Warehouse = require("../models/warehouse.mongo");
const { ErrorHandler } = require("../utils/error");
const { redisClient } = require("../services/redis");

const warehouseCheck = async (product) => {
  console.log("in warehouse check", product);

  product.map(async (item) => {
    const checkQty = await Warehouse.findOne({
      pid: item.pid,
      quantity: { $gte: item.quantity },
    });
    if (checkQty) {
      return true;
    } else {
      throw new ErrorHandler(500, `${item.title} not found in warehouse`);
    }
  });
};

const cacheData = async (data) => {
  console.log("cacheing warehouse order data");

  try {
    await redisClient.set("WarehouseItem", JSON.stringify(data));
    console.log("stored data in redis");
    const storedData = await redisClient.get("WarehouseItem");
    console.log(JSON.parse(storedData));
  } catch (e) {
    console.log(e);
  }
};

const commitData = async (consumer) => {
  try {
    const res = await redisClient.get("WarehouseItem");
    const cachedWarehouseItem = JSON.parse(res);

    const update = { $inc: { quantity: -cachedWarehouseItem.quantity } };

    const warehouseUpdate = await Warehouse.findOneAndUpdate(
      { pid: cachedWarehouseItem.pid },
      update
    );

    console.log("commited in db", warehouseUpdate);

    await redisClient.del("WarehouseItem");
  } catch (e) {
    console.log(e);
  }
};

const compensateAction = async () => {
  await redisClient.del("WarehouseItem");
};

const getProducts = async () => {
  return Warehouse.find();
};

module.exports = {
  warehouseCheck,
  commitData,
  cacheData,
  compensateAction,
  getProducts,
};

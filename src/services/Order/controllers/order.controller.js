const { randomBytes } = require("crypto");
const { ErrorHandler } = require("../utils/error");
const { redisClient } = require("../services/redis");
const Order = require("../models/Order.mongo");

const createOrder = (data) => {
  const newOrder = {
    oid: randomBytes(8).toString("hex"),
    ...data,
  };

  return newOrder;
};

const cacheOrder = async (data) => {
  console.log("cacheing  order data");
  try {
    await redisClient.set("OrderItem", JSON.stringify(data));
    console.log("stored data in redis");
    const storedData = await redisClient.get("OrderItem");
    console.log(JSON.parse(storedData));
  } catch (e) {
    console.log(e);
  }
};

const commitData = async () => {
  try {
    const res = await redisClient.get("OrderItem");
    const cachedOrderItem = JSON.parse(res);

    const newOrder = new Order(cachedOrderItem);

    await newOrder.save();

    await redisClient.del("OrderItem");
  } catch (e) {
    console.log(e);
  }
};

const compensateAction = async () => {
  await redisClient.del("OrderItem");
};

module.exports = {
  createOrder,
  cacheOrder,
  commitData,
  compensateAction,
};

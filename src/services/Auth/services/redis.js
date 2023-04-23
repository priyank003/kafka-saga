const REDIS_PORT = 6379;
const redis = require("redis");
const redisClient = redis.createClient(REDIS_PORT);

const connectRedis = async () => {
  await redisClient.connect();
};

module.exports = {
  connectRedis,
  redisClient,
};

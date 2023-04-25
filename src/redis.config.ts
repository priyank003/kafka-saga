const REDIS_PORT = 6379;
const redis = require("redis");
export const redisClient = redis.createClient(REDIS_PORT);

export const connectRedis = async () => {
  await redisClient.connect();
};

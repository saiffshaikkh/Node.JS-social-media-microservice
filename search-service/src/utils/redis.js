const Redis = require("ioredis");
const logger = require("./logger");

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisClient.on("error", (err) => {
  logger.error("Redis connection error", err);
});

module.exports = redisClient;

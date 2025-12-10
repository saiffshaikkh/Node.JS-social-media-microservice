const Search = require("../models/Search");
const logger = require("../utils/logger");
const redisClient = require("../utils/redis"); // Import the redis client

const searchPostController = async (req, res) => {
  logger.info("Search endpoint hit!");
  try {
    const { query } = req.query;

    const cacheKey = `search:${query}`;

    // 1. Check Cache
    const cachedResults = await redisClient.get(cacheKey);
    if (cachedResults) {
      logger.info("Serving from cache");
      return res.json(JSON.parse(cachedResults));
    }

    // 2. If not in cache, query Database
    const results = await Search.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    // 3. Save to Cache (for 5 minutes = 300 seconds)
    await redisClient.setex(cacheKey, 300, JSON.stringify(results));

    res.json(results);
  } catch (e) {
    logger.error("Error while searching post", e);
    res.status(500).json({
      success: false,
      message: "Error while searching post",
    });
  }
};

module.exports = { searchPostController };

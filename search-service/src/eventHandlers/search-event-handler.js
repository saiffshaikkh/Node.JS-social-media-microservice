const Search = require("../models/Search");
const logger = require("../utils/logger");
const redisClient = require("../utils/redis"); // Import redis

async function handlePostCreated(event) {
  try {
    const newSearchPost = new Search({
      postId: event.postId,
      userId: event.userId,
      content: event.content,
      createdAt: event.createdAt,
    });

    await newSearchPost.save();
    logger.info(
      `Search post created: ${event.postId}, ${newSearchPost._id.toString()}`
    );

    // INVALIDATE CACHE:
    // Delete all keys starting with "search:" so users get fresh results
    const keys = await redisClient.keys("search:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info("Search cache invalidated");
    }
  } catch (e) {
    logger.error(e, "Error handling post creation event");
  }
}

async function handlePostDeleted(event) {
  try {
    await Search.findOneAndDelete({ postId: event.postId });
    logger.info(`Search post deleted: ${event.postId}}`);

    // INVALIDATE CACHE here as well
    const keys = await redisClient.keys("search:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info("Search cache invalidated");
    }
  } catch (error) {
    logger.error(error, "Error handling post deletion event");
  }
}

module.exports = { handlePostCreated, handlePostDeleted };

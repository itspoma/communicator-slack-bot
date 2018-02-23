const redis = require("redis-mock");

const client = redis.createClient();

module.exports = { client };

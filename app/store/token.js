// token
const { redis } = require('../core/redis');

class RedisTokenStore {
  constructor(client) {
    this.client = client;
  }

  static getRedisTokenId(id) {
    return `auth:${id}`;
  }

  async get(id) {
    const token = RedisTokenStore.getRedisSessionId(id);
    const data = await this.client.get(token);
    if (!data) {
      return null;
    }
    const result = JSON.parse(data);
    return result;
  }

  async set(id, user, ttl = 1200) {
    const token = RedisTokenStore.getRedisTokenId(id);
    const userStr = JSON.stringify(user);
    if (ttl) {
      await this.client.setex(token, ttl, userStr);
    } else {
      await this.client.set(token, userStr);
    }
  }

  async destroy(id) {
    const token = RedisTokenStore.getRedisTokenId(id);
    await this.client.del(token);
  }
}

module.exports = new RedisTokenStore(redis);

// token
const { redis } = require('../core/redis');

class RedisTokenStore {
  constructor(client) {
    this.client = client;
  }

  static getRedisTokenId(id) {
    return `token:${id}`;
  }

  static getRedisSessionId(sid) {
    return `sid:${sid}`;
  }

  async get(id, login = true) {
    const token = login ? RedisTokenStore.getRedisTokenId(id) : RedisTokenStore.getRedisSessionId(id);
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
    await this.client.setex(token, ttl, userStr);
  }

  async destroy(id) {
    const token = RedisTokenStore.getRedisTokenId(id);
    await this.client.del(token);
  }
}

module.exports = new RedisTokenStore(redis);

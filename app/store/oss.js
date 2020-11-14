const OSS = require('ali-oss');

const client = new OSS({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  bucket: process.env.BUCKET,
});

class OssStore {
  constructor() {
    this.client = client;
  }

  async put(name, file) {
    const result = await client.put(name, file);
    return result;
  }
}

module.exports = new OssStore();

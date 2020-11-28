const unzipper = require('unzipper');
const path = require('path');
const OssClient = require('../store/oss');
const { isImage } = require('.');
const Img = require('../models/Img');

const { createReadStream, statSync, readdirSync, rmdirSync, unlinkSync } = require('fs');

let count = 0;

// 删除
function removeDir(dir) {
  const files = readdirSync(dir);
  for (var i = 0; i < files.length; i++) {
    const newPath = path.join(dir, files[i]);
    const stat = statSync(newPath);
    if (stat.isDirectory()) {
      removeDir(newPath);
    } else {
      unlinkSync(newPath); // 删除文件
    }
  }
  rmdirSync(dir); // 删除空文件夹
}

// 上传
async function uploadImages(dir, workId) {
  const files = readdirSync(dir);
  files.forEach(async (item) => {
    const newPath = path.join(dir, item);
    const stat = statSync(newPath);
    if (stat.isDirectory()) {
      await uploadImages(newPath, workId);
    } else {
      const isPicture = isImage(newPath);
      if (isPicture && newPath.indexOf('__MACOSX') === -1) {
        count = count + 1;
        const { url } = await OssClient.put(item, newPath);
        await Img.create({ path: url, workId, name: item });
      }
    }
  });
}

const STATIC_PATH = '/Users/yunye/workspace';

class ImgUpload {
  constructor(filePath, workId) {
    this.filePath = filePath;
    this.workId = workId;
    this.temporaryFolder = `${STATIC_PATH}/${new Date().getTime()}`; // 临时路径
    count = 0;
  }

  // 提取文件
  extract() {
    const { filePath, temporaryFolder } = this;
    const readStream = createReadStream(filePath);
    const WritableStream = unzipper.Extract({ path: temporaryFolder });
    readStream.pipe(WritableStream);
    return new Promise((resolve, reject) => {
      WritableStream.on('close', async () => {
        try {
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // 上传步骤
  async uploadProcess() {
    const { temporaryFolder, workId } = this;
    await uploadImages(temporaryFolder, workId);
    removeDir(`${temporaryFolder}`);
    return count;
  }
}

module.exports = ImgUpload;

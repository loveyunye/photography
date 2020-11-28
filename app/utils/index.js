/**
 * @name 生成唯一的32位uuid
 */
function uuid() {
  const length = 19;
  const timestamp = new Date().getTime().toString();
  const strArr = '0123456789abcdefghigklmnopqrstuvshyz'.split('');
  let uuidStr = '';
  let index = 0;
  for (let i = 0; i < length; i++) {
    if (i % 3 === 2 || i === length - 1) {
      uuidStr += timestamp.slice(index * 2, (index + 1) * 2);
      index++;
    }
    uuidStr += strArr[Math.floor((1 - Math.random()) * strArr.length)];
  }
  return uuidStr;
}

function isImage(ext) {
  const pathStr = ext.split('.');
  if (pathStr.length > 1) {
    return (
      ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(pathStr[pathStr.length - 1]) !== -1
    );
  } else {
    return false;
  }
}

module.exports = {
  uuid,
  isImage,
};

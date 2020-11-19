const { Sequelize, Model } = require('sequelize');
const sequelize = require('../core/mysql');

/**
 * @class 分享码
 */
class Share extends Model {}

Share.init(
  {
    // imgs 关联图片
    code: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'share',
    modelName: 'share',
    underscored: true,
  },
);

module.exports = Share;

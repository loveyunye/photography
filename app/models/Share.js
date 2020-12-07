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
    used: {
      type: Sequelize.INTEGER,
      get() {
        const value = this.getDataValue('used');
        if (value) {
          return true;
        } else {
          return false;
        }
      },
      set(val) {
        const value = val ? Number(val) : 0;
        this.setDataValue('used', value);
      },
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

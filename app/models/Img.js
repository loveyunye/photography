const { Sequelize, Model } = require('sequelize');
const sequelize = require('../core/mysql');

/**
 * @class Img 图片模型
 */
class Img extends Model {}

Img.init(
  {
    // 名称
    name: {
      type: Sequelize.STRING(128),
      // allowNull: false,
    },
    // 地址
    path: Sequelize.STRING(256),
  },
  {
    sequelize,
    tableName: 'img',
    modelName: 'img',
    underscored: true,
  },
);

module.exports = Img;

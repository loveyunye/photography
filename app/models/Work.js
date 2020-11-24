const { Sequelize, Model } = require('sequelize');
const sequelize = require('../core/mysql');

/**
 * @class Work 图片模型
 */
class Work extends Model {}

Work.init(
  {
    // 作品名
    name: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    choose: {
      type: Sequelize.INTEGER,
      defaultValue: 20,
    },
    // 封面
    mask: Sequelize.STRING(256),
    // 描述
    describe: Sequelize.STRING(256),
  },
  {
    sequelize,
    tableName: 'work',
    modelName: 'work',
    underscored: true,
  },
);

module.exports = Work;

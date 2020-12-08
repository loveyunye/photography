const { Sequelize, Model } = require('sequelize');
const sequelize = require('../core/mysql');

/**
 * @class User 用户模型
 */
class User extends Model {
  static async getUser(openId) {
    const user = await User.findOne({ where: { openId } });
    return user;
  }
}

User.init(
  {
    // 名字
    name: {
      type: Sequelize.STRING(128),
      allowNull: false,
    },
    // 头像
    avatarUrl: Sequelize.STRING(256),
    // 性别
    gender: {
      type: Sequelize.INTEGER,
      comment: '0:女；1:男；',
    },
    // 城市
    city: {
      type: Sequelize.STRING(64),
      defaultValue: '',
    },
    // 联系电话
    phone: {
      type: Sequelize.STRING(64),
      defaultValue: '',
    },
    email: {
      type: Sequelize.STRING(128),
      defaultValue: '',
    },
    // 联系地址
    address: {
      type: Sequelize.STRING(128),
      defaultValue: '',
    },
    // 公共Id
    openId: {
      type: Sequelize.STRING(256),
      defaultValue: '',
    },
    password: Sequelize.STRING(256),
    account: {
      type: Sequelize.STRING(32),
      unique: true,
    },
    // 用户类型
    type: {
      type: Sequelize.ENUM(['admin', 'normal', 'mobile-admin']),
      defaultValue: 'normal',
    },
  },
  {
    sequelize,
    tableName: 'user',
    modelName: 'user',
    underscored: true,
  },
);

module.exports = User;

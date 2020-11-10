const { Sequelize, Model } = require('sequelize');
const sequelize = require('../core/mysql');

/**
 * @class User、Work关联模型
 */
class UserWork extends Model {}

UserWork.init(
  {
    // imgs 关联图片
    imgs: {
      type: Sequelize.TEXT,
      get() {
        const value = this.getDataValue('imgs');
        if (value) {
          try {
            return JSON.parse(value);
          } catch (err) {
            console.err(err.message);
            return [];
          }
        }
        return [];
      },
      set(val) {
        const value = typeof val === 'string' ? val : JSON.stringify(val);
        this.setDataValue('imgs', value);
      },
    },
  },
  {
    sequelize,
    tableName: 'user_work',
    modelName: 'user_work',
    underscored: true,
  },
);

module.exports = UserWork;

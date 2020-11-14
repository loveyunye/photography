const User = require('../models/User');
const { Op } = require('sequelize');

class UserCtl {
  async list(ctx) {
    const { page = 1, size = 10 } = ctx.request.query;
    if (isNaN(Number(page)) || isNaN(Number(size))) {
      ctx.throw(422, 'page、size必须是整数');
    }
    const { name = '', type } = ctx.request.query;
    const users = await User.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
        type: type || ['mobile-admin', 'mobile'],
      },
      limit: +size,
      offset: (page - 1 < 0 ? 0 : page - 1) * size,
      order: [['updatedAt', 'desc']],
    });
    ctx.body = users;
  }

  async create(ctx) {
    ctx.status = 201;
    ctx.verifyParams({
      name: {
        type: 'string',
        require: false,
      },
    });
    const img = await User.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = img;
  }

  async edit(ctx) {
    const id = ctx.params.id;
    const updated = await User.findByPk(id);
    if (!updated) ctx.throw(404, '资源未找到');
    await updated.update(ctx.request.body);
    ctx.body = updated;
  }

  async delete(ctx) {
    const id = ctx.params.id;
    const deleted = await User.findByPk(id);
    if (!deleted) ctx.throw(404, '资源未找到');
    await deleted.destroy({ force: true });
    ctx.status = 204;
  }

  // 登录
  async login(ctx) {
    const { openId, account, password } = ctx.request.body;
    let user = null;
    let authStr;
    if (openId) {
      user = await User.findOne({ where: { openId } });
      authStr = 'openId 无效';
    } else {
      ctx.verifyParams({
        password: {
          type: 'string',
        },
        account: {
          type: 'string',
        },
      });
      user = await User.findOne({ where: { password, account } });
      authStr = '账号密码错误';
    }
    if (!user) ctx.throw(401, authStr);
    ctx.body = user;
  }
}

module.exports = new UserCtl();

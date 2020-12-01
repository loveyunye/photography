const User = require('../models/User');
const Work = require('../models/Work');
const Img = require('../models/Img');
const WorkUser = require('../models/WorkUser');
const { Op } = require('sequelize');
const Token = require('../store/token');
const { uuid } = require('../utils');

class UserCtl {
  async list(ctx) {
    const { page = 1, size = 10 } = ctx.request.query;
    if (isNaN(Number(page)) || isNaN(Number(size))) {
      ctx.throw(422, 'page、size必须是整数');
    }
    const { key = '', type } = ctx.request.query;
    const where = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${key}%`,
          },
        },
      ],
      type: type || ['mobile-admin', 'normal'],
    };
    const users = await User.findAll({
      where,
      limit: +size,
      offset: (page - 1 < 0 ? 0 : page - 1) * size,
      order: [['updatedAt', 'desc']],
    });
    const total = await User.count({ where });
    ctx.body = {
      total,
      records: users,
    };
  }

  async all(ctx) {
    const users = await User.findAll({ where: { type: 'normal' } });
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
    const user = await User.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = user;
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
    const authorization = uuid();
    await Token.set(authorization, user, openId ? 86400 : 3600);
    ctx.body = {
      user,
      authorization,
    };
  }

  // 登出
  async logout(ctx) {
    const id = ctx.headers.authorization;
    if (id) {
      await Token.destroy(id);
    }
    ctx.status = 200;
  }

  // 获取个人信息
  async getMy(ctx) {
    ctx.status = ctx.state.user;
  }

  async getWorks(ctx) {
    const id = ctx.params.id;
    const user = await User.findByPk(id);
    if (!user) ctx.throw(404, '资源未找到');
    const workUsers = await WorkUser.findAll({ userId: id });
    const works = [];
    if (workUsers.length) {
      const bridge = JSON.parse(JSON.stringify(workUsers));
      for (let i = 0; i < bridge.length; i++) {
        const imgs = await Img.findAll({ workId: bridge[i].workId });
        const work = await Work.findByPk(bridge[i].workId);
        works.push({
          select: bridge.imgs,
          imgs,
          ...JSON.parse(JSON.stringify(work)),
        });
      }
    }
    ctx.body = {
      works,
      user,
    };
  }
}

module.exports = new UserCtl();

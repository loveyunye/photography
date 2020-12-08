const Work = require('../models/Work');
const Img = require('../models/Img');
const User = require('../models/User');
const WorkUser = require('../models/WorkUser');
const Share = require('../models/Share');
const { Op } = require('sequelize');

class WorkCtl {
  // 列表
  async list(ctx) {
    const { page = 1, size = 10 } = ctx.request.query;
    if (isNaN(Number(page)) || isNaN(Number(size))) {
      ctx.throw(422, 'page、size必须是整数');
    }
    const { key = '' } = ctx.request.query;
    const where = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${key}%`,
          },
        },
        {
          describe: {
            [Op.like]: `%${key}%`,
          },
        },
      ],
    };
    const works = await Work.findAll({
      where,
      limit: +size,
      offset: (page - 1 < 0 ? 0 : page - 1) * size,
      order: [['updatedAt', 'desc']],
    });
    const total = await Work.count({ where });
    ctx.body = {
      total,
      records: works,
    };
  }

  // 获取所有
  async all(ctx) {
    const works = await Work.findAll();
    ctx.body = works;
  }

  // 创建
  async create(ctx) {
    ctx.status = 201;
    ctx.verifyParams({
      name: {
        type: 'string',
      },
    });
    const work = await Work.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = work;
  }

  // 编辑
  async edit(ctx) {
    const id = ctx.params.id;
    const updated = await Work.findByPk(id);
    if (!updated) ctx.throw(404, '资源未找到');
    await updated.update(ctx.request.body);
    ctx.body = updated;
  }

  // 删除
  async delete(ctx) {
    const id = ctx.params.id;
    const deleted = await Work.findByPk(id);
    if (!deleted) ctx.throw(404, '资源未找到');
    await deleted.destroy();
    ctx.status = 204;
  }

  static async detailById(ctx, id) {
    const work = await Work.findByPk(id);
    if (!work) ctx.throw(404, '资源未找到');
    const imgs = await Img.findAll({ where: { workId: id } });
    const workUsers = await WorkUser.findAll({ where: { workId: id } });
    const users = [];
    if (workUsers.length) {
      const bridge = JSON.parse(JSON.stringify(workUsers));
      for (let i = 0; i < bridge.length; i++) {
        const user = await User.findOne({ where: { id: bridge[i].userId }, raw: true });
        if (user) {
          users.push({
            ...bridge[i],
            ...user,
          });
        }
      }
    }
    return {
      work,
      imgs,
      users,
    };
  }

  // 获取详情
  async getDetail(ctx) {
    const id = ctx.params.id;
    const detail = await WorkCtl.detailById(ctx, id);
    ctx.body = detail;
  }

  // 通过code获取
  async getDetailByCode(ctx) {
    const code = ctx.params.code;
    const share = await Share.findByPk(code);
    if (!share) ctx.throw(404, '分享码已过期');
    const detail = await WorkCtl.detailById(ctx, share.workId);
    ctx.body = {
      ...detail,
      share,
    };
  }

  // 获取作品详情
  async getWorks(ctx) {
    const { id } = ctx.state.user;
    const workUsers = await WorkUser.findAll({ where: { userId: id } });
    const works = [];
    if (workUsers.length) {
      const bridge = JSON.parse(JSON.stringify(workUsers));
      for (let i = 0; i < bridge.length; i++) {
        const work = await Work.findByPk(bridge[i].workId);
        works.push(JSON.parse(JSON.stringify(work)));
      }
    }
    ctx.body = works;
  }

  // 判断是否为自己的作品
  async self(ctx) {
    const { id: userId } = ctx.state.user;
    const workId = ctx.params.id;
    const workUser = await WorkUser.findOne({ where: { userId, workId } });
    ctx.body = workUser;
  }

  // 设置关联
  async setLink(ctx) {
    const workId = ctx.params.id;
    const work = await Work.findByPk(workId);
    if (!work) ctx.throw(404, '资源未找到');
    ctx.verifyParams({
      userId: {
        type: 'int',
      },
      link: {
        type: 'boolean',
        require: false,
      },
    });
    const { userId, link = true } = ctx.request.body;
    const user = await User.findByPk(userId);
    if (!user) ctx.throw(404, '资源未找到');
    const bridge = await WorkUser.findOne({ where: { workId, userId } });
    if (!bridge && link) {
      await WorkUser.create({ workId, userId });
    }
    if (bridge && !link) {
      await bridge.destroy();
    }
    ctx.status = 200;
  }

  // 设置图片
  async setImgs(ctx) {
    const workId = ctx.params.id;
    const work = await Work.findByPk(workId);
    if (!work) ctx.throw(404, '资源未找到');
    ctx.verifyParams({
      userId: {
        type: 'int',
      },
      imgs: {
        type: 'array',
        require: false,
      },
    });
    const { userId, imgs = [] } = ctx.request.body;
    const user = await User.findByPk(userId);
    if (!user) ctx.throw(404, '资源未找到');
    const bridge = await WorkUser.findOne({ where: { workId, userId } });
    if (!bridge) {
      await WorkUser.create({ workId, userId, imgs });
    } else {
      await bridge.update({ imgs });
    }
    ctx.status = 200;
  }

  async selectImgs(ctx) {
    const { id: userId } = ctx.state.user;
    const workId = ctx.params.id;
    const { imgs = [] } = ctx.request.body;
    const bridge = await WorkUser.findOne({ where: { workId, userId } });
    if (!bridge) {
      ctx.throw(404, '资源未找到');
    } else {
      await bridge.update({ imgs });
    }
    ctx.status = 200;
  }
}

module.exports = new WorkCtl();

const Work = require('../models/Work');
const Img = require('../models/Img');
const User = require('../models/Img');
const WorkUser = require('../models/WorkUser');
const { Op } = require('sequelize');

class WorkCtl {
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

  async all(ctx) {
    const works = await Work.findAll();
    ctx.body = works;
  }

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

  async edit(ctx) {
    const id = ctx.params.id;
    const updated = await Work.findByPk(id);
    if (!updated) ctx.throw(404, '资源未找到');
    await updated.update(ctx.request.body);
    ctx.body = updated;
  }

  async delete(ctx) {
    const id = ctx.params.id;
    const deleted = await Work.findByPk(id);
    if (!deleted) ctx.throw(404, '资源未找到');
    await deleted.destroy();
    ctx.status = 204;
  }

  async getDetail(ctx) {
    const id = ctx.params.id;
    const work = await Work.findByPk(id);
    if (!work) ctx.throw(404, '资源未找到');
    const imgs = await Img.findAll({ where: { workId: id } });
    const workUsers = await WorkUser.findAll({ where: { workId: id } });
    const users = [];
    if (workUsers.length) {
      const bridge = JSON.parse(JSON.stringify(workUsers));
      for (let i = 0; i < bridge.length; i++) {
        const user = await User.findOne({ where: { userId: bridge[i].userId }, raw: true });
        users.push({
          ...user,
          ...bridge,
        });
      }
    }
    ctx.body = {
      work,
      imgs,
      users,
    };
  }

  async setLink(ctx) {
    const workId = ctx.params.id;
    const work = await Work.findByPk(workId);
    if (!work) ctx.throw(404, '资源未找到');
    ctx.verifyParams({
      userId: {
        type: 'int',
      },
      link: {
        type: Boolean,
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
}

module.exports = new WorkCtl();

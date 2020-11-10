const Work = require('../models/Work');
const { Op } = require('sequelize');

class WorkCtl {
  async list(ctx) {
    const { page = 20, size = 0 } = ctx.request.query;
    if (isNaN(Number(page)) || isNaN(Number(size))) {
      ctx.throw(422, 'page、size必须是整数');
    }
    const { key = '' } = ctx.request.query;
    const works = await Work.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${key}%`,
            },
            describe: {
              [Op.like]: `%${key}%`,
            },
          },
        ],
      },
      limit: +size,
      offset: (page - 1 < 0 ? 0 : page - 1) * size,
      order: [['updatedAt', 'desc']],
    });
    ctx.body = works;
  }

  async create(ctx) {
    ctx.status = 201;
    ctx.verifyParams({
      name: {
        type: 'string',
        require: false,
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
}

module.exports = new WorkCtl();

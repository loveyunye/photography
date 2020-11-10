const Img = require('../models/Img');
const { Op } = require('sequelize');

class ImgCtl {
  async list(ctx) {
    const { page = 20, size = 0 } = ctx.request.query;
    if (isNaN(Number(page)) || isNaN(Number(size))) {
      ctx.throw(422, 'page、size必须是整数');
    }
    const { workId, name } = ctx.request.query;
    const imgs = await Img.findAll({
      where: {
        ...(workId ? { workId } : {}),
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${name}%`,
            },
          },
        ],
      },
      limit: +size,
      offset: (page - 1 < 0 ? 0 : page - 1) * size,
      order: [['updatedAt', 'desc']],
    });
    ctx.body = imgs;
  }

  async create(ctx) {
    ctx.status = 201;
    ctx.verifyParams({
      name: {
        type: 'string',
        require: false,
      },
      path: {
        type: 'string',
      },
    });
    const img = await Img.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = img;
  }

  async edit(ctx) {
    const id = ctx.params.id;
    const updated = await Img.findByPk(id);
    if (!updated) ctx.throw(404, '资源未找到');
    await updated.update(ctx.request.body);
    ctx.body = updated;
  }

  async delete(ctx) {
    const id = ctx.params.id;
    const deleted = await Img.findByPk(id);
    if (!deleted) ctx.throw(404, '资源未找到');
    await deleted.destroy();
    ctx.status = 204;
  }
}

module.exports = new ImgCtl();

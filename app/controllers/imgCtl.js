const Img = require('../models/Img');
const Work = require('../models/Work');
const { Op } = require('sequelize');
const Tool = require('../utils/imgTool');

class ImgCtl {
  async list(ctx) {
    const { page = 1, size = 10 } = ctx.request.query;
    if (isNaN(Number(page)) || isNaN(Number(size))) {
      ctx.throw(422, 'page、size必须是整数');
    }
    const { workId, key = '' } = ctx.request.query;
    const where = {
      ...(workId ? { workId } : {}),
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${key}%`,
          },
        },
      ],
    };
    const imgs = await Img.findAll({
      where,
      limit: +size,
      offset: (page - 1 < 0 ? 0 : page - 1) * size,
      order: [['updatedAt', 'desc']],
    });
    const total = await Img.count({ where });
    ctx.body = {
      total,
      records: imgs,
    };
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

  // 上传
  async upload(ctx) {
    const id = ctx.params.workId;
    const work = await Work.findByPk(id);
    if (!work) ctx.throw(404, '资源未找到');
    const filePath = ctx.request.files.file.path;
    if (ctx.request.files.file && ctx.request.files.file.size > 1024 * 1024 * 100) {
      ctx.throw(422, '文件过大');
    }
    const tool = new Tool(filePath, id);
    try {
      await tool.extract();
      const count = await tool.uploadProcess();
      ctx.body = count;
    } catch (error) {
      ctx.throw(422, error.message);
    }
  }
}

module.exports = new ImgCtl();

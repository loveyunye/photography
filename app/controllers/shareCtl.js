// const User = require('../models/User');
const Share = require('../models/Share');
const Work = require('../models/Work');
const WorkUser = require('../models/WorkUser');
// const Token = require('../store/token');
const { uuid } = require('../utils');

class ShareCtl {
  // 创建分享
  async create(ctx) {
    const workId = ctx.params.workId;
    // work is exist
    const work = await Work.findByPk(workId);
    if (!work) ctx.throw(404, '作品不存在');
    // delete already shares
    // const shares = await Share.findAll({ where: { workId } });
    // if (shares && shares.length > 0) await shares.destroy();
    // // create new share
    // const share = await Share.create({ code: uuid(), workId });

    const share = await Share.create({ code: uuid(), workId });
    ctx.body = share;
  }

  // 获取分享内容
  async setShare(ctx) {
    const code = ctx.params.code;
    const { id: userId } = ctx.state.user;
    // share is exist
    const share = await Share.findByPk(code);
    if (!share) ctx.throw(404, '分享码已过期');
    // work is exist
    const workId = share.workId;
    const used = share.used;
    const work = await Work.findByPk(workId);
    if (!work) ctx.throw(404, '作品不存在');
    // create user-work
    if (!used) {
      const workUser = await WorkUser.findOne({ where: { workId, userId } });
      if (!workUser) {
        await WorkUser.create({ workId, userId, imgs: [] });
      }
      await share.update({ used: true });
    }
    ctx.body = share;
    ctx.status = 200;
  }
}

module.exports = new ShareCtl();

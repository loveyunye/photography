const Token = require('../store/token');
const User = require('../models/User');

class Auth {
  static async admin(ctx, next) {
    const { authorization } = ctx.headers;
    if (!authorization) Auth.failCommon(ctx);
    const user = await Token.get(authorization);
    if (!user) Auth.failCommon(ctx);
    if (user.type !== 'admin') Auth.failCommon(ctx);
    ctx.state.user = user;
    await next();
  }

  static async mobile(ctx, next) {
    const { authorization: openId } = ctx.headers;
    if (!openId) Auth.failCommon(ctx);
    const user = await User.getUser(openId);
    if (!user) Auth.failCommon(ctx);
    ctx.state.user = user;
    await next();
  }

  static failCommon(ctx) {
    ctx.throw(401, '身份认证失败， 请重新登录');
  }
}

module.exports = Auth;

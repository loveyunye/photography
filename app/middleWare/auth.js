const Token = require('../store/token');

class Auth {
  static async admin(ctx, next) {
    console.log(ctx.headers);
    const { authorization } = ctx.headers;
    if (!authorization) Auth.failCommon(ctx);
    const user = await Token.get(authorization);
    if (!user) Auth.failCommon(ctx);
    if (user.type !== 'admin') Auth.failCommon(ctx);
    await next();
  }

  static async mobile() {}

  static failCommon(ctx) {
    ctx.throw(401, '身份认证失败， 请重新登录');
  }
}

module.exports = Auth;
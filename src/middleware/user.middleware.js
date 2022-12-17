const errorTypes = require("../constants/error-types");
const service = require("../service/user.service");
const md5password = require("../utils/handlePwd");
const { decrypt } = require('../utils/jsencrypt')

async function verifyUser(ctx, next) {
    //1.获取用户名和密码
    const { name, password, code } = ctx.request.body;
    console.log(name, password);
    //判断用户名和密码是否为空
    if (!name || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit("error", error, ctx);
    }
    if (!code) {
        const error = new Error(errorTypes.CODE_IS_REQUIRED);
        return ctx.app.emit("error", error, ctx);
    }
    
    const result = await service.verifyUser(name);
    console.log(result);
    // 校验验证码
    if(result[0].Rcode !== code){
        const error = new Error(errorTypes.CODE_ERROR);
        return ctx.app.emit("error", error, ctx);
    }
    //用户名已经存在
    if (result[0].status) {
        const error = new Error(errorTypes.USER_ALREADY_EXISTS);
        return ctx.app.emit("error", error, ctx);
    }
    await next();
}
//对密码进行加密
async function handPassword(ctx, next) {
    console.log('密码加密：');
    let { password } = ctx.request.body;
    //对传过来的密码转为字符串
    //解密客户端传来的密码
    try {
        password = decrypt(password);
        console.log("解密后：", password);
    } catch (error) {
        console.log(error);
    }

    password = password.toString();
    ctx.request.body.password = md5password(password);
    await next();
}
module.exports = {
    verifyUser,
    handPassword,
};
const jwt = require("jsonwebtoken");

const errorTypes = require("../constants/error-types");
const userService = require("../service/user.service");
const AuthService = require("../service/auth.service");
const md5password = require("../utils/handlePwd");
const { PUBLICKKEY } = require("../app/config");
const { decrypt } = require('../utils/jsencrypt');
const { isManger,isExit } = require("../service/user.service");
//验证登录
const verifyLogin = async(ctx, next) => {
    //1.获取账号，密码
    let { name, password } = ctx.request.body;
    //2.账号密码是否为空
    if (!name || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit("error", error, ctx);
    }
    //3.账号是否存在
    const result = await userService.getUserbyName(name);
    const user = result[0];
    if (!user) {
        const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
        return ctx.app.emit("error", error, ctx);
    }

    //4.密码是否正确
    password = password.toString();
    //使用私钥解密客户端的密码
    password = decrypt(password);
    if (md5password(password) !== user.password) {
        const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
        return ctx.app.emit("error", error, ctx);
    }
    //用于将下一个中间件获取user
    ctx.user = user;
    await next();
};
const verifyLoginEnd = async(ctx, next) => {
    //1.获取账号，密码
    let { name, password } = ctx.request.body;
    //2.账号密码是否为空
    if (!name || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit("error", error, ctx);
    }
    //3.账号是否存在
    const result = await userService.getUserbyName(name);
    const user = result[0];
    if (!user) {
        const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
        return ctx.app.emit("error", error, ctx);
    }
    //验证是否有权限登录
    if (!user.authcode) {
        const error = new Error(errorTypes.NONEAUTH);
        return ctx.app.emit("error", error, ctx);
    }
    console.log(user);
    //4.密码是否正确
    password = password.toString();
    //使用私钥解密客户端的密码
    password = decrypt(password);
    if (md5password(password) !== user.password) {
        const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
        return ctx.app.emit("error", error, ctx);
    }

    //用于将下一个中间件获取user
    ctx.user = user;
    await next();
}

//验证token
const verfigAuth = async(ctx, next) => {
    console.log("开启验证token");
    const authorization = ctx.headers.authorization;
    if (authorization) {
        const token = authorization.replace("Bearer ", "");
        try {
            const result = jwt.verify(token, PUBLICKKEY, { algorithms: ["RS256"] });
            const exit =  await isExit(result.id)
            if(exit){
                ctx.user = result;
                await next();
            }else{
                const error = new Error(errorTypes.ACCOUNTDISABLED);
                ctx.app.emit("error", error, ctx);
            }
        } catch (err) {
            const error = new Error(errorTypes.UNVERIFYOTOKEN);
            ctx.app.emit("error", error, ctx);
        }
    } else {
        const error = new Error(errorTypes.NONETOKEN);
        ctx.app.emit('error', error, ctx)
    }
};

const verfigPermission = async(ctx, next) => {
    console.log("开启验证权限");
    //获取userId,momentId
    const userId = ctx.user.id;
    //获取操作的表
    const params = ctx.request.params;
    let [tableName] = Object.keys(params);
    const id = params[tableName]; //操作的id号
    tableName = tableName.replace("Id", "");
    //验证是否有权限
    try {
        const isPermission = await AuthService.permission(userId, id, tableName);
        if (!isPermission) {
            //如果没有权限，抛出错误
            throw new Error();
        }
        await next();
    } catch (err) {
        const error = new Error(errorTypes.UNPERMISSION);
        ctx.app.emit("error", error, ctx);
    }
};

//验证是否是管理员
const verfigManger = async(ctx, next) => {
    const user = ctx.user;
    const auth = await isManger(user.id);
    if (auth.authcode) {
        // 1
        await next();
    } else {
        // 0
        const error = new Error(errorTypes.NOISMANGER);
        ctx.app.emit('error', error, ctx)
    }
}

module.exports = {
    verifyLogin,
    verfigAuth,
    verfigPermission,
    verifyLoginEnd,
    verfigManger
};
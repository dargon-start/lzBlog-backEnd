const errorTypes = require("../constants/error-types");

function errorHandler(err, ctx) {
    let message, status;
    switch (err.message) {
        case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
            status = 400;
            message = "邮箱或密码不能为空";
            break;
        case errorTypes.CODE_IS_REQUIRED:
            status = 400;
            message = '验证码不能为空'
        case errorTypes.USER_ALREADY_EXISTS:
            status = 400;
            message = "账号已存在";
            break;
        case errorTypes.USER_DOES_NOT_EXISTS:
            status = 400;
            message = "用户名不存在";
            break;
        case errorTypes.PASSWORD_IS_INCORRENT:
            status = 400;
            message = "密码错误";
            break;
        case errorTypes.CODE_ERROR:
            status = 400;
            message = '验证码错误';
            break;
        case errorTypes.NONEAUTH:
            status = 400;
            message = '您不是管理员，不能登录！';
            break;
        case errorTypes.NONETOKEN:
            status = 401;
            message = '您未登录，请登录！';
            break;
        case errorTypes.UNVERIFYOTOKEN:
            status = 401;
            message = "失效的token~";
            break;
        case errorTypes.UNPERMISSION:
            status = 401;
            message = "您没有权限~";
            break;
        case errorTypes.ADDWEBSITEFAIL:
            status = 400;
            message = "添加站点失败,请检查网址是否正确~";
            break;
        case errorTypes.CANNOTSEARCHiCON:
            status = 500;
            message = "添加站点失败,未能搜索到网站图标~";
            break;
        case errorTypes.NOISMANGER:
            status = 401;
            message = '您不是管理员';
            break;
        case errorTypes.DELETEWEBSITEFILE:
            status = 400;
            message = '删除站点失败';
            break;
        case errorTypes.ACCOUNTDISABLED:
            status = 401;
            message = '账号已被禁用'
            break;
        case errorTypes.UPDATETOOLFAIL:
            status = 400;
            message = '修改工具站点失败';
            break;
        case errorTypes.SERVICEERR:
            status = 500;
            message = '服务器开小差了'
            break;
        default:
            status = 404;
            message = "Not found";
    }
    ctx.status = status;
    ctx.body = message;
}

module.exports = errorHandler;
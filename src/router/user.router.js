const router = require("koa-router");

const { verifyUser, handPassword } = require("../middleware/user.middleware");
const { verfigAuth, verifyLogin, verifyLoginEnd, verfigManger, verfigPermission } = require("../middleware/auth.middleware");

const { create, avatarInfo, verifyCode, modify, getUserInfo, getUserList, deleteUser, searchList } = require("../controller/user.control");
const { login } = require('../controller/auth.control')

const userRouter = new router({ prefix: "/user" });
//verifyUser验证邮箱是否已注册
//handPassword对密码进行加密
//注册
userRouter.post("/register", verifyUser, handPassword, create);
//登录
userRouter.post('/login', verifyLogin, login);

//后台登录
userRouter.post('/loginEnd', verifyLoginEnd, login)

//修改信息
// userRouter.post('/modify', verfigAuth, modify)

// 获取用户信息
userRouter.get('/', verfigAuth, getUserInfo)

//获取头像
// userRouter.get("/:userId/avatar", avatarInfo);

//发送验证码
userRouter.post('/code', verifyCode)

//用户列表
userRouter.get('/list', verfigAuth, verfigManger, getUserList)

//销毁用户
userRouter.delete('/delete', verfigAuth, verfigManger, deleteUser)

//搜索用户
userRouter.post('/search', verfigAuth, verfigManger, searchList)

module.exports = userRouter;
const router = require("koa-router");

const {
  create,
  reply,
  remove,
  update,
  getCommentList,
  getCommentList_back
} = require("../controller/comment.control");

const {verfigPermission, verfigManger} = require("../middleware/auth.middleware");
const {verfigAuth} = require("../middleware/auth.middleware");

const commentRouter = new router({prefix: "/comment"});

//评论要验证是否登录
commentRouter.post("/", verfigAuth, create);
//回复评论
commentRouter.post("/reply/:commentId", verfigAuth, reply);

//修改评论
//需要验证是否有权限修改
// commentRouter.patch("/:commentId", verfigAuth, verfigPermission, update);

//获取评论列表
commentRouter.get("/", getCommentList);

//后台接口 

// 获取评论列表 - 后台
commentRouter.get('/back',verfigAuth, verfigManger,getCommentList_back)

//删除评论
commentRouter.delete("/", verfigAuth, verfigManger, remove);

module.exports = commentRouter;

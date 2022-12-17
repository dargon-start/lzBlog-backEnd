const router = require("koa-router");
const {
  create,
  getMoment,
  getMonentList,
  update,
  remove,
  addLabels,
  fileInfo,
  getArtandlabelNumber,
  searchArticleList,
  getMomentBackList
} = require("../controller/article.control.js");
const {verfigAuth, verfigPermission,verfigManger} = require("../middleware/auth.middleware");
const {verfigisLabelExist} = require("../middleware/label.middleware");

const articleRouter = new router({prefix: "/article"});

//创建文章
articleRouter.post("/", verfigAuth, create);
//获取文章列表
articleRouter.get("/", getMonentList);

// 后台获取文章列表数据
articleRouter.get('/backList',verfigAuth ,getMomentBackList)

//获取文章数量和标签数量
articleRouter.get("/amount", getArtandlabelNumber);

//搜索文章列表
articleRouter.get("/search", searchArticleList);

//获取文章详情
articleRouter.get("/:articlesId", getMoment);

//动态配图
articleRouter.get("/images/:filename", fileInfo);


// 后台接口

//修改文章
articleRouter.patch("/:articlesId", verfigAuth, verfigManger, update);
//删除文章
articleRouter.delete("/:articlesId", verfigAuth, verfigManger, remove);
//给文章添加标签
articleRouter.post(
  "/:articlesId/labels",
  verfigAuth,
  verfigManger,
  verfigisLabelExist,
  addLabels
);

module.exports = articleRouter;

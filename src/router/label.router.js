const router = require("koa-router");

const {create, list,listByLable} = require("../controller/label.contrlol");
const {verfigAuth, verfigPermission} = require("../middleware/auth.middleware");

const labelRouter = new router({prefix: "/label"});

labelRouter.post("/", verfigAuth, create);

labelRouter.get("/", list);

//根据标签搜索文章
labelRouter.get('/article',listByLable)

module.exports = labelRouter;

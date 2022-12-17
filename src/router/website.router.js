const router = require('koa-router');

const {verfigAuth,verfigPermission} = require('../middleware/auth.middleware')

const {addwebsite,getwebsiteList, deleteWebsite} = require('../controller/website.control')
const websiteRouter = new router({prefix:'/website'});

//添加站点
websiteRouter.post('/',verfigAuth,addwebsite)
//获取站点列表
// websiteRouter.get('/',verfigAuth,getwebsiteList)
websiteRouter.get('/:userId', getwebsiteList)
//删除站点
websiteRouter.delete('/',verfigAuth,deleteWebsite)
module.exports = websiteRouter;
const router = require('koa-router');

const {verfigAuth, verfigManger, verfigPermission} = require('../middleware/auth.middleware');
const {addToolType, deleteToolType, getTypeList, addToolSite, 
  getToolSiteList, deleteToolsite, updateToolsite,iconInfo} = require('../controller/toolSite.control');

const toolSiteRouter = new router({prefix:'/toolSite'});

// 新增tool类别
toolSiteRouter.post('/type',verfigAuth,verfigManger,addToolType);

// 获取tool类别列表
toolSiteRouter.get('/type',verfigAuth,verfigManger,getTypeList);
//新增tool
toolSiteRouter.post('/',verfigAuth, verfigManger, addToolSite)
//获取tool列表
toolSiteRouter.get('/', getToolSiteList)
//删除站点
toolSiteRouter.delete('/:id',verfigAuth,verfigManger,deleteToolsite)
// 删除tool类别
toolSiteRouter.delete('/type/:id',verfigAuth,verfigManger,deleteToolType)
// 修改tool
toolSiteRouter.patch('/update',verfigAuth,verfigManger,updateToolsite)
// 获取icon图标
toolSiteRouter.get('/icon/:iconName',iconInfo)
module.exports = toolSiteRouter;
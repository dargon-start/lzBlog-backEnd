const {addTypeService,delTypeService,getTypelistService,addToolService,getToolListService,updateToolService,deleteToolServie} = require('../service/toolSite.service')
const errorTypes = require('../constants/error-types');
const fileservice = require('../service/file.service');
const { ICON_PATH} = require("../constants/file-path");
const fs = require("fs");
const path = require("path");
class ToolSiteController{
  async addToolType(ctx,next){
    try {
      const {type} = ctx.request.body;
      await addTypeService(type)
      ctx.body={
        msg:'添加工具类型成功'
      }
    } catch (error) {
      console.log(error);
      if(error.errno === 1062){
        ctx.status = 400;
        ctx.body = '类型名称已存在';
      }
    }
  }
  async deleteToolType(ctx){
    try {
      const {id} = ctx.request.params;
      const result = await delTypeService(id)
      if(result.affectedRows>0){
        ctx.body={
          msg:'删除工具类型成功'
        }
      }else{
        const error = new Error(errorTypes.DELETEWEBSITEFILE);
        return ctx.app.emit("error", error, ctx);
      }
    } catch (err) {
      const error = new Error(errorTypes.DELETEWEBSITEFILE);
      return ctx.app.emit("error", error, ctx);
    }
  }
  async getTypeList(ctx,next){
    try {
      const result = await getTypelistService();

      ctx.body={
        msg:'获取类型列表成功',
        data:result
      }
    } catch (error) {
      console.log(error);
    }

  }

  async addToolSite(ctx,next){
    try {
      const {name,url,iconUrl,type} = ctx.request.body;
      const result =  await addToolService(name,url,iconUrl,type);
      if(result.affectedRows>0){
        ctx.body={
            msg:'添加站点成功'
        }
      }else{
          const error = new Error(errorTypes.ADDWEBSITEFAIL);
          return ctx.app.emit("error", error, ctx);
      }
    } catch (err) {
      const error = new Error(errorTypes.ADDWEBSITEFAIL);
      return ctx.app.emit("error", error, ctx);
    }
  }
  async getToolSiteList(ctx,next){
    try {
      const result = await getToolListService();
      // 处理数据
      let _res = [];
      result.forEach(item=>{
        const obj =  _res.find(rd=>{
         return rd.typeName === item.typeName
        })
        if(obj){
          obj.tool.push(item)
        }else{
          _res.push({
            typeName:item.typeName,
            tool:[item]
          })
        }
      })
      ctx.body={
          msg:'获取站点列表成功',
          data:_res
      }
    } catch (err) {
      const error = new Error(errorTypes.SERVICEERR);
      return ctx.app.emit("error", error, ctx);
    }
  }
  async deleteToolsite(ctx,next){
    try {
      const {id} = ctx.request.params
      const result = await deleteToolServie(id);
      if(result.affectedRows>0){
        ctx.body={
            msg:'删除站点成功'
        }
      }else{
          const error = new Error(errorTypes.DELETEWEBSITEFILE);
          return ctx.app.emit("error", error, ctx);
      }
    } catch (err) {
      const error = new Error(errorTypes.DELETEWEBSITEFILE);
      return ctx.app.emit("error", error, ctx);
    }
  }
  async updateToolsite(){
    try {
      const {id,name,url,iconUrl,type} = ctx.request.body;
      const result =  await updateToolService(id,name,url,iconUrl,type);
      if(result.affectedRows>0){
        ctx.body={
            msg:'修改站点成功'
        }
      }else{
          const error = new Error(errorTypes.UPDATETOOLFAIL);
          return ctx.app.emit("error", error, ctx);
      }
    } catch (err) {
      const error = new Error(errorTypes.UPDATETOOLFAIL);
      return ctx.app.emit("error", error, ctx);
    }
  }

  async iconInfo(ctx, next) {
    try {
      let {iconName} = ctx.params;
      const fileinfo = await fileservice.getIconByname(iconName);
      //设置相应类型
      ctx.response.set("content-type", fileinfo.mimetype);
      //返回一个流文件
      ctx.body = fs.createReadStream(`${ICON_PATH}/${iconName}`);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new ToolSiteController();
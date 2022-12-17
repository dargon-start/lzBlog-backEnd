const service = require("../service/comment.service");
const {desensitize} = require('../utils/utils')
class commentControl {
  //评论
  async create(ctx, next) {

    const {content, articleId} = ctx.request.body;
    console.log(content,articleId);

    const userId = ctx.user.id;
    //添加评论
    try {
      const result = await service.create(articleId, content, userId);
      ctx.body = result;
    } catch (error) {
      console.log(error);
    }
    
  }

  //回复评论
  async reply(ctx, next) {

    const {content, articleId} = ctx.request.body;
    const userId = ctx.user.id;
    const {commentId} = ctx.request.params;
    //添加评论
    console.log(content,articleId,commentId);
    try {
      const result = await service.reply(articleId, content, userId, commentId);
      ctx.body = result;
    } catch (error) {
      console.log(error);
    }
   
  }
  //修改评论
  async update(ctx, next) {
    const {commentId} = ctx.request.params;
    const {content} = ctx.request.body;
    const result = await service.update(content, commentId);
    ctx.body = result;
  }
  //删除评论
  async remove(ctx, next) {
    console.log('删除评论');
    try {
      const {commentIds} = ctx.request.body;
      console.log(commentIds);
      const result = await service.remove(commentIds);
      ctx.body = result;
    } catch (error) {
      console.log(error);
      const err = new Error(errorTypes.ADDWEBSITEFAIL);
      return ctx.app.emit("error", err, ctx);
    }
    
  }
  //获取评论列表
  async getCommentList(ctx, next) {
    const {articleId} = ctx.request.query;
    try {
      let result = await service.getCommentList(articleId);
      //处理评论数据
      let clist = result.map(item=>{
        if(item.parentComment){
         return {...item,user:{...item.user,name:desensitize(item.user.name)},parentComment:{...item.parentComment,pname:desensitize(item.parentComment.pname)}}
        }else{
          return {...item,user:{...item.user,name:desensitize(item.user.name)}}
        }
      });
      let sonComment = clist;
      sonComment = sonComment.filter(item=>item.commentId !== null);
      clist = clist.filter(item=>item.commentId == null)
      console.log(sonComment);

      sonComment.forEach(s=>{
        clist.forEach((p,index)=>{
          if(s.commentId === p.id){
            if(p.childComment){
              p.childComment.push(s)
            }else{
              clist[index] = {...p,childComment:[s]}
            }
          }else{
            // 查询是否为评论二级评论
            if(p.childComment){
              p.childComment.forEach(sc=>{
                if(s.commentId === sc.id){
                  p.childComment.push(s)
                }
              })
            }
          }
        })
      })
      console.log(clist);
      result = clist;
      ctx.body = {
        msg:'ok',
        data:result
      };
    } catch (error) {
      throw new Error(error)
    }
  }

   //获取评论列表 - 后台
  async getCommentList_back(ctx,next){
    const {articleId,offset,size} = ctx.request.query;
    try {
      let result = await service.getCommentListBack(articleId,offset,size);
      // 更新已读
      await service.updateRead(articleId);
       //处理评论数据
       let clist = result.data.map(item=>{
        if(item.parentComment){
         return {...item,user:{...item.user,name:desensitize(item.user.name)},parentComment:{...item.parentComment,pname:desensitize(item.parentComment.pname)}}
        }else{
          return {...item,user:{...item.user,name:desensitize(item.user.name)}}
        }
      });
      ctx.body = {
        msg:'ok',
        data:{
          data:clist,
          total:result.total
        }
      };
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new commentControl();

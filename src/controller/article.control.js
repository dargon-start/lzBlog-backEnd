const service = require("../service/article.service");
const fileservice = require("../service/file.service");
const {AVATAR_PATH, PICTURE_PATH} = require("../constants/file-path");
const fs = require("fs");
const path = require("path");
class createMoment {
  async create(ctx, next) {
    console.log("create article");
    //1.获取用户id，要知道是那个用户发表动态
    const userId = ctx.user.id;
    //2.获取内容
    const {content, title, synopsis, imgList} = ctx.request.body;
    console.log(title, content, userId, imgList);
    //2.创建动态，保存到数据库
    try {
      const articleId = await service.create(userId, content, title, synopsis);
      //通过id来将图片绑定到该文章下
      await fileservice.undateFileInfo(articleId, imgList);
      ctx.body = {
        code: 200,
        message: "ok",
        articleId: articleId,
      };
    } catch (error) {
      console.error(error);
    }
  }

  //获取单个动态
  async getMoment(ctx, next) {
    console.log("获取动态");
    const articlesId = ctx.request.params.articlesId;
    //增加浏览量
    try {
      const result = await service.getMoment(articlesId);
      await service.addGlance(articlesId);

      ctx.body = {
        msg: "ok",
        data: result,
      };
    } catch (error) {
      console.error(error);
    }
  }

  //获取动态列表
  async getMonentList(ctx, next) {
    //获取偏移量和大小
    const {offset, size, type} = ctx.request.query;
    try {
      const result = await service.getList(offset, size, type);
      ctx.body = {
        code: 200,
        message: "ok",
        total: result.length,
        data: result,
      };
    } catch (error) {
      console.error(error);
    }
  }

  // 后台获取文章列表数据
  async getMomentBackList(ctx,next){
     //获取偏移量和大小
     const {offset, size, type} = ctx.request.query;
     try {
       const result = await service.getbackList(offset, size, type);
       ctx.body = {
         code: 200,
         message: "ok",
         total: result.length,
         data: result,
       };
     } catch (error) {
       console.error(error);
     }
  }

  //更新动态
  async update(ctx, next) {
    console.log("修改");
    const {articlesId} = ctx.request.params;
    const {content, title, synopsis, imgList} = ctx.request.body;
    console.log(articlesId, title, content);
    try {
      const result = await service.updateMoment(
        articlesId,
        title,
        content,
        synopsis
      );
      //通过id来将图片绑定到该文章下
      await fileservice.undateFileInfo(articlesId, imgList);
      ctx.body = {
        code: 200,
        message: "修改成功",
      };
    } catch (error) {
      console.error(error);
    }
  }

  //移除动态
  async remove(ctx, next) {
    console.log("移除");
    let {articlesId} = ctx.request.params;
    console.log(articlesId, typeof articlesId);
    try {
      //删除文章中的图片
      const imgs = await fileservice.getFileByArticleId(articlesId);
      for (const img of imgs) {
        const imgPath = path.resolve(
          process.cwd(),
          `./uploads/picture/${img.filename}`
        );
        fs.unlink(imgPath, () => {
          console.log("图片删除成功");
        });
      }
      //删除文章
      const result = await service.removeMoment(articlesId);

      ctx.body = {
        code: 200,
        message: "删除成功",
      };
    } catch (error) {
      console.error(error);
    }
  }

  //添加标签
  async addLabels(ctx, next) {
    const {labels} = ctx;
    const {articlesId} = ctx.request.params;
    console.log(labels, articlesId);
    try {
      for (const label of labels) {
        const isexist = await service.hasLabel(articlesId, label.id);
        //查看此动态是否有标签
        if (!isexist) {
          //不存在
          const result = await service.addLabel(articlesId, label.id);
          console.log(result);
        }
      }
      ctx.body = {
        code: 200,
        message: "添加标签成功",
      };
    } catch (error) {
      console.error(error);
    }
  }

  //获取动态图片
  async fileInfo(ctx, next) {
    try {
      let {filename} = ctx.params;
      const {type} = ctx.query;
      const fileinfo = await fileservice.getFileByname(filename);
      const fileTypes = ["small", "middle", "large"];
      if (fileTypes.some((item) => item === type)) {
        filename = filename + "-" + type;
      }
      //设置相应类型
      ctx.response.set("content-type", fileinfo.mimetype);
      //返回一个流文件
      ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
    } catch (error) {
      console.error(error);
    }
  }
  //获取文章和标签数量
  async getArtandlabelNumber(ctx, next) {
    try {
      const result = await service.getNumArtandlabel();
      ctx.body = {
        msg: "获取文章和标签数成功！",
        data: {
          ...result,
        },
      };
    } catch (error) {
      console.error(error);
    }
  }
  async searchArticleList(ctx, next) {
    const {offset, size, keyword} = ctx.request.query;
    console.log(keyword);
    try {
      const result = await service.searchArticle(keyword, offset, size);
      ctx.body = {
        msg: "搜索成功",
        data: result,
      };
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new createMoment();

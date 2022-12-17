const service = require("../service/file.service");
const { APP_HOST, APP_PORT } = require("../app/config");
const userService = require("../service/user.service");
const config = require("../app/config");
class file {
    async saveAvatar(ctx, next) {
        //获取图片信息
        const { filename, mimetype, size } = ctx.req.file;
        const { id } = ctx.user;
        //判断用户是否有头像
        const ishave = await service.isHaveAvatar(id);
        if (ishave) {
            //更新头像信息
            await service.updateAvatar(filename, mimetype, size, id);
        } else {
            //将图片信息保存到数据库
            await service.create(filename, mimetype, size, id);
            //将图片url保存到user表中
        }
        const avatarUrl = `${APP_HOST}:${APP_PORT}/user/${id}/avatar`;
        await userService.updateAvatarByid(avatarUrl, id);

        ctx.body = {
            code: 200,
            message: "上传头像成功",
        };
    }

    async savePicture(ctx, next) {
        //获取文件信息
        const files = ctx.request.files;
        const { id } = ctx.user;
        const { newFilename, mimetype, size } = files.picture;
        try {
            await service.createFile(newFilename, mimetype, size, id);
            //返回图片url地址
            const resUrl = `${config.APP_HOST}:${config.APP_PORT}/article/images/${newFilename}`;
            ctx.body = {
                errno: 0, // 注意：值是数字，不能是字符串
                data: {
                    url: resUrl, // 图片 src ，必须
                    alt: newFilename, // 图片描述文字，非必须
                    href: resUrl // 图片的链接，非必须
                }
            }
        } catch (error) {
            ctx.status = 404;
            ctx.body = {
                errno: 1, // 只要不等于 0 就行
                message: error
            }
        }

    }

    async saveIcon(ctx,next){
        console.log('上传icon');
        const files = ctx.request.files;
        const { newFilename, mimetype, size } = files.icon;
        try {
            await service.createIcon(newFilename, mimetype, size);
            //返回图片url地址
            const resUrl = `${config.APP_HOST}:${config.APP_PORT}/toolSite/icon/${newFilename}`;
            ctx.body = {
                errno: 0, // 注意：值是数字，不能是字符串
                data: {
                    url: resUrl, // 图片 src ，必须
                    alt: newFilename, // 图片描述文字，非必须
                    href: resUrl // 图片的链接，非必须
                }
            }
        } catch (error) {
            ctx.status = 404;
            ctx.body = {
                errno: 1, // 只要不等于 0 就行
                message: error
            }
        }
    }
}

module.exports = new file();
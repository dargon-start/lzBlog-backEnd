const fs = require("fs");
const service = require("../service/user.service.js");
// const fileservice = require("../service/file.service");
const { AVATAR_PATH } = require("../constants/file-path");
const nodemailer = require("nodemailer");
const {desensitize} = require('../utils/utils')
class UserController {
    //注册用户
    async create(ctx, next) {
        //获取数据
        const user = ctx.request.body;
        console.log(user);
        //操作数据库
        const result = await service.create(user);

        //响应数据
        ctx.body = { msg: "用户创建成功！" };
    }

    //   async avatarInfo(ctx, next) {
    //     const {userId} = ctx.params;
    //     const avatarinfo = await fileservice.getAvatarInfoById(userId);
    //     console.log(avatarinfo);

    //     ctx.response.set("content-type", avatarinfo.mimetype);
    //     ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarinfo.filename}`);
    //   }

    //发送验证码
    async verifyCode(ctx, next) {
        const { email } = ctx.request.body;
        console.log(email);
        let transporter = nodemailer.createTransport({
            host: "smtp.qq.com",
            port: 465,
            auth: {
                user: "179***7990@qq.com", // generated ethereal user
                pass: "wjuxzdbbi", // generated ethereal password
            },
        });

        function createCode() {
            let codeArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            let length = 6,
                code = "";
            for (let i = 0; i < length; i++) {
                let randomI = Math.floor(Math.random() * 10);
                code += codeArr[randomI];
            }
            return code;
        }

        //实现思路：
        /* 
            1、保存code到数据库
            2、设置定时器，60秒后清除
            3、注册验证，从数据库读取code，验证是否正确
        */
        //保存验证码
        const code = createCode()

        // send mail with defined transport object
        try {
            let info = await transporter.sendMail({
                from: '179***7990@qq.com', // sender address
                to: email, // list of receivers
                subject: "龙仔博客-验证邮件", // Subject line
                text: "验证码：" + code, // plain text body
            });

            transporter.verify(function(error, success) {
                if (!error) {
                    console.log("发送成功");
                }
            });
        } catch (error) {
            console.error("Email Error:" + error);
            return;
        }

        //用户名已经存在
        try {
            const result = await service.getUserbyName(email);
            if (result.length) {
                await service.updateRcode(email, code)
            } else {
                await service.saveRcode(email, code)
            }
        } catch (error) {
            console.error(error);
        }


        //60秒内有效
        setTimeout(async() => {
            await service.updateRcode(email, null)
        }, 60000);
        ctx.body = {
            msg: '发送成功'
        }
    }

    //修改密码
    // async modify(ctx, next) {
    //     console.log(ctx.user);
    //     const user = ctx.user;

    // }
    async getUserInfo(ctx, next) {
        const user = ctx.user;
        //标签和文章数
        ctx.body = {
            msg: '获取用户信息成功',
            data: user
        }
    }

    //获取用户列表
    async getUserList(ctx, next) {
        const { offset, size } = ctx.request.query;
        try {
            const total = await service.getUserAmount();
            let result = await service.userList(offset, size)
            console.log(result);
            result = result.map(item=>{
                return {...item,name:desensitize(item.name)}
            })
            ctx.body = {
                msg: '获取成功',
                data: {
                    total: total[0].userAmount,
                    list: result
                }
            }
        } catch (error) {
            console.error(error);
        }

    }

    //删除用户
    async deleteUser(ctx, next) {
        const { userId } = ctx.request.query;
        console.log(userId);
        try {
            const res = await service.deleteUserbyid(userId);
            if (res.affectedRows > 0) {
                ctx.body = {
                    msg: '删除成功'
                }
            }
        } catch (error) {
            console.error(error);
        }

    }

    // 搜索用户列表
    async searchList(ctx, next) {
        console.log(ctx.query);
        const { status, 'createTime[]':createTime, offset, size } = ctx.query;
        console.log(status, createTime, offset, size);
        try {
            const result = await service.searchUser(status, createTime, offset, size)
            // console.log(result);
            ctx.body = {
                msg: '获取成功',
                data: result
            }
        } catch (error) {
            console.error(error);
        }

    }

}

module.exports = new UserController();
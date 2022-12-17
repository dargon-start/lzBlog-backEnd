const axios = require("axios");
const errorTypes = require('../constants/error-types');
const serive = require('../service/website.service')
class websiteController{
    async addwebsite(ctx,next){
        console.log(ctx.user);
        const {name,url} = ctx.request.body;
        // const resUrl = url.replace(/https:\/\/www.|https:\/\//,'');
        // console.log(resUrl);
        // //通过url获取图标
        // try {
        //     let resIcon= await axios.get(`http://favicongrabber.com/api/grab/${resUrl}`);
        //     const icon = resIcon.data.icons[0].src;
        //     const result= await serive.addsite({name,url,icon,user_id:ctx.user.id});
        //     if(result.affectedRows>0){
        //         ctx.body={
        //             msg:'添加站点成功'
        //         }
        //     }else{
        //         ctx.body={
        //             msg:'添加站点失败'
        //         }
        //     }
        // } catch (err) {
        //     const error = new Error(errorTypes.ADDWEBSITEFAIL);
        //     return ctx.app.emit("error", error, ctx);
        // }
        try {
            const icon = `${url}/favicon.ico`;
            const icon1 = `${url}/logo.svg`;
            let resIcon;
            try{
                console.log('try');
                const res= await Promise.any([axios.get(icon),axios.get(icon1)]);
                if(typeof res.data !== 'string'){
                    throw new Error('失败')
                }else{
                    resIcon = res.config.url;
                }
            } catch (error) {
                console.log('catch');
                const resUrl = url.replace(/https:\/\/www.|https:\/\//,'');
                const  resdata= await axios.get(`http://favicongrabber.com/api/grab/${resUrl}`)
                resIcon = resdata.data.icons[0].src;
            }
            console.log('icon：',resIcon);
            const result= await serive.addsite({name,url,icon:resIcon,user_id:ctx.user.id});
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
    async getwebsiteList(ctx,next){
        // const user_id = ctx.user.id;
        const user_id = ctx.request.params.userId;
        const result = await serive.getsiteList(user_id);
        ctx.body={
            msg:'获取站点列表成功',
            data:result
        }

    }
    //删除站点
    async deleteWebsite(ctx,next){
        console.log('删除站点');
        const userId = ctx.user.id;
        const {id} = ctx.query;
        try {
            const result = await serive.delWebsite(id,userId)
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
}

module.exports =new websiteController();
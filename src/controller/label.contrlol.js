const service = require("../service/label.service");
const ArticleService = require("../service/article.service");
class labelControl {
    async create(ctx, next) {
        console.log("creatLabel");
        const { name } = ctx.request.body;
        const result = await service.create(name);

        ctx.body = {
            code: 200,
            message: "ok",
        };
    }

    async list(ctx, next) {
        try {
            const result = await service.getLabels();
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

    async listByLable(ctx, next) {
        const { offset, size, labelName } = ctx.query;
        console.log(labelName);
        try {
            //如果传入了label
            if (labelName) {
                const result = await service.getArticleBylable(offset, size, labelName);
                console.log(result);
                if (result.list.length === 1 && result.list[0].articleId === null) {
                    result.list = []
                }
                ctx.body = ctx.body = {
                    code: 200,
                    message: "ok",
                    total: result.length,
                    data: result,
                };
            } else {
                //没有传label
                const result = await ArticleService.getList(offset, size);
                ctx.body = ctx.body = {
                    code: 200,
                    message: "ok",
                    total: result.length,
                    data: result,
                };
            }

        } catch (error) {
            console.error(error);
        }

    }
}

module.exports = new labelControl();
const jwt = require("jsonwebtoken");
const { PRIVATEKEY } = require("../app/config");
const {desensitize} = require('../utils/utils.js')
class authController {
    async login(ctx, next) {
        let { id, name } = ctx.user;
        //颁发token
        const token = jwt.sign({ id, name }, PRIVATEKEY, {
            algorithm: "RS256",
            expiresIn: 60 * 60 * 24 * 30,
        });
        name = desensitize(name)
        ctx.body = {
            id,
            name,
            token,
        };
    }

    async success(ctx, next) {
        ctx.body = "授权成功";
    }
}

module.exports = new authController();
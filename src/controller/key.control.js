const { publicKey } = require('../utils/jsencrypt')
class keyController {
    async getPubkey(ctx, next) {
        ctx.body = {
            msg: '获取公钥成功!',
            publicKey: publicKey
        }
    }
}
module.exports = new keyController();
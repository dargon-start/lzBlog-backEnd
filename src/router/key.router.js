const router = require('koa-router');
const {getPubkey} = require('../controller/key.control')

const keyRouter = new router({prefix:'/pubkey'});

keyRouter.get('/',getPubkey);

module.exports = keyRouter;
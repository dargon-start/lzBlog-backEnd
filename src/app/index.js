const koa = require("koa");
const bodyparse = require("koa-bodyparser");
const cors = require('@koa/cors')
const morgan = require('koa-morgan')
const fs = require('fs')

const fileRoutes = require('../router/index')
const errorHandler = require('./errorHandler');

const accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' })

const app = new koa();

let whitelist = ['http://localhost:4001', 'http://39.105.207.193','http://39.105.207.193:8004','http://49.232.51.105','http://49.232.51.105:8004','http://longzai1024.top','http://longzai1024.top:8004']
let corsOptions = {
    origin: function(ctx) {
        if (whitelist.indexOf(ctx.header.origin) !== -1) {
            return "*"
        } else {
            return false
        }
    }
}

//记录日志
morgan.token('localDate', function getDate(req) {
    let date = new Date();
    return date.toLocaleString()
})

const token = ':remote-addr - :remote-user [:localDate] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
app.use(morgan(token, { stream: accessLogStream }))

app.use(cors(corsOptions));
app.use(bodyparse());
app.fileRoutes = fileRoutes;
app.fileRoutes();
//监听错误，处理错误
app.on("error", errorHandler);



module.exports = app;
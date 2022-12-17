const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();
//找到文件夹
const priDir = path.resolve(__dirname, "../key/private.key");
const pubDir = path.resolve(__dirname, "../key/public.key");

const PRIVATEKEY = fs.readFileSync(priDir);
const PUBLICKKEY = fs.readFileSync(pubDir);

module.exports = {
  APP_PORT,
  APP_HOST,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

module.exports.PRIVATEKEY = PRIVATEKEY;
module.exports.PUBLICKKEY = PUBLICKKEY;

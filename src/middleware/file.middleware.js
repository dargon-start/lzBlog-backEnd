const koaBody = require("koa-body");
const Jimp = require("jimp");

const { AVATAR_PATH, PICTURE_PATH,ICON_PATH } = require("../constants/file-path");
const path = require("path");

// const storageA = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, AVATAR_PATH);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const storageP = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, PICTURE_PATH);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const avatarUpload = multer({
//   storage: storageA,
// });
// const pictureUpload = multer({
//   storage: storageP,
// });

// const handleAvatar = avatarUpload.single("avatar");

// const handlePicture = pictureUpload.single("picture");
const handleAvatar = koaBody({
    multipart: true,
    formidable: {
        //保存的路径
        uploadDir: AVATAR_PATH,
        //是否保持原扩展
        keepExtensions: true,
        onFileBegin: (name, file) => {
            //设置上传后的文件名
            file.path = Date.now();
        },
    },
})


const handlePicture = koaBody({
    multipart: true,
    formidable: {
        // 设置上传文件大小最大限制，默认2M
        maxFileSize: 400 * 1024 * 1024,
        //保存的路径
        uploadDir: PICTURE_PATH,
        //是否保持原扩展
        keepExtensions: true,
        onFileBegin: (name, file) => {
            //设置上传后的文件名
            file.path = Date.now();
        },
    },
})

// 
const handleIcon = koaBody({
    multipart: true,
    formidable: {
        // 设置上传文件大小最大限制，默认2M
        maxFileSize: 400 * 1024 * 1024,
        //保存的路径
        uploadDir: ICON_PATH,
        //是否保持原扩展
        keepExtensions: true,
        onFileBegin: (name, file) => {
            //设置上传后的文件名
            file.path = Date.now();
        },
    },
})
//图片处理为大中小图
const pictureResize = async(ctx, next) => {
    console.log('处理size');
    const file = ctx.req.file;
    console.log(file);
    try {
        const destpath = path.join(file.destination, file.filename);
        Jimp.read(file.path).then((img) => {
            img.resize(1280, Jimp.AUTO).write(`${destpath}-large`);
            img.resize(640, Jimp.AUTO).write(`${destpath}-middle`);
            img.resize(320, Jimp.AUTO).write(`${destpath}-small`);
        });
        await next();
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    handleAvatar,
    handlePicture,
    handleIcon,
    pictureResize,
};
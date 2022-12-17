const router = require("koa-router");
const {
    handleAvatar,
    handlePicture,
    handleIcon,
    pictureResize,
} = require("../middleware/file.middleware");
const { saveAvatar, savePicture,saveIcon } = require("../controller/file.control");
const { verfigAuth } = require("../middleware/auth.middleware");
const fileRouter = new router({ prefix: "/upload" });

//上传头像
fileRouter.post("/avatar", verfigAuth, handleAvatar, saveAvatar);
//上传动态图片
fileRouter.post(
    "/picture",
    verfigAuth,
    handlePicture,
    // pictureResize,
    savePicture
);
// 上传图标
fileRouter.post('/icon',verfigAuth,handleIcon,saveIcon)
module.exports = fileRouter;
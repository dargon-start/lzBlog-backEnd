const connection = require("../app/database");

class file {
    //保存头像
    async create(filename, mimetype, size, userId) {
            const statement = `INSERT INTO avatar (filename,mimetype,size,user_id) VALUES (?,?,?,?);`;
            const [result] = await connection.execute(statement, [
                filename,
                mimetype,
                size,
                userId,
            ]);
            return result;
        }
        //查询用户是否有头像
    async isHaveAvatar(userId) {
        const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
        const [result] = await connection.execute(statement, [userId]);
        return result.length > 0 ? true : false;
    }

    //更新头像
    async updateAvatar(filename, mimetype, size, userId) {
        const statement = `UPDATE avatar SET filename=?,mimetype=?,size=? WHERE user_id=?;`;
        const [result] = await connection.execute(statement, [
            filename,
            mimetype,
            size,
            userId,
        ]);
        return result.length > 0 ? true : false;
    }

    //获取头像信息
    async getAvatarInfoById(userId) {
        const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
        const [result] = await connection.execute(statement, [userId]);
        return result[0];
    }

    //保存动态图
    async createFile(filename, mimetype, size, userId) {
        const statement = `INSERT INTO file (filename,mimetype,size,user_id) VALUES (?,?,?,?);`;
        const [result] = await connection.execute(statement, [
            filename,
            mimetype,
            size,
            userId,
        ]);
        return result;
    }

    //获取动态图片
    async getFileByname(filename) {
        const statement = `SELECT * FROM file WHERE filename = ?;`;
        const [result] = await connection.execute(statement, [filename]);
        return result[0];
    }

    // 修改所属文章
    async undateFileInfo(artId, filenames) {
        let awaitList = [];
        for (const img of filenames) {
            const statement = `UPDATE file SET article_id=? WHERE filename=?`;
            const p = connection.execute(statement, [artId, img]);
            awaitList.push(p)
        }
        const result = await Promise.all(awaitList)
        return result;
    }

    //根据articleId获取file列表
    async getFileByArticleId(articleId) {
        const statement = `SELECT filename FROM file WHERE article_id=?;`;
        const [result] = await connection.execute(statement, [articleId]);
        return result;
    }

    // 上传icon
    async createIcon(filename,mimetype,size){
        const statement = `INSERT INTO icons (iconName,mimetype,size) VALUES (?,?,?);`;
        const [result] = await connection.execute(statement, [
            filename,
            mimetype,
            size,
        ]);
        return result;
    }
    async getIconByname(filename) {
        const statement = `SELECT * FROM icons WHERE iconName = ?;`;
        const [result] = await connection.execute(statement, [filename]);
        return result[0];
    }

}

module.exports = new file();
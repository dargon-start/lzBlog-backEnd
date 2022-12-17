const connection = require("../app/database");

class label {
    async create(name) {
            const statement = `INSERT INTO label (name) VALUES(?);`;
            const [result] = await connection.execute(statement, [name]);
            console.log(result);
            return result;
        }
        //搜索标签
    async select(name) {
        const statement = `SELECT * FROM label WHERE name=?;`;
        const [result] = await connection.execute(statement, [name]);
        return result[0];
    }

    //getLabels
    async getLabels() {
        const statement = `SELECT id,name FROM label;`;
        const [result] = await connection.execute(statement);
        return result;
    }

    // 根据标签搜索文章
    async getArticleBylable(offset, limit, labelName) {
        const statement = `SELECT m.id articleId ,m.title title,m.synopsis synopsis , m.creatat createTime,m.updateat updateTime,m.glanceNum glanceNum,
    (SELECT COUNT(user_id) from  art_likes ml  WHERE ml.article_id = m.id) likeNumber,JSON_OBJECT("id",u.id,"name",u.name,'avatar',u.avatar_url) user,
    (SELECT IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)),NULL)  FROM article_label ml LEFT JOIN label l ON ml.label_id = l.id WHERE ml.article_id = m.id) labelList
    from label l LEFT JOIN article_label ml on l.id=ml.label_id 
    LEFT JOIN articles m on m.id = ml.article_id
    left JOIN users u on m.user_id=u.id
    WHERE l.name = ? ORDER BY glanceNum DESC limit ?,?`;

        const statement1 = `
        SELECT count(m.id) total from label l LEFT JOIN article_label ml on l.id=ml.label_id 
        LEFT JOIN articles m on m.id = ml.article_id WHERE l.name = ?;
        `
        const [result] = await connection.execute(statement, [labelName, offset, limit]);
        const [amount] = await connection.execute(statement1, [labelName]);
        return {
            total: amount[0].total,
            list: result
        };
    }
}

module.exports = new label();
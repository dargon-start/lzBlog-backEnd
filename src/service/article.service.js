const connection = require("../app/database");
const config = require("../app/config");
class articles {
  async create(userId, content, title, synopsis) {
    const statement = `INSERT INTO articles (content,user_id,title,synopsis) VALUES (?,?,?,?);`;
    const result = await connection.execute(statement, [
      content,
      userId,
      title,
      synopsis,
    ]);
    console.log(result);
    return result[0].insertId;
  }

  async getMoment(articleId) {
    //同时获取该动态的评论信息
    const path = `${config.APP_HOST}:${config.APP_PORT}/article/images/`;
    const statement = `
      SELECT m.id articleId ,m.title title,m.synopsis synopsis,m.content content , m.creatat createTime,m.updateat updateTime,m.glanceNum glanceNum,JSON_OBJECT("id",u.id,"name",u.name,'avatar',u.avatar_url) user ,
      (SELECT COUNT(user_id) from  art_likes ml  WHERE ml.article_id = m.id) likeNumber,
      (SELECT IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)),NULL)  FROM article_label ml LEFT JOIN label l ON ml.label_id = l.id WHERE ml.article_id = m.id) labelList,
      (SELECT JSON_ARRAYAGG(CONCAT('${path}',file.filename)) FROM file WHERE file.article_id = m.id) imgs
      FROM articles m LEFT JOIN users u ON m.user_id = u.id
      WHERE m.id =? GROUP BY m.id;
    `;
    const [result] = await connection.execute(statement, [articleId]);

    return result[0];
  }

  //增加浏览量
  async addGlance(articleId) {
    const statement = `UPDATE articles SET glanceNum = glanceNum +1 WHERE id=?`;
    const [result] = await connection.execute(statement, [articleId]);
    return result;
  }

  //获取动态列表
  async getList(offset, size, type) {
    let statement = ''
    if(type === 'hot') {
      statement = `
      SELECT m.id articleId ,m.title title,m.synopsis synopsis , m.creatat createTime,m.updateat updateTime,m.glanceNum glanceNum,
      (SELECT COUNT(user_id) from  art_likes ml  WHERE ml.article_id = m.id) likeNumber,JSON_OBJECT("id",u.id,"name",u.name,'avatar',u.avatar_url) user,
      (SELECT IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)),NULL)  FROM article_label ml LEFT JOIN label l ON ml.label_id = l.id WHERE ml.article_id = m.id) labelList
      FROM articles m LEFT JOIN users u on m.user_id=u.id ORDER BY glanceNum DESC LIMIT ? ,?;`;
    }else{
      statement = `
      SELECT m.id articleId ,m.title title,m.synopsis synopsis , m.creatat createTime,m.updateat updateTime,m.glanceNum glanceNum,
      (SELECT COUNT(user_id) from  art_likes ml  WHERE ml.article_id = m.id) likeNumber,JSON_OBJECT("id",u.id,"name",u.name,'avatar',u.avatar_url) user,
      (SELECT IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)),NULL)  FROM article_label ml LEFT JOIN label l ON ml.label_id = l.id WHERE ml.article_id = m.id) labelList
      FROM articles m LEFT JOIN users u on m.user_id=u.id ORDER BY m.creatat DESC LIMIT ? ,?;`;
    }
    const statement1 = `
            SELECT count(id) total from articles;
        `;
    const [result] = await connection.execute(statement, [ offset, size]);
    const [amount] = await connection.execute(statement1);
    return {
      total: amount[0].total,
      list: result,
    };
  }

  // 后台系统获取文章列表
  async getbackList(offset,size){
    let statement = `
    SELECT m.id articleId ,m.title title,m.synopsis synopsis , m.creatat createTime,m.updateat updateTime,m.glanceNum glanceNum,(SELECT COUNT(c.id) FROM comment c  WHERE c.article_id = m.id) commentNums,(SELECT COUNT(c.id) FROM comment c  WHERE c.article_id = m.id and c.isRead = 0) newCommentNums
    FROM articles m
    ORDER BY commentNums DESC,glanceNum DESC LIMIT ? ,?;`;
    const statement1 = `
            SELECT count(id) total from articles;
        `;
    const [result] = await connection.execute(statement, [ offset, size]);
    const [amount] = await connection.execute(statement1);
    return {
      total: amount[0].total,
      list: result,
    };
  }

  async updateMoment(articleId, title, content, synopsis) {
    const statement = `UPDATE articles SET title=?, content=? ,synopsis=? WHERE id = ?;`;

    const [result] = await connection.execute(statement, [
      title,
      content,
      synopsis,
      articleId,
    ]);

    return result;
  }

  async removeMoment(articleId) {
    const statement = `DELETE FROM articles WHERE id = ?;`;

    const [result] = await connection.execute(statement, [articleId]);

    return result;
  }

  async hasLabel(articleId, lableId) {
    const statement = `SELECT * FROM article_label WHERE article_id = ? AND label_id =?;`;

    const [result] = await connection.execute(statement, [articleId, lableId]);
    return result[0] ? true : false;
  }

  async addLabel(articleId, labelId) {
    const statement = `INSERT INTO article_label (article_id,label_id) VALUES (?,?);`;

    const [result] = await connection.execute(statement, [articleId, labelId]);

    return result;
  }

  async getNumArtandlabel() {
    const statement = ` SELECT count(id) articleNum from articles;`;
    const [result] = await connection.execute(statement);
    const statement1 = ` SELECT count(id) labelNum from label;`;
    const [result1] = await connection.execute(statement1);
    return {
      articleNum: result[0].articleNum,
      labelNum: result1[0].labelNum,
    };
  }

  async searchArticle(keyword, offset, size) {
    let statement, statement1;
    if (keyword !== undefined) {
      statement = ` 
            SELECT m.id articleId, m.title title, m.synopsis synopsis, m.creatat createTime, m.updateat updateTime, m.glanceNum glanceNum,(SELECT COUNT(c.id) FROM comment c  WHERE c.article_id = m.id) commentNums,(SELECT COUNT(c.id) FROM comment c  WHERE c.article_id = m.id and c.isRead = 0) newCommentNums,
                (SELECT COUNT(user_id) from art_likes ml WHERE ml.article_id = m.id) likeNumber, JSON_OBJECT("id", u.id, "name", u.name, 'avatar', u.avatar_url) user,
                (SELECT IF(COUNT(l.id), JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)), NULL) FROM article_label ml LEFT JOIN label l ON ml.label_id = l.id WHERE ml.article_id = m.id) labelList
            FROM articles m LEFT JOIN users u on m.user_id = u.id where INSTR(title,?)>0 ORDER BY glanceNum DESC LIMIT ? , ?  ;`;

      //获取总数
      statement1 = `
            SELECT count(m.id) amount FROM articles m LEFT JOIN users u on m.user_id = u.id where INSTR(title,?)>0 ORDER BY glanceNum;
        `;
      const [result] = await connection.execute(statement, [
        keyword,
        offset,
        size,
      ]);
      const [artNum] = await connection.execute(statement1, [keyword]);
      return {
        total: artNum[0].amount,
        list: result,
      };
    } else {
      statement = ` 
            SELECT m.id articleId, m.title title, m.synopsis synopsis, m.creatat createTime, m.updateat updateTime, m.glanceNum glanceNum,(SELECT COUNT(c.id) FROM comment c  WHERE c.article_id = m.id) commentNums,(SELECT COUNT(c.id) FROM comment c  WHERE c.article_id = m.id and c.isRead = 0) newCommentNums,
                (SELECT COUNT(user_id) from art_likes ml WHERE ml.article_id = m.id) likeNumber, JSON_OBJECT("id", u.id, "name", u.name, 'avatar', u.avatar_url) user,
                (SELECT IF(COUNT(l.id), JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)), NULL) FROM article_label ml LEFT JOIN label l ON ml.label_id = l.id WHERE ml.article_id = m.id) labelList
            FROM articles m LEFT JOIN users u on m.user_id = u.id  ORDER BY glanceNum DESC LIMIT ? , ?  ;`;

      //获取总数
      statement1 = `
            SELECT count(m.id) amount FROM articles m LEFT JOIN users u on m.user_id = u.id  ORDER BY glanceNum;`;
      const [result] = await connection.execute(statement, [offset, size]);
      const [artNum] = await connection.execute(statement1);
      return {
        total: artNum[0].amount,
        list: result,
      };
    }
  }
}

module.exports = new articles();

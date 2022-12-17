const connection = require("../app/database");

class Comment {
  //评论
  async create(momentId, content, userId) {
    return await devide(content, momentId, userId);
  }
  //回复评论
  async reply(momentId, content, userId, commentId) {
    return await devide(content, momentId, userId, commentId);
  }


  //修改评论
  async update(content, commentId) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, commentId]);
    return result;
  }
  //删除评论
  async remove(commentIds) {
    try {
      const ids = commentIds.join(',');
      const statement = 'DELETE FROM comment WHERE id in ('+ids+')';
      const [result] = await connection.execute(statement, [ids]);
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }
  //获取一个动态下的所有评论
  async getCommentList(momentId) {
     const statement = `SELECT c.id id,c.content content,c.comment_id commentId, JSON_OBJECT('id',u.id,'name',u.name) user , c.createAt createAt,
                      IF(c.comment_id,JSON_OBJECT('id',pc.id,'content',pc.content,'pname',(select name from users pu where pu.id = pc.user_id)),NULL) parentComment
                      FROM comment c 
                      LEFT JOIN users u ON c.user_id = u.id
                      LEFT JOIN comment pc on c.comment_id = pc.id
                    WHERE c.article_id = ?`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }

  async getCommentListBack(momentId,offset,size){
    const statement = `SELECT c.id id,c.content content,c.comment_id commentId, JSON_OBJECT('id',u.id,'name',u.name) user , c.createAt createAt,
    IF(c.comment_id,JSON_OBJECT('id',pc.id,'content',pc.content,'pname',(select name from users pu where pu.id = pc.user_id)),NULL) parentComment
    FROM comment c 
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN comment pc on c.comment_id = pc.id
    WHERE c.article_id = ? ORDER BY c.createAt DESC limit ? ,?`;
    const statement1 = ` SELECT count(id) total from comment c WHERE c.article_id = ? ;`;
    const [result1] = await connection.execute(statement1,[momentId]);
    const [result] = await connection.execute(statement, [momentId,offset,size]);
    return {
      total: result1[0].total,
      data:result
    };
  }

  // 将未读标记置为false
  async updateRead(momentId){
    const statement = `UPDATE comment SET isRead = 1 WHERE article_id = ? AND isRead = 0;`
    await connection.execute(statement, [momentId]);
    return;
  }
}

async function devide(...args) {
  let statement;
  if (args.length == 4) {
    statement = `INSERT INTO comment (content,article_id,user_id,comment_id) VALUES (?,?,?,?);`;
  } else if (args.length == 3) {
    statement = `INSERT INTO comment (content,article_id,user_id) VALUES (?,?,?);`;
  }
  const [result] = await connection.execute(statement, args);
  return result;
}

module.exports = new Comment();

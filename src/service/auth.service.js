const connection = require("../app/database");

class AuthService {
  async permission(userId, id, table) {
    const statement = `SELECT * FROM ${table} WHERE id = ? AND user_id = ?;`;
    const [result] = await connection.execute(statement, [id, userId]);
    //如果没有查询到结果，表示没有权限
    return result.length == 0 ? false : true;
  }
}

module.exports = new AuthService();

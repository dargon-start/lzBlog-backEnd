const connection = require("../app/database");

class UserService {
    async create(user) {
        const { name, password } = user;
        const statement = `UPDATE users SET password = ?,status=1 WHERE name =?;`;
        const result = await connection.execute(statement, [password, name]);
        console.log(result);
        return result[0];
    }

    //更改密码
    async modifyPwd(name, password) {
        const statement = `UPDATE users SET password = ? WHERE name =?;`;
        const result = await connection.execute(statement, [password, name]);
        console.log(result);
        return result[0];
    }

    //根据email查看是否注册过
    async getUserbyName(name) {
        const statement = `SELECT * FROM users WHERE NAME=?`;
        const result = await connection.execute(statement, [name]);
        return result[0];
    }

    // 查看是否注册
    async verifyUser(email) {
            const statement = `SELECT  Rcode , status FROM users WHERE NAME=?`;
            const result = await connection.execute(statement, [email]);
            return result[0];
        }
    //头像
    async updateAvatarByid(avatarUrl, userId) {
        const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`;
        const [result] = await connection.execute(statement, [avatarUrl, userId]);
        return result;
    }

    //保存注册验证码
    async saveRcode(name, Rcode) {
        const statement = `INSERT INTO users (name,Rcode) VALUES (?,?);`;
        const [result] = await connection.execute(statement, [name, Rcode]);
        return result;
    }

    //更新注册验证码
    async updateRcode(name, Rcode) {
        const statement = ` UPDATE users SET Rcode = ? WHERE name = ?;`;
        const [result] = await connection.execute(statement, [Rcode, name]);
        return result;
    }

    //用户总数
    async getUserAmount() {
        const statement = `SELECT count(id) userAmount from users;`;
        const [result] = await connection.execute(statement);
        return result;
    }
    // 判断用户是否存在
    async isExit(id){
        const statement = `SELECT count(id) idNums  from users where id=?;`;
        const [result] = await connection.execute(statement, [id]);
        console.log(result[0].idNums);
        return !!result[0].idNums;
    }

    // 判断用户是否为管理员
    async isManger(id) {
        const statement = `SELECT authcode from users where id=?;`;
        const [result] = await connection.execute(statement, [id]);
        return result[0];
    }

    // 获取用户列表
    async userList(offset, size) {
        const statement = `SELECT id,name,creatat createTime,status FROM users limit ?,?`;
        const [result] = await connection.execute(statement, [offset, size]);
        return result;
    }

    //删除用户
    async deleteUserbyid(id) {
        const statement = `DELETE FROM users WHERE id = ?`;
        const [result] = await connection.execute(statement, [id]);
        return result;
    }

    //搜索用户
    async searchUser(status, creatTime, offset, size) {
        let statement = '',
            statement1 = '',
            amount,
            result;
        try {
            if (status !== undefined && creatTime !== undefined) {
                statement = `SELECT id,name,creatat createTime,status FROM users where status=? and creatat between ? and ? limit ?,?`;
                statement1 = `SELECT count(id) userAmount from users where status=? and creatat between ? and ?;`;
                result = await connection.execute(statement, [status, creatTime[0], creatTime[1], offset, size]);
                amount = await connection.execute(statement1, [status, creatTime[0], creatTime[1]])
            } else if (status === undefined && creatTime !== undefined) {
                statement = `SELECT id,name,creatat createTime,status FROM users where creatat between ? and ? limit ?,?`;
                statement1 = `SELECT count(id) userAmount from users where creatat between ? and ?;`;
                result = await connection.execute(statement, [creatTime[0], creatTime[1], offset, size]);
                amount = await connection.execute(statement1, [creatTime[0], creatTime[1]])
            } else if (creatTime === undefined && status !== undefined) {
                statement = `SELECT id,name,creatat createTime,status FROM users where status=? limit ?,?`;
                statement1 = `SELECT count(id) userAmount from users where status=?;`;
                console.log(statement,statement1,status,offset,size);
                result = await connection.execute(statement, [status, offset, size]);
                amount = await connection.execute(statement1, [status])
            } else {
                statement = `SELECT id,name,creatat createTime,status FROM users  limit ?,?`;
                statement1 = `SELECT count(id) userAmount from users;`;
                result = await connection.execute(statement, [offset, size]);
                amount = await connection.execute(statement1)
            }
        } catch (error) {
            console.log('err',error);
        }
        
        return { total: amount[0][0].userAmount, list: result[0] };
    }

}

module.exports = new UserService();
const connection = require("../app/database");

class websiteService{
    async addsite({name,url,icon,user_id}){
        const statement = `INSERT INTO websites (name,url,icon,user_id) VALUES (?,?,?,?);`;
        const result = await connection.execute(statement, [name,url,icon,user_id]);
        console.log(result[0]);
        return result[0];
    }
    async getsiteList(user_id){
        const statement = `SELECT * FROM websites WHERE user_id=?`;
        const [result] = await connection.execute(statement, [user_id]);
        return result;
    }
    async delWebsite(id,userId){
        const statement = `DELETE FROM websites  WHERE id = ? and user_id = ?`;
        const [result] = await connection.execute(statement, [id,userId]);
        return result;
    }
}

module.exports= new websiteService();
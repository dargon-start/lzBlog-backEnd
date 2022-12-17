const connection = require("../app/database");

class ToolSiteService{
  async addTypeService(name){
    const statement = `INSERT INTO site_category (name) VALUES (?)`;
    const result = await connection.execute(statement, [name]);
    console.log(result[0]);
    return result[0];
  }

  async delTypeService(id){
    const statement = `DELETE FROM site_category WHERE id = ?`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }

  async getTypelistService(){
    const statement = `SELECT * from site_category`;
    const [result] = await connection.execute(statement);
    return result;
  }

  async addToolService(name,url,iconUrl,type){
    const statement = `INSERT INTO site (name,url,icon_url,siteCategory_id) VALUES (?,?,?,?)`;
    const result = await connection.execute(statement, [name,url,iconUrl,type]);
    console.log(result[0]);
    return result[0];
  }

  async getToolListService(){
    const statement = `SELECT s.id id,s.name name,s.url url,s.icon_url icon,sc.name typeName  from site s LEFT JOIN site_category sc ON s.siteCategory_id = sc.id`;
    const [result] = await connection.execute(statement);
    return result;
  }

  async updateToolService(id,name,url,iconUrl,type){
    const statement = `UPDATE site SET name=?,url=?,icon_url=?,siteCategory_id=? WHERE id = ?`;
    const [result] = await connection.execute(statement,[name,url,iconUrl,type,id]);
    return result;
  }
  
  async deleteToolServie(id){
    const statement = `DELETE FROM site WHERE id = ?`;
    const [result] = await connection.execute(statement,[id]);
    return result;
  }
}

module.exports = new ToolSiteService()
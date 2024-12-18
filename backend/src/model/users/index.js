const MysqlConnection = require("../../utils/database");

class UsersModel{
    constructor(){
        this.db = new MysqlConnection();
    }
    async getUsers(){
        await this.db.connect();
        const sql = 'SELECT * FROM users';

        try {
            console.log("query menampilakn semua data users");
            const result = await this.db.query(sql);
            await this.db.close();
            return result;
        } catch (error) {
            await this.db.close
            console.log("Gagal query get data users");
        }
    }

    async findUser(name){
        await this.db.connect();
        const sql = 'SELECT * FROM users WHERE nama = ?';
        const params = [name];

        try {
            console.log('Fetching user by name:', name);
            const result = await this.db.query(sql, params);
            await this.db.close();
            return result.length > 0 ? result[0] : null;
          } catch (error) {
            await this.db.close();
            console.error('Error fetching user by name:', error);
            throw error;
          }
    }
    async updateLogin(is_login, nama){
        await this.db.connect();

        const sql = `
            UPDATE users 
            SET is_login = ?
            WHERE nama = ?
        `;
        const params = [is_login, nama];

        try {
            console.log(`Updating login status for user ${nama}`);
            const result = await this.db.query(sql, params);
            await this.db.close();
            return result;
          } catch (error) {
            await this.db.close();
            console.error('Error updating login status:', error);
            throw error;
          }
    }
    async updateLogout(id){
        await this.db.connect();
        const sql = `UPDATE users SET is_login = 0 WHERE id_user = ?`;
        const params = [id];

    try {
      const result = await this.db.query(sql, params);
      console.log("update logout success");
      return result;
    } catch (error) {
      await this.db.close();
      throw error;
    }
    }
    async getUserById(inputRequest){
      await this.db.connect();
      const sql = 'SELECT * FROM users WHERE id_user = ?';
      const params = [inputRequest.id_user];

      try {
        console.log('Fetching user by name:', inputRequest.id_user);
        const result = await this.db.query(sql, params);
        await this.db.close();
        console.log(result);
        
        return result.length > 0 ? result[0] : null;
      } catch (error) {
        await this.db.close();
        console.error('Error fetching user by id:', error);
        throw error;
      }
    }
}
module.exports = UsersModel;
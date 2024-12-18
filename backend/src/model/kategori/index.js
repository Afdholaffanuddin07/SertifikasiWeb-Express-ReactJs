const MysqlConnection = require("../../utils/database");

class KategoriModel{
    constructor(){
        this.db = new MysqlConnection();
    }
    async getKategori(){
        await this.db.connect();
        const sql = 'SELECT * FROM kategori';

        try {
            console.log("query menampilakn semua data kategori");
            const result = await this.db.query(sql);
            await this.db.close();
            return result;
        } catch (error) {
            await this.db.close
            console.log("Gagal query get data kategori");
        }
    }
    async addKategori(inputRequest){
        await this.db.connect();

        const sql = `
            INSERT INTO kategori (nama, keterangan)
            VALUES (?, ?)
        `;
        const params = [
            inputRequest.nama,
            inputRequest.keterangan
        ];
        try {
            console.log("saving new kategori : ", inputRequest.nama);
            const result = await this.db.query(sql, params);
            await this.db.close();
            return result;
        } catch (error) {
            await this.db.close();
            console.error('Error saving kategori:', error);
            throw error;
        }
    }
    async editKategori(inputRequest){
        await this.db.connect();
        const sql = `
        UPDATE kategori
        SET nama = ?,
            keterangan = ?
        WHERE id_kategori = ?
        `;
        const params = [
            inputRequest.nama,
            inputRequest.keterangan,
            inputRequest.id_kategori
        ];
        try {
            console.log("edit kategori : ", inputRequest.nama);
            const result = await this.db.query(sql, params);
            await this.db.close();
            return result;
        } catch (error) {
            await this.db.close();
            console.error('Error edit kategori:', error);
            throw error;
        }
    }
    async deleteKategori(inputRequest){
        await this.db.connect();
        const sql = `DELETE FROM kategori WHERE id_kategori = ?`;
        const params = [
            inputRequest.id_kategori
        ];

        try {
            console.log(`file sudah di hapus : ${inputRequest.id_kategori}`);
            const result = await this.db.query(sql, params);
            await this.db.close();
            return result
        } catch (error) {
            await this.db.close();
            console.log(`gagal menghapus file : ${inputRequest.id_kategori}`);
        }
    }
}
module.exports = KategoriModel;
const MysqlConnection = require("../../utils/database");

class SuratModel{
    constructor(){
        this.db = new MysqlConnection();
    }
    async getSurat(){
        await this.db.connect();
        const sql = 'SELECT * FROM surat';

        try {
            console.log("query menampilakn semua data surat");
            const result = await this.db.query(sql);
            await this.db.close();
            return result;
        } catch (error) {
            await this.db.close
            console.log("Gagal query get data surat");
        }
    }
    async addSurat(inputRequest){
        await this.db.connect();

        const sql = `
            INSERT INTO surat (nomor, kategori, judul, waktu)
            VALUES (?, ?, ?, ?)
        `;
        const params = [
            inputRequest.nomor,
            inputRequest.kategori,
            inputRequest.judul,
            inputRequest.waktu
        ];
        try {
            console.log("saving new surat : ", inputRequest.nomor);
            const result = await this.db.query(sql, params);
            await this.db.close();
            return result;
        } catch (error) {
            await this.db.close();
            console.error('Error saving surat:', error);
            throw error;
        }
    }
    async getSuratById(inputRequest){
        await this.db.connect();
        const sql = `SELECT * FROM surat WHERE id_surat = ?`;
        const params = [
            inputRequest.id_surat
        ];

        try {
            console.log(`mencari file dengan id : ${inputRequest.id}`);
            const result = await this.db.query(sql, params);
            await this.db.close();
            return result;
        } catch (error) {
            console.error("Error saat mengambil file dari database:", error);
            throw error;
        }
    }
    async deleteSurat(inputRequest){
        await this.db.connect();
        const sql = `DELETE FROM surat WHERE id_surat = ?`;
        const params = [
            inputRequest.id_surat
        ];

        try {
            console.log(`file sudah di hapus : ${inputRequest.id_surat}`);
            const result = await this.db.query(sql, params);
            await this.db.close();
            return result
        } catch (error) {
            await this.db.close();
            console.log(`gagal menghapus file : ${inputRequest.id_surat}`);
        }
    }
}
module.exports = SuratModel;
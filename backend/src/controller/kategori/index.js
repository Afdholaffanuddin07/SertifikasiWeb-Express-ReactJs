const { KategoriModel } = require("../../model");
const { ResponseHandler } = require("../../utils"); 

const Kategori = new KategoriModel();

class KategoriController{
    async getKategori(req, res, next){
        try {
            const dataKategori = await Kategori.getKategori();
            console.log("data kategori : ", dataKategori);
            
            const formatedData = dataKategori?.map((kategori) => {
                return {
                    id_kategori: kategori.id_kategori,
                    nama: kategori.nama,
                    keterangan: kategori.keterangan,
                };
            });
            return ResponseHandler.success(res, 'Successfully retrieved kategori data', formatedData);
        } catch (error) {
            console.error('Error retrieving kategori data:', error);
            return ResponseHandler.error(res, 'Internal Server Error', error);
        
        }
    }
    async addKategori(req, res, next){
        const body = req.body;
            const inputRequest = {
                nama : body.nama,
                keterangan : body.keterangan
            };
        await Kategori.addKategori(inputRequest); 
        console.log('Kategori saved successfully');
        return ResponseHandler.success(res, 'Kategori saved successfully', {}, 201);
           
    }
    async editKategori(req, res, next){
        const body = req.body;

        const inputRequest = {
            nama : body.nama,
            keterangan : body.keterangan,
            id_kategori : body.id_kategori
        }

        await Kategori.editKategori(inputRequest);
        console.log('Kategori saved successfully');
        return ResponseHandler.success(res, 'Kategori saved successfully', {}, 201);
    }
    async deleteKategori(req, res, next){
        const body = req.body;

        const inputRequest = {
            id_kategori : body.id_kategori
        }
        await Kategori.deleteKategori(inputRequest);
        console.log("delete kategori succesfully");

        return ResponseHandler.success(res, 'Kategori delete successfully', {}, 201);
    }
}
module.exports = {kategoriController : new KategoriController}
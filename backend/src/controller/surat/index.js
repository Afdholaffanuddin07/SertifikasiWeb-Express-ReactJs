const { SuratModel } = require("../../model");
const { ResponseHandler } = require("../../utils"); 
const path = require("path");
const fs = require("fs");

const Surat = new SuratModel();

class SuratController{
    async getSurat(req, res, next){
        try {
            const dataSurat = await Surat.getSurat();
            console.log("data surat : ", dataSurat);
            
            const formatedData = dataSurat?.map((surat) => {
                return {
                    id_surat: surat.id_surat,
                    nomor: surat.nomor,
                    kategori: surat.kategori,
                    judul: surat.judul,
                    waktu: surat.waktu
                };
            });
            return ResponseHandler.success(res, 'Successfully retrieved surat data', formatedData);
        } catch (error) {
            console.error('Error retrieving surat data:', error);
            return ResponseHandler.error(res, 'Internal Server Error', error);
        
        }
    }
    async addSurat(req, res, next){
        try {
            const body = req.body;
            const renameFile = body.nomor;
            const nameFile = req.file.filename;
            const uploadPath = path.resolve(__dirname, "../../storage/uploads");
            const newFilePath = path.join(uploadPath, nameFile);

            if (fs.existsSync(newFilePath)) {
                // 2. Jika ada, rename file 
                const newFileName = `${renameFile}${path.extname(nameFile)}`;
                const renamedFilePath = path.join(uploadPath, newFileName);

                // Rename file
                fs.renameSync(newFilePath, renamedFilePath);
                console.log("Nama file setelah di-rename:", newFileName);
            }else{
                console.error('File tidak ditemukan : ', error);
                return ResponseHandler.error(res, 'Internal Server Error', error);
        
            }
            const now = new Date();
            const inputRequest = {
                nomor : body.nomor,
                kategori : body.kategori,
                judul : body.judul,
                waktu : now
            }
            console.log(inputRequest);

            const bodyRespon = {
                nomor : body.nomor
            }

            try {
                await Surat.addSurat(inputRequest);
                return ResponseHandler.success(res, 'File uploaded successfully', bodyRespon.nomor);
              } catch (error) {
                console.error('Error adding surat', error);
                return ResponseHandler.error(res, 'Internal Server Error', error, 500);
              }

        } catch (error) {
            console.error('Error adding surat', error);
                return ResponseHandler.error(res, 'Internal Server Error', error, 500);
        }
    }
    async downloadFile(req, res, next){
        const { id_surat } = req.params;
        const inputRequest = {id_surat : id_surat}
        const fileSurat = await Surat.getSuratById(inputRequest);
        const params = Array.isArray(fileSurat) ? fileSurat[0] : fileSurat;
        console.log(params);

        let surat = params.nomor;

        if (!surat.endsWith('.pdf')) {
            surat += '.pdf';
        }
        const filePath = path.resolve(__dirname, "../../storage/uploads", surat);

        console.log(filePath);
        console.log(surat);
        
        
        if (!fs.existsSync(filePath)) {
            return ResponseHandler.error(res, "File not found");
        }
        res.download(filePath, surat, (err) => {
            if (err) {
              return ResponseHandler.error(res, "Error downloading file");
            }
        }); 
    }
    async deleteSurat(req, res, next){
        const idSurat = req.body.id;
        const inputRequest = { id_surat : idSurat};

        const fileSurat = await Surat.getSuratById(inputRequest);
        const params = Array.isArray(fileSurat) ? fileSurat[0] : fileSurat;
        console.log(params);
        
        let surat = params.nomor;
        console.log(surat);

        if (!surat.endsWith('.pdf')) {
            surat += '.pdf';
        }
        console.log(surat);
        
        const uploadPath = path.resolve(__dirname, "../../storage/uploads");
        const filePath = path.join(uploadPath, surat); // Path lengkap file
        
        try {
            if (!fs.existsSync(filePath)) {
                console.error(`File ${surat} tidak ditemukan di server.`);
                return ResponseHandler.error(res, `File ${surat} tidak ditemukan di server.`, 404);
              }
              fs.unlinkSync(filePath);
              console.log(`File ${surat} berhasil dihapus.`); 
              
              await Surat.deleteSurat(inputRequest);
              return ResponseHandler.success(res, `File surat "${surat}" berhasil dihapus.`);
        } catch (error) {
            console.error('Error deleting surat:', error);
            return ResponseHandler.error(res, 'Internal Server Error', error);
        }
    }
    async viewSurat(req, res, next){
        const { id_surat } = req.params;
        const inputRequest = {id_surat : id_surat}
        const fileSurat = await Surat.getSuratById(inputRequest);
        const params = Array.isArray(fileSurat) ? fileSurat[0] : fileSurat;
        console.log(params);

        let surat = params.nomor;

        if (!surat.endsWith('.pdf')) {
            surat += '.pdf';
        }
        const filePath = path.resolve(__dirname, "../../storage/uploads", surat);

        console.log(filePath);
        console.log(surat);
        
        
        if (!fs.existsSync(filePath)) {
            return ResponseHandler.error(res, "File not found");
        }
        res.sendFile(filePath, (err) => {
            if(err){
              console.log("Gagal mengirim file");
              return ResponseHandler.error(res, "gagal memutar file", err);
            }
          });
    }
}
module.exports = {suratController : new SuratController}
const { authController, usersController, suratController, kategoriController} = require("../../controller");
const { authMiddleware } = require("../../midleware");
const { upload } = require("../../utils/multer");
module.exports = (app) => {

    //test db
    app.get('/getUsers', authMiddleware, usersController.getUsers);
    app.get('/getuserbyid/:id_user', authMiddleware, usersController.getUserById);
    
    //Authentication
    app.post('/login', authController.login);
    app.put('/logout', authMiddleware, authController.logout);

    //Surat
    app.get('/surat', authMiddleware, suratController.getSurat);
    app.post('/addsurat', authMiddleware, upload.single('file'), suratController.addSurat);
    app.get('/download/:id_surat', authMiddleware, suratController.downloadFile); 
    app.delete('/deletesurat', authMiddleware, suratController.deleteSurat);
    app.get('/viewsurat/:id_surat', authMiddleware, suratController.viewSurat);

    //Kategori
    app.get('/kategori', authMiddleware, kategoriController.getKategori);
    app.post('/addkategori', authMiddleware, kategoriController.addKategori);
    app.put('/editkategori', authMiddleware, kategoriController.editKategori);
    app.delete('/deletekategori', authMiddleware, kategoriController.deleteKategori);

    
    app.get("*", (req, res) => {
        res.status(404).json({
            status: "error",
            message: "API endpoint not found",
        });
    });
};

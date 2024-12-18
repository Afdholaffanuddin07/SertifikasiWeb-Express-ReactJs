const { authController } = require('./auth');
const { usersController } = require('./users');
const { suratController } = require('./surat');
const { kategoriController } = require('./kategori');
module.exports = {
    authController,
    usersController,
    suratController,
    kategoriController
}
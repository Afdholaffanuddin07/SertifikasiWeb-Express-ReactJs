const { UsersModel } = require("../../model");
const { ResponseHandler, generateToken} = require("../../utils"); 


const User = new UsersModel();

class AuthController{
    async login(req, res){
        try {
    
        const body = req.body;
        const { nama, password } = body;

        const userInfo = await User.findUser(nama);
        console.log('User info:', userInfo);

        if (!userInfo) {
            console.log('User not found');
            return ResponseHandler.error(res, 'Invalid credential', null, 404);
        }

        const user = userInfo;

        if (user.is_login !== 0) {
            console.log('User already logged in');
            return ResponseHandler.error(res, 'User already logged in', null, 401);
        }
        if(user.password != password){
            console.log("Password salah");
            return ResponseHandler.error(res, 'Password yang anda Masukkan Salah', null, 401);
        }
        const payload = {id_user: user.id_user, nama: user.nama}
        const tokenJwt = generateToken(payload);

        const is_login = 1;
        await User.updateLogin(is_login, user.nama);

        const respons = {
            token : tokenJwt,
            id_user : user.id_user,
            nama : user.nama,

        }
        return ResponseHandler.success(res, 'Login successful', respons, 200);
    } catch (error) {
        console.log('Error during login:', error);
            return ResponseHandler.error(res, 'Internal Server Error', error, 500);
       
    }
    }

    async logout(req, res){
        try {
            const id  = req.user.id_user;
            console.log("id yang di logout", req.user.id_user);
            console.log("id yang di terima", id);
            
            await User.updateLogout(id);
            return ResponseHandler.success(res, "Logout success", {});
        } catch (error) {
            console.log(error);
            ResponseHandler.error(res, "internal server error", error, 500);
        }
    }
}
module.exports = { authController: new AuthController() };
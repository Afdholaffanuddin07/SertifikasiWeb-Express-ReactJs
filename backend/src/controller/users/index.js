const { UsersModel } = require("../../model");
const { ResponseHandler } = require("../../utils"); 

const User = new UsersModel();

class UsersController{
    async getUsers(req, res, next){
        try {
            const dataUsers = await User.getUsers();
            console.log("data user : ", dataUsers);
            
            const formatedData = dataUsers?.map((user) => {
                return {
                    id_user: user.id_user,
                    nama: user.nama,
                    password: user.password,
                    is_login: user.is_login,
                };
            });
            return ResponseHandler.success(res, 'Successfully retrieved user data', formatedData);
        } catch (error) {
            console.error('Error retrieving user data:', error);
            return ResponseHandler.error(res, 'Internal Server Error', error);
        
        }
    }
    async getUserById(req, res, next){
        
        try {
            const { id_user } = req.params;
            const inputRequest = {id_user : id_user}
            const dataUsers = await User.getUserById(inputRequest);
            console.log("data yang di kririm",dataUsers);
            
            return ResponseHandler.success(res, 'Successfully retrieved user data', dataUsers);
        } catch (error) {
            console.error('Error retrieving user data:', error);
            return ResponseHandler.error(res, 'Internal Server Error', error);
        } 
    }
}
module.exports = {usersController: new UsersController()};
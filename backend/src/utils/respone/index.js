

class ResponseHandler {
    static success(res, message, data, status = 200){
        const bodyResponse = {
            status: "succes",
            message,
            data,
        };
        return res.status(status).json(bodyResponse);
    }
    static error(res, message, error, status = 500){
        const bodyResponse = {
            status: "error",
            message,
            error,
        };
        return res.status(status).json(bodyResponse);
    }
}
module.exports = ResponseHandler;
const { ResponseHandler, verifyToken, CryptoHelper } = require('../../utils');



exports.auth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
  // Memeriksa apakah header Authorization ada
  if (!authHeader) {
    return ResponseHandler.error(res, 'Authorization header is missing', null, 401);
  }

  // Mengecek apakah header Authorization sesuai dengan format 'Bearer <token>'
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return ResponseHandler.error(res, 'Token format is invalid', null, 401);
  }

  const token = match[1];
  console.log("Token Match", token);
  

  try {
    // Memverifikasi token menggunakan fungsi verifyToken
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    
    
    
    req.user = decoded;
    console.log(req.user);
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return ResponseHandler.error(res, 'Invalid token', error, 401);
  }
}
const CryptoJS = require('crypto-js');

// Encryption and Decryption functions
const secretKey = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef'); // 32 hex characters = 16 bytes
const iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210'); // 32 hex characters = 16 bytes


const encrypt = async (text) => {
  try {
    let encrypted = CryptoJS.AES.encrypt(text, secretKey, { iv: iv });
    let base64 = encrypted.toString();
    // Replace URL-unsafe characters
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    //return encrypted.toString();
  } catch (error) {
    logger.errorlLog(
      `unable to create otp email template: ${JSON.stringify(error)}`
    );
    throw new Error(error.message);
  }
};


const decrypt = async (encryptedText) => {
  try {
    //let decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey, { iv: iv });
    //return decrypted.toString(CryptoJS.enc.Utf8);
    let base64 = encryptedText.replace(/-/g, '+').replace(/_/g, '/');
    let decrypted = CryptoJS.AES.decrypt(base64, secretKey, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);


  } catch (error) {
    logger.errorlLog(`Unable to send Email : ${JSON.stringify(error)}`);
    //throw new Error(error.message);
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};



module.exports = {
    encrypt,decrypt
};

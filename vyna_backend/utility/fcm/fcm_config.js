

let admin = require("firebase-admin");

let serviceAccount = require("./fcm_credential.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://alex-application-5c845-default-rtdb.firebaseio.com"

});
module.exports.fcm_admin = admin;

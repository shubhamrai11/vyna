const express = require("express");
const router = express.Router();
const contactUsController = require("../../controller/apiv1Controller/admin/contactUsController");
const validateMiddleware = require("../../middleWare/validationMiddleware");
const multer = require('multer');
const upload = multer();
const checkAllowedKeys = require("../../middleWare/checkAllowedKeys")
const uploadFile = require("../../utility/uploadAWS");

router.use((req, res, next) => {
  console.log("api: Content routes");
  next();
});

  router.route("/create-contactus").post(contactUsController.createContactUsForm);

  router.route("/").get(contactUsController.getContactUsForm);

  router.route("/:id").get(contactUsController.getContactUsFormByID) 

  router.route("/:id").delete(contactUsController.deleteByID)  


module.exports = router;
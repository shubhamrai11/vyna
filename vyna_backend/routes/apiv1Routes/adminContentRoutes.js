const express = require("express");
const router = express.Router();
const contentController = require("../../controller/apiv1Controller/admin/contentController");
const ContentValidator = require("../../helpers/validation/content");
const validateMiddleware = require("../../middleWare/validationMiddleware");
const multer = require('multer');
const upload = multer();
const checkAllowedKeys = require("../../middleWare/checkAllowedKeys")
const uploadFile = require("../../utility/uploadAWS");

router.use((req, res, next) => {
  console.log("api: Content routes");
  next();
});


router.route("/").get(contentController.list)
router.route("/create-content")
  .post(uploadFile("file").array("image", 10), contentController.createContent);


  router.route("/create-newletter")
  .post(contentController.createNewLetter);


  router.route("/create-contactus")
  .post(contentController.createContactUs);

  router.route("/getall_newletter").get(contentController.getAllNewLetter);

  router.route("/get_contactus").get(contentController.getContactUs);
router
  .route("/:id").get(contentController.getByID)

router.route("/:id")
  .delete(contentController.deleteByID)

  router.route("/newletter/:id")
  .delete(contentController.deleteNewLetterByID)

  router
  .route("/contactus/:id").get(contentController.getContactUsByID)

  router.route("/contactus/:id")
  .put( ContentValidator.update, validateMiddleware,
  checkAllowedKeys(['title', 'address','website_url','email','mobile_number']), contentController.updateContactUs);

router.route("/:id")
  .put(uploadFile("file").array("image", 10), ContentValidator.update, validateMiddleware,
  checkAllowedKeys(['title', 'content']), contentController.update);

  


module.exports = router;
const express = require("express");
const router = express.Router();
const valueVisionController = require("../../controller/apiv1Controller/admin/valueVisionController");
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const validateMiddleware = require("../../middleWare/validationMiddleware");
const multer = require('multer');
const upload = multer();
const checkAllowedKeys = require("../../middleWare/checkAllowedKeys")
const uploadFile = require("../../utility/uploadAWS");

router.use((req, res, next) => {
  console.log("api: Content routes");
  next();
});


router.route("/").get(valueVisionController.getAllValueVision)
router.route("/create-valuevision")
  .post(AdminAuthController.protact,uploadFile("file").fields([
    { name: "icon", maxCount: 1 }
  ]), valueVisionController.create);

router
  .route("/:id").get(AdminAuthController.protact,valueVisionController.getByID)

router.route("/:id")
  .delete(valueVisionController.deleteByID)

  router.route("/:id")
  .put(uploadFile("file").fields([
    { name: "icon", maxCount: 1 }
  ]),  validateMiddleware,
  valueVisionController.update);
  
module.exports = router;
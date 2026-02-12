const express = require("express");
const router = express.Router();
const faqAskQuestionController = require("../../controller/apiv1Controller/admin/faqAskQuestionController");
const validateMiddleware = require("../../middleWare/validationMiddleware");
const multer = require('multer');
const upload = multer();
const checkAllowedKeys = require("../../middleWare/checkAllowedKeys")
const uploadFile = require("../../utility/uploadAWS");

router.use((req, res, next) => {
  console.log("api: Content routes");
  next();
});

  router.route("/create-faq").post(faqAskQuestionController.createFaqAsKForm);

  router.route("/").get(faqAskQuestionController.getFaqAsKForm);

  router.route("/:id").get(faqAskQuestionController.getFaqAsKFormByID);

  router.route("/:id").delete(faqAskQuestionController.deleteByID);  


module.exports = router;
const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const faqController = require("../../controller/apiv1Controller/admin/faqController");
const checkAllowedKeys = require("../../middleWare/checkAllowedKeys");
const qrCodeController = require("../../controller/apiv1Controller/qrcode/index");

/* GLOBAL MIDDLEWARE */
router.use((req, res, next) => {
  console.log("api: Admin Auth Routes");
  next();
});

router
  .route("/create-faq")
  .post(
    AdminAuthController.protact,
    checkAllowedKeys(["question", "answer"]),
    faqController.create
  );

router.route("/").get(faqController.getAllFaq);

router.route("/:id").get(AdminAuthController.protact, faqController.getByID);

router.route("/:id").put(AdminAuthController.protact, faqController.update);

router
  .route("/:id")
  .delete(AdminAuthController.protact, faqController.deleteByID);

  router.post("/generate-qrcode", qrCodeController.generateAndSaveQRCode);

module.exports = router;

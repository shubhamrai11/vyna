const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const bannerController = require("../../controller/apiv1Controller/admin/bannerController");
const validateMiddleware = require("../../middleWare/validationMiddleware");
const checkAllowedKeys = require("../../middleWare/checkAllowedKeys");
const uploadFile = require("../../utility/uploadAWS");

/* GLOBAL MIDDLEWARE */
router.use((req, res, next) => {
  console.log("api: Admin Auth Routes");
  next();
});

/* AUTH ROUTES */
router.post(
  "/create-banner",
  validateMiddleware,
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "image", maxCount: 1 },
  ]),
  bannerController.create
);

router.route("/").get(bannerController.getAllBanner);

router
  .route("/:id")
  .get(AdminAuthController.protact, bannerController.getByID);

router.route("/:id").put(
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "image", maxCount: 1 }
  ]),
  bannerController.update
);

router
  .route("/:id")
  .delete(AdminAuthController.protact, bannerController.deleteByID);

module.exports = router;

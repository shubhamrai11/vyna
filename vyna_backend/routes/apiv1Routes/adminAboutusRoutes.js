const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const aboutusController = require("../../controller/apiv1Controller/admin/aboutusController");
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
  "/create-about-us",
  validateMiddleware,
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "image", maxCount: 10 },
    { name: "pointIcons", maxCount: 10 }
  ]),
  checkAllowedKeys([
    "title",
    "description",
    "aboutValues"
  ]),
  aboutusController.create
);

router.route("/").get(aboutusController.getAllAboutUs);

router
  .route("/:id")
  .get(AdminAuthController.protact, aboutusController.getByID);
  

router.route("/:id").put(
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "image", maxCount: 10 },
    { name: "pointIcons", maxCount: 10 }
  ]),
  aboutusController.update
);

router
  .route("/:id")
  .delete(AdminAuthController.protact, aboutusController.deleteByID);


  router
  .route("/:id/image/:imageId")
  .delete(AdminAuthController.protact, aboutusController.imageDeleteByID);

module.exports = router;

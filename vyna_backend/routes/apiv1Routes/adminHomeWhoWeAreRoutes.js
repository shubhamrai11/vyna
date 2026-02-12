const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const homeWhoWeAreController = require("../../controller/apiv1Controller/admin/homeWhoWeAreController");
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
  homeWhoWeAreController.create
);

router.route("/").get(homeWhoWeAreController.getAllAboutUs);

router
  .route("/:id")
  .get(AdminAuthController.protact, homeWhoWeAreController.getByID);
  

router.route("/:id").put(
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "image", maxCount: 10 },
    { name: "pointIcons", maxCount: 10 }
  ]),
  homeWhoWeAreController.update
);

router
  .route("/:id")
  .delete(AdminAuthController.protact, homeWhoWeAreController.deleteByID);


  router
  .route("/:id/image/:imageId")
  .delete(AdminAuthController.protact, homeWhoWeAreController.imageDeleteByID);

module.exports = router;

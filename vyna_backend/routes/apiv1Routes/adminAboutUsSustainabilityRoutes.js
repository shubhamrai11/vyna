
const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const aboutUsSustainabilityController = require("../../controller/apiv1Controller/admin/aboutUsSustainabilityController")
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
  "/create-sustain",
  validateMiddleware,
  AdminAuthController.protact,
  uploadFile("file").array("image", 10),
  checkAllowedKeys([
    "title",
    "description",
  ]),
  aboutUsSustainabilityController.create
);

router.route("/").get(aboutUsSustainabilityController.getSustainability);


router
  .route("/:id")
  .get(AdminAuthController.protact, aboutUsSustainabilityController.getByID);


router.route("/:id").put(
  AdminAuthController.protact,
  uploadFile("file").array("image", 10),
  aboutUsSustainabilityController.update
);



module.exports = router;



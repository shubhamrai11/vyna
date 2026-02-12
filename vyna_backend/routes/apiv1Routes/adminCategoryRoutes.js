const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const categoryController = require("../../controller/apiv1Controller/admin/categoryController");
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
  "/create-category",
  validateMiddleware,
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "category_logo", maxCount: 1 },
    { name: "category_image", maxCount: 1 },
     { name: "category_banner", maxCount: 1 },
     {name:"category_mobile_banner",maxCount:1},
    { name: "image", maxCount: 1 }
  ]),
  checkAllowedKeys([
    "category_name",
    "category_logo",
    "category_description",
    "category_image",
    "category_mobile_banner",
    "category_banner"
  ]),
  categoryController.create
);

router.route("/").get(categoryController.getAllCategory);

router
  .route("/:id")
  .get( categoryController.getByID);

  router
  .route("/allcategory/:id")
  .get(categoryController.getCategoryByID);

  

router.route("/:id").put(
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "category_logo", maxCount: 1 },
   { name: "category_banner", maxCount: 1 },
   {name:"category_mobile_banner",maxCount:1},

    { name: "category_image", maxCount: 1 },
    { name: "image", maxCount: 1 }
  ]),
  categoryController.update
);

router
  .route("/:id")
  .delete(AdminAuthController.protact, categoryController.deleteByID);

module.exports = router;

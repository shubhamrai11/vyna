const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const subcategoryController = require("../../controller/apiv1Controller/admin/subcategoryController");
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
  "/create-subcategory",
  AdminAuthController.protact,
   uploadFile("file").fields([
    { name: "image", maxCount: 1 },
    { name: "subCategory_banner", maxCount: 1 },
    { name: "subCategory_mobile_banner", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]),
  checkAllowedKeys(["categoryId", "subCategoryName", "image","subCategory_banner","sequence","subCategory_mobile_banner","file"]),
  subcategoryController.create
);

router.route("/").get(subcategoryController.getAllSubCategory);

router
  .route("/:id")
  .get( subcategoryController.getByID);

router
  .route("/:id")
  .put(AdminAuthController.protact, uploadFile("file").fields([
    { name: "image", maxCount: 1 },
    { name: "subCategory_banner", maxCount: 1 },
    { name: "subCategory_mobile_banner", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]),subcategoryController.update);

router
  .route("/:id")
  .delete(AdminAuthController.protact, subcategoryController.deleteByID);

module.exports = router;

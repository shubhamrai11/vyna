const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const productController = require("../../controller/apiv1Controller/admin/productController");
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
  "/create-product",
  validateMiddleware,
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: 'colorTemperatureImages', maxCount: 20 },
    { name: 'image', maxCount: 20 }, { name: 'image1', maxCount: 20 }
  ])
  ,
  checkAllowedKeys([
    "productName",
    "categoryId",
    "subCategoryId",
    "short_description",
    "description",
    "image",
    "specification",
    "color",
    "colorTemperature",
    "keyFeatures",
    "colorTemperatureData"
  ]),
  productController.create
);

router.route("/").get(productController.getAllProduct);

router.route("/feature_producrt").get(productController.getAllHighlighProduct);

router
  .route("/search/:searchKey")
  .get(productController.searchAllProduct);

router
  .route("/:id")
  .get(productController.getByID);

router
  .route("/subcategoryid/:id")
  .get(productController.getSubCategoryByID);


router
  .route("/categoryid/:id")
  .get(productController.getCategoryByID);




router.route("/:id").put(
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: 'colorTemperatureImages', maxCount: 20 },
    { name: 'image', maxCount: 20 }, { name: 'image1', maxCount: 20 }
  ]),
  productController.update
);

router
  .route("/highlight_change_status/:id")
  .put(AdminAuthController.protact, productController.changeHighlightProductStatus);

router
  .route("/:id")
  .delete(AdminAuthController.protact, productController.deleteByID);

router
  .route("/:id/image/:imageId")
  .delete(AdminAuthController.protact, productController.imageDeleteByID);
router
  .route("/:id/image1/:imageId")
  .delete(AdminAuthController.protact, productController.image1DeleteByID);

router
  .route("/new/:newid")
  .get(productController.renderTicketPage);

module.exports = router;

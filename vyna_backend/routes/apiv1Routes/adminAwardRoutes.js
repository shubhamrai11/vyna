
const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const awardController = require("../../controller/apiv1Controller/admin/awardController")
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
  "/create-award",
  validateMiddleware,
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: 'award_image', maxCount: 1 },
    { name: 'image', maxCount: 4 },
    { name: 'side_image', maxCount: 10 }
  ]),
  checkAllowedKeys([
    "heading",
    "description",
  ]),
  awardController.create
);

router.route("/").get(awardController.getAward);


router
  .route("/:id")
  .get(AdminAuthController.protact, awardController.getByID);


router.route("/:id").put(
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: 'award_image', maxCount: 1 },
    { name: 'image', maxCount: 4 },
    { name: 'side_image', maxCount: 10 }
  ]),
  awardController.update
);

router
  .route("/:id/image/:imageId")
  .delete(AdminAuthController.protact, awardController.imageDeleteByID);

  router
  .route("/:id/sideimage/:sideimageId")
  .delete(AdminAuthController.protact, awardController.sideimageDeleteByID);


module.exports = router;



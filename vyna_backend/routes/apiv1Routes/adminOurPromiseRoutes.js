const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const ourPromiseController = require("../../controller/apiv1Controller/admin/ourPromiseController");
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
  "/create-ourpromise",
  validateMiddleware,
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "pointIcons", maxCount: 10 }
  ]),
  checkAllowedKeys([
    "heading",
    "title",
    "description",
    "points"
  ]),
  ourPromiseController.create
);

router.route("/").get(ourPromiseController.getAllOurPromise);

router
  .route("/:id")
  .get(AdminAuthController.protact, ourPromiseController.getByID);


router.route("/:id").put(
  AdminAuthController.protact,
  uploadFile("file").fields([
    { name: "pointIcons", maxCount: 10 }
  ]),
  ourPromiseController.update
);


router
  .route("/:id")
  .delete(AdminAuthController.protact, ourPromiseController.deleteByID);



module.exports = router;

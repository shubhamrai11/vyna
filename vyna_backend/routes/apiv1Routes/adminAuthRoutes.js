const express = require("express");
const router = express.Router();

/* CONTROLLERS & MIDDLEWARES */
const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
const AdminValidator = require("../../helpers/validation/admin");
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
  "/login",
  AdminValidator.login,
  validateMiddleware,
  checkAllowedKeys(["email", "password"]),
  AdminAuthController.login
);

router.post(
  "/forgot-password",
  AdminValidator.forgotPassword,
  validateMiddleware,
  checkAllowedKeys(["email"]),
  AdminAuthController.forgotPasswordLink
);

router.post(
  "/verify_forgot_password",
  AdminValidator.verifyEmail,
  validateMiddleware,
  AdminAuthController.verifyForgotPassworEmail
);

/* PROFILE ROUTES */
router.get("/", AdminAuthController.protact, AdminAuthController.getAdminProfile);

router.patch(
  "/update-profile",
  AdminAuthController.protact,
  uploadFile("file").single("avatar"),
  AdminValidator.update_profile,
  validateMiddleware,
  checkAllowedKeys(["first_name", "mobileNumber"]),
  AdminAuthController.updateAdmin
);

/* PASSWORD ROUTES */
router.post(
  "/reset-password",
  AdminValidator.reset_password,
  validateMiddleware,
  checkAllowedKeys(["email", "password", "token"]),
  AdminAuthController.resetPassword1
);

router.post(
  "/change-password",
  AdminAuthController.protact,
  AdminValidator.change_password,
  validateMiddleware,
  checkAllowedKeys(["old_password", "password"]),
  AdminAuthController.changePassword
);

/* DASHBOARD */
router.get(
  "/dashboard-listing",
  AdminAuthController.protact,
  AdminAuthController.getDashboardListing
);

module.exports = router;

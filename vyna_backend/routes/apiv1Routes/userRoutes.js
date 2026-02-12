const express = require("express");

/* MIDDLEWARE */
const router = express.Router();
const uploadFile = require("../../utility/uploadAWS");
// const userController = require("../../controller/apiv1Controller/frontend/userController");
// const AdminAuthController = require("../../controller/apiv1Controller/admin/adminAuthController");
// const authController = require("../../controller/apiv1Controller/frontend/authController");
const UserValidator = require("../../helpers/validation/user");
const JobValidator = require("../../helpers/validation/jobs");
const validateMiddleware = require("../../middleWare/validationMiddleware");
const checkAllowedKeys = require("../../middleWare/checkAllowedKeys")
/* GLOBAL MIDDLEWARE USAGE */
router.use((req, res, next) => {
  console.log("api: User routes");
  next();
});

/* SWAGGER SCHEMA */
/**
 * @swagger
 * components:
 *  schemas:
 *      otpVerifationSchema:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: User Email required
 *                  example: mailto:example@gmail.com
 *              otp:
 *                  type: string 
 *                  description: otp which send to email required
 *                  example: af32
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      verifEmailSchema:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: User Email
 *                  example: jhon@gmail.com
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      UserSchema:
 *          type: object
 *          properties:
 *              first_name:
 *                  type: string
 *                  description: First Name is required
 *                  example: First Name
 *              last_name:
 *                  type: string
 *                  description: Last Name is required
 *                  example: Last Name
 *              email:
 *                  type: string
 *                  description: Email is required
 *                  example: example@abc.com
 *              country_code: 
 *                  type: string
 *                  description: Please enter country code
 *                  example: "+242"
 *              mobileNumber:
 *                  type: string
 *                  description: Any 6 to 15 digit number Optional
 *                  example: 719875678
 *              password:
 *                  type: string
 *                  description: Password is required
 *                  exmaple: pass@123
 *            
 */

/* ROUTES */
//USER ROUTES
/**
 * @swagger
 * /hr-web-app/api/v1/users:
 *  post:
 *      tags: [Jobseeker Authentication]
 *      summary: Create User API
 *      description: Create User Record
 *      parameters:
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      requestBody:
 *          required: true
 *          content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    $ref: '#/components/schemas/UserSchema'
 *      responses:
 *          201:
 *              description: Success
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: User created Successfully
 *                      data:
 *                        type: object
 *                        
 */

/**
 * @swagger
 * /hr-web-app/api/v1/users:
 *  get:
 *      tags: [Jobseeker Authentication]
 *      summary: Get All Jobseeker API
 *      description: Retrieve a paginated list of all location
 *      parameters:
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: Jobseeker fetched successfully
 *                      currentPage:
 *                        type: integer
 *                        example: 1
 *                      totalPages:
 *                        type: integer
 *                        example: 5
 *                      totalCount:
 *                        type: integer
 *                        example: 50
 *                      limit:
 *                        type: integer
 *                        example: 10
 *                      data:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/UserSchema'
 */



router
  .route("/")
  .post(UserValidator.create_user, validateMiddleware,
    checkAllowedKeys(['first_name','last_name', 'email','country_code', 'mobileNumber','password']), userController.create)

    .get(AdminAuthController.protactBoth, userController.getAllUser);

/**
 * @swagger
 * components:
 *  schemas:
 *      OtpVerificationSchema:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: User Email required
 *                  example: example@gmail.com
 *              otp:
 *                  type: string
 *                  description: OTP sent to email required
 *                  example: af32
 */

/**
 * @swagger
 * /hr-web-app/api/v1/users/verify-otp:
 *  post:
 *      tags: [Jobseeker Authentication]
 *      summary: Verify OTP API
 *      description: Verifies the OTP sent to the user's email and activates the account
 *      parameters:
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      requestBody:
 *          required: true
 *          content:
 *               application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/OtpVerificationSchema'
 *      responses:
 *          201:
 *              description: OTP Verified Successfully
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: Your account has been successfully verified!
 *                      data:
 *                        type: object
 *          400:
 *              description: Invalid OTP or Email
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success:
 *                        type: boolean
 *                        example: false
 *                      message:
 *                        type: string
 *                        example: Please enter a valid OTP.
 *          404:
 *              description: Email not found
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success:
 *                        type: boolean
 *                        example: false
 *                      message:
 *                        type: string
 *                        example: Email not found.
 *          500:
 *              description: Internal Server Error
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      message:
 *                        type: string
 *                        example: Failed to verify email.
 */
router.post("/verify-otp", userController.verifyOtp);



/**
 * @swagger
 * /hr-web-app/api/v1/users/resend-otp:
 *  post:
 *      tags: [Jobseeker Authentication]
 *      summary: Resend OTP API
 *      description: Sends a new OTP to the user's registered email.
 *      parameters:
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      requestBody:
 *          required: true
 *          content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      email:
 *                        type: string
 *                        description: User Email required
 *                        example: user@example.com
 *      responses:
 *          200:
 *              description: OTP has been resent successfully
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      statusCode:
 *                        type: integer
 *                        example: 200
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: OTP has been resent successfully!
 *                      data:
 *                        type: object
 *          400:
 *              description: Email not found
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success:
 *                        type: boolean
 *                        example: false
 *                      message:
 *                        type: string
 *                        example: Email not found.
 *          500:
 *              description: Internal Server Error
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      message:
 *                        type: string
 *                        example: Something went wrong.
 */

router.post("/resend-otp", userController.resendOtp);


/**
 * @swagger
 * components:
 *  schemas:
 *      JobseekerSchemaLogin:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: User Email required
 *                  example: abc@yopmail.com
 *              password:
 *                  type: string
 *                  description: User Password required
 *                  example: Abc@1234
 */

/**
 * @swagger
 * /hr-web-app/api/v1/users/login:
 *  post:
 *      tags: [Jobseeker Authentication]
 *      summary: Vaidates a Jobseeker login
 *      description: Create Player Stats Record
 *      parameters:
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      requestBody:
 *          required: true
 *          content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    $ref: '#/components/schemas/JobseekerSchemaLogin'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: Jobseeker credentials vaidation success
 *                      token:
 *                        type: string
 *                        example: Bearer Token
 *                      user:
 *                        type: object
 *                        #ref: '#/components/schemas/JobseekerSchemaLogin'
 */
router.route("/login")

    .post(UserValidator.login, validateMiddleware,
        checkAllowedKeys(['email','password']), userController.login);

/**
 * @swagger
 * components:
 *  schemas:
 *      jobseekerForgotPasswordSchema:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: User Email required
 *                  example: admin1@yopmail.com
 */

/**
 * @swagger
 * /hr-web-app/api/v1/users/forgot-password:
 *  post:
 *      tags: [Jobseeker Authentication]
 *      summary: Send Reset Password Link on Email
 *      description: Forgot password
 *      parameters:
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      requestBody:
 *          required: true
 *          content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    $ref: '#/components/schemas/jobseekerForgotPasswordSchema'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: Email Sent Successfully
 *                     
 */
router.route("/forgot-password").post(UserValidator.forgotPassword,validateMiddleware,checkAllowedKeys(['email']),userController.forgotPasswordLink);

/**
* @swagger
* components:
*  schemas:
*      jobseekerVerifyEmail:
*          type: object
*          properties:
*              token:
*                  type: string
*                  description: Token required
*                  example: hjlshflsdhfsk
*/
/**
* @swagger
* /hr-web-app/api/v1/users/verify_forgot_password:
*  post:
*      tags: [Jobseeker Authentication]
*      summary: Verify Email Link
*      description: Verify Email Link
*      parameters:
*        - in: header
*          name: language
*          schema:
*            type: string
*          required: false
*          description: Language preference for the response (e.g., en, fr)
*      requestBody:
*          required: true
*          content:
*                application/json:
*                  schema:
*                    type: object
*                    $ref: '#/components/schemas/jobseekerVerifyEmail'
*      responses:
*          200:
*              description: Success
*              content:
*                application/json:
*                  schema:
*                    type: object
*                    properties:
*                      status:
*                        type: string
*                        example: success
*                      message:
*                        type: string
*                        example: Email has been verified,please reset your password
*                      data:
*                        type: object
*                     
*/
router.route("/verify_forgot_password").post(UserValidator.verifyEmail,validateMiddleware,userController.verifyForgotPassworEmail);

/**
 * @swagger
 * components:
 *  schemas:
 *      jobseekerResetPasswordSchema:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *                  description: User Email
 *                  example: example@gmail.com
 *              password:
 *                  type: string
 *                  description: new password
 *                  example: Password@123
 *              token:
 *                  type: string
 *                  description: token
 *                  example: sahdhhkjhdfkjkjou789712indkhQ3Y4IRWBEFIU32Y
 */

/**
 * @swagger
 * /hr-web-app/api/v1/users/reset-password:
 *  post:
 *      tags: [Jobseeker Authentication]
 *      summary: Vaidates a Jobseeker User email
 *      description: Forgot password verification
 *      parameters:
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      requestBody:
 *          required: true
 *          content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    $ref: '#/components/schemas/jobseekerResetPasswordSchema'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: User credentials vaidation success
 *                      user:
 *                        type: object
 *                        #ref: '#/components/schemas/jobseekerResetPasswordSchema
 */
router.route("/reset-password").post(UserValidator.reset_password,validateMiddleware,
  checkAllowedKeys(['email','password','token']),userController.resetPassword);



/**
 * @swagger
 * /hr-web-app/api/v1/users/{id}:
 *   get:
 *     summary: Get user details by ID
 *     description: Retrieves a user based on the provided ID.
 *     tags: [Jobseeker Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the user.
 *         schema:
 *           type: string
 *       - in: header
 *         name: language
 *         schema:
 *           type: string
 *         required: false
 *         description: Language preference for the response (e.g., en, fr)
 *     responses:
 *       200:
 *         description: Successfully retrieved user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Jobseeker List
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d8e35d8f7a2b1"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     createdBy:
 *                       type: string
 *                       example: "60b8f2b8e5f8b3405c8f3d5b"
 *                     updatedBy:
 *                       type: string
 *                       example: "60b8f2b8e5f8b3405c8f3d5b"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Unable to get User
 */

router.route("/:id").get(AdminAuthController.protactBoth,userController.getUserById);


/**
 * @swagger
 * /hr-web-app/api/v1/users/update/{id}:
 *   put:
 *     summary: Update user profile
 *     description: Update user details and job seeker profile.
 *     tags: [Jobseeker Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: header
 *         name: language
 *         schema:
 *           type: string
 *         required: false
 *         description: Language preference for the response (e.g., en, fr)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               country_code: 
 *                 type: string
 *                 description: Please enter country code
 *                 example: "+242"
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               location:
 *                 type: string
 *                 example: "New York"
 *               linkedin_profile:
 *                 type: string
 *                 example: "https://linkedin.com/in/johndoe"
 *               resume:
 *                 type: string
 *                 format: binary
 *               certificate:
 *                 type: string
 *                 format: binary
 *               skills:
 *                 type: string
 *                 example: ["JavaScript", "Node.js"]
 *               job_preferences_location:
 *                 type: string
 *                 example: "NYC"
 *               type:
 *                 type: string
 *                 enum: ["Full-time", "Part-time", "Freelance", "Internship", "Remote"]
 *               experience:
 *                 type: string
 *                 enum: ["0-1 Year", "1-3 Year", "4-8 Year", "9-12 Year", "13-15 Year"]
 *               salaryRange:
 *                 type: string
 *                 example: "40K-50K"
 *               privacy_setting:
 *                 type: string
 *                 enum: ["Public - Visible to all recruiters", "Private - Only visible to approved companies", "Hidden - Not visible in search results"]
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       202:
 *         description: User updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/update/:id")
  .put(
    uploadFile("file").fields([
      { name: "avatar", maxCount: 1 },
      { name: "resume", maxCount: 1 },
      { name: "certificate", maxCount: 1 },
    ]),
    userController.protact,
    userController.updateUser
  );


  /**
 * @swagger
 * /hr-web-app/api/v1/users/{id}:
 *  delete:
 *      tags: [Jobseeker Authentication]
 *      summary: Delete Jobseeker API
 *      description: Delete an existing Jobseeker by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The unique ID of the Jobseeker to delete
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      responses:
 *          200:
 *              description: Jobseeker deleted successfully
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: Jobseeker deleted successfully
 *          404:
 *              description: Jobseeker not found
 */

router.route("/:id").delete(AdminAuthController.protact, userController.deleteByID);


/**
 * @swagger
 * /hr-web-app/api/v1/users/dashboardList/{jobseekerId}:
 *  get:
 *     summary: Get Jobseeker User API
 *     description: API to retrieve jobseeker user details by jobseeker ID.
 *     tags: 
 *       - Jobseeker Authentication
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: language
 *         schema:
 *           type: string
 *         required: false
 *         description: Language preference for the response (e.g., en, fr)
 *       - in: path
 *         name: jobseekerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the recruiter.
 *     responses:
 *         200:
 *             description: Success
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: Get Jobseeker User
 *                      user:
 *                        type: object
 *         400:
 *           description: Bad request - Invalid jobseeker ID
 *         404:
 *           description: Jobseeker not found
 *         500:
 *           description: Internal server error
 */

router
  .route("/dashboardList/:jobseekerId")
  .get(userController.getDashboardListing)


/**
 * @swagger
 * /hr-web-app/api/v1/users/change_status/{id}:
 *  put:
 *      tags: [Jobseeker Authentication]
 *      summary: Update Change Status API
 *      description: Update an existing recruiter's details
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The unique ID of the job to update
 *        - in: header
 *          name: language
 *          schema:
 *            type: string
 *          required: false
 *          description: Language preference for the response (e.g., en, fr)
 *      responses:
 *          200:
 *              description: Status change successfully
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: success
 *                      message:
 *                        type: string
 *                        example: Status Change Successfully
 *                      data:
 *                        $ref: '#/components/schemas/RecruiterSchema'
 *          404:
 *              description: Status change not found
 *              content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      status:
 *                        type: string
 *                        example: error
 *                      message:
 *                        type: string
 *                        example: RecruiterSchema not found
 *                      data:
 *                        type: string
 *                        example: null
 */
    
router
.route("/change_status/:id")
.put(AdminAuthController.protactBoth, userController.changeStatus);


module.exports = router;

const { body, validationResult } = require('express-validator');
const moment =require("moment");
const {REGX}=require("../../../utility/constant");
/**
 * JOI Validation Schema for Admin Route
 */

const isBase64Image = (value) => {
  if (typeof value !== 'string') {
      return false;
  }
  const matches = value.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
  return matches !== null;
};
module.exports = {

  create:[
    body("assetsType", "assets Type Id is required").exists().trim(),
      body("title", "Title is required").exists().trim().isLength({min:3 ,max: 50 }).withMessage("Title  should be between 3 to 50 characters."),
      body("quantity", "Quantity is required").exists().notEmpty().withMessage("Quantity  should not be empy.")
      .isNumeric({ gt: 0 }).withMessage("Quantity is greater than 0")
   ],
  update:[
    body("assetsType", "assets Type Id is required").if(body('title').exists()).trim(),
      body("title", "Title is required").if(body('title').exists()).trim().isLength({min:3 ,max: 50 }).withMessage("Title  should be between 3 to 50 characters."),
      body("quantity", "Quantity is required").if(body('title').exists()).notEmpty().withMessage("Quantity  should not be empy.")
      .isNumeric({ gt: 0 }).withMessage("Quantity is greater than 0")
    ],

    create_assetstypes:[
      body("title", "Title is required").exists().isLength({min:3 ,max: 50 })
        .trim().withMessage("Title  should be between 3 to 50 characters.")
     ],
     update_assetstype:[
      body("title", "Title is required").if(body('title').exists()).isLength({min:3 ,max: 50 })
        .trim().withMessage("Title  should be between 3 to 50 characters.")
     ],

     checkoutItem:[
      
      body("assetId", "assets  Id is required").exists().trim().notEmpty().withMessage("Please Select Assets."),
      body("userId", "User Id is required").exists().trim(),
      body("quantity", "Quantity is required").exists().notEmpty().withMessage("Quantity  should not be empy.")
        .isNumeric({ gt: 0 }).withMessage("Quantity is greater than 0"),

      body("condition", "Condition is required").if(body('condition').exists()).trim()
        .isLength({min:3 ,max: 50 }).withMessage("Condition  should be between 3 to 50 characters."),

      body("description", "Description is required").if(body('description').exists()).trim(),
       // .isLength({min:3 ,max: 50 }).withMessage("Description  should be between 3 to 50 characters."),

      body("location", "Location is required").exists().trim(),
          // .isLength({min:3 ,max: 50 }).withMessage("Location  should be between 3 to 50 characters."),

      // body("latitude").exists().withMessage("Latitude is required").trim()
      //   .notEmpty()
      //   .withMessage("Latitude is not allowed to be empty")
      //   .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),
      // body("longitude").exists().withMessage("Longitude is required").trim()
      //       .notEmpty()
      //       .withMessage("Longitude is not allowed to be empty")
      //       .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),
      // body('signature')
      // .notEmpty()
      // .withMessage('Signature is required')
      // .custom((value) => {
      //     if (!isBase64Image(value)) {
      //         throw new Error('Signature must be a base64 encoded image string');
      //     }
      //     return true;
      // }),
      
        
     ],

   

  
}
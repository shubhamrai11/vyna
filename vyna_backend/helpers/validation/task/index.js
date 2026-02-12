const { body, validationResult } = require('express-validator');
const moment =require("moment");
const {REGX}=require("../../../utility/constant");
/**
 * JOI Validation Schema for Admin Route
 */

module.exports = {

  create:[
    body("name", "Name is required").exists().isLength({min:3 ,max: 50 })
      .trim().withMessage("Name  should be between 3 to 50 characters.")
   ],
  update:[
    body("name", "Name is required").if(body('name').exists()).isLength({min:3 ,max: 50 })
      .trim().withMessage("Name  should be between 3 to 50 characters.")
    ],

    assign_job:[
      body("projectId", "Project Id is required").exists().trim(),
      body("taskId", "Task Id is required").exists().trim(),
      body("userId", "User Id is required").exists().trim()
    ],
  

  
}
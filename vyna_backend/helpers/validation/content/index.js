const { body, validationResult } = require('express-validator');
const moment =require("moment");
const {REGX}=require("../../../utility/constant");
/**
 * JOI Validation Schema for Admin Route
 */

module.exports = {

  create:[
    body("title", "Title is required").exists()
     ,
      body("content", "Content is required").exists()
   ],
  update:[
    body("title", "Title is required").if(body('title').exists()),
    body("content", "Content is required").if(body('content').exists())
    ],

    

   

  
}
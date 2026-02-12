const { body, validationResult } = require('express-validator');
const {REGX}=require("../../../utility/constant");


module.exports = {

    createCategory:[
        body("category_name","Category Name is Required").exists().notEmpty(),
        body("category_logo","Category Logo is Required").exists().notEmpty(),
        body("category_image","Category Image is Required").exists().notEmpty(),
        body("category_description","Category Description is Required").exists().notEmpty(),
      ],
}
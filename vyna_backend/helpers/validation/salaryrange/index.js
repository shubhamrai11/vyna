const { body, validationResult } = require('express-validator');
const {REGX}=require("../../../utility/constant");


module.exports = {

    salary_range:[
        body("salary_range","Salary Range is Required").exists().notEmpty(),
      ],
}
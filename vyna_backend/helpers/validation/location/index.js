const { body, validationResult } = require('express-validator');
const {REGX}=require("../../../utility/constant");


module.exports = {

    location:[
        body("location","Salary Range is Required").exists().notEmpty(),
      ],
}
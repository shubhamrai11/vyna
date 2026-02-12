const { body, validationResult } = require('express-validator');
const {REGX}=require("../../../utility/constant");


module.exports = {

    name:[
        body("interviewer_name","Interviewer Name is Required").exists().notEmpty(),
      ],
}
const { body, validationResult } = require('express-validator');
const {REGX}=require("../../../utility/constant");


module.exports = {

    name:[
        body("skills_name","Skill Name is Required").exists().notEmpty(),
      ],
}
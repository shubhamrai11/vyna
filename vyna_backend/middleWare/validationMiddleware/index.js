"use strict";
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   
    return res.status(422).json({ status:false, message: errors.array()[0].msg });

  }
  next();
};

module.exports = validate;



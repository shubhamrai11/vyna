const { body, validationResult } = require('express-validator');
const moment =require("moment");
const {REGX}=require("../../../utility/constant");
/**
 * JOI Validation Schema for Admin Route
 */

module.exports = {

  create_project:[
    body("name", "Name is required").exists().isLength({min:3 ,max: 50 }).trim().withMessage("Name  should be between 3 to 50 characters."),
    body("description", "Description is not allowed to be empty").exists().trim().notEmpty(),
    body("latitude").exists().trim()
      .notEmpty()
      .withMessage("Latitude is not allowed to be empty")
      .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),
    body("longitude").exists().trim()
      .notEmpty()
      .withMessage("Longitude is not allowed to be empty")
      .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),
    body("address", "Address is not allowed to be empty").exists().trim()
      .notEmpty()
      .withMessage('Address not allowed to be empty'),
      body('startDate')
            .notEmpty()
            .withMessage('Start date is required')
            .custom((value) => {
                const date = moment(value, 'YYYY-MM-DD', true);
                if (!date.isValid()) {
                    throw new Error('Invalid date format, should be YYYY-MM-DD');
                }
                if (date.isBefore(moment(), 'day')) {
                    throw new Error('Start date must be a current or future date');
                }
                return true;
            }),
        body('endDate')
            .notEmpty()
            .withMessage('End date is required')
            .custom((value, { req }) => {
                const endDate = moment(value, 'YYYY-MM-DD', true);
                const startDate = moment(req.body.startDate, 'YYYY-MM-DD', true);
                if (!endDate.isValid()) {
                    throw new Error('Invalid date format, should be YYYY-MM-DD');
                }
                if (!endDate.isAfter(startDate, 'day')) {
                    throw new Error('End date must be after start date');
                }
                return true;
            })
    

  ],
  update_project:[
    body("name", "Name is required").if(body('name').exists()).isLength({min:3 ,max: 50 }).trim().withMessage("Name  should be between 3 to 50 characters."),
    body("description", "Description is not allowed to be empty").if(body('description').exists()).trim().notEmpty(),
    body("latitude").if(body('latitude').exists()).trim()
      .notEmpty()
      .withMessage("Latitude is not allowed to be empty")
      .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),
    body("longitude").if(body('longitude').exists()).trim()
      .notEmpty()
      .withMessage("Longitude is not allowed to be empty")
      .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),
    body("address", "Address is not allowed to be empty").if(body('address').exists()).trim()
      .notEmpty()
      .withMessage('Address not allowed to be empty'),
      body('startDate').if(body('startDate').exists())
            .notEmpty()
            .withMessage('Start date is required')
            .custom((value) => {
                const date = moment(value, 'YYYY-MM-DD', true);
                if (!date.isValid()) {
                    throw new Error('Invalid date format, should be YYYY-MM-DD');
                }
                // if (date.isBefore(moment(), 'day')) {
                //     throw new Error('Start date must be a current or future date');
                // }
                return true;
            }),
        body('endDate').if(body('endDate').exists())
            .notEmpty()
            .withMessage('End date is required')
            .custom((value, { req }) => {
                const endDate = moment(value, 'YYYY-MM-DD', true);
                const startDate = moment(req.body.startDate, 'YYYY-MM-DD', true);
                if (!endDate.isValid()) {
                    throw new Error('Invalid date format, should be YYYY-MM-DD');
                }
                if (!endDate.isAfter(startDate, 'day')) {
                    throw new Error('End date must be after start date');
                }
                return true;
            })
    

  ],
  

  
}
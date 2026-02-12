const { body } = require('express-validator');
const moment =require("moment");

/**
 * JOI Validation Schema for Admin Route
 */

module.exports = {

  create_leave:[
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
                if (!endDate.isSameOrAfter(startDate, 'day')) {
                    throw new Error('End date must be after start date');
                }
                return true;
            }),
            body('noOfDays')
            .notEmpty()
            .withMessage('No of days is required')
            .isNumeric().withMessage('noOfDays must be a number')

  ],
  update_leave:[
      body('startDate').if(body('startDate').exists())
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
            }),
            body('noOfDays')
            .notEmpty()
            .withMessage('No of days is required')
            .isNumeric().withMessage('noOfDays must be a number')
    

  ],
  

  
}
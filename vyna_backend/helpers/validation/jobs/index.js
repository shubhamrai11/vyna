const { body, validationResult } = require('express-validator');
const moment =require("moment");
const {REGX,jobStatus}=require("../../../utility/constant");
/**
 * JOI Validation Schema for Admin Route
 */
const isBase64Image = (value) => {
    if (typeof value !== 'string') {
        return false;
    }
    const matches = value.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
    return matches !== null;
};

module.exports = {

    create_punch_in:[
    body("projectId").exists().notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid Project ID'),
    // body('taskDetail')
    //         .notEmpty()
    //         .withMessage('taskDetail is required'),
            // .custom(value => {
            //     try {
            //         console.log("Value",value);
            //         const tasks =value; //JSON.parse(value);
            //         console.log("tasks",tasks);
            //         if (!Array.isArray(tasks)) {
            //             throw new Error('taskDetail must be an array');
            //         }
            //         tasks.forEach(task => {
            //             if (!mongoose.Types.ObjectId.isValid(task.taskId)) {
            //                 throw new Error('Invalid Task ID');
            //             }
            //             if (![jobStatus.INPROGRESS,jobStatus.COMPLETE,jobStatus.PENDING,jobStatus.HOLD].includes(task.status)) {
            //                 throw new Error('Invalid status value');
            //             }
            //         });
            //         return true;
            //     } catch (err) {
            //         throw new Error('Invalid JSON format or validation error in taskDetail');
            //     }
            // }),

    body('signature')
    .notEmpty()
    .withMessage('Signature is required')
    .custom((value) => {
        if (!isBase64Image(value)) {
            throw new Error('Signature must be a base64 encoded image string');
        }
        return true;
    }),
    //.if(body('latitude').exists());
    body("latitude").exists().withMessage("Latitude is required").trim()
    .notEmpty()
    .withMessage("Latitude is not allowed to be empty")
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),
    body("longitude").exists().withMessage("Longitude is required").trim()
        .notEmpty()
        .withMessage("Longitude is not allowed to be empty")
        .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),

    body('remark').if(body('remark').exists()).isLength({min:3 ,max: 150 }).trim().withMessage("Remark  should be between 3 to 150 characters.")
    .notEmpty()
    .withMessage('Remark is required')

  ],
  update_punch_in:[
    body("punchInId").exists().notEmpty()
    .withMessage('Punch-in ID is required')
    .isMongoId()
    .withMessage('Invalid Punch-in ID'),
    // body('taskDetail')
    //         .notEmpty()
    //         .withMessage('taskDetail is required'),
            // .custom(value => {
            //     try {
            //         console.log("Value",value);
            //         const tasks =value; //JSON.parse(value);
            //         console.log("tasks",tasks);
            //         if (!Array.isArray(tasks)) {
            //             throw new Error('taskDetail must be an array');
            //         }
            //         tasks.forEach(task => {
            //             if (!mongoose.Types.ObjectId.isValid(task.taskId)) {
            //                 throw new Error('Invalid Task ID');
            //             }
            //             if (![jobStatus.INPROGRESS,jobStatus.COMPLETE,jobStatus.PENDING,jobStatus.HOLD].includes(task.status)) {
            //                 throw new Error('Invalid status value');
            //             }
            //         });
            //         return true;
            //     } catch (err) {
            //         throw new Error('Invalid JSON format or validation error in taskDetail');
            //     }
            // }),

    body('signature')
    .notEmpty()
    .withMessage('Signature is required')
    .custom((value) => {
        if (!isBase64Image(value)) {
            throw new Error('Signature must be a base64 encoded image string');
        }
        return true;
    }),
    //.if(body('latitude').exists());
    body("latitude").exists().withMessage("Latitude is required").trim()
    .notEmpty()
    .withMessage("Latitude is not allowed to be empty")
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),
    body("longitude").exists().withMessage("Longitude is required").trim()
        .notEmpty()
        .withMessage("Longitude is not allowed to be empty")
        .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),

    body('remark').if(body('remark').exists()).isLength({min:3 ,max: 150 }).trim().withMessage("Remark  should be between 3 to 150 characters.")
    .notEmpty()
    .withMessage('Remark is required')

  ],
  reject_job:[
    body("reason_reject","Reject Reason is required").exists().notEmpty().withMessage('Reject Reason is required')
    .isLength({min:3 ,max: 500 })
    .trim().withMessage("Name  should be between 3 to 500 characters.")
    

  ],
  

  
}
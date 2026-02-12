// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const contactUsFormModel = require("../../../models/contactUsFormModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");
const {sendFaqQueryToAdmin } =require("../../../utility/email")

exports.createContactUsForm = catchAsync(async (req, res, next) => {
    try {
        const body = req.body;
        let data = await contactUsFormModel.create(body);
         await sendFaqQueryToAdmin(body);
        return res.status(statusCodes.CREATED).json({
            status: "success",
            message: res.__("create_contact_us")
        });
    } catch (error) {
        console.log('=====error===',error)
        logger.errorlLog("Unable to create Contet", error);
        res.status(error.statusCode || statusCodes.INTERNAL_SERVER).send({ status: error.status, message: error.message });
    }
});

exports.getContactUsForm = catchAsync(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default limit
        const skip = (page - 1) * limit;
      let data = await contactUsFormModel.find().skip(skip)
      .limit(limit);
      const totalCount = await contactUsFormModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

      if (data.length === 0) {
        return res.status(statusCodes.NOT_FOUND).json({
          status: "error",
          message: res.__("no_record_found"),
          data: []
        });
      }
      return res.status(statusCodes.OK).json({
        status: "success",
        message: res.__("get_contact_information_listings"),
        data: data,
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
      });
    } catch (error) {
      logger.errorlLog("Unable to get Content", error);
      res
        .status(error.statusCode || statusCodes.INTERNAL_SERVER)
        .send({ status: error.status, message: error.message });
    }
  });

  exports.getContactUsFormByID = async (req,res,next) => {
    try {
      const id = req.params.id;
      let user = await contactUsFormModel.findById(id);
  
      if (!user) {
        return res.status(statusCodes.NOT_FOUND).json({
          status: "error",
          message: res.__("no_record_found"),
          data: null
        });
      }
  
      return res.status(statusCodes.OK).json({
        status: "success",
        message: res.__("get_contact_us"),
        data: user
      });
  
  
    } catch (error) {
      return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
        status: "error",
        message: error.message
      });
    }
  };


  exports.deleteByID = async (req,res,next) => {
    try {
      const id = req.params.id;
      const deletedContact = await contactUsFormModel.findByIdAndDelete(id);

      if (!deletedContact) {
        return res.status(statusCodes.NOT_FOUND).json({
            status: "error",
            message: res.__("no_record_found")
        });
    }

    return res.status(statusCodes.OK).json({
        status: true,
        message: res.__("deleted_contact_us_form")
    });
     
    } catch (error) {
      return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
        status: "error",
        message: error.message
      });
    }
  };
// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const faqModel = require("../../../models/faqModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");
// CONTROLLER
exports.create = catchAsync(async (req, res, next) => {
  try {
    const body = req.body;
    let existingFaq = await faqModel.findOne({
      question: body.question
    });

    if (existingFaq) {
      return res.status(statusCodes.CONFLICT).json({
        status: "error",
        message: res.__("question_already_exists")
      });
    }

    let data = await faqModel.create(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("create_faq")
    });
  } catch (error) {
    logger.errorlLog("Unable to create Faq", error);
      return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
        status: "error",
        message: error.message
      });
  }
});

exports.getAllFaq= async (req, res, next) => {
  try {
    
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;
    let user = await faqModel.find().skip(skip)
    .limit(limit);
    const totalCount = await faqModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    if (user.length === 0) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("no_record_found"),
        data: []
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("get_all_faq"),
      data: user,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit,
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

exports.getByID = async (req,res,next) => {
  try {
    const id = req.params.id;
    let user = await faqModel.findById(id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("no_record_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("get_faq"),
      data: user
    });


  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

  exports.update = async (req,res,next) => {
    try {
      const id = req.params.id;
      const { body } = req;
      console.log("body", body)
      
      let user = await faqModel.findByIdAndUpdate(id, body, { new: true });

      if (!user) {
        return res.status(statusCodes.NOT_FOUND).json({
          status: "error",
          message: res.__("no_record_found"),
          data: null
        });
      }
      
      return res.status(statusCodes.OK).json({
        status: "success",
        message: res.__("update_faq"),
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
      const deletedFaq = await faqModel.findByIdAndDelete(id);

      if (!deletedFaq) {
        return res.status(statusCodes.NOT_FOUND).json({
            status: "error",
            message: res.__("no_record_found")
        });
    }

    return res.status(statusCodes.OK).json({
        status: true,
        message: res.__("delete_faq")
    });
     
    } catch (error) {
      return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
        status: "error",
        message: error.message
      });
    }
  };

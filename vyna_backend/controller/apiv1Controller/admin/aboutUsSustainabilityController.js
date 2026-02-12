// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const aboutUsSustainabilityModel = require("../../../models/aboutUsSustainabilityModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");
// CONTROLLER
exports.create = catchAsync(async (req, res, next) => {
    try {
      const id = req.user._id;
      const body = req.body;
      body.createdBy = id;
     
      let check = await aboutUsSustainabilityModel.findById(id);

    //   console.log("Uploaded files:", req.files);
      if (req.files && req.files.length > 0) {
        body.image = req.files[0].location; // from S3
      } else if (check && check.image) {
        body.image = check.image;
      } else {
        body.image = "";
      }
      
      let data = await aboutUsSustainabilityModel.create(body);
  
      return res.status(statusCodes.CREATED).json({
        status: "success",
        message: "Data Created Successfully",
        data
      });
    } catch (error) {
    //   logger.errorLog("Unable to create Award", error);
      return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
        status: "error",
        message: error.message
      });
    }
  });

exports.getSustainability = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;
    let user = await aboutUsSustainabilityModel
      .find()
      .skip(skip)
      .limit(limit)
    //  .sort({ _id: -1 });
    const totalCount = await aboutUsSustainabilityModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    if (user.length === 0) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: []
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: "Get All Data Listing",
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit,
      data: user
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

exports.getByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await aboutUsSustainabilityModel.findById(id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: "Data details fetched successfully",
      data: user
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { body } = req;

   
    let check = await aboutUsSustainabilityModel.findById(id);

    console.log("Uploaded files:", req.files);
    if (req.files && req.files.length > 0) {
      body.image = req.files[0].location; // from S3
    } else if (check && check.image) {
      body.image = check.image;
    } else {
      body.image = "";
    }

    let user = await aboutUsSustainabilityModel.findByIdAndUpdate(id, body, {
      new: true
    });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: "Data Updated Successfully",
      data: user
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};




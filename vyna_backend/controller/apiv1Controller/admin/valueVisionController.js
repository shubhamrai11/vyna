// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const valueVisionModel = require("../../../models/valueVisionModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");

// CONTROLLER
exports.create = catchAsync(async (req, res, next) => {
  try {
    const id = req.user._id;
   // console.log("iddd", id);

    const body = req.body;
    body.createdBy = id;
    let existingvalueVision = await valueVisionModel.findOne({
        title: body.title
      });
  
      if (existingvalueVision) {
        return res.status(statusCodes.CONFLICT).json({
          status: "error",
          message: res.__("value_vision_already_exists")
        });
      }

    let check = await valueVisionModel.findById(id);
    // Ensure req.files exists and contains uploaded files
    if (req.files && req.files["icon"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.icon = req.files["icon"][0].location; // Get location of first avatar file
    } else if (!("icon" in body)) {
      body.icon = check.icon || "";
    }
    
    let data = await valueVisionModel.create(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("value_vision_created")
    });
  } catch (error) {
    logger.errorlLog("Unable to create User", error);
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
});

exports.getAllValueVision = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;
    let user = await valueVisionModel
      .find()
      .skip(skip)
      .limit(limit);
      // .sort({ _id: -1 });
    const totalCount = await valueVisionModel.countDocuments();
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
      message: res.__("value_vision_get_all_data"),
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
    let user = await valueVisionModel.findById(id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("get_value_vision"),
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
    let check = await valueVisionModel.findById(id);
    if (req.files && req.files["icon"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.icon = req.files["icon"][0].location; // Get location of first avatar file
    } else if (!("icon" in body)) {
      body.icon = check.icon || "";
    }

    let user = await valueVisionModel.findByIdAndUpdate(id, body, { new: true });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("value_vision_updated"),
      data: user
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

exports.deleteByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedCategory = await valueVisionModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }

    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("value_vision_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

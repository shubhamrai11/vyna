// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const ourPromiseModel = require("../../../models/ourPromiseModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");

// CONTROLLER
exports.create = catchAsync(async (req, res, next) => {
  try {
    const id = req.user._id;

    const body = req.body;
    body.createdBy = id;
    let existingOurPromise = await ourPromiseModel.findOne({
        heading: body.heading
    });

    if (existingOurPromise) {
      return res.status(statusCodes.CONFLICT).json({
        status: "error",
        message: res.__("our_promise_already_exists")
      });
    }

    let points = JSON.parse(req.body.points);

    if (req.files && req.files.pointIcons) {
        const pointFiles = req.files.pointIcons; 
      
        for (let i = 0; i < points.length; i++) {
          if (pointFiles[i]) {
            points[i].icon = pointFiles[i].location;
          }
        }
      }

    body.points = points;

    let data = await ourPromiseModel.create(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("our_promise_created")
    });
  } catch (error) {
    logger.errorlLog("Unable to create User", error);
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
});

exports.getAllOurPromise = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;
    let user = await ourPromiseModel
      .find()
      .skip(skip)
      .limit(limit);
      // .sort({ _id: -1 });
    const totalCount = await ourPromiseModel.countDocuments();
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
      message: res.__("our_promise_get_all_data"),
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
    let user = await ourPromiseModel.findById(id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("get_our_promise"),
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

    let points = JSON.parse(req.body.points);
    let existingPromise = await ourPromiseModel.findById(id);

    if (req.files && req.files.pointIcons) {
        const pointFiles = req.files.pointIcons;
  
        for (let i = 0; i < points.length; i++) {
          if (pointFiles[i]) {
            points[i].icon = pointFiles[i].location;
          } else if (
            existingPromise.points[i] && 
            existingPromise.points[i].icon
          ) {
            points[i].icon = existingPromise.points[i].icon;
          }
        }
      } else {
        for (let i = 0; i < points.length; i++) {
          if (existingPromise.points[i] && existingPromise.points[i].icon) {
            points[i].icon = existingPromise.points[i].icon;
          }
        }
      }

      body.points = points;


    let user = await ourPromiseModel.findByIdAndUpdate(id, body, {
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
      message: res.__("our_promise_updated"),
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
    const deletedCategory = await ourPromiseModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }

    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("our_promise_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};




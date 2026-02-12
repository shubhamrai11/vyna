// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const bannerModel = require("../../../models/bannerModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");
// CONTROLLER
exports.create = catchAsync(async (req, res, next) => {
  try {
    const id = req.user._id;
    console.log("iddd", id);

    const body = req.body;
    body.createdBy = id;

    let check = await bannerModel.findById(id);
    // Ensure req.files exists and contains uploaded files
    if (req.files && req.files["image"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.image = req.files["image"][0].location; // Get location of first avatar file
    } else if (!("image" in body)) {
      body.image = check.image || "";
    }

    let data = await bannerModel.create(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("banner_created")
    });
  } catch (error) {
    logger.errorlLog("Unable to create User", error);
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
});

exports.getAllBanner = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default limit
    const skip = (page - 1) * limit;
    let user = await bannerModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });
    const totalCount = await bannerModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    if (user.length === 0) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: []
      });
    }
    user.sort((a, b) => {
      const seqA = a.sequence != null ? Number(a.sequence) : Infinity;
      const seqB = b.sequence != null ? Number(b.sequence) : Infinity;
      return seqA - seqB;
    });

    // console.log('user------------------------', user)
    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("banner_all_listing"),
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
    let user = await bannerModel.findById(id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("banner_fetch_details"),
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
    let check = await bannerModel.findById(id);
    if (req.files && req.files["image"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.image = req.files["image"][0].location; // Get location of first avatar file
    } else if (!("image" in body)) {
      body.image = check.image || "";
    }

    let user = await bannerModel.findByIdAndUpdate(id, body, { new: true });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("banner_updated"),
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
    const deletedCategory = await bannerModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }

    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("banner_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

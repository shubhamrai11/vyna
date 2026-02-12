// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const categoryModel = require("../../../models/categoryModel");
const subCategoryModel = require("../../../models/subCategoryModel");
const productModel = require("../../../models/productModel");
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
    let existingCategory = await categoryModel.findOne({
      category_name: body.category_name
    });

    if (existingCategory) {
      return res.status(statusCodes.CONFLICT).json({
        status: "error",
        message: res.__("category_name_already_exists")
      });
    }
    let check = await categoryModel.findById(id);

    // Ensure req.files exists and contains uploaded files
    if (req.files && req.files["category_logo"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.category_logo = req.files["category_logo"][0].location; // Get location of first avatar file
    } else if (!("category_logo" in body)) {
      body.category_logo = check.category_logo || "";
    }
    if (req.files && req.files["category_banner"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.category_banner = req.files["category_banner"][0].location; // Get location of first avatar file
    } else if (!("category_banner" in body)) {
      body.category_banner = check.category_banner || "";
    }

    if (req.files && req.files["category_mobile_banner"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.category_mobile_banner =
        req.files["category_mobile_banner"][0].location; // Get location of first avatar file
    } else if (!("category_mobile_banner" in body)) {
      body.category_mobile_banner = check.category_mobile_banner || "";
    }

    if (req.files && req.files["image"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.image = req.files["image"][0].location; // Get location of first avatar file
    } else if (!("image" in body)) {
      body.image = check.image || "";
    }

    if (req.files && req.files["category_image"]) {
      // console.log("=====req.files.resume====", req.files["resume"]);
      body.category_image = req.files["category_image"][0].location;
    } else if (!("category_image" in body)) {
      body.category_image = check.category_image || "";
    }

    let data = await categoryModel.create(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("category_created")
    });
  } catch (error) {
    logger.errorlLog("Unable to create User", error);
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
});

exports.getAllCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;
    let user = await categoryModel.find().skip(skip).limit(limit);
    // .sort({ _id: -1 });
    const totalCount = await categoryModel.countDocuments();
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
      message: res.__("category_all_listing"),
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
    let user = await categoryModel.findById(id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("category_fetch_details"),
      data: user
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

exports.getCategoryByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log("id", id)
    let user = await subCategoryModel
      .find({ categoryId: id })
      .populate({ path: "categoryId", model: "category" });
    user.sort((a, b) => {
      const seqA = a.sequence !== undefined ? Number(a.sequence) : Infinity;
      const seqB = b.sequence !== undefined ? Number(b.sequence) : Infinity;
      return seqA - seqB; // smaller sequence comes first
    });
    // console.log("user-----------", user)

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("category_fetch_details"),
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

    let check = await categoryModel.findById(id);

    if (req.files && req.files["category_logo"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.category_logo = req.files["category_logo"][0].location; // Get location of first avatar file
    } else if (!("category_logo" in body)) {
      body.category_logo = check.category_logo || "";
    }
    if (req.files && req.files["category_image"]) {
      // console.log("=====req.files.resume====", req.files["resume"]);
      body.category_image = req.files["category_image"][0].location;
    } else if (!("category_image" in body)) {
      body.category_image = check.category_image || "";
    }
    if (req.files && req.files["category_banner"]) {
      // console.log("=====req.files.resume====", req.files["resume"]);
      body.category_banner = req.files["category_banner"][0].location;
    } else if (!("category_banner" in body)) {
      body.category_banner = check.category_banner || "";
    }

    if (req.files && req.files["category_mobile_banner"]) {
      // console.log("=====req.files.resume====", req.files["resume"]);
      body.category_mobile_banner =
        req.files["category_mobile_banner"][0].location;
    } else if (!("category_mobile_banner" in body)) {
      body.category_mobile_banner = check.category_mobile_banner || "";
    }

    if (req.files && req.files["image"]) {
      // console.log("=====req.files.resume====", req.files["resume"]);
      body.image = req.files["image"][0].location;
    } else if (!("image" in body)) {
      body.image = check.image || "";
    }

    let user = await categoryModel.findByIdAndUpdate(id, body, { new: true });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("category_updated"),
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
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }
    await productModel.deleteMany({ categoryId: id });
    await subCategoryModel.deleteMany({ categoryId: id });
    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("category_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

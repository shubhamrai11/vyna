// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const subcategoryModel = require("../../../models/subCategoryModel");
const productModel = require("../../../models/productModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");
// CONTROLLER
exports.create = catchAsync(async (req, res, next) => {
  try {
    const id = req.user._id;
    const body = req.body;

    body.createdBy = id;
    let existingCategory = await subcategoryModel.findOne({
      subCategoryName: body.subCategoryName
    });

    if (existingCategory) {
      return res.status(statusCodes.CONFLICT).json({
        status: "error",
        message: res.__("subcategory_name_already_exists")
      });
    }
    // Ensure req.files exists and contains uploaded files
    if (req.files && req.files["image"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.image = req.files["image"][0].location; // Get location of first avatar file
    }
    if (req.files && req.files["subCategory_banner"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.subCategory_banner = req.files["subCategory_banner"][0].location; // Get location of first avatar file
    }

    if (req.files && req.files["subCategory_mobile_banner"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.subCategory_mobile_banner =
        req.files["subCategory_mobile_banner"][0].location; // Get location of first avatar file
    }

    if (req.files && req.files["file"]) {
      body.file = req.files["file"][0].location;
    }

    let data = await subcategoryModel.create(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("subcategory_created")
    });
  } catch (error) {
    console.log("========error-----", error);
    logger.errorlLog("Unable to create User", error);
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
});

exports.getAllSubCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 100; // Default limit
    const skip = (page - 1) * limit;
    let user = await subcategoryModel
      .find()
      .skip(skip)
      .limit(limit)
      // .sort({ _id: -1 })
      .populate({ path: "categoryId", model: "category" });
    const totalCount = await subcategoryModel.countDocuments();
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
      message: res.__("subcategory_all_listing"),
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
    let user = await subcategoryModel
      .findById(id)
      .populate({ path: "categoryId", model: "category" });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("subcategory_fetch_details"),
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
    let check = await subcategoryModel.findById(id);
    if (req.files && req.files["image"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.image = req.files["image"][0].location; // Get location of first avatar file
    } else if (!("image" in body)) {
      body.image = check.image || "";
    }
    if (req.files && req.files["subCategory_banner"]) {
      // console.log("=======req.files.avatar====", req.files["avatar"]);
      body.subCategory_banner = req.files["subCategory_banner"][0].location; // Get location of first avatar file
    } else if (!("subCategory_banner" in body)) {
      body.subCategory_banner = check.subCategory_banner || "";
    }

    //mobile banner
    if (req.files && req.files["subCategory_mobile_banner"]) {
      //console.log("=======req.files.avatar====", req.files["avatar"]);
      console.log(
        ' req.files["subCategory_mobile_banner"][0].location; 0--',
        req.files["subCategory_mobile_banner"][0].location
      );
      body.subCategory_mobile_banner =
        req.files["subCategory_mobile_banner"][0].location; // Get location of first avatar file
    } else if (!("subCategory_mobile_banner" in body)) {
      body.subCategory_mobile_banner = check.subCategory_mobile_banner || "";
    }

    // file (PDF catalogue)
    if (req.files && req.files["file"]) {
      body.file = req.files["file"][0].location;
    } else if (!("file" in body)) {
      body.file = check.file || "";
    }

    let user = await subcategoryModel.findByIdAndUpdate(id, body, {
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
      message: res.__("subcategory_updated"),
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
    const deletedCategory = await subcategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }
    await productModel.deleteMany({ subCategoryId: id });
    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("subcategory_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

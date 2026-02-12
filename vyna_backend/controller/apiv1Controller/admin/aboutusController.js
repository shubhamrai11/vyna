// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const aboutusModel = require("../../../models/aboutModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");
// CONTROLLER

exports.create = catchAsync(async (req, res, next) => {
  try {
    const id = req.user._id;

    const body = req.body;
    body.createdBy = id;

    if (req.files && req.files.image && req.files.image.length > 0) {
      body.image = req.files.image.map((file) => ({ url: file.location }));
    } else {
      body.image = [];
    }

    let points = JSON.parse(req.body.aboutValues);

    if (req.files && req.files.pointIcons) {
      const pointFiles = req.files.pointIcons;

      for (let i = 0; i < points.length; i++) {
        if (pointFiles[i]) {
          points[i].icon = pointFiles[i].location;
        }
      }
    }

    body.aboutValues = points;

    let data = await aboutusModel.create(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("aboutus_created")
    });
  } catch (error) {
    logger.errorlLog("Unable to create User", error);
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
});

exports.getAllAboutUs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;
    let user = await aboutusModel
      .find()
      .skip(skip)
      .limit(limit)
    //  .sort({ _id: -1 });
    const totalCount = await aboutusModel.countDocuments();
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
      message: res.__("aboutus_all_listing"),
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
    let user = await aboutusModel.findById(id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("aboutus_fetch_details"),
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

    let check = await aboutusModel.findById(id);

    let existingImages = check.image || [];

    if (req.files && req.files.image && req.files.image.length > 0) {
      const newImages = req.files.image.map((file) => ({ url: file.location }));
      body.image = [...existingImages, ...newImages];
    } else {
      body.image = existingImages;
    }

    let points = JSON.parse(req.body.aboutValues);

    let existingData1 = check.aboutValues || [];

    if (req.files && req.files.pointIcons) {
      const pointFiles = req.files.pointIcons;

      for (let i = 0; i < points.length; i++) {
        if (pointFiles[i]) {
          points[i].icon = pointFiles[i].location;
        } else if (existingData1[i] && existingData1[i].icon) {
          points[i].icon = existingData1[i].icon;
        }
      }
    } else {
      for (let i = 0; i < points.length; i++) {
        if (existingData1[i] && existingData1[i].icon) {
          points[i].icon = existingData1[i].icon;
        }
      }
    }

    body.aboutValues = points;

    let user = await aboutusModel.findByIdAndUpdate(id, body, { new: true });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("aboutus_updated"),
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
    const deletedCategory = await aboutusModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }

    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("aboutus_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

exports.imageDeleteByID = async (req, res, next) => {
  try {
    const aboutUsId = req.params.id;
    const imageId = req.params.imageId;
    console.log("aboutUsId", aboutUsId);
    console.log("imageId", imageId);
    const deletedCategory = await aboutusModel.findByIdAndUpdate(
      aboutUsId,
      {
        $pull: { image: { _id: imageId } }
      },
      { new: true }
    );

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }

    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("image_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

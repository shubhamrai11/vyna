// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const awardModel = require("../../../models/awardModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const { UserError, UserNotFoundError } = require("../../../utility/error");
// CONTROLLER
exports.create = catchAsync(async (req, res, next) => {
    try {
      const id = req.user._id;
      const body = req.body;
      body.createdBy = id;
  
      if (req.files && req.files.award_image && req.files.award_image.length > 0) {
        body.award_image = req.files.award_image[0].location; 
      } else {
        body.award_image = "";
      }
  
     
      if (req.files && req.files.image) {
        body.image = req.files.image.map((file) => ({ url: file.location }));
      } else {
        body.image = [];
      }
  

      if (req.files && req.files.side_image) {
        body.side_image = req.files.side_image.map((file) => ({ url: file.location }));
      } else {
        body.side_image = [];
      }
  
      
      let data = await awardModel.create(body);
  
      return res.status(statusCodes.CREATED).json({
        status: "success",
        message: res.__("award_created"),
        data
      });
    } catch (error) {
      logger.errorLog("Unable to create Award", error);
      return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
        status: "error",
        message: error.message
      });
    }
  });

exports.getAward = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;
    let user = await awardModel
      .find()
      .skip(skip)
      .limit(limit)
   //   .sort({ _id: -1 });
    const totalCount = await awardModel.countDocuments();
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
      message: res.__("award_get_all_data"),
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
    let user = await awardModel.findById(id);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("get_award"),
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

   
    let check = await awardModel.findById(id);

    if (req.files && req.files.award_image && req.files.award_image.length > 0) {
        body.award_image = req.files.award_image[0].location;
      } else {
        body.award_image = check.award_image; 
      }
  
      let existingImages = check.image || [];
      if (req.files && req.files.image) {
        const newImages = req.files.image.map(file => ({ url: file.location }));
        body.image = [...existingImages, ...newImages];  
      } else {
        body.image = existingImages;
      }
  
      
      let existingSideImages = check.side_image || [];
      if (req.files && req.files.side_image) {
        const newSideImages = req.files.side_image.map(file => ({ url: file.location }));
        body.side_image = [...existingSideImages, ...newSideImages]; 
      } else {
        body.side_image = existingSideImages;
      }


    let user = await awardModel.findByIdAndUpdate(id, body, {
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
      message: res.__("award_updated"),
      data: user
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
  
      const awardId = req.params.id;
      const imageId = req.params.imageId;
      
      const deletedCategory = await awardModel.findByIdAndUpdate(
        awardId,
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

  exports.sideimageDeleteByID = async (req, res, next) => {
    try {
  
      const awardId = req.params.id;
      const imageId = req.params.sideimageId;
      
      const deletedCategory = await awardModel.findByIdAndUpdate(
        awardId,
        {
          $pull: { side_image: { _id: imageId } }
        },
        { new: true }
      );

      console.log("deletedCategory",deletedCategory)
  
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
  

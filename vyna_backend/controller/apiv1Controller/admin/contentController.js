const contentService = require("../../../service/apiv1Service/contentService");
const newletterModel = require("../../../models/newLetterModel");
const { statusCodes } = require("../../../utility/constant");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
const contentData = require("../../../models/contentModel");
const contactusModel = require("../../../models/contactusModel");
const { sendNewLetter } = require("../../../utility/email");

exports.list = catchAsync(async (req, res, next) => {
  try {
    let data = await contentData.find();
    if (data.length === 0) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("no_record_found"),
        data: []
      });
    }
    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("get_all_content"),
      data: data
    });
  } catch (error) {
    logger.errorlLog("Unable to get Content", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});

exports.createContent = catchAsync(async (req, res, next) => {
  try {
    const body = req.body;

    if (req.files && req.files.length > 0) {
      body.image = req.files.map((file) => file.location); // or file.filename if you store only name
    }
    // console.log("req.files",req.files)
    // console.log("rreq.files.length",req.files.length)

    // console.log("image",body.image)

    let checkData = await contentData.findOne({ role: body.role });

    if (checkData) {
      return res.status(statusCodes.CONFLICT).json({
        status: "error",
        // message: "Content already added."
        message: res.__("content_already_exists")
      });
    }

    let data = await contentService.createContent(body, res);
    res.status(statusCodes.CREATED).json(data);
  } catch (error) {
    console.log("=====error===", error);
    logger.errorlLog("Unable to create Contet", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});

exports.getByID = catchAsync(async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = await contentService.getByID(id, res);
    res.status(statusCodes.OK).json(data);
  } catch (error) {
    logger.errorlLog("Unable to get Content", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});

exports.update = catchAsync(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { body } = req;
    if (req.files && req.files.length > 0) {
      body.image = req.files.map((file) => file.location); // or file.filename if you store only name
    }
    logger.infoLog(`FrontEnd Body: ${JSON.stringify(body)}`);
    const content = await contentData.findOne({ _id: id });
    if (!content) {
      return res.send(statusCodes.EXPECTATION_FAILED, {
        status: false,
        // message: "Invalid Content Id"
        message: res.__("content_already_exists")
      });
    }
    // if (body.title && (content.title != body.title)) {
    //     body.key = convertToSlug(body.title)
    // }

    logger.infoLog(`Updating Content Record with id: ${JSON.stringify(id)}`);
    let data = await contentService.update(id, body, res);
    logger.infoLog(`Content Updated with id: ${JSON.stringify(id)}`);
    res.status(statusCodes.ACCEPTED).json(data);
  } catch (error) {
    logger.errorlLog("Unable to update Content", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});

exports.deleteByID = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.infoLog(`Deleting Content Record with Id: ${JSON.stringify(id)}`);

    let data = await contentService.deleteByID(id, res);
    logger.infoLog(`Contednt deleted with Id: ${JSON.stringify(id)}`);

    res.status(statusCodes.OK).json(data);
  } catch (error) {
    logger.errorlLog("Unable to delete Content", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});
//new
exports.createNewLetter = catchAsync(async (req, res, next) => {
  try {
    const body = req.body;

    let checkData = await newletterModel.findOne({ email: body.email });

    if (checkData) {
      return res.status(statusCodes.CONFLICT).json({
        status: "error",
        message: res.__("new_letter_already_exists")
      });
    }

    let data = await newletterModel.create(body);
    await sendNewLetter(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("new_letter_created")
    });
  } catch (error) {
    console.log("=====error===", error);
    logger.errorlLog("Unable to create Contet", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});

exports.getAllNewLetter = catchAsync(async (req, res, next) => {
  try {
    let data = await newletterModel.find();
    if (data.length === 0) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("no_record_found"),
        data: []
      });
    }
    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("new_letter_get_all_listing"),
      data: data
    });
  } catch (error) {
    logger.errorlLog("Unable to get Content", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});

exports.deleteNewLetterByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedCategory = await newletterModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }

    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("new_letter_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

exports.createContactUs = catchAsync(async (req, res, next) => {
  try {
    const body = req.body;
    let data = await contactusModel.create(body);
    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("create_contact_us")
    });
  } catch (error) {
    console.log("=====error===", error);
    logger.errorlLog("Unable to create Contet", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});

exports.getContactUs = catchAsync(async (req, res, next) => {
  try {
    let data = await contactusModel.find();
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
      data: data
    });
  } catch (error) {
    logger.errorlLog("Unable to get Content", error);
    res
      .status(error.statusCode || statusCodes.INTERNAL_SERVER)
      .send({ status: error.status, message: error.message });
  }
});

exports.getContactUsByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await contactusModel.findById(id);

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

exports.updateContactUs = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { body } = req;
    console.log("body", body);

    let user = await contactusModel.findByIdAndUpdate(id, body, { new: true });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("no_record_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("update_contact_us"),
      data: user
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

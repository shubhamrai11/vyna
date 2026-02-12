const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// USER DEFINED FUNCTION
const { UserError, UserNotFoundError } = require("../../utility/error");
const { PageNotFoundError } = require("../../utility/commonError");
const { statusCodes } = require("../../utility/constant");
const i18n = require("../../translation");
const contentData = require("../../models/contentModel");

exports.list = async (pagination) => {
  // let query = projectModel.find().sort({ updatedAt: -1 });
  let query = contentData.find({}).sort({ updatedAt: -1 });
  const page = pagination.currentPage;
  const limit = pagination.docPerPageCount * 1 || 50;
  const skip = page * limit;
  query = query.skip(skip).limit(limit);

  pagination.totalDocCount = await contentData.countDocuments({});
  if (pagination.totalCount === 0) {
    return {
      status: true,
      message: "No Records Found",
      data: [],
      meta: {
        pagination: pagination,
        field: "createdAt",
        rowIds: "",
      },
    };
  }
  pagination.totalPageCount = Math.ceil(pagination.totalCount / limit);
  if (page > pagination.totalPageCount) {
    throw new PageNotFoundError("This page dose not exist");
  }

  let pages = await query;

  return {
    status: "success",
    message: "Got All Pages",
    data: pages,
    meta: {
      pagination: pagination,
      field: "createdAt",
      rowIds: "",
    },
  };
};

exports.createContent = async (body,res) => {
  try {
    // console.log('body---', body);
    let project = await contentData.create(body);

    return {
      status: true,
      // message: `Content Created Successfully`,
      message: res.__("content_created_successfully"),
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.getByID = async (id,res) => {
  try {
    let user = await contentData.findById(id).then();
    if (user === null) {
      throw new UserNotFoundError("Content not found");
    }
    return {
      status: true,
      // message: `Get Content`,
      message: res.__("get_content"),
      data: user,
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.update = async (id, userBody,res) => {
  try {
    const userToUpdate = new contentData(userBody);
    const docInfo = userToUpdate.toObject();
    delete docInfo._id;
    delete docInfo.id;

    let content = await contentData
      .findByIdAndUpdate(id, docInfo, { new: true })
      .then();

    if (content === null) {
      throw new UserNotFoundError("Content not found");
    }
    return {
      status: true,
      // message: "Content Updated Successfully",
      message: res.__("content_updated_successfully"),
      data: content,
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.deleteByID = async (id,res) => {
  try {
    await contentData.findByIdAndDelete(id).then();
    return {
      status: true,
      // message: "Content Deleted Successfully",
      message: res.__("content_deleted_successfully"),
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

exports.getByKey = async (id) => {
  try {
    let data = await contentData.findOne({ key: id }).then();

    return {
      status: true,
      message: "Content Found Successfully",
      data: data,
    };
  } catch (error) {
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

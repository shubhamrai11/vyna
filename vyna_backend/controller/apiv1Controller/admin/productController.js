// USER DEFINED MIDDLEWARES
const { statusCodes } = require("../../../utility/constant");
const productModel = require("../../../models/productModel");
const subCategoryModel = require("../../../models/subCategoryModel");
const logger = require("../../../utility/coustomLogger");
const catchAsync = require("../../../utility/catchAsync");
// const pdf = require("html-pdf");
const pdf = require("html-pdf-node");
const axios = require('axios');
 


const { UserError, UserNotFoundError } = require("../../../utility/error");
// CONTROLLER
exports.create = catchAsync(async (req, res, next) => {
  try {
    const id = req.user._id;
    const body = req.body;
    body.createdBy = id;

    //  Parse JSON strings first
    if (body.specification) {
      body.specification = JSON.parse(body.specification);
    }
    if (body.color) {
      body.color = JSON.parse(body.color);
    }
    if (body.colorTemperature) {
      body.colorTemperature = JSON.parse(body.colorTemperature);
    }

    //  Check if product already exists
    const existingProduct = await productModel.findOne({
      productName: body.productName
    });
    if (existingProduct) {
      return res.status(statusCodes.CONFLICT).json({
        status: "error",
        message: res.__("product_name_already_exists")
      });
    }

    // Handle product image(s)
    if (req.files?.image) {
      body.image = req.files.image.map((file) => ({ url: file.location }));
    } else {
      body.image = [];
    }
    if (req.files?.image1) {
      body.image1 = req.files.image1.map((file) => ({ url: file.location }));
    } else {
      body.image1 = [];
    }
    //  Handle colorTemperatureImages
    // console.log('======req.files?.colorTemperatureImages========',req.files?.colorTemperatureImages)
    if (
      req.files?.colorTemperatureImages &&
      Array.isArray(body.colorTemperature)
    ) {
      const ctImages = req.files.colorTemperatureImages.map((file) => ({
        url: file.location
      }));

      //  Attach image URLs to corresponding colorTemperature items
      body.colorTemperature = body.colorTemperature.map((ct, index) => ({
        ...ct,
        image: ctImages[index]?.url || null
      }));
    } else if (Array.isArray(body.colorTemperature)) {
      // Set null if no images provided
      body.colorTemperature = body.colorTemperature.map((ct) => ({
        ...ct,
        image: null
      }));
    }
    //console.log('colorTemperature---------',body.colorTemperature)
    // Create product
    const data = await productModel.create(body);

    return res.status(statusCodes.CREATED).json({
      status: "success",
      message: res.__("product_created")
    });
  } catch (error) {
    logger.errorlLog("Unable to create Product", error);
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
});

exports.getAllProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 50; // Default limit
    const skip = (page - 1) * limit;
    let user = await productModel
      .find()
      .skip(skip)
      .limit(limit)
      // .sort({ _id: -1 })
      .populate([
        { path: "categoryId", model: "category" },
        { path: "subCategoryId", model: "sub_category" }
      ]);
    const totalCount = await productModel.countDocuments();
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
      message: res.__("product_all_listing"),
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
    let user = await productModel.findById(id).populate([
      { path: "categoryId", model: "category" },
      { path: "subCategoryId", model: "sub_category" }
    ]);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("product_fetch_details"),
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
    const body = req.body;

    // Parse JSON strings (if provided)
    if (body.specification) body.specification = JSON.parse(body.specification);
    if (body.color) body.color = JSON.parse(body.color);
    if (body.colorTemperature)
      body.colorTemperature = JSON.parse(body.colorTemperature);

    // Fetch existing product
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    // Handle existing + new images
    const existingImages = existingProduct.image || [];
    const existingImages1 = existingProduct?.image1 || [];

    if (req.files?.image) {
      const newImages = req.files.image.map((file) => ({ url: file.location }));
      body.image = [...existingImages, ...newImages];
    } else {
      body.image = existingImages;
    }
    if (req.files?.image1) {
      const newImages = req.files.image1.map((file) => ({
        url: file.location
      }));
      //  console.log('============newImages=====',newImages)
      body.image1 = [...existingImages1, ...newImages];
    } else {
      body.image1 = existingImages1;
    }
    // Handle colorTemperature images
    if (
      req.files?.colorTemperatureImages &&
      Array.isArray(body.colorTemperature)
    ) {
      const ctImages = req.files.colorTemperatureImages.map((file) => ({
        url: file.location
      }));

      // Merge new images with corresponding colorTemperature entries
      body.colorTemperature = body.colorTemperature.map((ct, index) => ({
        ...ct,
        image: ctImages[index]?.url || ct.image || null
      }));
    } else if (Array.isArray(body.colorTemperature)) {
      // Retain existing images if not updated
      body.colorTemperature = body.colorTemperature.map((ct, index) => {
        const existingCT = existingProduct.colorTemperature?.[index];
        return {
          ...ct,
          image: existingCT?.image || null
        };
      });
    }

    // Perform update
    const updatedProduct = await productModel
      .findByIdAndUpdate(id, body, {
        new: true
      })
      .populate([
        { path: "categoryId", model: "category" },
        { path: "subCategoryId", model: "sub_category" }
      ]);

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("product_updated"),
      data: updatedProduct
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
    const deletedCategory = await productModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found")
      });
    }

    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("product_deleted")
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

exports.changeHighlightProductStatus = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await productModel.findOne({ _id: id });

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("no_record_found")
      });
    }

    const newStatus = !user.highlightProduct;

    const updateStatus = await productModel.findByIdAndUpdate(
      id,
      { $set: { highlightProduct: newStatus } },
      { new: true }
    );

    return res.status(statusCodes.OK).json({
      status: true,
      message: res.__("highlight_product_status_change"),
      data: updateStatus
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
    const producrId = req.params.id;
    const imageId = req.params.imageId;
    // console.log("producrId", producrId);
    // console.log("imageId", imageId);
    const deletedCategory = await productModel.findByIdAndUpdate(
      producrId,
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
exports.image1DeleteByID = async (req, res, next) => {
  try {
    const producrId = req.params.id;
    const imageId = req.params.imageId;
    // console.log("producrId", producrId);
    // console.log("imageId", imageId);
    const deletedCategory = await productModel.findByIdAndUpdate(
      producrId,
      {
        $pull: { image1: { _id: imageId } }
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

// exports.getAllHighlighProduct = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const limit = parseInt(req.query.limit) || 20; // Default limit
//     const skip = (page - 1) * limit;
//     let user = await productModel
//       .find({ "highlightProduct": true })
//       .skip(skip)
//       .limit(limit)
//       .sort({ _id: -1 }).populate([{ path: "categoryId", model: "category" }, { path: "subCategoryId", model: "sub_category" }]);
//     const totalCount = await productModel.find({ "highlightProduct": true }).countDocuments();
//     const totalPages = Math.ceil(totalCount / limit);

//     if (user.length === 0) {
//       return res.status(statusCodes.NOT_FOUND).json({
//         status: "error",
//         message: res.__("data_not_found"),
//         data: []
//       });
//     }

//     return res.status(statusCodes.OK).json({
//       status: "success",
//       message: res.__("product_all_listing"),
//       currentPage: page,
//       totalPages: totalPages,
//       totalCount: totalCount,
//       limit: limit,
//       data: user
//     });
//   } catch (error) {
//     return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
//       status: "error",
//       message: error.message
//     });
//   }
// };

exports.getAllHighlighProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default limit
    const skip = (page - 1) * limit;

    let user = await productModel
      .find({ highlightProduct: true })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 }) // 👈 Sort by updated_at (latest first)
      .populate([
        { path: "categoryId", model: "category" },
        { path: "subCategoryId", model: "sub_category" }
      ]);

    const totalCount = await productModel.countDocuments({
      highlightProduct: true
    });
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
      message: res.__("product_all_listing"),
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

exports.searchAllProduct = catchAsync(async (req, res, next) => {
  try {
    const searchKey = req.params.searchKey;

    if (!searchKey) {
      return res.status(statusCodes.BAD_REQUEST).json({
        status: "error",
        message: res.__("empty_searchKey")
      });
    }
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;
    const products = await productModel
      .find({ productName: { $regex: new RegExp(searchKey, "i") } })
      .populate([
        { path: "categoryId", model: "category" },
        { path: "subCategoryId", model: "sub_category" }
      ])
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    const totalCount = await productModel.countDocuments({
      productName: { $regex: new RegExp(searchKey, "i") }
    });
    const totalPages = Math.ceil(totalCount / limit);

    if (products.length > 0) {
      return res.status(statusCodes.OK).json({
        status: true,
        message: res.__("search_all_product"),
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        data: products
      });
    } else {
      return res.status(statusCodes.NOT_FOUND).json({
        status: false,
        message: res.__("no_record_found"),
        data: []
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(e.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: e.message
    });
  }
});

exports.getSubCategoryByID = async (req, res, next) => {
  try {
    const id = req.params.id;

    let user = await productModel.find({ subCategoryId: id }).populate([
      { path: "categoryId", model: "category" },
      { path: "subCategoryId", model: "sub_category" }
    ]);
    console.log("user", user);

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("product_all_listing"),
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

    let user = await productModel.find({ categoryId: id }).populate([
      { path: "categoryId", model: "category" },
      { path: "subCategoryId", model: "sub_category" }
    ]);
    // console.log("user", user)

    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({
        status: "error",
        message: res.__("data_not_found"),
        data: null
      });
    }

    return res.status(statusCodes.OK).json({
      status: "success",
      message: res.__("product_all_listing"),
      data: user
    });
  } catch (error) {
    return res.status(error.statusCode || statusCodes.INTERNAL_SERVER).json({
      status: "error",
      message: error.message
    });
  }
};

async function getImageAsBase64(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const mimeType = response.headers['content-type'];
    const base64 = Buffer.from(response.data).toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.error('❌ Error converting image to base64:', err.message);
    return null;
  }
}

exports.renderTicketPage = async (req, res) => {
  try {
    const { newid } = req.params;
    const ticket = await productModel.findById(newid).populate([
      { path: "categoryId", model: "category" },
      { path: "subCategoryId", model: "sub_category" }
    ]);



    if (!ticket) {
      return res.status(404).send("<h2>Product Specification not found</h2>");
    }

    // Extract specifications (array of objects)
    const specs = ticket.specification || [];

    // Helper function → join all values of a key from specs
    // const joinValues = (key) =>
    //   specs.map(opt => opt[key] || "").filter(Boolean).join(" / ");

    const joinValues = (key) => {
      const values = specs.map((opt) => opt[key] || "").filter(Boolean);
      return [...new Set(values)].join(" / "); // remove duplicates
    };

    // Fields mapping: label -> key
    const fields = [
      { label: "Rated Wattage", key: "ratedWattage" },
      { label: "Lumen", key: "lumen" },
      { label: "Power Factor", key: "powerFactor" },
      { label: "Colour Temperature", key: "colourTemperature" },
      { label: "Shape", key: "shape" },
      { label: "Cut-Out Size (mm)", key: "cutOutSizeInmm" },
      { label: "Beam Angle", key: "beamAngle" },
      { label: "Housing", key: "housing" },
      { label: "Length (mm)", key: "lengthInMm" },
      { label: "Width (mm)", key: "widthInMm" },
      { label: "Protection Class", key: "protectionClass" },
      { label: "CRI", key: "cri" },
      { label: "Base", key: "base" },
      { label: "Lumen (AC)", key: "lumenAC" },
      { label: "Lumen (DC)", key: "lumenDC" },
      { label: "Standard Pkg", key: "stdPkg" },
      { label: "Breaking Capacity", key: "breaking_capacity" },
      { label: "MCB Type", key: "MCB_type" },
      { label: "Curve", key: "curve" },
      { label: "Pole", key: "pole" },
      { label: "Ampere", key: "ampere" },
      { label: "Sensitivity", key: "sensitivity" },
      { label: "Door Type", key: "door_type" },
      { label: "DB Type", key: "DB_type" },
      { label: "Phase", key: "phase" },
      { label: "Number of Way", key: "number_of_way" },
      { label: "Module", key: "module" },
      { label: "Type", key: "type" },

      { label: "Standard Conformity", key: "standardConformity" },
      { label: "No. of Pole", key: "noOfPole" },
      { label: "Magnetic Release Setting", key: "magneticReleaseSetting" },
      { label: "Method of Mounting", key: "methodOfMounting" },
      { label: "Rated Operational Voltage", key: "ratedOperationalVoltage" },
      { label: "Rated Current", key: "ratedCurrent" },
      { label: "Rated Frequency", key: "ratedFrequency" },
      {
        label: "Rated Short Circuit Capacity",
        key: "ratedShortCircuitCapacity"
      },
      { label: "Max Value of I²t", key: "maxValueOfI2t" },
      { label: "Rated Insulation Voltage", key: "ratedInsulationVoltage" },
      {
        label: "Rated Impulse Withstands Voltage",
        key: "ratedImpulseWithstandsVoltage"
      },
      { label: "Material Group", key: "materialGroup" },
      { label: "IP Category", key: "ipCategory" },
      { label: "Ambient Temp", key: "ambientTemp" },
      { label: "Tightening Torque", key: "tighteningTorque" },
      { label: "Dielectric Test Voltage", key: "dielectricTestVoltage" },
      { label: "Energy Limiting Class", key: "energyLimitingClass" },
      { label: "Vibration", key: "vibration" },
      { label: "Installation Position", key: "installationPosition" },
      { label: "Bi-Connect Terminal", key: "biConnectTerminal" },
      {
        label: "Line & Load Terminal Capacity",
        key: "lineAndLoadTerminalCapacity"
      },
      { label: "Resistance to Shock", key: "resistanceToShock" },
      {
        label: "Endurance (Mechanical & Electrical Cycles)",
        key: "enduranceMechanicalElectricalCycles"
      }
    ];
    for (const img of ticket.image || []) {
  const base64 = await getImageAsBase64(img.url);
  img.base64 = base64;
}
    // Generate dynamic rows

    const specRows = fields
      .map((f) => {
        const value = joinValues(f.key);
        return value ? `<tr><td>${f.label}</td><td>${value}</td></tr>` : "";
      })
      .join("");

    // Response → HTML with dynamic table

    const htmlContent =`
      <html>
        <head>
         <title>${ticket.productName} - Product Details</title>
          <style>
            body {
              font-family: 'Poppins', sans-serif;
              background: #e9f0f7;
              margin: 0;
            }
            .ticket {
              background: #ffffff;
              max-width: 1000px;
              margin: auto;
              padding: 5px;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.15);
              border-top: 6px solid #007BFF;
            }
            h3 {
              color: #007BFF;
              border-bottom: 2px solid #007BFF;
              padding-bottom: 0px;
              margin-top: 40px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 15px;
              border-radius: 8px;
              overflow: hidden;
            }
            th, td {
              border: 1px solid #dcdcdc;
              padding: 3px 0px;
              text-align: center;
            }
            th {
              background-color: #f0f8ff;
              color: #003e7e;
              font-weight: 600;
            }
            tr:nth-child(even) td {
              background-color: #f9fcff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            
            .qr-right {
              text-align: center;
            }
            
            
            .qr-right .qr-link {
              display: block;
              font-size: 10px;
              color: #007BFF;
              text-decoration: none;
              word-break: break-all;
            }
            .qr-right .qr-link:hover {
              text-decoration: underline;
            }
            
          </style>
        </head>
        <body>
          <div class="ticket">
           <div class="header">
           <div class="logo-left">
                     <img  style="max-width:150px; height:auto;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABcgAAAGVCAYAAADKaBJBAAAACXBIWXMAABYlAAAWJQFJUiTwAAA51GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDI1LTA4LTA1VDE4OjQyOjEwKzA1OjMwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjUtMDgtMDVUMTg6NDQ6MDErMDU6MzA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDI1LTA4LTA1VDE4OjQ0OjAxKzA1OjMwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmUwYzNlMjE3LTgxMmYtMTA0My04NzViLTNhZjk1ZjRhNmVmNTwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDozNDVmNWQyMy1hYTlhLTc1NGQtOTRmZS0xODhkMzJhNTA0YmI8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDozNDVmNWQyMy1hYTlhLTc1NGQtOTRmZS0xODhkMzJhNTA0YmI8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MzQ1ZjVkMjMtYWE5YS03NTRkLTk0ZmUtMTg4ZDMyYTUwNGJiPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDI1LTA4LTA1VDE4OjQyOjEwKzA1OjMwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplMGMzZTIxNy04MTJmLTEwNDMtODc1Yi0zYWY5NWY0YTZlZjU8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjUtMDgtMDVUMTg6NDQ6MDErMDU6MzA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+MTQ0MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MTQ0MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTQ4MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40MDU8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PqNKA2kAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAXXJJREFUeNrs3T1yI0mWIOA3aa0z9wTkaNDIOQHZ2ipryTGDBIXoExTqBBl5gkKeoCIVSDAbpK2yWpMnGFKDtuQJljxBr8BgVVZV/pBEAPDn8X1maT273SQ93CP858UL93/717/+FQAAAAAAMDRvVAEAAAAAAEMkQA4AAAAAwCAJkAMAAAAAMEgC5AAAAAAADJIAOQAAAAAAgyRADgAAAADAIAmQAwAAAAAwSALkAAAAAAAMkgA5AAAAAACDJEAOAAAAAMAgCZADAAAAADBIf+vrF/3Pn/+X2oRnWCzXZ2qhSveT8ehaNYC+eYuuJ+PRvdYaxP34NiJOSi/nZDy6fMW1HUXEUdKm8Qx6pvbhdjIe3W6xbkp/Jj13OZ6xk4h4W8tYRbH3WcY5hD5sh/7PL//71T/7tx5v1GlE/Ko5ivR3g0JRE4d/qolq21cl8Br/mIxHrWrYuyYiTgsv48eImGmqQThPMK++e+Ui9SjxXOgqIs7cnim1EfEuadn/MyJu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" class="logo" />
         </div>
         <div class="qr-right">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOZSURBVO3BQY7kSAIDQfeA/v9lbh/mwJMAIZW1NT00M38w84/DTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNMufiQyk9KwhMqLQlNpSWhqbQkNJWWhKbyk5LwicNMOcyUw0y5eFkS3qTyhModlZaEptKS0FRaEp5IwptU3nSYKYeZcpgpF1+m8kQSnlC5k4Sm0lRaEp5QaUl4QuWJJHzTYaYcZsphplz85VSeUPkvO8yUw0w5zJSLv0wS7qi0JDSVloQ7Kn+Tw0w5zJTDTLn4siT8P6k8kYQ7Km9Kwm9ymCmHmXKYKRcvU/nNktBUWhKaSktCU3lC5Tc7zJTDTDnMlIsPJeE3UWlJ+KYk3EnCv8lhphxmymGmXHxIpSWhqbwpCS0JTeUTKndUWhLuqLwpCd90mCmHmXKYKRcfSkJTuZOEOyotCU3lEyp3kvCEyp0kNJWWhCdUWhLedJgph5lymCkXX5aEptKS0JLQVO4koal8QqUloancScKdJDSVO0m4o9KS8InDTDnMlMNMufjlktBUnlBpSXhC5QmVJ5LwRBKaypsOM+UwUw4z5eKHJaGptCQ0lTsqb1JpSWgqLQlN5QmVloSm8pMOM+UwUw4z5eJDKm9SaUl4QqUl4Y7KE0loKi0Jd1RaEppKS0JTaUl402GmHGbKYaZcvCwJTaUl4U4Smso3JaGpNJU7SWgqLQl3VD6h0pLwicNMOcyUw0y5+LIk3ElCU2lJaCotCU3lCZWWhDsqTaUl4RNJuJOEpvKmw0w5zJTDTLn4ZZLQVO6otCR8QuVOEppKU3mTSktCS8KbDjPlMFMOM8X8wb+Yyp0kvEnlThKeULmThJ90mCmHmXKYKRcfUvlJSWhJeELliSS0JDSVOyotCXeS0FSeSMInDjPlMFMOM+XiZUl4k8odlZaEpnInCXdUWhKeSMITKi0Jd1TedJgph5lymCkXX6byRBLelISm0lSeULmj8okkNJWWhJaENx1mymGmHGbKxV9GpSWhJaGp3EnCEyp3ktBUmsodlTtJ+MRhphxmymGmXPzHJaGpNJWWhDtJeCIJTeVOEprKmw4z5TBTDjPl4suS8E1JeFMSmkpTuZOEpvKJJPykw0w5zJTDTLl4mcpPUrmThKbyiSTcUXmTyk86zJTDTDnMFPMHM/84zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlP8BNrSBSwNl7VkAAAAASUVORK5CYII=" 
         style="max-width:55px; height:auto; margin-left:250px" />
         <a href="https://www.vynaelectric.com/" target="_blank" class="qr-link" style="margin-left: 250px">
         www.vynaelectric.com
    </a>
  </div>
  </div>
            <div class="product-info">
              <h1><img src="${
               ticket.image?.[0]?.base64 || "" }"
                 style="width:150px;"></h1>
              <h1 style="font-size:25px; font-weight: 600;">${ticket.productName}</h1>
              <p><strong>Category:</strong> ${
                ticket.categoryId.category_name
              }</p>
              <p><strong>Subcategory:</strong> ${
                ticket.subCategoryId.subCategoryName
              }</p>
            </div>
            
            <div class="section">
              <h3 style= "font-size: 25px">Description</h3>
              <p>${ticket.description || "No description available."}</p>
            </div>
            
            <div class="section">
              <h3 style= "font-size: 25px">Specifications</h3>
              <table>
                <thead>
                  <tr>
                    <th>Details</th>
                    <th>${ticket.productName}</th>
                  </tr>
                </thead>
                <tbody>
                  ${specRows}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;
    // const options = { format: "A3", border: "10mm" };
 
    // pdf.create(htmlContent, options).toStream((err, stream) => {
    //   if (err) {
    //     console.error("PDF generation error:", err);
    //     return res.status(500).send("Error generating PDF");
    //   }
    //   res.setHeader(
    //     "Content-Disposition",
    //     `attachment; filename="${ticket.productName}.pdf"`
    //   );
    //   res.setHeader("Content-Type", "application/pdf");
    //   stream.pipe(res);
    // });

    // const file = { content: htmlContent };
    // const options = { format: "A3", margin: { bottom: "10mm" } };
 
    // const pdfBuffer = await pdf.generatePdf(file, options);
 
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   `inline; filename="${ticket.productName}.pdf"`
    // );
    // res.end(pdfBuffer);
     
    
    res.status(200).json({
      status: true,
      message: "HTML generated successfully",
      html: htmlContent
    });
  } catch (err) {
    console.error("Ticket rendering error:", err);
    res.status(500).send("Error loading ticket page");
  }
};

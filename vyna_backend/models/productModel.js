const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const category = require("./categoryModel");
const subCategory = require("./subCategoryModel");
const users = require("./userModel");

const imageSchema = new Schema(
  {
    url: { type: String, required: [true, "Image URL is required"] }
  },
  { _id: true } // ✅ each image gets its own _id
);

const productSchema = new Schema(
  {
    productName: {
      type: String
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: category
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: subCategory
    },
    image: [imageSchema],
    description: {
      type: String
    },
    short_description: {
      type: String
    },
    specification: [
      {
        ratedWattage: { type: String },
        lumen: { type: String },
        lumenAC: { type: String },
        lumenDC: { type: String },
        shape: { type: String },
        cutOutSizeInmm: { type: String },
        powerFactor: { type: String },
        colourTemperature: { type: String },
        housing: { type: String },
        beamAngle: { type: String },
        swivelArrangement: { type: String },
        price: { type: String },
        availableQuantity: { type: String },
        // New keys
        lengthInMm: { type: String },
        widthInMm: { type: String },
        base: { type: String },
        protectionClass: { type: String },
        cri: { type: String },
        stdPkg: { type: String },
        breaking_capacity: { type: String },
        MCB_type: { type: String },
        curve: { type: String },
        pole: { type: String },
        ampere: { type: String },
        sensitivity: { type: String },
        door_type: { type: String },
        DB_type: { type: String },
        phase: { type: String },
        number_of_way: { type: String },
        module: { type: String },
        type: { type: String },

        // 📌 New fields from your image
        standardConformity: { type: String },
        noOfPole: { type: String },
        magneticReleaseSetting: { type: String },
        methodOfMounting: { type: String },
        ratedOperationalVoltage: { type: String },
        ratedCurrent: { type: String },
        ratedFrequency: { type: String },
        ratedShortCircuitCapacity: { type: String },
        maxValueOfI2t: { type: String },
        ratedInsulationVoltage: { type: String },
        ratedImpulseWithstandsVoltage: { type: String },
        materialGroup: { type: String },
        ipCategory: { type: String },
        ambientTemp: { type: String },
        tighteningTorque: { type: String },
        dielectricTestVoltage: { type: String },
        energyLimitingClass: { type: String },
        vibration: { type: String },
        installationPosition: { type: String },
        biConnectTerminal: { type: String },
        lineAndLoadTerminalCapacity: { type: String },
        resistanceToShock: { type: String },
        enduranceMechanicalElectricalCycles: { type: String },
        isDeleted: { type: Boolean, default: false }
      }
    ],
    keyFeatures: { type: String },
    color: [
      {
        name: { type: String },
      }
    ],
    colorTemperature: [
      {
        watt: { type: String },
        image: {
          type: String
        }
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false
    },
    highlightProduct: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.ObjectId,
      required: true,
      ref: users
    },
    updatedBy: {
      type: mongoose.ObjectId,
      ref: users
    },
    image1: [imageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);

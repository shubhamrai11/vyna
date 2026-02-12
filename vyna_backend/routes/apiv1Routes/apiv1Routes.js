const express = require("express");
const router = express.Router();
// const userRegistryRouter = require("./userRoutes");
const adminAuthController = require("./adminAuthRoutes");
const categoryController = require("./adminCategoryRoutes");
const subcategoryController = require("./adminSubCategoryRoutes");
const faqController = require("./adminFaqRoutes");
const bannerController = require("./adminBannerRoutes");
const aboutusController = require("./adminAboutusRoutes");
const productController = require("./adminProductRoutes");
const contentController = require("./adminContentRoutes");
const ourPromiseController = require("./adminOurPromiseRoutes");
const valueVisionController = require("./adminValueVisionRoutes");
const awardController = require("./adminAwardRoutes");
const adminContactUsFormController = require("./adminContactUsFormRoutes");
const faqAskQuesController = require("./faqAskQuesRoutes");
const adminCmsBannerRoutes = require("./adminCmsBannerRoutes");
const adminHomeWhoWeAreRoutes = require("./adminHomeWhoWeAreRoutes");
const adminAboutUsSustainabilityRoutes = require("./adminAboutUsSustainabilityRoutes");

router.use("/admin", adminAuthController);
router.use("/category", categoryController);
router.use("/subcategory", subcategoryController);
router.use("/faq", faqController);
router.use("/banner", bannerController);
router.use("/aboutus", aboutusController);
router.use("/product", productController);
router.use("/content", contentController);
router.use("/ourpromise", ourPromiseController);
router.use("/valuevision", valueVisionController);
router.use("/award", awardController);
router.use("/contactUs", adminContactUsFormController);
router.use("/faqAsk", faqAskQuesController);
router.use("/cmsbanner", adminCmsBannerRoutes);
router.use("/homewhoweare", adminHomeWhoWeAreRoutes);
router.use("/aboutusSustainbility", adminAboutUsSustainabilityRoutes);



module.exports = router;
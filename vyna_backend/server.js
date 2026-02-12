const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authController = require("./controller/apiv1Controller/admin/adminAuthController");
const cron = require('node-cron'); // Import node-cron

// MIDDLEWARES
dotenv.config({ path: "./config.env" });
const app = require("./app");

// DEFAULT

let serverENV = process.env.NODE_ENV;
let hostName = process.env.HOSTNAME_LOCAL;
let DBConString = process.env.DATABASE_LOCAL;

let DBOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

if (process.env.NODE_ENV === "local") {
  hostName = process.env.HOSTNAME_LOCAL;
  DBConString = process.env.DATABASE_LOCAL;
}

if (process.env.NODE_ENV === "development") {
  hostName = process.env.HOSTNAME_DEV;
  DBConString = process.env.DATABASE_DEV;
}

if (process.env.NODE_ENV === "production") {
  hostName = process.env.HOSTNAME_PROD;
  console.log('----------------hostName-----',hostName)
  DBConString = process.env.DATABASE_PROD;
}

(async () => {
  try {
    console.log('-------------------------mongo')
    await mongoose.connect(DBConString, DBOptions);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB error" + err);
  }
})();

(async () => {
  try {
    await authController.createDefaultAdmin();

    // Initial call to check break time
    // await jobService.checkBreakTime();
  } catch (err) {
    console.log("Admin Error" + err);
  }
})();

process.env["HOST"] = hostName;
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server running on ${hostName}:${port}`);
});

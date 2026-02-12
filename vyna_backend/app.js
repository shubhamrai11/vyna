// DEPENDENCIES

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const hpp = require("hpp");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const { DeleteTemplate } = require('./utility/email_templates/deleteUrl');
const {confirmationMessage,notFoundMessage} = require('./utility/email_templates/template');
const i18n = require("./translation")

// const {confirmationMessageEmail,sendVerificationEmail} = require("./controller/apiv1Controller/frontend/userController")
const app = express();
app.use(express.json());

app.use(i18n.init);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  // In production (Vercel), local filesystem is ephemeral — redirect to S3
  const bucket = process.env.S3BUSCKET || "vynabucket";
  const region = process.env.REGION || "us-east-1";
  const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
  return res.redirect(s3Url);
});

// Static file serving disabled for Vercel — frontend & admin are deployed separately.
// Uncomment the line below for local development if needed:
// app.use(express.static(path.join(__dirname, "./public")));

app.use(cors());

dotenv.config({ path: "./config.env" });

const apiRouter = require("./routes/apiv1Routes/apiv1Routes");

app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 10000,
  message: "too many requesr from this IP",
});

app.use("/api", limiter);

app.use(xss());

app.use(hpp());

	// method to get delete account template 

	app.get("/vyna/api/delete-account",async (req, res) => {
		const template = DeleteTemplate();
		res.send(template);
	})

  app.post('/sendVerificationEmail', async (req, res) => {
		const email = req.body.email;

 //   console.log('=============--===',email)
		let check = await sendVerificationEmail(email)
//		console.log("chevk----", check);
		if (check == 'Verification email sent successfully.') {
			res.status(200).send('Verification email sent sucessfully.');
		} else {
			return res.status(404).send('Email not found.');
		}
		// Further processing, such as sending the email, would go here...
	});

	app.get('/confirmDelete/:token', async (req, res) => {
		const token = req.params.token;
		//console.log("--tokenvalue--", token);
		let check = await confirmationMessageEmail(token);
		if(check=='Account Deleted Successfully'){
			let template = confirmationMessage()
			res.send(template)
		}else{
		//	console.log('-=-',user)
			let template = notFoundMessage()
			res.send(template)
		}
		
	});

// ──────────────────────────────────────────────────────────────
// Health Check Endpoint
// ──────────────────────────────────────────────────────────────
// Use this to verify the backend is up and MongoDB is connected.
// Visit: https://your-backend.vercel.app/vyna/api/v1/health
// ──────────────────────────────────────────────────────────────
app.get("/vyna/api/v1/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    server: "vyna-backend",
    environment: process.env.NODE_ENV || "unknown",
    database: {
      status: dbStatus[dbState] || "unknown",
      host: mongoose.connection.host || "not connected",
      name: mongoose.connection.name || "not connected",
    },
    uptime: process.uptime().toFixed(2) + "s",
  });
});

app.use("/vyna/api/v1", apiRouter);

// ──────────────────────────────────────────────────────────────
// Static file serving for admin panel & frontend panel
// DISABLED for Vercel deployment — they are separate Vercel projects.
// Uncomment below for local development where backend serves everything.
// ──────────────────────────────────────────────────────────────

// app.get(
//   "/adminpanel/*",
//   express.static(path.join(__dirname, "./public", "adminpanel"), {
//     maxAge: "1y",
//   })
// );
// app.all("/adminpanel/*", function (req, res) {
//   res.status(200).sendFile(path.join(__dirname, "./public", "adminpanel", "index.html"));
// });

// app.get(
//   "/*",
//   express.static(path.join(__dirname, "./public", "panel"), {
//     maxAge: "1y",
//   })
// );
// app.all("/*", function (req, res) {
//   res.status(200).sendFile(path.join(__dirname, "./public", "panel", "index.html"));
// });


module.exports = app;

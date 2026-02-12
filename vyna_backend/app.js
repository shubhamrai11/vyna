// DEPENDENCIES

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const hpp = require("hpp");
const dotenv = require("dotenv");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
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

app.use(express.static(path.join(__dirname, "./public")));

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

// app.use("/vyna/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/vyna/api/v1", apiRouter);

app.get(
  "/adminpanel/*",
  express.static(path.join(__dirname, "./public", "adminpanel"), {
    maxAge: "1y",
  })
);

// ---- SERVE APLICATION PATHS ---- //
app.all("/adminpanel/*", function (req, res) {
  // console.log("Path", path.join(__dirname, "./public", "panel", "index.html"));
  res
    .status(200)
    .sendFile(path.join(__dirname, "./public", "adminpanel", "index.html"));
});


app.get(
  "/*",
  express.static(path.join(__dirname, "./public", "panel"), {
    maxAge: "1y",
  })
);

// ---- SERVE APLICATION PATHS ---- //
app.all("/*", function (req, res) {
  // console.log("Path", path.join(__dirname, "./public", "panel", "index.html"));
  res
    .status(200)
    .sendFile(path.join(__dirname, "./public", "panel", "index.html"));
});


module.exports = app;

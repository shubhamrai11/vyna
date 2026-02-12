const nodemailer = require("nodemailer");
const fs = require("fs");
const { UserError } = require("./error");
const { statusCodes } = require("./constant");
const logger = require("./coustomLogger");

const sendOtpEmail = async (user) => {
  // console.log("76563235762573657",user)
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/send_otp.html"
    );
    let otpTemplate = buffer.toString();
    otp = user.otp;

    // let otpLink = `http://${process.env.HOST}:${process.env.FR_PORT}/register/user?userId=${user.userId}`;
    otpTemplate = otpTemplate.replace(/{otp}/g, otp);

    await sendEmail({
      email: user.email,
      userId: user.id,
      // subject: "Otp -Verify Email ARPCE",
      subject: "Forgot Password Link",
      message: otpTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `unable to create otp email template: ${JSON.stringify(error)}`
    );
    throw new Error(error.message);
  }
};

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      port: process.env.EMAIL_PORT,
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: '"Vyna Electric"', //sender address
      to: options.email,
      subject: options.subject,
      html: options.message
    };
    // console.log('mailOptions------',mailOptions)
    await transporter.sendMail(mailOptions).then((response, error) => {
      if (error) {
        //   console.log('error==', error)
        throw new Error("Failed to send email");
      }
    });
  } catch (error) {
    console.log("error==", error);
    logger.errorlLog(`Unable to send Email : ${JSON.stringify(error)}`);
    //throw new Error(error.message);
    throw new UserError(
      error.message,
      error.statusCode || statusCodes.INTERNAL_SERVER
    );
  }
};

const sendPasswordUser = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/send_password.html"
    );
    let otpTemplate = buffer.toString();
    // let otpLink = `http://${process.env.HOST}:${process.env.FR_PORT}/verify_email/${user.token}`;
    let password = user.password;
    otpTemplate = otpTemplate
      .replace(/{password}/g, password)
      .replace(/{email}/g, user.email);

    await sendEmail({
      email: user.email,
      // subject: "Recruiter Registration ARPCE",
      subject: "Inscription des recruteurs ARPCE",
      message: otpTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `unable to create registration email template: ${JSON.stringify(error)}`
    );
    throw new Error(error.message);
  }
};

const sendPasswordApplicant = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/send_password_applicant.html"
    );
    let otpTemplate = buffer.toString();
    // let otpLink = `http://${process.env.HOST}:${process.env.FR_PORT}/verify_email/${user.token}`;
    let password = user.password;
    otpTemplate = otpTemplate
      .replace(/{password}/g, password)
      .replace(/{email}/g, user.email);

    await sendEmail({
      email: user.email,
      // subject: "Jobseeker Registration ARPCE",
      subject: "Inscription des demandeurs d'emploi ARPCE",
      message: otpTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `unable to create registration email template: ${JSON.stringify(error)}`
    );
    throw new Error(error.message);
  }
};

const sendInterviewSchedule = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/interview_schedule.html"
    );
    let emailTemplate = buffer.toString();

    // Replace placeholders with actual values

    emailTemplate = emailTemplate
      .replace(/{candidate_name}/g, user.candidate_name)
      .replace(/{email}/g, user.email)
      .replace(/{interview_type}/g, user.interview_type)
      .replace(/{company_name}/g, user.company_name)
      .replace(/{company_address}/g, user.company_address)
      .replace(/{date}/g, user.date)
      .replace(/{time}/g, user.time)
      .replace(/{meeting_link}/g, user.meeting_link)
      .replace(/{job_title}/g, user.job_title);

    await sendEmail({
      email: user.email,
      // subject: "Interview Schedule - ARPCE",
      subject: "Calendrier des entretiens - ARPCE",
      message: emailTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `Unable to create interview schedule email template: ${JSON.stringify(
        error
      )}`
    );
    throw new Error(error.message);
  }
};

const sendHiredInterview = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/hired_template.html"
    );
    let emailTemplate = buffer.toString();

    // Replace placeholders with actual values
    emailTemplate = emailTemplate
      .replace(/{candidate_name}/g, user.candidate_name)
      .replace(/{email}/g, user.email)
      .replace(/{company_name}/g, user.company_name)
      .replace(/{job_title}/g, user.job_title);

    await sendEmail({
      email: user.email,
      // subject: "Congratulations - You're Hired!",
      subject: "Félicitations – vous êtes embauché !",
      message: emailTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `Unable to create interview schedule email template: ${JSON.stringify(
        error
      )}`
    );
    throw new Error(error.message);
  }
};

const sendRejectInterview = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/reject_template.html"
    );
    let emailTemplate = buffer.toString();

    // Replace placeholders with actual values
    emailTemplate = emailTemplate
      .replace(/{candidate_name}/g, user.candidate_name)
      .replace(/{email}/g, user.email)
      .replace(/{company_name}/g, user.company_name)
      .replace(/{job_title}/g, user.job_title);

    await sendEmail({
      email: user.email,
      // subject: "Interview Update",
      subject: "Mise à jour de l'entrevue",
      message: emailTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `Unable to create interview schedule email template: ${JSON.stringify(
        error
      )}`
    );
    throw new Error(error.message);
  }
};

const sendHoldInterview = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/hold_template.html"
    );
    let emailTemplate = buffer.toString();

    // Replace placeholders with actual values
    emailTemplate = emailTemplate
      .replace(/{candidate_name}/g, user.candidate_name)
      .replace(/{email}/g, user.email)
      .replace(/{company_name}/g, user.company_name)
      .replace(/{job_title}/g, user.job_title);

    await sendEmail({
      email: user.email,
      // subject: "Application Status - On Hold",
      subject: "Statut de la demande - En attente",
      message: emailTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `Unable to create interview schedule email template: ${JSON.stringify(
        error
      )}`
    );
    throw new Error(error.message);
  }
};

const sendEmailByCandidate = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/send_email_by_candidate.html"
    );
    let emailTemplate = buffer.toString();

    // Replace placeholders with actual values
    emailTemplate = emailTemplate
      .replace(/{candidate_name}/g, user.candidate_name)
      .replace(/{email}/g, user.email)
      .replace(/{company_name}/g, user.company_name)
      .replace(/{job_title}/g, user.job_title)
      .replace(/{subject}/g, user.subject)
      .replace(/{message}/g, user.message);

    await sendEmail({
      email: user.email,
      subject: user.subject,
      message: emailTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `Unable to create interview schedule email template: ${JSON.stringify(
        error
      )}`
    );
    throw new Error(error.message);
  }
};

const sendPasswordSubadmin = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/subadmin.html"
    );
    let otpTemplate = buffer.toString();
    // let otpLink = `http://${process.env.HOST}:${process.env.FR_PORT}/verify_email/${user.token}`;
    let password = user.password;
    otpTemplate = otpTemplate
      .replace(/{password}/g, password)
      .replace(/{email}/g, user.email);

    await sendEmail({
      email: user.email,
      // subject: "User Registration ARPCE",
      subject: "Inscription des utilisateurs ARPCE",
      message: otpTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `unable to create registration email template: ${JSON.stringify(error)}`
    );
    throw new Error(error.message);
  }
};
const sendVerifcationLink = async (user) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/verification_email.html"
    );
    let otpTemplate = buffer.toString();
    // console.log("process.env.HOST_FR",process.env.FR_URL)
    //let otpLink = `http://${process.env.HOST_FR}:${process.env.FR_PORT}/verify_email/${user.token}`;
    let otpLink = `${process.env.FR_URL}/reset-password/${user.token}`;
    // console.log("otpLink",otpLink)
    otpTemplate = otpTemplate.replace(/{otpLink}/g, otpLink);

    await sendEmail({
      email: user.email,
      // subject: "Password Verification ARPCE",
      subject: "Reset Password Link",
      message: otpTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `unable to create otp email template: ${JSON.stringify(error)}`
    );
    //throw new Error(error.message);
    throw new UserError(error, error.statusCode || statusCodes.INTERNAL_SERVER);
  }
};

const websitesendVerifcationLink = async (user) => {
  try {
    console.log("287637", user);
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/verification_email.html"
    );
    let otpTemplate = buffer.toString();
    console.log("process.env.HOST_FR", process.env.FR_URL);
    //let otpLink = `http://${process.env.HOST_FR}:${process.env.FR_PORT}/verify_email/${user.token}`;
    let otpLink = "";
    if (user.role == "jobseeker")
      otpLink = `${process.env.Website_FR_URL}/verify_jobseeker_email/${user.token}`;
    else otpLink = `${process.env.Website_FR_URL}/verify_email/${user.token}`;
    // console.log("otpLink",otpLink)
    otpTemplate = otpTemplate.replace(/{otpLink}/g, otpLink);

    await sendEmail({
      email: user.email,
      // subject: "Password Verification ARPCE",
      subject: "Vérification du mot de passe ARPCE",
      message: otpTemplate
    });
  } catch (error) {
    logger.errorlLog(
      `unable to create otp email template: ${JSON.stringify(error)}`
    );
    //throw new Error(error.message);
    throw new UserError(error, error.statusCode || statusCodes.INTERNAL_SERVER);
  }
};

const sendFaqQueryToAdmin = async (faq) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/faq_admin_notification.html"
    );
    let emailTemplate = buffer.toString();

    // Conditional removal of email row
    if (!faq.email) {
      emailTemplate = emailTemplate.replace(
        /<p><span class="label">Email:<\/span>.*?<\/p>/,
        ""
      );
    } else {
      emailTemplate = emailTemplate.replace(/{email}/g, faq.email);
    }

    // Replace other fields
    emailTemplate = emailTemplate
      .replace(/{name}/g, faq.name || "N/A")
      .replace(/{mobile_number}/g, faq.mobile_number || "N/A")
      .replace(/{message}/g, faq.message || "N/A");

    await sendEmail({
      email: "info@vynaelectric.com", // Ideally should be process.env.ADMIN_EMAIL
      subject: "New Query Received",
      message: emailTemplate
    });
  } catch (error) {
    console.log("error=========", error);
    error, error.statusCode || statusCodes.INTERNAL_SERVER;
  }
};

const sendNewLetter = async (data) => {
  try {
    const buffer = fs.readFileSync(
      __dirname + "/email_templates/new_letter.html"
    );
    let emailTemplate = buffer.toString();

    // Conditional removal of email row
    if (!data.email) {
      emailTemplate = emailTemplate.replace(
        /<p><span class="label">Email:<\/span>.*?<\/p>/,
        ""
      );
    } else {
      emailTemplate = emailTemplate.replace(/{email}/g, data.email);
    }

    // Replace other fields
    emailTemplate = emailTemplate;

    await sendEmail({
      email: "info@vynaelectric.com", // Ideally should be process.env.ADMIN_EMAIL
      subject: "News Letter Received",
      message: emailTemplate
    });
  } catch (error) {
    console.log("error=========", error);
    error, error.statusCode || statusCodes.INTERNAL_SERVER;
  }
};

module.exports = {
  sendOtpEmail,
  sendFaqQueryToAdmin,
  sendPasswordUser,
  sendVerifcationLink,
  sendPasswordSubadmin,
  sendPasswordApplicant,
  websitesendVerifcationLink,
  sendInterviewSchedule,
  sendHiredInterview,
  sendRejectInterview,
  sendHoldInterview,
  sendEmailByCandidate,
  sendNewLetter
};

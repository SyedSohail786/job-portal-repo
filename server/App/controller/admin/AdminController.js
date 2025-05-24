const { transporter } = require("../../middleware/emailConfig");
const { jobModel, adminRegisterModel } = require("../../model/AdminRegistrationSchema");
require("dotenv").config()
const { otpModel } = require("../../model/OtpModel");
const bcrypt = require('bcrypt');
const { userModel } = require("../../model/userModel");
const saltRounds = 10;
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");



const insertController = async (req, res) => {

     try {
          // Map incoming data to schema fields
          const jobData = {
               jobTitle: req.body.title,
               jobDescription: req.body.description,
               jobCategory: req.body.category,
               jobLocation: req.body.location,
               jobLevel: req.body.level,
               jobSalary: req.body.salary,
               jobPostedAdmin: req.user.email,
               adminImage: req.body.adminImage,
               adminName: req.body.adminName
          };

          // Create and save job
          const newJob = new jobModel(jobData);
          const savedJob = await newJob.save();

          // Send success response
          res.status(201).json({
               success: true,
               message: "Job created successfully",
               data: savedJob
          });

     } catch (error) {
          res.status(500).json({
               success: false,
               message: "Failed to create job",
               error: error.message
          });
     }
};

const viewController = async (req, res) => {

     try {
          let loggedEmail = req.user.email

          if (typeof loggedEmail === 'string') {
               loggedEmail = loggedEmail.replace(/^["']|["']$/g, '').trim().toLowerCase();
          }
          const table = await jobModel.find({ jobPostedAdmin: loggedEmail })

          res.status(200).json({
               status: true,
               data: table
          })
     } catch (error) {
          res.status(500).json({
               success: false,
               message: "Failed",
               error: error.message
          });

     }
};

const AdminRegisterController = async (req, res) => {

     try {
          const { uname, uemail, upassword } = req.body;
          const filename = req.file.filename;
          const hashPass = await bcrypt.hash(upassword, saltRounds)
          const newAdmin = new adminRegisterModel({
               uname,
               uemail,
               upassword: hashPass,
               filename
          });

          await newAdmin.save();

          res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
     } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
     }
};

const emailCheckController = async (req, res) => {
     try {
          const email = req.body.uemail;
          const filterEmail = await adminRegisterModel.findOne({ uemail: email })
          if (filterEmail) {
               res.send({ status: false, msg: "Email already exist" })
          } else {
               res.send({ status: true, msg: "Enter OTP" })
          }
     } catch (error) {
          res.status(500).json({
               success: false,
               message: "Failed to check",
               error: error.message
          });


     }
};

const sendOtp = async (req, res) => {
     const email = req.body.uemail
     const name = req.body.uname
     const generatedOTP = Math.floor(100000 + Math.random() * 900000)

     //Delete previous otp if exist
     await otpModel.deleteOne({ email });

     // Save new OTP
     await otpModel.create({ email, otp: generatedOTP });

     try {
          const info = await transporter.sendMail({
               from: '"Fast Job" <kusohail70@gmail.com>',
               to: `${email}`,
               subject: "Email Verification",
               text: "Email Verification",
               html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8" />
          <title>OTP Verification</title>
          <style>
          body {
               font-family: Arial, sans-serif;
               background:#ecf0f1;
               padding: 20px;
          }
          .email-container {
               max-width: 500px;
               margin: auto;
               background: rgb(188, 226, 254);
               border-radius: 8px;
               padding: 30px;
               box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .logo {
               text-align: center;
               margin-bottom: 20px;
          }
          .capitalize {
          text-transform: capitalize;
          }
          .otp {
               font-size: 28px;
               font-weight: bold;
               color: #2c3e50;
               background: #ecf0f1;
               padding: 15px;
               border-radius: 6px;
               text-align: center;
               letter-spacing: 5px;
          }
          .footer {
               text-align: center;
               color: #7f8c8d;
               font-size: 12px;
               margin-top: 20px;
          }
          </style>
          </head>
          <body>
          <div class="email-container">
          <div class="logo">
               <h2>🔐 OTP Verification</h2>
          </div>
          <p>Hi <strong class="capitalize">${name}</strong>,</p>
          <p>Use the following One-Time Password (OTP) to complete your verification. This OTP is valid for the next 10 minutes.</p>
          <div class="otp">${generatedOTP}</div>
          <p>If you didn't request this, please ignore this email.</p>
          <div class="footer">
               <p>© 2025 Fast Job. All rights reserved.</p>
          </div>
          </div>
          </body>
          </html>

          `,
          });
          res.send({ status: true, msg: "OTP sent" })
          return
     } catch (error) {
          res.status(500).json({
               status: false,
               message: "Failed to send OTP",
               error: error.message
          });
     }




};

const checkOTP = async (req, res) => {
     try {
          const uemail = req.body.uemail
          const receivedOTP = req.body.otp

          const record = await otpModel.findOne({ email: uemail })
          if (!record) {
               return res.send({ status: 0, msg: "OTP expired or Invalid OTP" })
          }
          if (record.otp === receivedOTP) {
               await otpModel.deleteOne({ email: uemail });
               return res.send({ status: 1, msg: "OTP Verified" })
          } else {
               return res.send({ status: 2, msg: "Incorrect OTP" })
          }
     } catch (error) {
          res.status(500).json({
               status: false,
               message: "Failed to check",
               error: error.message
          });
     }



};

const CheckLoginDetails = async (req, res) => {
     try {
          const { loginPass, loginEmail } = req.body;

          const fetchUserLoginDetails = await adminRegisterModel.findOne({ uemail: loginEmail });

          if (!fetchUserLoginDetails) {
               return res.send({ status: 2, msg: "No user found" });
          }

          const { upassword } = fetchUserLoginDetails;
          const gotDetailsFromDB = await bcrypt.compare(loginPass, upassword);

          if (!gotDetailsFromDB) {
               return res.send({ status: 0, msg: "Wrong email or password" });
          }

          const payload = { email: fetchUserLoginDetails.uemail, id: fetchUserLoginDetails._id };
          const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });

          return res.send({
               status: 1,
               msg: "User verified",
               token,
               user: {
                    name: fetchUserLoginDetails.uname,
                    email: fetchUserLoginDetails.uemail
               }
          });

     } catch (error) {
          res.status(500).json({
               status: false,
               message: "Failed to check",
               error: error.message
          });
     }
};


const getLogo = async (req, res) => {
     const uemail = req.user.email

     try {
          const filteredEmail = await adminRegisterModel.findOne({ uemail })
          return res.send({ status: 1, logoName: filteredEmail.filename, userName: filteredEmail.uname, msg: "got logo" })
     } catch (error) {
          res.status(500).json({
               status: false,
               message: "Failed to check",
               error: error.message
          });
     }
}

const getApplicantsData = async (req, res) => {
     const uemail = req.user.email

     try {
          const appliedJobApplicants = [];

          const adminAllJobs = await jobModel.find({ jobPostedAdmin: uemail, jobVisible: true });
          adminAllJobs.forEach((job) => {
               if (job.jobApplicants && job.jobApplicants.length > 0) {
                    appliedJobApplicants.push(...job.jobApplicants); // flatten here directly
               }
          });

          const updatedApplicants = await Promise.all(
               appliedJobApplicants.map(async (applicant) => {
                    const user = await userModel.findOne({ userEmail: applicant.userEmail });
                    return {
                         ...applicant,
                         resume: user?.resume || "",// add resume if found, else empty
                    };
               })
          );

          res.json({
               status: true,
               msg: "Applicants fetched successfully",
               applicants: updatedApplicants
          });

     } catch (error) {
          res.json({
               status: false,
               msg: error.message
          });
     }
};

const downloadResume = async (req, res) => {
     const filename = req.params.filename;
     const filePath = path.join(__dirname, "uploads/resume/", filename);

     // Check if file exists
     if (fs.existsSync(filePath)) {
          res.download(filePath); // prompts file download in browser
     } else {
          res.status(404).json({ status: false, msg: "File not found" });
     }

}

const updateApplicantAction = async (req, res) => {
     const { jobId, userEmail, action, adminEmail } = req.body;

     try {
          // Step 1: Find job posted by admin and visible
          const jobs = await jobModel.find({
               jobPostedAdmin: adminEmail,
               jobVisible: true
          });

          let updated = false;

          // Step 2: Loop through jobs
          for (let job of jobs) {
               // Step 3: Loop through jobApplicants
               for (let i = 0; i < job.jobApplicants.length; i++) {
                    const applicant = job.jobApplicants[i];

                    // Step 4: Check for matching jobId and userEmail
                    if (applicant.jobId == jobId && applicant.userEmail === userEmail) {
                         // Step 5: Update the applicant object
                         job.jobApplicants[i] = {
                              ...applicant,
                              action: action, // You can add more fields to update if needed
                         };

                         // Step 6: Save the job
                         await job.save();
                         updated = true;
                         return res.send({
                              message: "Applicant action updated successfully",
                              updatedApplicant: job.jobApplicants[i]
                         });
                    }
               }
          }

          // If no applicant matched
          if (!updated) {
               return res.status(404).send({ message: "Matching applicant not found" });
          }

     } catch (err) {
          console.error(err);
          res.status(500).send({ message: "Failed to update applicant action" });
     }
};

const sendOtpChangePassword = async (req, res) => {

     const { email } = req.body;

     try {
          const adminData = await adminRegisterModel.findOne({ uemail: email })
          if (!adminData) {
               return res.send({
                    status: false,
                    code: 202,
                    message: "No user found",
               });
          }
          const generatedOTP = Math.floor(100000 + Math.random() * 900000)

          //Delete previous otp if exist
          await otpModel.deleteOne({ email });

          // Save new OTP
          await otpModel.create({ email, otp: generatedOTP });
          const info = await transporter.sendMail({
               from: '"Fast Job" <kusohail70@gmail.com>',
               to: `${email}`,
               subject: "Forgot Password",
               text: "Forgot Password",
               html: `
                    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        padding: 30px;
      }
      .otp-box {
        font-size: 28px;
        font-weight: bold;
        color: #2563eb;
        background-color: #e0e7ff;
        padding: 15px;
        text-align: center;
        border-radius: 8px;
        letter-spacing: 4px;
        margin: 30px 0;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2 style="color: #1e40af;">Your Verification Code</h2>
      <p>Hello ${adminData.uname},</p>
      <p>
        Use the following One-Time Password (OTP) to verify your identity. This code is valid for the next 10 minutes:
      </p>

      <div class="otp-box">${generatedOTP}</div>

      <p>
        If you did not request this code, please ignore this email or contact support.
      </p>

      <p>Thanks,<br />Fast Job</p>

      <div class="footer">
        &copy; 2025 Fast Job. All rights reserved.
      </div>
    </div>
  </body>
</html>

          `,
          });
          res.send({ status: true, msg: "OTP sent" })






     } catch (error) {
          res.send({ status: false, msg: error.message })
     }



};

const checkForgotPasswordOtp = async (req, res) => {

     const { email, otp } = req.body;
     console.log(req.body)
     try {
          const adminData = await otpModel.findOne({ email })
          if (adminData.otp == otp) {
               await otpModel.deleteOne({ email });
               res.status(200).json({

                    msg: "OTP Verified"
               })
          } else {
               res.status(201).json({

                    msg: "OTP expired or Invalid OTP"
               })
          }

     } catch (error) {
          res.send({ status: false, msg: "No OTP Found" })
     }


}
const changePasswordController = async (req, res) => {

     const { newPassword, email } = req.body;
     const hashPass = await bcrypt.hash(newPassword, saltRounds)
     
     try {
          const adminRes = await adminRegisterModel.findOneAndUpdate({ uemail: email }, {
          $set: {
               upassword: hashPass
          }
     }, { new: true })
     const payload = { email: email, id: adminRes._id };
     const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });
     res.send({
               status: true,
               msg: "Success",
               token
          })

     } catch (error) {
          res.send({
               status: false,
               msg: error.message
          })
     }
     

}


module.exports = {
     insertController, viewController,
     AdminRegisterController, emailCheckController,
     checkOTP, sendOtp, CheckLoginDetails, getLogo,
     getApplicantsData, downloadResume, updateApplicantAction,
     changePasswordController, sendOtpChangePassword,
     checkForgotPasswordOtp,
};
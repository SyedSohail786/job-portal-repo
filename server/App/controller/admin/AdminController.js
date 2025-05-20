const { transporter } = require("../../middleware/emailConfig");
const { jobModel, adminRegisterModel } = require("../../model/AdminRegistrationSchema");
const { otpModel } = require("../../model/OtpModel");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
               jobPostedAdmin: req.body.adminEmail,
               adminImage:req.body.adminImage,
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
          console.error("Error creating job:", error);
          res.status(500).json({
               success: false,
               message: "Failed to create job",
               error: error.message
          });
     }
};

const viewController = async (req, res) => {
     try {
          let {loggedEmail} = req.body
          
          if (typeof loggedEmail === 'string') {
               loggedEmail = loggedEmail.replace(/^["']|["']$/g, '').trim().toLowerCase();
          }
          const table = await jobModel.find({ jobPostedAdmin: loggedEmail })

          res.status(200).json({
               status: true,
               data: table
          })
     } catch (error) {
          console.error("Error:", error);
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
          console.error("Error saving admin:", error);
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
          console.error("Error:", error);
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
          console.error("Error:", error);
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
          console.log(req.body)
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
          const { loginPass, loginEmail } = req.body

          const fetchUserLoginDetails = await adminRegisterModel.findOne({ uemail: loginEmail })
          if (fetchUserLoginDetails) {
               const { upassword } = fetchUserLoginDetails
               const gotDetailsFromDB = await bcrypt.compare(loginPass, upassword)
               if (gotDetailsFromDB) {
                    return res.send({ status: 1, msg: "User verified" })
               } else {
                    return res.send({ status: 0, msg: "Wrong email or password " })
               }
          } else {
               return res.send({ status: 2, msg: "No user found " })
          }
     } catch (error) {
          res.status(500).json({
               status: false,
               message: "Failed to check",
               error: error.message
          });
     }

};

const getLogo = async (req, res) => {
     try {
          const filteredEmail = await adminRegisterModel.findOne({ uemail: req.body.loginEmail })
          return res.send({ status: 1, logoName: filteredEmail.filename, userName: filteredEmail.uname, msg: "got logo" })
     } catch (error) {
          res.status(500).json({
               status: false,
               message: "Failed to check",
               error: error.message
          });
     }
}

module.exports = {
     insertController, viewController,
     AdminRegisterController, emailCheckController,
     checkOTP, sendOtp, CheckLoginDetails, getLogo
};
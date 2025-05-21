const { set } = require("mongoose");
const { jobModel } = require("../../model/AdminRegistrationSchema");
const { userModel } = require("../../model/userModel");

const viewAllJobsController = async (req, res) => {

     try {
          const fetchres = await jobModel.find({ jobVisible: true })
          res.status(200).json({
               status: true,
               msg: fetchres
          })
     } catch (error) {
          res.status(500).json({
               success: false,
               message: "Failed",
               error: error.message
          });
     }



}

const updateVisibilty = async (req, res) => {

     try {
          const { visible } = req.body;
          await jobModel.findByIdAndUpdate(req.params.id, { jobVisible: visible });
          res.json({ success: true });
     } catch (error) {
          res.json({ success: false, msg: error.message });
     }
}

const usersDataController = async (req, res) => {
     const { userName, userEmail, profilePic, userResume, _id } = req.body

     try {
          // console.log(userResume)
          const saveUser = new userModel(
               {
                    userName,
                    userEmail,
                    profilePic,
                    userResume,
                    _id,
               })
          const finalSave = await saveUser.save();

          res.json({
               success: true,
               msg: finalSave
          })
     } catch (error) {
          res.json({
               success: false,
               msg: error.message
          })

     }
}

const saveResumeController = async (req, res) => {

     const { userEmail } = req.body;

     if (!req.file) {
          return res.json({
               status: false,
               msg: "no file uploaded"

          })
     }
     const resumeName = req.file.filename;
     try {
          const findingUser = await userModel.findOneAndUpdate({ userEmail: userEmail }, { resume: resumeName })

          res.json({
               status: true,
               msg: findingUser
          })


     } catch (error) {
          res.json({
               status: false,
               msg: error.message

          })
     }
}

const saveAppliedJobsController = async (req, res) => {
     const { userName, userEmail, jobTitle, _id, jobLocation } = req.body;
     console.log(req.body)
     const newApplicant = { userName, userEmail, jobTitle, jobLocation, Timestamp: Date.now() }
     let foundUser = "";

     try {
          const checkApplicant = await jobModel.findOne({ _id: _id })
          const applicantsList = checkApplicant.jobApplicants;
          applicantsList.map((items, index) => {
               if (items.userEmail == userEmail) {
                    foundUser = items.userEmail;
               }

               return null
          })
          if (foundUser === undefined || foundUser === "") {
               await jobModel.findByIdAndUpdate(
                    _id,
                    { $push: { jobApplicants: newApplicant } },
                    { new: true } // to return the updated document
               );
               res.json({
                    status: true,
                    msg: "User Applied"
               })

          } else {
               res.json({
                    status: false,
                    msg: "User Already Applied"
               })
          }

     } catch (error) {
          res.json({
               status: false,
               msg: error.message
          })
     }






}

const getResumeController = async (req, res) => {
     const { userEmail } = req.body

     try {
          const userFullInfo = await userModel.findOne({ userEmail: userEmail })

          res.json({
               status: true,
               resumeName: userFullInfo.resume,
               msg: "Resume Fetched"
          })
     } catch (error) {
          res.json({
               status: false,
               msg: error.message
          })
     }



}

module.exports = { viewAllJobsController, updateVisibilty, usersDataController, saveResumeController, saveAppliedJobsController, getResumeController }
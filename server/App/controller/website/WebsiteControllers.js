const { set } = require("mongoose");
const { jobModel, adminRegisterModel } = require("../../model/AdminRegistrationSchema");
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
     const { userName, userEmail, jobTitle, _id, jobLocation, action, resume } = req.body;
     const newApplicant = {
          userName, userEmail, jobTitle,
          jobLocation, resume, action,
          jobId: Math.floor(Math.random() * 99999 + Date.now()).toString(),
          Timestamp: Date.now()
     }
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

const viewCategoryLocationController = async (req, res) => {
     try {
          const allLocationData = await jobModel.find({}, 'jobLocation'); // only fetch jobLocation
          const locationSet = new Set();

          allLocationData.forEach(item => {
               if (item.jobLocation) {
                    locationSet.add(item.jobLocation.trim()); // optional: trim spaces
               }
          });

          const allLocation = Array.from(locationSet);

          res.json({
               status: true,
               msg: allLocation
          });
     } catch (error) {
          res.json({
               status: false,
               msg: error.message
          });
     }
};

const viewCategoryController = async (req, res) => {
     try {
          const allCategoryData = await jobModel.find({}, 'jobCategory'); // fetch only jobCategory
          const categorySet = new Set();

          allCategoryData.forEach(item => {
               if (item.jobCategory) {
                    categorySet.add(item.jobCategory.trim()); // remove accidental spaces
               }
          });

          const allCategory = Array.from(categorySet);

          res.json({
               status: true,
               msg: allCategory
          });
     } catch (error) {
          res.json({
               status: false,
               msg: error.message
          });
     }
};

const appliedJobsController = async (req, res) => {
     const { userEmail } = req.body;
     try {
          const allJobs = await jobModel.find({
               "jobApplicants.userEmail": userEmail
          });

          const filteredJobs = allJobs.map(job => {
               const applicant = job.jobApplicants.find(app => app.userEmail === userEmail);

               return {
                    adminImage: job.adminImage,
                    adminName: job.adminName,
                    jobTitle: job.jobTitle,
                    jobLocation: job.jobLocation,
                    createdAt: job.createdAt,
                    action: applicant.action
               };
          });

          res.status(200).json(filteredJobs);
     } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error while fetching applied jobs." });
     }


}


module.exports = {
     viewAllJobsController, updateVisibilty,
     usersDataController, saveResumeController,
     saveAppliedJobsController, getResumeController,
     viewCategoryLocationController, viewCategoryController,
     appliedJobsController
}
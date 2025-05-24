const express = require("express")
const { viewAllJobsController, updateVisibilty, 
     viewCategoryLocationController,
      viewCategoryController, appliedJobsController 
     } = require("../../controller/website/WebsiteControllers")
const { clerkWebhook } = require("../../controller/website/webhooks")

const viewAllJobs = express.Router()

viewAllJobs.get("/viewJobs", viewAllJobsController)
viewAllJobs.put("/updateVisibilty/:id", updateVisibilty)
viewAllJobs.post("/webhooks",clerkWebhook)
viewAllJobs.get("/viewCategoryLocation",viewCategoryLocationController)
viewAllJobs.get("/viewCategory",viewCategoryController)
viewAllJobs.post("/appliedJobs",appliedJobsController)

module.exports={viewAllJobs}
const express = require("express")
const { viewAllJobsController, updateVisibilty } = require("../../controller/website/WebsiteControllers")
const { clerkWebhook } = require("../../controller/website/webhooks")

const viewAllJobs = express.Router()

viewAllJobs.get("/viewJobs", viewAllJobsController)
viewAllJobs.put("/updateVisibilty/:id", updateVisibilty)
viewAllJobs.post("/webhooks",clerkWebhook)

module.exports={viewAllJobs}
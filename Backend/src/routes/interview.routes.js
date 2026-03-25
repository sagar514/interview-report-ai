const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();


interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

interviewRouter.get("/report/:interviewReportId", authMiddleware.authUser, interviewController.getReport);

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllReports);

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);


module.exports = interviewRouter;
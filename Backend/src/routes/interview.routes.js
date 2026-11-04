import express from "express"
import {authUser} from "../middleware/auth.middleware.js"
import {generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController,generateResumePdfController} from "../controllers/interview.controller.js"
import { uplaod } from "../middleware/file.middleware.js"

export const interviewRouter = express.Router()


/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post('/', authUser, uplaod.single("resume"),generateInterviewReportController)


/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser,getInterviewReportByIdController)


interviewRouter.get(
    '/',
    authUser,
    getAllInterviewReportsController
);

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController)

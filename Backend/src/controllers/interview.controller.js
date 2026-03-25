const pdfParse = require("pdf-parse");
const interviewReportModel = require("../models/interviewReport.model");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");


const generateInterviewReportController = async (req, res) => {

    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body;
    
    const resumeFileBuffer = resumeFile.buffer;
    // const uint8Array = new Uint8Array(resumeFileBuffer);
    const uint8Array = Uint8Array.from(resumeFileBuffer);
    
    const resumeContent = await (new pdfParse.PDFParse(uint8Array)).getText();

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        jobDescription,
        selfDescription
    });

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resumeText: resumeContent.text,
        jobDescription,
        selfDescription,
        ...interviewReportByAi
    });

    res.status(201).json({
        message: "Interview report created successfully",
        interviewReport
    });
}

const getReport = async (req, res) => {

    const interviewReportId = req.params.interviewReportId;
    const userId = req.user.id;

    const report = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: userId
    });

    res.status(200).json({
        message: "Report fetched successfully",
        report
    });

}

const getAllReports = async (req, res) => {

    const userId = req.user.id;

    const reports = await interviewReportModel.find({ user: userId })
                                                .select("title matchScore createdAt")
                                                .sort({ "createdAt": -1 });

    res.status(200).json({
        message: "Reports fetched successfully",
        reports
    });

}

const generateResumePdfController = async (req, res) => {

    const { interviewReportId } = req.params;

    const report = await interviewReportModel.findOne({ _id: interviewReportId});

    if(!report) {
        return res.status(404).json({
            message: "Report not found"
        });
    }

    const { resume, jobDescription, selfDescription } = report;

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    });

    res.send(pdfBuffer);

}


module.exports = { generateInterviewReportController, getReport, getAllReports, generateResumePdfController };
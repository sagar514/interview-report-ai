import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { generateReport, getReport, geAllReports, generateResumePdf } from "../services/interview.api";
import { useParams } from "react-router";

export const useInterview = () => {

    const context = useContext(InterviewContext);
    const { report, setReport, reports, setReports, loading, setLoading } = context; 

    const { reportId } = useParams();

    const handleGenerateReport = async ({ resume, jobDescription, selfDescription }) => {

        try {
            setLoading(true);
            const response = await generateReport({ resume, jobDescription, selfDescription });
            setReport(response.data.interviewReport);
        } catch (error) {
            setReport(null);
        } finally {
            setLoading(false);
        }
        
    }

    const handleGetReport = async ({ reportId }) => {

        try {
            setLoading(true);
            const response = await getReport({ reportId });
            setReport(response.data.report);
        } catch (error) {
            setReport(null);
        } finally {
            setLoading(false);
        }

    }

    const handleGetAllReports = async () => {

        try {
            setLoading(true);
            const response = await geAllReports();
            setReports(response.data.reports);
        } catch (error) {
            setReports([]);
        } finally {
            setLoading(false);
        }

    }

    const handleGenerateResumePdf = async ({ reportId }) => {

        try {
            setLoading(true);
            const response = await generateResumePdf({ reportId });

            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${reportId}.pdf`);
            document.body.appendChild(link);
            link.click();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }

    useEffect( () => {

        if(reportId) {
            handleGetReport({ reportId });
        } else {
            handleGetAllReports();
        }

    }, [reportId]);

    return { report, reports, loading, handleGenerateReport, handleGetReport, handleGetAllReports, handleGenerateResumePdf };

}
 
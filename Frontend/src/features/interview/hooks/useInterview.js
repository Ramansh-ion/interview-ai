


import { getAllInterviewReports,generateInterviewReport,getInterviewReportById,generateResumePdf} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../style/interview.context.jsx";
import { useParams } from "react-router";


export const useInterview = () => {

    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context;


    // Generate Interview Report
    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {

        setLoading(true);

        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            if (!response?.interviewReport) {
                throw new Error("Interview report was not returned by the server.");
            }

            setReport(response.interviewReport);

            return response.interviewReport;

        } catch (error) {

            console.error(
                "Generate Report Error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {
            setLoading(false);
        }
    };


    // Get Interview Report By ID
    const getReportById = async (interviewId) => {

        setLoading(true);

        try {
            const response = await getInterviewReportById(interviewId);

            if (!response?.interviewReport) {
                throw new Error("Interview report not found.");
            }

            setReport(response.interviewReport);

            return response.interviewReport;

        } catch (error) {

            console.error(
                "Get Report Error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {
            setLoading(false);
        }
    };


    // Get All Interview Reports
    const getReports = async () => {

        setLoading(true);

        try {
            const response = await getAllInterviewReports();

            setReports(response.interviewReports);

            return response.interviewReports;

        } catch (error) {

            console.error(
                "Get Reports Error:",
                error.response?.data || error.message
            );

            throw error;

        } finally {
            setLoading(false);
        }
    };

// error in generate
    // // Generate Resume PDF
    // const getResumePdf = async (interviewReportId) => {

    //     setLoading(true);

    //     try {
    //         const response = await generateResumePdf({ interviewReportId });

    //         const url = window.URL.createObjectURL(
    //             new Blob([response], { type: "application/pdf" })
    //         );

    //         const link = document.createElement("a");

    //         link.href = url;
    //         link.setAttribute(
    //             "download",
    //             `resume_${interviewReportId}.pdf`
    //         );

    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();

    //         window.URL.revokeObjectURL(url);

    //     } catch (error) {

    //         console.error(
    //             "Generate Resume PDF Error:",
    //             error.response?.data || error.message
    //         );

    //         throw error;

    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // Fetch reports based on current route
    useEffect(() => {

        if (interviewId) {
            getReportById(interviewId).catch(() => {});
        } else {
            getReports().catch(() => {});
        }

    }, [interviewId]);


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        // getResumePdf
    };

};

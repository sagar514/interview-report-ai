import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

export const generateReport = async ({ resume, jobDescription, selfDescription }) => {

    try {
        
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobDescription", jobDescription);
        formData.append("selfDescription", selfDescription);

        const response = await api.post("/api/interview", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response

    } catch (error) {
        console.log(error);
    }

}

export const getReport = async ({ reportId }) => {

    try {
        
        const response = await api.get(`/api/interview/report/${reportId}`);

        return response;

    } catch (error) {
        console.log(error);
    }

}

export const geAllReports = async () => {

    try {
        
        const response = await api.get(`/api/interview`);

        return response;

    } catch (error) {
        console.log(error);
    }

}

export const generateResumePdf = async ({ reportId }) => {

    try {

        const response = await api.post(`/api/interview/resume/pdf/${reportId}`, null, {
            responseType: "blob"
        });

        return response.data;

    } catch (error) {
        console.log(error);
    }

}
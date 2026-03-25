import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {

    const [reports, setReports] = useState([]);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <InterviewContext.Provider value={{ report, setReport, reports, setReports, loading, setLoading }}>
            {children}
        </InterviewContext.Provider>
    );

}
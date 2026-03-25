import React, { useRef, useState } from 'react'
import "../styles/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from 'react-router';

const Home = () => {

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();
    const { loading, report, handleGenerateReport } = useInterview();

    const navigate = useNavigate();

    const handleButtonClick = async () => {
        const resumeFile = resumeInputRef.current.files[0];
        await handleGenerateReport({ resume: resumeFile, jobDescription, selfDescription });
        navigate(`/report/${report._id}`);
    }

    if(loading){
        return (
            <main className='home'>
                <p>Interview plan is loading...</p>
            </main>
        );
    }

  return (
    <main className='home'>
        <div className="interview-input-group">
            <div className="left">
                <label htmlFor="jobDescription">Job Description</label>
                <textarea name="jobDescription" id="jobDescription" placeholder='Enter job description here...' onChange={(e) => setJobDescription(e.target.value)}></textarea>
            </div>
            <div className="right">
                <div className="input-group">
                    <p>Resume <small className='highlight'>(Use Resume and self description together for best results)</small></p>
                    <label className="file-label" htmlFor="resume">Upload Resume</label>
                    <input hidden type="file" name="resume" id="resume" accept='.pdf' ref={resumeInputRef} />
                </div>
                <div className="input-group">
                    <label htmlFor="selfDescription">Self Description</label>
                    <textarea name="selfDescription" id="selfDescription" placeholder='Describe yourself in a few sentences...' onChange={(e) => setSelfDescription(e.target.value)}></textarea>
                </div>
                <button className='button primary-button' onClick={handleButtonClick}>Generate Report</button>
            </div>
        </div>
    </main>
  )
}

export default Home
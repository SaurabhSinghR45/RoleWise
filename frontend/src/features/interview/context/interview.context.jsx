import React, { createContext, useState, useCallback } from "react";
import {
  generateInterviewReportApi,
  getInterviewReportByIdApi,
  getUserInterviewReportsApi,
  deleteInterviewReportApi,
} from "../services/interview.api";

export const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [interviewError, setInterviewError] = useState(null);

  // Fetch all user reports
  const fetchUserReports = useCallback(async () => {
    try {
      setIsLoadingReports(true);
      const data = await getUserInterviewReportsApi();
      if (data?.success && data?.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("[Fetch Reports Error]:", err);
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  // Fetch specific report by ID
  const fetchReportById = useCallback(async (id) => {
    try {
      setIsLoadingReports(true);
      setInterviewError(null);
      const data = await getInterviewReportByIdApi(id);
      if (data?.success && data?.report) {
        setActiveReport(data.report);
        return { success: true, report: data.report };
      }
      return { success: false, message: "Report not found" };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to load report";
      setInterviewError(message);
      return { success: false, message };
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  // Generate Report with simulated dynamic progress steps
  const generateReport = async (formData) => {
    try {
      setIsGenerating(true);
      setInterviewError(null);
      setGenerationStep("Parsing Resume & Extracting Technical Skills...");

      const stepTimer1 = setTimeout(() => {
        setGenerationStep("Querying Gemini 2.5 Flash for Match Analysis & Skill Gaps...");
      }, 2500);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep("Synthesizing In-depth Questions, Model Answers & 7-Day Roadmap...");
      }, 5500);

      const data = await generateInterviewReportApi(formData);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (data?.success && data?.report) {
        setActiveReport(data.report);
        setReports((prev) => [data.report, ...prev]);
        return { success: true, report: data.report };
      }

      return { success: false, message: data?.message || "Generation failed" };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "AI Report generation failed";
      setInterviewError(message);
      return { success: false, message };
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  // Delete Report
  const deleteReport = async (id) => {
    try {
      await deleteInterviewReportApi(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
      if (activeReport?._id === id) {
        setActiveReport(null);
      }
      return { success: true };
    } catch (err) {
      console.error("[Delete Report Error]:", err);
      return { success: false };
    }
  };

  const clearActiveReport = () => setActiveReport(null);
  const clearInterviewError = () => setInterviewError(null);

  const value = {
    reports,
    activeReport,
    isGenerating,
    generationStep,
    isLoadingReports,
    interviewError,
    fetchUserReports,
    fetchReportById,
    generateReport,
    deleteReport,
    setActiveReport,
    clearActiveReport,
    clearInterviewError,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

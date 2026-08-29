import api from "../../../services/api";

/**
 * Layer 4: Interview API Service
 */

export const generateInterviewReportApi = async (formData) => {
  const response = await api.post("/interview/generate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getInterviewReportByIdApi = async (id) => {
  const response = await api.get(`/interview/report/${id}`);
  return response.data;
};

export const getUserInterviewReportsApi = async () => {
  const response = await api.get("/interview/reports");
  return response.data;
};

export const deleteInterviewReportApi = async (id) => {
  const response = await api.delete(`/interview/report/${id}`);
  return response.data;
};

export const downloadResumePdfApi = async (id) => {
  const response = await api.get(`/interview/report/${id}/pdf`, {
    responseType: "blob",
  });
  return response.data;
};

export const evaluateAnswerApi = async ({
  question,
  intention = "",
  expectedAnswer = "",
  userAnswer,
  questionType = "technical",
}) => {
  const response = await api.post("/interview/evaluate-answer", {
    question,
    intention,
    expectedAnswer,
    userAnswer,
    questionType,
  });
  return response.data;
};

export const updateRoadmapProgressApi = async (reportId, completedTasks) => {
  const response = await api.patch(`/interview/report/${reportId}/roadmap-progress`, {
    completedTasks,
  });
  return response.data;
};

export const compareRolesApi = async ({
  reportId,
  resumeText = "",
  selfDescription = "",
  targetRoles = [],
}) => {
  const response = await api.post("/interview/compare-roles", {
    reportId,
    resumeText,
    selfDescription,
    targetRoles,
  });
  return response.data;
};

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

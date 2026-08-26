import { useContext } from "react";
import { InterviewContext } from "../context/interview.context";

/**
 * Layer 2: Custom Hook for Interview State & Actions
 */
export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
};

export default useInterview;

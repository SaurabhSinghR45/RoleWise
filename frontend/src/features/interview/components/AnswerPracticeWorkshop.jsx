import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Check,
  Copy,
  ChevronRight,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { evaluateAnswerApi } from "../services/interview.api";

const AnswerPracticeWorkshop = ({
  question,
  intention = "",
  expectedAnswer = "",
  questionType = "technical",
}) => {
  const [answerText, setAnswerText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Speech Recognition support in browser
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition is not supported in this browser. Please type your answer or use Google Chrome / Microsoft Edge."
      );
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setError(null);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        let finalTranscript = answerText;

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += (finalTranscript ? " " : "") + transcript;
            } else {
              currentTranscript += transcript;
            }
          }
          setAnswerText(
            finalTranscript + (currentTranscript ? " " + currentTranscript : "")
          );
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
          if (event.error !== "no-speech") {
            setError(
              `Microphone error: ${event.error}. You can also type your answer.`
            );
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsRecording(false);
        setError("Could not access microphone. Please type your answer below.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!answerText || answerText.trim().length < 10) {
      setError("Please provide a substantive answer (at least 10 characters).");
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    try {
      setIsEvaluating(true);
      setError(null);
      const res = await evaluateAnswerApi({
        question,
        intention,
        expectedAnswer,
        userAnswer: answerText.trim(),
        questionType,
      });

      if (res.success && res.evaluation) {
        setEvaluation(res.evaluation);
      } else {
        throw new Error(res.message || "Failed to evaluate answer");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      setError(err.response?.data?.message || err.message || "Evaluation failed. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setEvaluation(null);
    setError(null);
  };

  const handleCopySnippet = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Emerald green
    if (score >= 65) return "#6366f1"; // Indigo
    if (score >= 50) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  return (
    <div className="answer-workshop">
      <div className="workshop-header">
        <div className="workshop-title">
          <Sparkles size={16} className="text-primary" />
          <span>Interactive AI Answer Practice</span>
          <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
            Real-Time Coaching
          </span>
        </div>
        <p className="workshop-subtitle">
          {questionType === "behavioral"
            ? "Speak or type your STAR response (Situation, Task, Action, Result). Get instant AI feedback on structure & impact."
            : "Deliver your technical explanation. Rolewise AI will grade your technical depth, accuracy, and missing edge-cases."}
        </p>
      </div>

      {error && (
        <div className="auth-alert auth-error" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {!evaluation ? (
        <form onSubmit={handleSubmit} className="workshop-form">
          <div className="workshop-input-wrapper">
            <textarea
              className="workshop-textarea"
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={
                questionType === "behavioral"
                  ? "e.g. In my previous project, we faced an unexpected production memory leak under peak load (Situation)... I took the lead to profile the heap dumps (Task)..."
                  : "e.g. I would use asyncio.gather with return_exceptions=True to execute the agents concurrently while isolating failures..."
              }
              disabled={isEvaluating}
            />

            {/* Voice Recording Control */}
            <div className="workshop-controls-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`btn-mic ${isRecording ? "recording" : ""}`}
                    title={isRecording ? "Stop recording" : "Speak your answer"}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    <span>{isRecording ? "Listening... (Click to Stop)" : "Voice Dictate"}</span>
                  </button>
                )}

                {answerText && (
                  <button
                    type="button"
                    onClick={() => setAnswerText("")}
                    className="btn-text-clear"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span className="char-count">{answerText.length} chars</span>
                <button
                  type="submit"
                  disabled={isEvaluating || !answerText.trim()}
                  className="btn btn-primary"
                  style={{ padding: "0.5rem 1.1rem", fontSize: "0.88rem" }}
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 size={15} className="spinner" />
                      <span>Grading Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit for AI Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Evaluation Results Card */
        <div className="evaluation-card">
          <div className="evaluation-header">
            <div className="evaluation-score-wrap">
              <div
                className="evaluation-score-circle"
                style={{ borderColor: getScoreColor(evaluation.score) }}
              >
                <span className="eval-score-num" style={{ color: getScoreColor(evaluation.score) }}>
                  {evaluation.score}
                </span>
                <span className="eval-score-label">/ 100</span>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${getScoreColor(evaluation.score)}22`,
                      color: getScoreColor(evaluation.score),
                      border: `1px solid ${getScoreColor(evaluation.score)}44`,
                      fontWeight: "700",
                    }}
                  >
                    {evaluation.rating}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    AI Interview Assessment
                  </span>
                </div>
                <h4 style={{ fontSize: "1.05rem", marginTop: "0.25rem", color: "#f8fafc" }}>
                  {evaluation.score >= 80
                    ? "Outstanding Technical Articulation!"
                    : evaluation.score >= 65
                    ? "Good Delivery with Room for Precision"
                    : "Solid Effort — Key Concepts Omitted"}
                </h4>
              </div>
            </div>

            <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ gap: "0.35rem" }}>
              <RotateCcw size={14} />
              <span>Practice Again</span>
            </button>
          </div>

          {/* Hiring Manager Feedback */}
          <div className="eval-section">
            <div className="eval-sec-title">
              <HelpCircle size={14} className="text-primary" />
              <span>Hiring Manager Assessment</span>
            </div>
            <p className="eval-feedback-text">{evaluation.feedback}</p>
          </div>

          {/* Strengths & Missed Concepts Grid */}
          <div className="eval-grid-2">
            {/* Strengths */}
            <div className="eval-sub-card strengths-card">
              <div className="eval-sub-title text-success">
                <CheckCircle2 size={14} />
                <span>What You Articulated Well</span>
              </div>
              <ul className="eval-list">
                {(evaluation.strengths || []).map((str, idx) => (
                  <li key={idx} className="strength-item">
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missed Concepts */}
            <div className="eval-sub-card missed-card">
              <div className="eval-sub-title text-warning">
                <AlertCircle size={14} />
                <span>Omitted / Refinement Areas</span>
              </div>
              <ul className="eval-list">
                {(evaluation.missedConcepts || []).map((miss, idx) => (
                  <li key={idx} className="missed-item">
                    {miss}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Principal Engineer Improved Phrasing */}
          {evaluation.improvedAnswerSnippet && (
            <div className="eval-improved-box">
              <div className="eval-improved-header">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Lightbulb size={15} color="#f59e0b" />
                  <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "#f8fafc" }}>
                    Principal Engineer Model Phrasing
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopySnippet(evaluation.improvedAnswerSnippet)}
                  className="btn-copy-snippet"
                  title="Copy improved response"
                >
                  {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <p className="eval-improved-text">{evaluation.improvedAnswerSnippet}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerPracticeWorkshop;

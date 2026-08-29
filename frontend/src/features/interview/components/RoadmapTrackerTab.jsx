import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Trophy,
  Flame,
  RotateCcw,
  CheckCheck,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { updateRoadmapProgressApi } from "../services/interview.api";

const RoadmapTrackerTab = ({ report }) => {
  const preparationPlan = report?.preparationPlan || [];

  // Initialize completed tasks from report or localStorage
  const [completedTasks, setCompletedTasks] = useState(() => {
    if (report?.completedRoadmapTasks && Array.isArray(report.completedRoadmapTasks)) {
      const map = {};
      report.completedRoadmapTasks.forEach((k) => (map[k] = true));
      return map;
    }

    try {
      const cached = localStorage.getItem(`rolewise_roadmap_${report?._id}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn("Could not load roadmap progress from localStorage", e);
    }
    return {};
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Calculate total and completed task counts
  const { totalTasks, completedCount, readinessPercent } = useMemo(() => {
    let total = 0;
    let completed = 0;

    preparationPlan.forEach((day, dayIdx) => {
      (day.tasks || []).forEach((_, taskIdx) => {
        total++;
        if (completedTasks[`day${dayIdx}-task${taskIdx}`]) {
          completed++;
        }
      });
    });

    const cleanPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalTasks: total,
      completedCount: completed,
      readinessPercent: cleanPct,
    };
  }, [preparationPlan, completedTasks]);

  // Sync to backend and localStorage
  const syncProgress = async (newCompletedMap) => {
    try {
      localStorage.setItem(
        `rolewise_roadmap_${report?._id}`,
        JSON.stringify(newCompletedMap)
      );

      const taskKeys = Object.keys(newCompletedMap).filter((k) => newCompletedMap[k]);
      setIsSyncing(true);
      if (report?._id) {
        await updateRoadmapProgressApi(report._id, taskKeys);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      }
    } catch (err) {
      console.warn("Failed to sync roadmap progress to cloud:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleTask = (dayIdx, taskIdx) => {
    const key = `day${dayIdx}-task${taskIdx}`;
    const updated = {
      ...completedTasks,
      [key]: !completedTasks[key],
    };
    setCompletedTasks(updated);
    syncProgress(updated);
  };

  const toggleEntireDay = (dayIdx, tasks = []) => {
    const dayTaskKeys = tasks.map((_, taskIdx) => `day${dayIdx}-task${taskIdx}`);
    const allDone = dayTaskKeys.every((k) => completedTasks[k]);

    const updated = { ...completedTasks };
    dayTaskKeys.forEach((k) => {
      updated[k] = !allDone;
    });

    setCompletedTasks(updated);
    syncProgress(updated);
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all preparation checklist progress?")) {
      const reset = {};
      setCompletedTasks(reset);
      syncProgress(reset);
    }
  };

  const getDayStatus = (dayIdx, tasks = []) => {
    if (!tasks.length) return "pending";
    const dayTaskKeys = tasks.map((_, taskIdx) => `day${dayIdx}-task${taskIdx}`);
    const doneCount = dayTaskKeys.filter((k) => completedTasks[k]).length;

    if (doneCount === tasks.length) return "completed";
    if (doneCount > 0) return "in-progress";
    return "pending";
  };

  return (
    <div className="roadmap-tracker-container">
      {/* Hero Sprint Readiness Banner */}
      <div className="roadmap-hero glass-panel">
        <div className="roadmap-hero-left">
          {/* Circular Progress Ring */}
          <div className="readiness-gauge-wrap">
            <svg className="readiness-svg" viewBox="0 0 100 100">
              <circle
                className="gauge-bg"
                cx="50"
                cy="50"
                r="42"
              />
              <circle
                className="gauge-progress"
                cx="50"
                cy="50"
                r="42"
                style={{
                  strokeDasharray: 264,
                  strokeDashoffset: 264 - (264 * readinessPercent) / 100,
                }}
              />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-pct">{readinessPercent}%</span>
              <span className="gauge-sub">Readiness</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <Flame size={18} color="#f59e0b" />
              <span style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "#f59e0b" }}>
                7-Day Daily Interview Sprint Tracker
              </span>
            </div>

            <h3 style={{ fontSize: "1.35rem", color: "#f8fafc", marginBottom: "0.35rem" }}>
              {readinessPercent === 100
                ? "🎉 All 7 Days Mastered! Full Interview Readiness Achieved."
                : readinessPercent >= 70
                ? "⚡ Final Stretch! High Probability of Interview Conversion."
                : readinessPercent >= 40
                ? "🚀 Strong Momentum! Core Architecture & Coding Progressing."
                : "🎯 Day 1–2 Kickoff! Check Off Tasks Daily Leading to Interview Day."}
            </h3>

            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              Completed <strong>{completedCount}</strong> of <strong>{totalTasks}</strong> actionable tasks across all 7 preparation modules. Automatically synced to your cloud profile.
            </p>

            {/* Cloud Sync Status Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.85rem" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <ShieldCheck size={14} color="#10b981" />
                {justSaved ? "Saved to Cloud!" : isSyncing ? "Syncing..." : "Cloud Synced"}
              </span>

              {completedCount > 0 && (
                <button onClick={handleResetProgress} className="btn-reset-roadmap">
                  <RotateCcw size={12} />
                  <span>Reset Progress</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Milestone Badge Pill */}
        <div className="roadmap-hero-milestone">
          <div className="milestone-icon-wrap">
            <Trophy size={26} color="#fbbf24" />
          </div>
          <div>
            <div className="milestone-title">Interview Sprint Status</div>
            <div className="milestone-value">
              {readinessPercent === 100 ? "Ready to Ace 🏆" : `Day ${Math.min(Math.ceil((completedCount / (totalTasks || 1)) * 7) || 1, 7)} of 7 Sprint`}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Interactive Sprint Cards */}
      <div className="days-sprint-list">
        {preparationPlan.map((dayPlan, dayIdx) => {
          const status = getDayStatus(dayIdx, dayPlan.tasks);
          const tasks = dayPlan.tasks || [];
          const dayDoneCount = tasks.filter((_, tIdx) => completedTasks[`day${dayIdx}-task${tIdx}`]).length;
          const isAllDayDone = tasks.length > 0 && dayDoneCount === tasks.length;

          return (
            <div
              key={dayIdx}
              className={`sprint-day-card ${status === "completed" ? "day-card-completed" : status === "in-progress" ? "day-card-active" : ""}`}
            >
              {/* Day Header */}
              <div className="sprint-day-header">
                <div className="day-title-left">
                  <div className="day-number-badge">
                    DAY {dayPlan.day || dayIdx + 1}
                  </div>
                  <div>
                    <h4 className="day-focus-title">{dayPlan.focus}</h4>
                    <span className="day-tasks-count">
                      {dayDoneCount} of {tasks.length} tasks completed
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {/* Status Badge */}
                  {status === "completed" ? (
                    <span className="badge badge-success" style={{ gap: "0.3rem" }}>
                      <CheckCheck size={13} /> Day Complete
                    </span>
                  ) : status === "in-progress" ? (
                    <span className="badge badge-primary" style={{ gap: "0.3rem" }}>
                      <Flame size={13} /> In Progress
                    </span>
                  ) : (
                    <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                      Pending
                    </span>
                  )}

                  {/* Mark All Day Tasks Toggle */}
                  <button
                    onClick={() => toggleEntireDay(dayIdx, tasks)}
                    className="btn-mark-day"
                    title={isAllDayDone ? "Uncheck all tasks for this day" : "Mark all tasks for this day as completed"}
                  >
                    {isAllDayDone ? "Uncheck Day" : "Complete Day"}
                  </button>
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="day-tasks-checklist">
                {tasks.map((task, taskIdx) => {
                  const isDone = !!completedTasks[`day${dayIdx}-task${taskIdx}`];
                  return (
                    <div
                      key={taskIdx}
                      onClick={() => toggleTask(dayIdx, taskIdx)}
                      className={`task-check-row ${isDone ? "task-row-done" : ""}`}
                    >
                      <button
                        type="button"
                        className={`custom-checkbox ${isDone ? "checked" : ""}`}
                        aria-label="Toggle task completion"
                      >
                        {isDone ? <Check size={13} strokeWidth={3} /> : null}
                      </button>
                      <span className="task-text">{task}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapTrackerTab;

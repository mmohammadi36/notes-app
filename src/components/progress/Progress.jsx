
import { useEffect, useState } from "react";
import "./Progress.css";

function Progress({ notes }) {
  const [plannerTasks, setPlannerTasks] = useState([]);

  // دریافت کارهای برنامه‌ریز
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("planner-tasks");

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          setPlannerTasks(parsedTasks);
        }
      }
    } catch (error) {
      console.error("خطا در دریافت کارهای برنامه‌ریز:", error);
    }
  }, []);

  // آمار یادداشت‌ها
  const totalNotes = notes.length;

  const completedNotes = notes.filter(
    (note) => note.completed
  ).length;

  const pendingNotes = totalNotes - completedNotes;

  const notesProgress = totalNotes
    ? Math.round((completedNotes / totalNotes) * 100)
    : 0;

  // آمار برنامه‌ریز
  const totalTasks = plannerTasks.length;

  const completedTasks = plannerTasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const tasksProgress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // آمار کلی
  const totalActivities = totalNotes + totalTasks;
  const completedActivities = completedNotes + completedTasks;

  const overallProgress = totalActivities
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  return (
    <section className="progress-page">
      <div className="page-heading">
        <h1>آمار و پیشرفت</h1>
        <p>
          پیشرفت‌های کوچک امروز، نتیجه‌های بزرگ فردا را می‌سازند.
        </p>
      </div>

      <div className="progress-summary">
        <div className="progress-summary-info">
          <span>پیشرفت کلی فعالیت‌ها</span>
          <strong>{overallProgress}٪</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill overall-fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <p>
          از {totalActivities} فعالیت، {completedActivities} مورد را
          تکمیل کرده‌ای.
        </p>
      </div>

      <div className="progress-section">
        <h2>وضعیت یادداشت‌ها</h2>

        <div className="progress-cards">
          <div className="progress-card">
            <span>کل یادداشت‌ها</span>
            <strong>{totalNotes}</strong>
          </div>

          <div className="progress-card">
            <span>تکمیل‌شده</span>
            <strong>{completedNotes}</strong>
          </div>

          <div className="progress-card">
            <span>باقی‌مانده</span>
            <strong>{pendingNotes}</strong>
          </div>
        </div>

        <div className="progress-detail">
          <div className="progress-summary-info">
            <span>درصد تکمیل یادداشت‌ها</span>
            <strong>{notesProgress}٪</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${notesProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h2>وضعیت برنامه‌ریزی</h2>

        <div className="progress-cards">
          <div className="progress-card">
            <span>کل کارها</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="progress-card">
            <span>انجام‌شده</span>
            <strong>{completedTasks}</strong>
          </div>

          <div className="progress-card">
            <span>باقی‌مانده</span>
            <strong>{pendingTasks}</strong>
          </div>
        </div>

        <div className="progress-detail">
          <div className="progress-summary-info">
            <span>درصد تکمیل برنامه‌ها</span>
            <strong>{tasksProgress}٪</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${tasksProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="progress-message">
        <span>🌱</span>
        <p>
          مهم نیست امروز چند کار انجام داده‌ای؛ مهم این است که
          برای بهتر شدن قدم برداشته‌ای.
        </p>
      </div>
    </section>
  );
}

export default Progress;

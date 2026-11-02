
import { useEffect, useMemo, useState } from "react";
import "./Focus.css";

const MODES = {
  focus: {
    title: "زمان تمرکز",
    duration: 25 * 60,
    description: "با تمرکز کامل روی یک کار پیش برو.",
  },
  short: {
    title: "استراحت کوتاه",
    duration: 5 * 60,
    description: "کمی استراحت کن و انرژی بگیر.",
  },
  long: {
    title: "استراحت بلند",
    duration: 15 * 60,
    description: "به خودت فرصت بیشتری برای استراحت بده.",
  },
};

const STORAGE_KEY = "rooznegar-focus-sessions";

const ACTIVITIES = [
  "یادگیری React",
  "تمرین و کدنویسی",
  "یادگیری برنامه‌نویسی",
  "مطالعه",
  "کار شخصی",
  "فعالیت دلخواه",
];

const getDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function Focus() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(
    MODES.focus.duration
  );
  const [isRunning, setIsRunning] = useState(false);

  const [activity, setActivity] = useState("یادگیری React");
  const [customActivity, setCustomActivity] = useState("");

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("خطا در دریافت جلسات تمرکز:", error);
      return [];
    }
  });

  const currentMode = MODES[mode];
  const selectedActivity =
    activity === "فعالیت دلخواه"
      ? customActivity.trim() || "فعالیت دلخواه"
      : activity;

  const progress =
    ((currentMode.duration - secondsLeft) /
      currentMode.duration) *
    100;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  // ذخیره جلسات در مرورگر
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // اجرای شمارشگر
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // پایان هر جلسه
  useEffect(() => {
    if (secondsLeft !== 0) return;

    setIsRunning(false);

    if (mode === "focus") {
      const newSession = {
        id: Date.now(),
        activity: selectedActivity,
        minutes: 25,
        date: getDateKey(),
      };

      setSessions((previous) => [...previous, newSession]);

      const nextSessionNumber = sessions.length + 1;
      const nextMode =
        nextSessionNumber % 4 === 0 ? "long" : "short";

      setMode(nextMode);
      setSecondsLeft(MODES[nextMode].duration);
    } else {
      setMode("focus");
      setSecondsLeft(MODES.focus.duration);
    }
  }, [secondsLeft, mode, selectedActivity, sessions.length]);

  // تغییر حالت تایمر
  const changeMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(MODES[newMode].duration);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(currentMode.duration);
  };

  // آمار امروز
  const today = getDateKey();

  const todaySessions = useMemo(
    () => sessions.filter((session) => session.date === today),
    [sessions, today]
  );

  const todayMinutes = todaySessions.reduce(
    (total, session) => total + session.minutes,
    0
  );

  // آمار هفت روز اخیر
  const weeklyStats = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));

      const key = getDateKey(date);

      const minutes = sessions
        .filter((session) => session.date === key)
        .reduce((total, session) => total + session.minutes, 0);

      return {
        key,
        label: new Intl.DateTimeFormat("fa-IR", {
          weekday: "short",
        }).format(date),
        minutes,
      };
    });
  }, [sessions]);

  const maxWeeklyMinutes = Math.max(
    ...weeklyStats.map((day) => day.minutes),
    25
  );

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset =
    circumference - (progress / 100) * circumference;

  return (
    <section className="focus-page">
      <div className="page-heading">
        <h1>تمرکز و تایمر</h1>
        <p>
          قدم‌های کوچک و متمرکز، تو را به هدف‌های بزرگ می‌رسانند.
        </p>
      </div>

      <div className="focus-layout">
        <div className="focus-card">
          <div className="focus-activity">
            <label htmlFor="focus-activity">
              روی چه کاری می‌خوای تمرکز کنی؟
            </label>

            <select
              id="focus-activity"
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              disabled={isRunning}
            >
              {ACTIVITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {activity === "فعالیت دلخواه" && (
              <input
                type="text"
                value={customActivity}
                onChange={(event) =>
                  setCustomActivity(event.target.value)
                }
                placeholder="عنوان فعالیتت رو بنویس"
                disabled={isRunning}
              />
            )}
          </div>

          <div className="focus-mode-buttons">
            <button
              className={mode === "focus" ? "active" : ""}
              onClick={() => changeMode("focus")}
              type="button"
            >
              تمرکز
            </button>

            <button
              className={mode === "short" ? "active" : ""}
              onClick={() => changeMode("short")}
              type="button"
            >
              استراحت کوتاه
            </button>

            <button
              className={mode === "long" ? "active" : ""}
              onClick={() => changeMode("long")}
              type="button"
            >
              استراحت بلند
            </button>
          </div>

          <div className="focus-timer">
            <svg viewBox="0 0 240 240">
              <circle
                className="focus-timer-bg"
                cx="120"
                cy="120"
                r={radius}
              />

              <circle
                className="focus-timer-progress"
                cx="120"
                cy="120"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
              />
            </svg>

            <div className="focus-timer-content">
              <span>{currentMode.title}</span>
              <strong>{formattedTime}</strong>
              <small>
                {isRunning ? "در حال تمرکز..." : "آماده‌ای؟"}
              </small>
            </div>
          </div>

          <p className="focus-description">
            {currentMode.description}
          </p>

          <p className="focus-current-activity">
            فعالیت: {selectedActivity}
          </p>

          <div className="focus-controls">
            <button
              className="focus-start-button"
              onClick={() => setIsRunning((previous) => !previous)}
              type="button"
            >
              {isRunning
                ? "توقف"
                : secondsLeft === currentMode.duration
                  ? "شروع"
                  : "ادامه"}
            </button>

            <button
              className="focus-reset-button"
              onClick={resetTimer}
              type="button"
            >
              بازنشانی
            </button>
          </div>
        </div>

        <div className="focus-side">
          <div className="focus-stat-card">
            <span>جلسات تمرکز امروز</span>
            <strong>{todaySessions.length}</strong>
            <small>جلسه ۲۵ دقیقه‌ای تکمیل‌شده</small>
          </div>

          <div className="focus-stat-card">
            <span>زمان تمرکز امروز</span>
            <strong>{todayMinutes} دقیقه</strong>
            <small>مجموع زمان جلسات تکمیل‌شده</small>
          </div>
        </div>
      </div>

      <div className="focus-week-card">
        <div className="focus-section-heading">
          <div>
            <h2>گزارش هفتگی تمرکز</h2>
            <p>میزان زمان تمرکزت در هفت روز اخیر</p>
          </div>
        </div>

        <div className="focus-week-chart">
          {weeklyStats.map((day) => (
            <div className="focus-week-day" key={day.key}>
              <strong>{day.minutes} دقیقه</strong>

              <div className="focus-week-bar">
                <div
                  style={{
                    height: `${
                      day.minutes === 0
                        ? 0
                        : Math.max(
                            8,
                            (day.minutes / maxWeeklyMinutes) * 100
                          )
                    }%`,
                  }}
                />
              </div>

              <span>{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="focus-history-card">
        <h2>جلسات امروز</h2>

        {todaySessions.length === 0 ? (
          <p className="focus-empty">
            هنوز جلسه تمرکزی ثبت نکردی. اولین جلسه رو شروع کن!
          </p>
        ) : (
          <div className="focus-history-list">
            {todaySessions.map((session, index) => (
              <div className="focus-history-item" key={session.id}>
                <span className="focus-history-number">
                  {index + 1}
                </span>

                <div>
                  <strong>{session.activity}</strong>
                  <small>۲۵ دقیقه تمرکز</small>
                </div>

                <span className="focus-history-check">✓</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="focus-tip">
        پیشنهاد روزنگار: بعد از هر چهار جلسه تمرکز، یک استراحت بلند داشته باش.
      </p>
    </section>
  );
}

export default Focus;

import { useEffect, useMemo, useState } from "react";
import "./Planner.css";

const STORAGE_KEY = "planner-tasks";

const categories = [
  "برنامه‌نویسی",
  "ورزش",
  "خانه",
  "خانواده",
  "شخصی",
  "سایر",
];

const priorities = {
  high: "زیاد",
  medium: "متوسط",
  low: "کم",
};

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getSavedTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

function Planner() {
  const [tasks, setTasks] = useState(getSavedTasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("شخصی");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState(getToday());
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const today = getToday();

  const todayTasks = useMemo(
    () => tasks.filter((task) => task.date === today),
    [tasks, today]
  );

  const completedTasks = todayTasks.filter((task) => task.completed).length;

  const progress =
    todayTasks.length > 0
      ? Math.round((completedTasks / todayTasks.length) * 100)
      : 0;

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      if (filter === "today") return task.date === today;
      if (filter === "pending") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });

    return result.sort((a, b) => {
      if (a.completed !== b.completed) {
        return Number(a.completed) - Number(b.completed);
      }

      return a.date.localeCompare(b.date);
    });
  }, [tasks, filter, today]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      date,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((previousTasks) => [newTask, ...previousTasks]);

    setTitle("");
    setDescription("");
    setCategory("شخصی");
    setPriority("medium");
    setDate(today);
  };

  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };

  const formatDate = (value) => {
    if (!value) return "";

    return new Date(`${value}T00:00:00`).toLocaleDateString("fa-IR");
  };

  return (
    <section className="planner-page" dir="rtl">
      <div className="planner-header">
        <div>
          <span className="planner-eyebrow">مدیریت زمان و کارها</span>
          <h1>برنامه‌ریزی من</h1>
          <p>قدم‌های کوچک امروز، موفقیت‌های بزرگ فردا</p>
        </div>

        <div className="planner-date">
          <span>امروز</span>
          <strong>{formatDate(today)}</strong>
        </div>
      </div>

      <div className="planner-stats">
        <div className="planner-stat-card">
          <span className="planner-stat-icon">📋</span>
          <div>
            <span>کل کارهای امروز</span>
            <strong>{todayTasks.length}</strong>
          </div>
        </div>

        <div className="planner-stat-card">
          <span className="planner-stat-icon">✅</span>
          <div>
            <span>کارهای انجام‌شده</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>

        <div className="planner-stat-card">
          <span className="planner-stat-icon">⏳</span>
          <div>
            <span>کارهای باقی‌مانده</span>
            <strong>{todayTasks.length - completedTasks}</strong>
          </div>
        </div>
      </div>

      <div className="planner-progress-card">
        <div className="planner-progress-heading">
          <div>
            <h3>پیشرفت امروز</h3>
            <p>هر کاری که انجام می‌دی، یک قدم به جلو هستی.</p>
          </div>

          <strong>{progress}٪</strong>
        </div>

        <div className="planner-progress-track">
          <div
            className="planner-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="planner-content">
        <form className="planner-form" onSubmit={handleSubmit}>
          <h3>افزودن کار جدید</h3>

          <div className="planner-field">
            <label htmlFor="task-title">عنوان کار</label>
            <input
              id="task-title"
              type="text"
              placeholder="مثلاً مطالعه ری‌اکت"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="planner-field">
            <label htmlFor="task-description">توضیحات</label>
            <textarea
              id="task-description"
              placeholder="توضیحات کوتاه درباره کار..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="3"
            />
          </div>

          <div className="planner-form-row">
            <div className="planner-field">
              <label htmlFor="task-date">تاریخ انجام</label>
              <input
                id="task-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>

            <div className="planner-field">
              <label htmlFor="task-category">دسته‌بندی</label>
              <select
                id="task-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="planner-field">
            <label htmlFor="task-priority">اولویت</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="high">زیاد</option>
              <option value="medium">متوسط</option>
              <option value="low">کم</option>
            </select>
          </div>

          <button type="submit" className="planner-add-button">
            <span>＋</span>
            افزودن به برنامه
          </button>
        </form>

        <div className="planner-task-section">
          <div className="planner-task-heading">
            <div>
              <h3>فهرست کارها</h3>
              <p>{filteredTasks.length} کار در این فهرست</p>
            </div>
          </div>

          <div className="planner-filters">
            {[
              { value: "all", label: "همه" },
              { value: "today", label: "امروز" },
              { value: "pending", label: "انجام‌نشده" },
              { value: "completed", label: "انجام‌شده" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={filter === item.value ? "active" : ""}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="planner-task-list">
            {filteredTasks.length === 0 ? (
              <div className="planner-empty">
                <span>📝</span>
                <h4>هنوز کاری ثبت نشده!</h4>
                <p>اولین کار خودت رو به برنامه اضافه کن.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <article
                  key={task.id}
                  className={`planner-task ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  <button
                    type="button"
                    className={`planner-check ${
                      task.completed ? "checked" : ""
                    }`}
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.completed
                        ? "علامت‌گذاری به‌عنوان انجام‌نشده"
                        : "علامت‌گذاری به‌عنوان انجام‌شده"
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="planner-task-info">
                    <h4>{task.title}</h4>

                    {task.description && <p>{task.description}</p>}

                    <div className="planner-task-meta">
                      <span>{task.category}</span>
                      <span>{formatDate(task.date)}</span>
                      <span className={`priority-${task.priority}`}>
                        اولویت {priorities[task.priority]}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="planner-delete"
                    onClick={() => deleteTask(task.id)}
                    aria-label="حذف کار"
                    title="حذف کار"
                  >
                    ×
                  </button>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Planner;
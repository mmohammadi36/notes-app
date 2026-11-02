
import { useEffect, useState } from "react";

function Planner() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // دریافت کارهای ذخیره‌شده هنگام ورود به صفحه
  useEffect(() => {
    const savedTasks = localStorage.getItem("planner-tasks");

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("خطا در خواندن کارهای ذخیره‌شده:", error);
      }
    }

    setIsLoaded(true);
  }, []);

  // ذخیره کارها بعد از بارگذاری اطلاعات اولیه
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("planner-tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // محاسبه آمار
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // افزودن کار جدید
  const addTask = (event) => {
    event.preventDefault();

    if (!taskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: taskTitle.trim(),
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskTitle("");
  };

  // تغییر وضعیت انجام کار
  const toggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // حذف کار
  const deleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  return (
    <section className="planner-page">
      <div className="page-heading">
        <h1>برنامه‌ریز من</h1>
        <p>برای امروزت برنامه‌ریزی کن و قدم‌به‌قدم پیش برو.</p>
      </div>

      <form onSubmit={addTask} className="planner-form">
        <input
          type="text"
          placeholder="چه کاری باید انجام بدی؟"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
        />

        <button type="submit">افزودن کار</button>
      </form>

      <div className="planner-stats">
        <div className="planner-stat">
          <span>کل کارها</span>
          <strong>{totalTasks}</strong>
        </div>

        <div className="planner-stat">
          <span>انجام‌شده</span>
          <strong>{completedTasks}</strong>
        </div>

        <div className="planner-stat">
          <span>باقی‌مانده</span>
          <strong>{pendingTasks}</strong>
        </div>
      </div>

      <div className="planner-progress">
        <div className="planner-progress-info">
          <span>پیشرفت امروز</span>
          <strong>{progress}٪</strong>
        </div>

        <div className="planner-progress-track">
          <div
            className="planner-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="planner-task-list">
        {tasks.length === 0 ? (
          <p>هنوز کاری ثبت نکردی. اولین کارت رو اضافه کن!</p>
        ) : (
          tasks.map((task) => (
            <div className="planner-task" key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />

                <span className={task.completed ? "completed" : ""}>
                  {task.title}
                </span>
              </label>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
              >
                حذف
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Planner;

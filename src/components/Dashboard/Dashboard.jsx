
function Dashboard({ notes, onNavigate }) {
  const completedNotes = notes.filter(
    (note) => note.completed
  ).length;

  const pendingNotes = notes.length - completedNotes;

  const progress = notes.length
    ? Math.round((completedNotes / notes.length) * 100)
    : 0;

  const today = new Date().toLocaleDateString("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const recentNotes = [...notes]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 3);

  return (
    <section className="dashboard">
      <div className="page-heading">
        <span>خوش آمدی 👋</span>
        <h1>امروز چه برنامه‌ای داری؟</h1>
        <p>{today}</p>
      </div>

      <div className="dashboard-cards">
        <article className="dashboard-card">
          <span>کل یادداشت‌ها</span>
          <strong>{notes.length}</strong>
        </article>

        <article className="dashboard-card">
          <span>انجام‌شده</span>
          <strong>{completedNotes}</strong>
        </article>

        <article className="dashboard-card">
          <span>در انتظار انجام</span>
          <strong>{pendingNotes}</strong>
        </article>
      </div>

      <div className="dashboard-progress">
        <div className="dashboard-progress__header">
          <h2>پیشرفت فعالیت‌ها</h2>
          <strong>{progress}٪</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p>
          {completedNotes} مورد از {notes.length} یادداشت انجام شده است.
        </p>
      </div>

      <div className="dashboard-recent">
        <div className="dashboard-recent__header">
          <h2>آخرین یادداشت‌ها</h2>

          <button onClick={() => onNavigate("notes")}>
            مشاهده همه
          </button>
        </div>

        {recentNotes.length === 0 ? (
          <p className="dashboard-empty">
            هنوز یادداشتی ثبت نکرده‌ای.
          </p>
        ) : (
          <div className="recent-note-list">
            {recentNotes.map((note) => (
              <article className="recent-note" key={note.id}>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                </div>

                <span className={note.completed ? "done" : "pending"}>
                  {note.completed ? "انجام‌شده" : "در انتظار"}
                </span>
              </article>
            ))}
          </div>
        )}
      </div>

      <button
        className="btn btn--primary dashboard-add-button"
        onClick={() => onNavigate("notes")}
      >
        + افزودن یادداشت جدید
      </button>
    </section>
  );
}

export default Dashboard;

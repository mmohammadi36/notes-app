
function NoteList({ notlist, onDelete, onCompleted, onEdit }) {
  if (notlist.length === 0) {
    return (
      <p className="note-list__empty">
        یادداشتی برای نمایش وجود ندارد.
      </p>
    );
  }

  return (
    <div className="note-list">
      {notlist.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onDelete={onDelete}
          onCompleted={onCompleted}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function NoteItem({ note, onDelete, onCompleted, onEdit }) {
  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "تاریخ نامشخص";

  return (
    <article className={`note-item ${note.completed ? "completed" : ""}`}>
      <div className="note-item__header">
        <div className="note-item__content">
          <h3 className="title">{note.title}</h3>
          <p className="desc">{note.description}</p>
          <p className="note-text">{note.text}</p>
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={() => onEdit(note)}
            aria-label={`ویرایش یادداشت ${note.title}`}
            title="ویرایش یادداشت"
          >
            ✏️
          </button>

          <button
            type="button"
            onClick={() => onDelete(note.id)}
            aria-label={`حذف یادداشت ${note.title}`}
            title="حذف یادداشت"
          >
            🗑️
          </button>

          <label>
            <input
              type="checkbox"
              checked={Boolean(note.completed)}
              onChange={() => onCompleted(note.id)}
              aria-label={`تغییر وضعیت ${note.title}`}
            />
            <span className="sr-only">انجام شد</span>
          </label>
        </div>
      </div>

      <div className="note-item__footer">
        <span>{formattedDate}</span>
      </div>
    </article>
  );
}

export default NoteList;

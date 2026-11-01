
function NoteStatus({ notes }) {
  const all = notes.length;

  const completed = notes.filter(
    (note) => note.completed
  ).length;

  const pending = all - completed;

  if (all === 0) {
    return (
      <p className="note-status__empty">
        هنوز یادداشتی اضافه نکرده‌اید.
      </p>
    );
  }

  return (
    <ul className="note-status">
      <li>
        کل یادداشت‌ها:
        <span>{all}</span>
      </li>

      <li>
        انجام‌شده:
        <span>{completed}</span>
      </li>

      <li>
        در انتظار انجام:
        <span>{pending}</span>
      </li>
    </ul>
  );
}

export default NoteStatus;

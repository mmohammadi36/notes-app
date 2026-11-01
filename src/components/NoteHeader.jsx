
function NoteHeader({ notes, sortBy, onSort }) {
  return (
 <header className="note-header">
      <div className="note-header__title">
        <h1>یادداشت‌های من</h1>
        <span>تعداد یادداشت‌ها: {notes.length}</span>
      </div>

      <div className="note-header__sort">
        <label htmlFor="sort-notes">
          مرتب‌سازی:
        </label>

        <select
          id="sort-notes"
          value={sortBy}
          onChange={onSort}
        >
          <option value="latest">
            جدیدترین یادداشت‌ها
          </option>

          <option value="earliest">
            قدیمی‌ترین یادداشت‌ها
          </option>

          <option value="completed">
            ابتدا انجام‌نشده‌ها
          </option>
        </select>
      </div>
    </header>
  );
}

export default NoteHeader;


import { useState, useEffect } from "react";

function AddNotes({
  onAddNote,
  editingNote,
  onUpdateNote,
  onCancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [text, setText] = useState("");

  // پر کردن فرم هنگام ویرایش
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setDescription(editingNote.description);
      setText(editingNote.text || "");
    } else {
      setTitle("");
      setDescription("");
      setText("");
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    const noteData = {
      title: title.trim(),
      description: description.trim(),
      text: text.trim(),
    };

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        ...noteData,
      });
    } else {
      onAddNote({
        id: Date.now(),
        ...noteData,
        completed: false,
        createdAt: new Date().toISOString(),
      });

      setTitle("");
      setDescription("");
      setText("");
    }
  };

  return (
    <section className="add-new-note">
      <h2>
        {editingNote ? "ویرایش یادداشت" : "افزودن یادداشت جدید"}
      </h2>

      <form className="note-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان یادداشت"
          className="text-field"
          required
          maxLength={80}
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="توضیح کوتاه"
          className="text-field"
          required
          maxLength={150}
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن یادداشت خود را بنویسید..."
          className="text-field"
          rows={4}
          maxLength={2000}
        />

        <button type="submit" className="btn btn--primary">
          {editingNote ? "ذخیره تغییرات" : "افزودن یادداشت"}
        </button>

        {editingNote && (
          <button
            type="button"
            className="btn btn--cancel"
            onClick={onCancelEdit}
          >
            لغو ویرایش
          </button>
        )}
      </form>
    </section>
  );
}

export default AddNotes;

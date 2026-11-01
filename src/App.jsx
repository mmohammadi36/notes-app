
import { useState, useMemo, useEffect } from "react";
import AddNotes from "./components/AddNotes";
import NoteList from "./components/NoteList";
import NoteStatus from "./components/NoteStatus";
import NoteHeader from "./components/NoteHeader";
import "./App.css";

const STORAGE_KEY = "notes-app-notes";

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error("خطا در دریافت یادداشت‌ها:", error);
      return [];
    }
  });

  const [sortBy, setSortBy] = useState("latest");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("خطا در ذخیره یادداشت‌ها:", error);
    }
  }, [notes]);

  // افزودن یادداشت جدید
  const handleAddNote = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  // انتخاب یادداشت برای ویرایش
  const handleEdit = (note) => {
    setEditingNote(note);
  };

  // ذخیره تغییرات یادداشت
  const handleUpdateNote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        String(note.id) === String(updatedNote.id)
          ? updatedNote
          : note
      )
    );

    setEditingNote(null);
  };

  // لغو ویرایش
  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  // حذف یادداشت
  const handleDelete = (id) => {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== id)
    );

    if (String(editingNote?.id) === String(id)) {
      setEditingNote(null);
    }
  };

  // تغییر وضعیت انجام‌شدن
  const handleCompleted = (noteId) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        String(note.id) === String(noteId)
          ? { ...note, completed: !note.completed }
          : note
      )
    );
  };

  // مرتب‌سازی یادداشت‌ها
  const sortedNotes = useMemo(() => {
    const newNotes = [...notes];

    switch (sortBy) {
      case "earliest":
        return newNotes.sort(
          (a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );

      case "latest":
        return newNotes.sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

      case "completed":
        return newNotes.sort(
          (a, b) =>
            Number(a.completed) - Number(b.completed)
        );

      default:
        return newNotes;
    }
  }, [notes, sortBy]);

  return (
    <div className="container">
      <NoteHeader
        notes={notes}
        sortBy={sortBy}
        onSort={(e) => setSortBy(e.target.value)}
      />

      <div className="note-app">
        <AddNotes
          onAddNote={handleAddNote}
          editingNote={editingNote}
          onUpdateNote={handleUpdateNote}
          onCancelEdit={handleCancelEdit}
        />

        <div className="note-container">
          <NoteStatus notes={notes} />

          <NoteList
            notlist={sortedNotes}
            onDelete={handleDelete}
            onCompleted={handleCompleted}
            onEdit={handleEdit}
          />
        </div>
      </div>

      <footer className="app-footer">
        <p>
          طراحی و توسعه با ❤️ توسط <strong>مریم محمدی</strong>
        </p>
        <span>© 2026 | تمامی حقوق محفوظ است</span>
      </footer>
    </div>
  );
}

export default App;

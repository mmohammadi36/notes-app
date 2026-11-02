
import { useState, useMemo, useEffect } from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import Planner from "./components/planner/Planner";
import Focus from "./components/focus/Focus";
import Progress from "./components/progress/Progress";

import AddNotes from "./components/AddNotes";
import NoteList from "./components/NoteList";
import NoteStatus from "./components/NoteStatus";
import NoteHeader from "./components/NoteHeader";
import Sidebar from "./components/layout/Sidebar";

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
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("خطا در ذخیره یادداشت‌ها:", error);
    }
  }, [notes]);

  const handleAddNote = (newNote) => {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
  };

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

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleDelete = (id) => {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== id)
    );

    if (String(editingNote?.id) === String(id)) {
      setEditingNote(null);
    }
  };

  const handleCompleted = (noteId) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        String(note.id) === String(noteId)
          ? { ...note, completed: !note.completed }
          : note
      )
    );
  };

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
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <main className="main-content">
        {activePage === "dashboard" && (
          <Dashboard
            notes={notes}
            onNavigate={setActivePage}
          />
        )}

        {activePage === "notes" && (
          <section className="page-content">
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
          </section>
        )}

        {activePage === "planner" && <Planner />}

        {activePage === "focus" && <Focus />}

        {activePage === "progress" && (
          <Progress notes={notes} />
        )}

        <footer className="app-footer">
          <p>
            طراحی و توسعه با ❤️ توسط <strong>مریم محمدی</strong>
          </p>
          <span>© 2026 | تمامی حقوق محفوظ است</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const NOTES_API = "http://localhost:8080/api/notes";
const AUTH_API = "http://localhost:8080/api/auth";


function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  async function handleAuth() {
    const url = `${AUTH_API}/${registerMode ? "register" : "login"}`;
    try {
      const res = await axios.post(url, { email, password });
      if (res.data.includes("Successful")) {
        if (!registerMode) setUser(email);
        alert(res.data);
      } else {
        alert(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchNotes() {
    try {
      const res = await axios.get(NOTES_API);
      setNotes(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function createNote() {
    if (!title && !content) return;
    const res = await axios.post(NOTES_API, { title, content });
    setNotes([...notes, res.data]);
    setTitle("");
    setContent("");
  }

  async function deleteNote(id) {
    await axios.delete(`${NOTES_API}/${id}`);
    setNotes(notes.filter((n) => n.id !== id));
  }

  function startEdit(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  async function updateNote() {
    await axios.put(`${NOTES_API}/${editingId}`, { title, content });
    setEditingId(null);
    setTitle("");
    setContent("");
    fetchNotes();
  }

  if (!user) {
    return (
      <div className="login-container">
        <h1>{registerMode ? "Register" : "Login"}</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleAuth}>
          {registerMode ? "Register" : "Login"}
        </button>
        <p
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => setRegisterMode(!registerMode)}
        >
          {registerMode
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>📝 My Notes</h1>
      <div className="note-form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {editingId ? (
          <div>
            <button onClick={updateNote}>Save</button>
            <button
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setContent("");
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={createNote}>Add Note</button>
        )}
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => startEdit(note)}>Edit</button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

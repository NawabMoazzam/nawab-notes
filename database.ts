import * as SQLite from "expo-sqlite";

export interface Note {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
}

// Open or create the database file.
const db = SQLite.openDatabaseSync("notes.db");

// Create the notes table if it does not exist yet.
export const initDatabase = (): void => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      createdAt TEXT NOT NULL
    );
  `);
};

// Save a new note.
export const addNote = (title: string, content: string): void => {
  const createdAt = new Date().toISOString();

  db.runSync(
    "INSERT INTO notes (title, content, createdAt) VALUES (?, ?, ?);",
    [title, content, createdAt],
  );
};

// Get a single note by its ID.
export const getNoteById = (id: number): Note | null => {
  const result = db.getFirstSync("SELECT * FROM notes WHERE id = ?;", [id]);
  return result ? (result as Note) : null;
};

// Fetch all saved notes (newest first).
export const getNotes = (): Note[] => {
  return db.getAllSync(
    "SELECT * FROM notes ORDER BY createdAt DESC;",
  ) as Note[];
};

// Update an existing note.
export const updateNote = (
  id: number,
  title: string,
  content: string,
): void => {
  db.runSync("UPDATE notes SET title = ?, content = ? WHERE id = ?;", [
    title,
    content,
    id,
  ]);
};

// Delete a note.
export const deleteNote = (id: number): void => {
  db.runSync("DELETE FROM notes WHERE id = ?;", [id]);
};

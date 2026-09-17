const pool = require("../config/db");

const getAllNotes = async () => {
  const result = await pool.query(
    "SELECT * FROM notes ORDER BY id"
  );

  return result.rows;
};

const getNoteByID = async (id) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE id = $1",
    [id]
  );

  return result.rows;
};

const createNote = async (title, content) => {
  const result = await pool.query(
    `INSERT INTO notes (title, content)
     VALUES ($1, $2)
     RETURNING *`,
    [title, content]
  );

  return result.rows[0];
};

const updateNote = async (id, title, content) => {
  const result = await pool.query(
    `UPDATE notes
     SET title = COALESCE($1, title),
         content = COALESCE($2, content),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [title, content, id]
  );

  return result.rows[0];
};

const deleteNote = async (id) => {
  const result = await pool.query(
    "DELETE FROM notes WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllNotes,
  getNoteByID,
  createNote,
  updateNote,
  deleteNote
};
const pool = require("../config/db");

const getAllTodos = async () => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id");
  return result.rows;
};

const getTodobyID = async (id) => {
  const result = await pool.query("SELECT * FROM todos WHERE ID=$1", [id]);
  return result.rows;
};

module.exports = {
  getAllTodos,
  getTodobyID
};

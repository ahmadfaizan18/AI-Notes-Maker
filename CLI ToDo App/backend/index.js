const fs = require("fs");
const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
app.use(express.json());

function saveTodos(todos, callback) {
  fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
    if (err) {
      return callback(err);
    }

    callback(null);
  });
}

//const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

app.get("/api/v1/todos", (req, res) => {
  pool.query("SELECT * FROM todos", (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch todos"
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        todos: result.rows
      }
    });
  });
});

app.get("/api/v1/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  pool.query("SELECT * FROM todos WHERE ID=$1", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch todos"
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `No ToDo with id:${id} exists`
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        todo: result.rows[0]
      }
    });
  });
});

app.post("/api/v1/todos", (req, res) => {
  const { title, completed } = req.body;
  pool.query(
    "INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *",
    [title, completed],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Failed to fetch todos"
        });
      }
      res.status(201).json({
        status: "success",
        data: {
          todo: result.rows
        }
      });
    }
  );
});

app.patch("/api/v1/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const fields = Object.keys(req.body);

  if (fields.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "No fields provided for update"
    });
  }

  const values = Object.values(req.body);

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  values.push(id);

  pool.query(
    `UPDATE todos
     SET ${setClause}
     WHERE id = $${values.length}
     RETURNING *`,
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: "Failed to update todo"
        });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: "error",
          message: `No ToDo with id:${id} exists`
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          todo: result.rows[0]
        }
      });
    }
  );
});

app.delete("/api/v1/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  pool.query(
    "DELETE FROM todos WHERE id = $1 RETURNING *",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: "Failed to update todo"
        });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: "error",
          message: `No ToDo with id:${id} exists`
        });
      }
      res.status(200).json({
        status: "success",
        data: {
          todo: null
        }
      });
    }
  );
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

app.listen(3000, () => {
  console.log("express server has started");
});

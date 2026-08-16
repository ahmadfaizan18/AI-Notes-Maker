const fs = require("fs");
const express = require("express");

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

const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

app.get("/api/v1/todos", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      todos
    }
  });
});

app.get("/api/v1/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return res.status(404).json({
      status: "error",
      message: `No ToDo with id:${id} exists`
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      todo
    }
  });
});

app.post("/api/v1/todos", (req, res) => {
  const nID = todos[todos.length - 1].id + 1;
  const todo = Object.assign({ id: nID }, req.body);
  todos.push(todo);
  saveTodos(todos, (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Failed to save todos"
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        todo
      }
    });
  });
});

app.patch("/api/v1/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return res.status(404).json({
      status: "error",
      message: `No ToDo with id:${id} exists`
    });
  }
  Object.assign(todo, req.body);
  saveTodos(todos, (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Failed to save todos"
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        todo
      }
    });
  });
});

app.delete("/api/v1/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return res.status(404).json({
      status: "error",
      message: `No ToDo with id:${id} exists`
    });
  }
  todos.splice(todos.indexOf(todo), 1);
  saveTodos(todos, (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Failed to save todos"
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        todo: null
      }
    });
  });
});

app.listen(3000, () => {
  console.log("express server has started");
});

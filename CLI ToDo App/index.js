const fs = require("fs");
const express = require("express");

let app = express();
app.use(express.json());
let todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

/*const result = todos
  .map((todo) => `${todo.id}, ${todo.title}, ${todo.completed}<br>`)
  .join("");*/

app.get("/api/v1/todos", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      todos
    }
  });
});

app.get("/api/v1/todos/:id", (req, res) => {
  const id = req.params.id * 1;
  const ntodo = todos.find((todo) => todo.id === id);
  if (!ntodo) {
    return res.status(404).json({
      status: "success",
      message: `No movie with id:${id} exists`
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      todo: ntodo
    }
  });
});

app.post("/api/v1/todos", (req, res) => {
  const nID = todos[todos.length - 1].id + 1;
  const ntodo = Object.assign({ id: nID }, req.body);
  todos.push(ntodo);
  fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
    res.status(200).json({
      status: "success",
      data: {
        todo: ntodo
      }
    });
  });
});

app.patch("/api/v1/todos/:id", (req, res) => {
  let id = req.params.id * 1;
  let newtodo = todos.find((todo) => todo.id === id);
  if (!newtodo) {
    return res.status(404).json({
      status: "success",
      message: `No movie with id:${id} exists`
    });
  }
  let index = todos.indexOf(newtodo);
  Object.assign(newtodo, req.body);
  todos[index] = newtodo;
  fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
    res.status(200).json({
      status: "success",
      data: {
        todo: newtodo
      }
    });
  });
});

app.delete("/api/v1/todos/:id", (req, res) => {
  let id = req.params.id * 1;
  let newtodo = todos.find((todo) => todo.id === id);
  let index = todos.indexOf(newtodo);
  if (!newtodo) {
    return res.status(404).json({
      status: "success",
      message: `No movie with id:${id} exists`
    });
  }
  todos.splice(index, 1);
  fs.writeFile("./todos.json", JSON.stringify(todos), (err) => {
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

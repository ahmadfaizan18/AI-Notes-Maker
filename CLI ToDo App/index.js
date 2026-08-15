const fs = require("fs");
const http = require("http");

const data = fs.readFileSync("./todos.json", "utf-8");
const todos = JSON.parse(data).todos;

const result = todos
  .map((todo) => `${todo.id}, ${todo.title}, ${todo.completed}<br>`)
  .join("");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(result);
});

server.listen(3000);

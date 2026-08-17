const Todo = require("../models/todoModel");

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.getAllTodos();

    res.status(200).json({
      status: "success",
      data: {
        todos
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch todos"
    });
  }
};

const getTodobyID = async (req, res) => {
  try {
    const todo = await Todo.getTodobyID(req.params.id);
    if (todo.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `No ToDo with id:${req.params.id} exists`
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        todo
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch todos"
    });
  }
};

module.exports = {
  getAllTodos,
  getTodobyID
};

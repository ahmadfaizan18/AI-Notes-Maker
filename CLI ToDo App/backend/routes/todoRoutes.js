const express = require("express");
const todoController = require("../controllers/todoController");

const router = express.Router();

router.get("/", todoController.getAllTodos);
router.get("/:id", todoController.getTodobyID);

module.exports = router;

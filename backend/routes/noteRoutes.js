const express = require("express");
const noteController = require("../controllers/noteController");

const router = express.Router();

router.get("/", noteController.getAllNotes);
router.get("/:id", noteController.getNoteByID);

router.post("/", noteController.createNote);
router.patch("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
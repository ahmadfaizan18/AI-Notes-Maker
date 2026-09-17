const Note = require("../models/noteModel");

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.getAllNotes();

    res.status(200).json({
      status: "success",
      data: {
        notes
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch notes"
    });
  }
};

const getNoteByID = async (req, res) => {
  try {
    const note = await Note.getNoteByID(req.params.id);

    if (note.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `No Note with id:${req.params.id} exists`
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        note
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch note"
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: "error",
        message: "Title and content are required"
      });
    }

    const note = await Note.createNote(title, content);

    res.status(201).json({
      status: "success",
      data: {
        note
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to create note"
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    if (title === undefined && content === undefined) {
      return res.status(400).json({
        status: "error",
        message: "No fields provided for update"
      });
    }

    const note = await Note.updateNote(id, title, content);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: `No Note with id:${id} exists`
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        note
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to update note"
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const note = await Note.deleteNote(id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: `No Note with id:${id} exists`
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        note
      }
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to delete note"
    });
  }
};

module.exports = {
  getAllNotes,
  getNoteByID,
  createNote,
  updateNote,
  deleteNote
};
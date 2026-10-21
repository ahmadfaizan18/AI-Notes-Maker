const Tag = require("../models/tagModel");

const isValidID = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};

const getAllTags = async (req,res) => {
  try {
    const tags = await Tag.getAllTags();

    res.status(200).json({
      status: "success",
      data: {
        number: tags.length,
        tags,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "failed to fetch tags",
    });
  }
};

const getTagByID = async (req, res) => {
  try {
    if (!isValidID(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid ID!",
      });
    }
    const tag = await Tag.getTagByID(req.params.id);

    if (!tag) {
      return res.status(404).json({
        status: "error",
        message: `This tag doesn't exist`,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tag,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch tag",
    });
  }
};

const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Tag is required",
      });
    }
    const trimmedName=name.trim()
    const tag = await Tag.createTag(trimmedName);

    res.status(201).json({
      status: "success",
      data: {
        tag,
      },
    });
  } catch (err) {
    console.log(err);

    if (err.code === "23505") {
      return res.status(409).json({
        status: "error",
        message: "Tag already exists",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Failed to add Tag",
    });
  }
};

const updateTag = async (req, res) => {
  try {
    if (!isValidID(req.params.id))
      return res.status(400).json({
        status: "error",
        message: "Invalid ID!",
      });

    const id = Number(req.params.id);
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Tag must be a non-empty string",
      });
    }

    const trimmedName=name.trim()
    const tag = await Tag.updateTag(id, trimmedName);

    if (!tag) {
      return res.status(404).json({
        status: "error",
        message: `No Tag with id:${id} exists`,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tag,
      },
    });
  } catch (err) {
    console.log(err);
    if (err.code === "23505") {
      return res.status(409).json({
        status: "error",
        message: "Use a new tag name",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Failed to update tag",
    });
  }
};

const deleteTag = async (req, res) => {
  try {
    if (!isValidID(req.params.id))
      return res.status(400).json({
        status: "error",
        message: "Invalid ID!",
      });
    const id = Number(req.params.id);
    const tag = await Tag.deleteTag(id);

    if (!tag) {
      return res.status(404).json({
        status: "error",
        message: `No Tag with id:${id} exists`,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tag,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to delete tag",
    });
  }
};

module.exports = {
  getAllTags,
  getTagByID,
  createTag,
  updateTag,
  deleteTag,
};
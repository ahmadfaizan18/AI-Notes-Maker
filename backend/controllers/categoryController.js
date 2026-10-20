const Category = require("../models/categoryModel");
const isValidId = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();

    res.status(200).json({
      status: "success",
      data: {
        number: categories.length,
        categories,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch categories",
    });
  }
};

const getCategoryByID = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return res.status(400).json({
        status: "error",
        message: "Invalid ID!",
      });
    const category = await Category.getCategoryByID(req.params.id);

    if (category.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `This note with id:${req.params.id} has no categories`,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch category",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Category is required",
      });
    }

    const category = await Category.createCategory(name);

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    console.log(err);

    if (err.code === "23505") {
      return res.status(409).json({
        status: "error",
        message: "Category already exists",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Failed to add category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return res.status(400).json({
        status: "error",
        message: "Invalid ID!",
      });

    const id = Number(req.params.id);
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Category must be a non-empty string",
      });
    }

    const category = await Category.updateCategory(id, name);

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: `No Category with id:${id} exists`,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    console.log(err);
    if (err.code === "23505") {
      return res.status(409).json({
        status: "error",
        message: "Use a new category name",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Failed to update category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    if (!isValidId(req.params.id))
      return res.status(400).json({
        status: "error",
        message: "Invalid ID!",
      });
    const id = Number(req.params.id);
    const category= await Category.deleteCategory(id);

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: `No Category with id:${id} exists`,
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "error",
      message: "Failed to delete category",
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryByID,
  createCategory,
  updateCategory,
  deleteCategory,
};

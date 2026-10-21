const express = require("express");
const tagController = require("../controllers/tagController");

const router = express.Router();

router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getTagByID);

router.post("/", tagController.createTag);
router.patch("/:id", tagController.updateTag);
router.delete("/:id", tagController.deleteTag);

module.exports = router;
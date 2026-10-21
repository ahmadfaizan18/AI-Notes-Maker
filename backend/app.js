const express = require("express");
const noteRoutes = require("./routes/noteRoutes");
const categoryRoutes=require("./routes/categoryRoutes")
const tagRoutes=require("./routes/tagRoutes")
const cors=require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/categories",categoryRoutes);
app.use("/api/v1/tags",tagRoutes)

module.exports = app;
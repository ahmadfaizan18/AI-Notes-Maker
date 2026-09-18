const express = require("express");
const noteRoutes = require("./routes/noteRoutes");
const cors=require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/notes", noteRoutes);

module.exports = app;
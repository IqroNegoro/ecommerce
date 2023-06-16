const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routers = require("./routers/routers");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use(routers);

app.listen(3000, () => console.log("listening on port 3000"));
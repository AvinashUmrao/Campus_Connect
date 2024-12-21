const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dbURL = process.env.DB_URL;
const bodyParser = require("body-parser");


mongoose.connect(dbURL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));


app.use(cookieParser(process.env.SECRET));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["*" ],
    credentials: true,
  })
);


app.use(express.json());

const user = require("./routes/userRoutes");
app.use("/user", user);


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  console.log(err);
  res.status(statusCode).json(err.message);
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

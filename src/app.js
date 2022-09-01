const express = require("express");
const morgan = require("morgan");

const app = express();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
  res.status(200).end("hello");
});

module.exports = app;

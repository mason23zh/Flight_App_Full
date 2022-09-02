const express = require("express");
const morgan = require("morgan");
const airportsRoutes = require("./routes/airportsRoutes");

const app = express();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/airports", airportsRoutes);

module.exports = app;

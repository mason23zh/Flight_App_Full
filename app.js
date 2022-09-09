const express = require("express");
require('express-async-error');
const morgan = require("morgan");
const airportsRoutes = require("./routes/airportsRoutes");
const userRoutes = require('./routes/userRoutes')
const errorHandler = require('./common/middlewares/error-handler');
const NotFoundError = require('./common/errors/NotFoundError');

const app = express();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use("/api/v1/airports", airportsRoutes);
app.use('/api/v1/users', userRoutes);

app.all("*", (req, res) => {
  throw new NotFoundError("Page Not Found");
})

app.use(errorHandler);

module.exports = app;

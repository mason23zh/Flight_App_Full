const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config({ path: "./config.env" });

mongoose.connect(`${process.env.DATABASE}`).then(() => {
  console.log("DB connected");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Express starts on port ${port}`);
});

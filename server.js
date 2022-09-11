const mongoose = require("mongoose");
const app = require("./app");
const { PORT } = require("./config");
require("dotenv").config({ path: "./config.env" });

mongoose.connect(`${process.env.DATABASE}`).then(() => {
    console.log("DB connected");
});

app.listen(PORT, () => {
    console.log(`Express starts on port ${PORT}`);
});

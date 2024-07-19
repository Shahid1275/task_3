const express = require("express");
const bodyParser = require("body-parser");
const itemRoutes = require("./source/items/routes");
const app = express();
// app.use(express.json());
//new:
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = 3000;
app.get("/", (req, res) => {
  res.send("Nothing to Show Here.");
});
//route file for crud of items:
app.use("/items", itemRoutes);
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
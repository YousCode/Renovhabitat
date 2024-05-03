require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

require("./mongo");

const { PORT, APP_URL, ADMIN_URL } = require("./config.js");

const app = express();

const origin = ["https://kolab-app.cleverapps.io", "http://localhost:8082", "https://kolab-admin.cleverapps.io", "http://localhost:8083"];

console.log("origin", origin);
app.use(cors({ credentials: true, origin }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(__dirname + "/../public"));

app.use("/user", require("./controllers/user"));
app.use("/admin", require("./controllers/admin"));
app.use("/project", require("./controllers/project"));
app.use("/task", require("./controllers/task"));
app.use("/workspace", require("./controllers/workspace"));
app.use("/freelance_request", require("./controllers/freelance_request"));
app.use("/comment", require("./controllers/comment"));
app.use("/media", require("./controllers/media"));
app.use("/ventes", require("./controllers/ventes"));

const d = new Date();

app.get("/", async (req, res) => {
  res.status(200).send("COUCOU " + d.toLocaleString());
});

require("./passport")(app);

app.listen(PORT, () => console.log("Listening on port " + PORT));

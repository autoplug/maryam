let fs = require("fs");
let ejs = require("ejs");
let express = require("express");
let app = express();

let index_html = fs.readFileSync("index.html", "utf8");

let view = ejs.render(index_html, { rows: "" });

//static file
app.use(express.static("./"));

app.get("/", (req, res) => {
  res.send(view);
});

app.get("/test", (req, res) => {
  res.send(view);
});

app.listen(8080);

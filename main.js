const port = 3000;
const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.send("Hello World!");
});
// URLパラメータを取得する経路
app.get("/items/:vegetable", (req, res) => {
	let veg = req.params.vegetable;
	res.send(`This is the page for ${veg}`);
});

app.listen(port, () => {
	console.log("server start http://localhost:%d/", port);
});

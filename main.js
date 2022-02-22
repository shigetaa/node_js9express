const port = 3000;
const express = require("express");
const app = express();

// ミドルウェアカンスト定義
app.use((req, res, next) => {
	// リクエストのパスをログに出力する
	console.log(`request made to: ${req.url}`);
	next();
});
// URLエンコードされたデータを解析する
app.use(
	express.urlencoded({
		exteeeended: false
	})
);
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});
// URLパラメータを取得する経路
app.get("/items/:vegetable", (req, res) => {
	let veg = req.params.vegetable;
	res.send(`This is the page for ${veg}`);
});
// POST
app.post("/", (req, res) => {
	console.log(req.body);
	console.log(req.query);
	res.send("POST Successful!");
});

app.listen(port, () => {
	console.log("server start http://localhost:%d/", port);
});

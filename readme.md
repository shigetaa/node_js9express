# Express.js でのルーティング

Express.js のインストールについては以前紹介しましたので、
[Express.js パッケージをインストール](https://github.com/shigetaa/node_js8express)を参照して下さい。

Express.js では、「パラメータのあるパス」を使う経路を書くことができます。
これらのパラメータはリクエスト経由でデータを送る方法のひとつです。（もう一つの方法がクエリ文字列です。）この「経路パラメータ」は、その前にコロン `:` を書けば、パスのどこでも置けます。
それでは、`main.js`と言うファイル名でコードを記述してみましょう。

```javascript
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
```
以下のコマンドを実行してみます。

```bash
node main.js
```
```bash
server start http://localhost:3000/
```
Webブラウザで`http://localhost:3000/items/tomato`にアクセスしてみて **This is the page for tomato** が表示されると思います。

Express.js の経路について、リクエストの受信と、そのリクエストの処理との間に処理追加することが可能です。
ここでは、`main.js`にリクエストを受信前に、ログを出力する処理を追加してみます。

```javascript
const port = 3000;
const express = require("express");
const app = express();

// ミドルウェアカンスト定義
app.use((req, res, next) => {
	// リクエストのパスをログに出力する
	console.log(`request made to: ${req.url}`);
	next();
});

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
```

HTTPメソッドと同様に、どのリクエストでも実行される `app.use` 関数を定義してログを出力しましたが、指定したURLだけ処理を実行する事もできます。
例えば `/items/:vegetable` のURL時に処理する場合は、
`app.use("/items/:vegetable", (req, res, next) => {})` と書けば実行できます。
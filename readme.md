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


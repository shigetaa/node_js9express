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

## リクエストのデータを解析する
アプリケーションでは人目を惹く動的なレスポンスも重要ですが、ユーザーのリクエストからデータを取得する能力を示さなければなりません。

- POSTリクエストの本文から取り出す
- リクエストのURLに入っているクエリ文字列から取り出す

Express.jsでは、body 属性によってリクエスト本文を簡単に取り出すことができます。
bodyの内容を読みだす際に、着信したリクエストの本文を解析する為 `express.json` と `express.urlencoded` を `app` インスタントに追加します。

下記のコード`main.js`では、ポストされたデータをコンソールに出力するのに、`req.body` を使っている事に注目しましょう。そのコードを `app.use` によって、着信するリクエストのうち、URLエンコードされたJSONフォーマットのリクエストを解析したいことをExpress.jsに知らせます。次に、ポストされたデータのために新しい経路を作ります。このプロセスは、post メソッドを使い、URLを指定するだけのシンプルなものです。そして最後にポストされたフォームの内容を、その `request` オブジェクトおよび `body` 属性とともに出力します。

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
```
以下のコマンドを実行してみます。

```bash
node main.js
```
```bash
server start http://localhost:3000/
```
このコードをテストする為、`http://localhost:3000/` に向けて、POST リクエストを出すためには、次の `curl` コマンドを使用します。
```bash
curl --data "first_name=Shigeta&last_name=Akira" http://localhost:3000/
```
すると次のような本文がサーバーのコンソールにロギングされます。
```bash
{ first_name: "Shigeta", last_name: "Akira" }
```

## MVCを使う
Express.jsはカスタムモジュールの可能性を広げ、リクエストとレスオンスのサイクルの中でデータを読み、編集し、レスポンスするコードを書けるようにしてくれます。
成長を続けるコードベースを組織化する為、今後は**MVC**と呼ばれるアプリケーションの機能が、モデル、ビュー、コントローラーという３つの主な部分に集約されます。

| 名称           | 説明                                                                                                                                                                             |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ビュー         | アプリケーションからのデータをレンダリングしたもの。                                                                                                                             |
| モデル         | アプリケーションとデータベースの中で、オブジェクト指向のデータを表現するクラス。                                                                                                 |
| コントローラー | ビューとモデルを結びつけるもの。リクエストを受信した時、リクエスト本体データの処理方法や、モデル及びビューとの関係などを決定するロジックは、その大半をコントローラが実行します。 |

MVCのデザインパターンに従って、コールバック関数を、その用途を示す名前の別モジュールに移しましょう。
たとえばユーザーアカウントの作成、削除、変更に関するコールバック関数は、`controllers` フォルダの `usersController.js` というファイルに入れます。
そしてホームページや、その他の情報を表示する経路の関数は、慣例に従って `homeController.js` にいれます。

```path
main.js
router.js
package.json
public/
 L images/
 L js/
 L css/
views/
 L index.html
controllers/
 L homeController.js
models/
```
上記のようなファイル構成に変更します。

コントローラー、モジュールを`homeController.js`と言うファイルを作成し下記の様に記述します。
```javascript
exports.sendReqParam = (req, res) => {
	let veg = req.params.vegetable;
	res.send(`This is the page for ${veg}`);
};
```
そして、`main.js`の先頭に次のコードを追記して`homeController.js`ファイルをロードします。
`const homeController = require("./controllers/homeController");`
経路のコールバック関数群が、homeController に移したので以下の様に書き換えます
`app.get("/items/:vegetable", homeController.sendReqParam);`
このパスへのリクエストが来たら、`homeController.sendReqParam`関数が実行されます。


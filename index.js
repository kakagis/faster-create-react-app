const fs = require("fs");
const url = require("url");
const path = require("path");
const { exec } = require("child_process");

const dir = process.cwd();

const devDeps =
	"npm install -D webpack webpack-cli webpack-dev-server @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader style-loader file-loader html-webpack-plugin";

const webpackConfig = `const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	mode: "production",
	entry: "./src/index.jsx",
	output: {
		filename: "bundle.[hash].js",
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
	],
	resolve: {
		modules: [__dirname, "src", "node_modules"],
		extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: require.resolve("babel-loader"),
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.png|svg|jpg|gif$/,
				use: ["file-loader"],
			},
		],
	},
};`;

const babelRC = `{
	"presets": ["@babel/preset-env", "@babel/preset-react"]
}`;

const appFile = `import React from "react"

const App = () => {
	return (
		<div>
			<h1>Hello World</h1>
		</div>
	)
}

export default App;`;

const indexFile = `import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles.css";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);`;

const cssFile = `body {
	margin: 0;
	padding: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color: #eee;
	background-color: #111;
	font-family: system-ui;
}`;

const htmlFile = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>React App</title>
	</head>
	<body>
		<div id="root"></div>
	</body>
</html>`;

const handleExecCommand = (err, stdout, stderr) => {
	if (err) {
		console.log(err);
		return;
	}
	if (stderr) {
		console.log(stderr);
		return;
	}
	console.log(stdout);
};

const generatePackageJSONFile = (dir) => {
	const parsedDir = url.parse(__dirname).pathname.split("/");

	return `{
		"name": "${parsedDir[parsedDir.length - 1]}",
		"version": "1.0.0",
		"description": "",
		"main": "index.js",
		"scripts": {
			"start": "webpack serve --hot --open",
			"build": "webpack --config webpack.config.js --mode production"
		},
		"keywords": [],
		"author": "",
		"license": "ISC"
	}`;
};

const appendFiles = (dir = "") => {
	fs.mkdirSync(path.join(dir, "src"));
	fs.mkdirSync(path.join(dir, "public"));
	fs.appendFileSync(path.join(dir, "webpack.config.js"), webpackConfig);
	fs.appendFileSync(path.join(dir, ".babelrc"), babelRC);
	fs.appendFileSync(
		path.join(dir, "package.json"),
		generatePackageJSONFile(dir)
	);
	fs.appendFileSync(path.join(dir, "src", "App.jsx"), appFile);
	fs.appendFileSync(path.join(dir, "src", "index.jsx"), indexFile);
	fs.appendFileSync(path.join(dir, "src", "styles.css"), cssFile);
	fs.appendFileSync(path.join(dir, "public", "index.html"), htmlFile);
};

(() => {
	exec("npm init -y", { cwd: dir }, handleExecCommand);

	exec("npm install react react-dom", { cwd: dir }, handleExecCommand);

	exec(devDeps, { cwd: dir }, handleExecCommand);

	appendFiles(dir);
})();

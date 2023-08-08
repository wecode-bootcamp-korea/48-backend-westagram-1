require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { DataSource } = require("typeorm");
// 변수명: my -> app
const appDataSource = new DataSource({
  // TYPEORM -> DB (종속성 문제)
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const app = express();
// app.use(): req -> app.js(middleware) -> res
app.use(cors());
app.use(morgan("combined"));

app.get("/ping", function (req, res) {
  res.json({ message: "pong" });
});

// 서버가 동작하고 DB가 연결되어야함 (비동기적으로 수행되어 언제든지 호출)
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await appDataSource
    .initialize()
    .then(() => {
      // then: 올바르게 initialize() 되었음
      console.log("Data Source has been initialized!");
    })
    .catch((error) => {
      // catch: 에러를 잡아냄
      console.error("Error during Data Source initialization", error);
    });
  console.log(`Listening to request on port: ${PORT}`);
});

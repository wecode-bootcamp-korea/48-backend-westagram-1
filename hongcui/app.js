require("dotenv").config();
const express = require("express");
const cors = require("cors");

const morgan = require("morgan");

const { DataSource } = require("typeorm");

const bcrypt = require("bcrypt");

const DataSource_id = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

DataSource_id.initialize().then(() => {
  console.log("Data Source has been initialized!");
});
const app = express();
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

app.post("/users", async (req, res) => {
  const { user_id, password, email } = req.body;
  const saltRounds = 12;
  const hash_password = bcrypt.hashSync(password, saltRounds);

  await DataSource_id.query(
    "INSERT INTO users(user_id, password, email ) VALUES (?, ?, ?);",
    [user_id, hash_password, email]
  );
  res.status(201).json({ message: "successfully created" });
});

// main();

// app.get("/users", async (req, res) => {
//   await myDataSource.query(
//     `SELECT
//           users.user_id,
//           users.password,
//           users.email
//       FROM users`,
//     (err, rows) => {
//       res.status(200).json(rows);
//     }
//   );
// });

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

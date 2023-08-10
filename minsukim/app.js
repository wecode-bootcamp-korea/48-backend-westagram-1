const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

const dotenv = require("dotenv");

const bcrypt = require("bcrypt");

dotenv.config();
const PORT = process.env.PORT;

const { DataSource } = require("typeorm");

const appDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const start = async () => {
  try {
    app.listen(PORT, () => {
      appDataSource
        .initialize()
        .then(() => {
          console.log("Data Source has been initialized!");
        })
        .catch((error) => console.error("mysql connection error", error));
      console.log(`Server is listening on ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

app.post("/user", async (req, res, next) => {
  const saltRounds = 12;

  const { name, email, password } = req.body;

  const hashpassword = bcrypt.hashSync(password, saltRounds);

  await appDataSource.query(
    `INSERT INTO users
    (name,email,password)
    VALUES (? , ? , ?);`,
    [name, email, hashpassword]
  );
  res.status(201).json({ message: "userCreated" });
});

start();

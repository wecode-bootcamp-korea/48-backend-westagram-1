const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

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

app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

app.post("/users/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashpassword = bcrypt.hashSync(password, 12);
    await appDataSource.query(
      `INSERT INTO users (
        name,
        email,
        password
        )
      VALUES (? , ? , ?)`,
      [name, email, hashpassword]
    );
    res.status(201).json({ message: "userCreated" });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await appDataSource.query(
      `
        SELECT *
        FROM users u
        WHERE u.email = ?
      `,
      [email]
    );
    if (!users) {
      const err = new Error("specified user does not exist");
      err.statusCode = 404;
      throw err;
    }

    const checkPassword = await bcrypt.compare(password, users.password);

    if (!checkPassword) {
      const err = new Error("invalid password");
      err.statusCode = 401;
      throw err;
    }

    const accessToken = jwt.sign(
      { sub: users.id, email: users.email },
      process.env.JWT_SECRET
    );

    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode || 401).json({ message: err.message });
  }
});

app.listen(3000, async () => {
  await appDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((error) => {
      console.error("Error during Data Source has been initialized", error);
    });

  console.log(`Listening to request on port: ${3000}`);
});

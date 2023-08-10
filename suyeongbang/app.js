require("dotenv").config();

const express = require("express");

const cors = require("cors");
const morgan = require("morgan");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { DataSource } = require("typeorm");

const appDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Health check
app.get("/ping", function (req, res) {
  res.status(200).json({ message: "pong" });
});

// Create users
app.post("/users/signup", async (req, res) => {
  try {
    const { name, email, profile_image, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 5);

    await appDataSource.query(
      `INSERT INTO users (
        name,
        email,
        profile_image,
        password
        ) VALUES (?, ?, ?, ?);`,
      [name, email, profile_image, hashedPassword]
    );

    res.status(201).json({ message: "successfully created" });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
});

// Signin validation
app.post("/users/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await appDataSource.query(
      `SELECT * FROM users WHERE email = ?;`,
      [email]
    );

    if (!user) {
      const err = new Error("specified user does not exist");
      err.statusCode = 404;
      throw err;
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      const err = new Error("invalid password");
      err.statusCode = 401;
      throw err;
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    res.status(err.statusCode || 401).json({ message: err.message });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  await appDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((error) => {
      console.error("Error during Data Source initialization", error);
    });
  console.log(`Listening to request on port: ${PORT}`);
});

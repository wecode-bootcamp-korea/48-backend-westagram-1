require("dotenv").config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const app = express();

const {DataSource} = require('typeorm');

const appDataSoure = new DataSource({
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));


const PORT = process.env.PORT

app.get('/ping', (req, res) => {
    res.status(200).json({message: "pong"});
});


app.post('/users', async(req, res) => {
    const {name, email, profile_image, password} = req.body;

    await appDataSoure.query(
        `INSERT INTO users(
            name, 
            email,
            profile_image,
            password
        ) VALUES (?, ?, ?, ?);`,
        [name, email, profile_image, password]
    );
    res.status(201).json({message: "user Creaeted"});
});


app.listen(PORT, async (req, res) => {
    await appDataSoure
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((error) => {
        console.error('Error during Data Source initialization', error);
      });
  
    console.log(`Listening to request on port: ${PORT}`);
  });

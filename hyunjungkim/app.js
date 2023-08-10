require("dotenv").config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const {DataSource} = require('typeorm');

const appDataSoure = new DataSource({
    database_url: process.env.DATABASE_URL,
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


app.post('/books', async(req, res) => {
    const {title, description, cover_image} = req.body;

    await appDataSoure.query(
        `INSERT INTO books(
            title, 
            description,
            cover_image
        ) VALUES (?, ?, ?);`,
        [title, description, cover_image]
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

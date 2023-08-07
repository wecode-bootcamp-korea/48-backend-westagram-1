
const dotenv = require("dotenv");
const express = require('express');
const app = express();

dotenv.config();

app.post('/users', async(req, res)=> {
    const {name, email, profile_image, password} = req.body

    await myDataSoure.query(
    `INSERT INTO users(
        name,
        email,
        profile_image,
        password
    ) VALUES ('hjk','hjk123@gmail.com','https://github.com/amacneil/dbmate#command-line-options',password4);`,
    [name,email,profile_image,password]
);
    res.status(201).json({message: "sucessfully created"});
    
})

const {DataSource} = require('typeorm');

const myDataSoure = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

myDataSoure.initialize().then(() => {
    console.log("Data Source has been initialized!")
    const DataSource = myDataSoure.query('SELECT * FROM users')
});

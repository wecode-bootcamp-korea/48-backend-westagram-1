import morgan from "morgan";


const express = require('express');
const logger = require("morgan");

const cors = require('cors');

const app = express();

app.use(cors());

app.get('/ping', function (req,res,next) {
    res.json({message: 'pong'})  
});

app.listen(3000, function(){
    console.log('server listening on port 3000')
});

app.listen(3000, () => {console.log("Running on port 3000");}) ;
app.use(morgan('combined'));
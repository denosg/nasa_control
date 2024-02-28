const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

//cross origin
app.use(cors({
    origin: 'http://localhost:3000'
}));
//logging
app.use(morgan('combined'));

app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))
app.use('/v1', api)
// uses express's mapping 
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app
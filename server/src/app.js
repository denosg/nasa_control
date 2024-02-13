const express = require('express');
const cors = require('cors');

const planetsRouter = require('./routes/planets/planets.router')

const app = express();

app.use(express.json())
app.use(planetsRouter)
app.use(cors({
    origin: 'http://localhost:3000'
}));

module.exports = app
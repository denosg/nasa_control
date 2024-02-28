const { parse } = require('csv-parse');
const path = require('path');
const fs = require('fs');

const planets = require('./planets.mongo');

const options = {
    comment: '#',
    columns: true,
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../', '../', 'data', 'kepler_data.csv'))
            .pipe(parse(options))
            .on('data', (data) => onData(data))
            .on('error', (err) => {
                onError(err);
                reject();
            })
            .on('close', () => {
                onEnd();
                resolve();
            })
    });
}

async function onData(data) {
    if (isHabitablePlanet(data)) {
        await savePlanet(data)
    }
}

async function onEnd() {
    const planetsCount = (await getAllPlanets()).length
    console.log(`${planetsCount} habitable planets found !`);
}

function onError(err) {
    console.log(`Err: ${err}`);
}

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function getPlanetName(planet) {
    return planet['kepler_name'];
}

async function savePlanet(data) {
    try {
        await planets.updateOne({
            keplerName: data.kepler_name,
        }, {
            keplerName: data.kepler_name,
        }, {
            upsert: true
        });
    } catch (err) {
        console.error(`Could not save planet. ERR: ${err}`);
    }
}

async function getAllPlanets() {
    return planets.find({}, {
        '_id': 0, '__v': 0,
    });
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
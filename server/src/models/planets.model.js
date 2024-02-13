const { parse } = require('csv-parse');
const path = require('path');
const fs = require('fs');

const habitablePlanets = [];

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

function onData(data) {
    if (isHabitablePlanet(data)) {
        habitablePlanets.push(data)
    }
}

function onEnd() {
    console.log(`${habitablePlanets.length} habitable planets found !`);
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

module.exports = {
    loadPlanetsData,
    planets: habitablePlanets,
}
const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

const options = {
    comment: '#',
    columns: true,
}

fs.createReadStream('../kepler_data.csv')
    .pipe(parse(options))
    .on('data', (data) => onData(data))
    .on('error', (err) => onError(err))
    .on('close', onEnd)

function onData(data) {
    if (isHabitablePlanet(data)) {
        habitablePlanets.push(data)
    }
}

function onEnd() {
    console.log(habitablePlanets.map((planet) => {
        return getPlanetName(planet)
    }));
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
    planets: habitablePlanets,
}
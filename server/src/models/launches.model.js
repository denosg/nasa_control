const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function populateLaunches() {
    console.log(`Downloading Launch Data From spacex Api`);
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.error(`Problem downloading launch data.`);
        throw new Error('Launch download failed.')
    }

    const launchDocs = response.data.docs
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }

        console.log(`${launch.flightNumber} ${launch.rocket}`);

        await saveLaunch(launch)
    }
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })
    if (firstLaunch) {
        console.log(`Launch data already loaded.`);
        return;
    }
    await populateLaunches()
}

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function saveLaunch(launch) {
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
        launch,
        {
            upsert: true,
        });
}

async function existsLaunchWithId(id) {
    return await launches.findOne({
        flightNumber: id,
    })
}

async function getAllLaunches(skip, limit) {
    return await launches
        .find({}, {
            '_id': 0, '__v': 0,
        })
        .sort({
            flightNumber: 1
        })
        .skip(skip)
        .limit(limit)
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if (!planets) {
        throw new Error('No matching planet found.')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['costelas', 'nasa'],
        upcoming: true,
        success: true,
    })
    await saveLaunch(newLaunch);
}

async function abortLaunchWithId(id) {
    const aborted = await launches.updateOne({
        flightNumber: id
    }, {
        upcoming: false,
        success: false
    });
    return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchesData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchWithId
}
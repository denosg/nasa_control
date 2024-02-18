const launches = new Map()

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exporation 1',
    rocket: 'Exporer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'DENOS'],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch)

function existsLaunchWithId(id) {
    return launches.has(id)
}

function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++
    launches.set(latestFlightNumber, Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['costelas', 'nasa'],
        upcoming: true,
        success: true,
    }));
}

function abortLaunchWithId(id) {
    const aborted = launches.get(id);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchWithId
}
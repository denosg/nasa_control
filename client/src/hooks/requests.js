const API_URL = 'v1';

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`)
  const planets = await response.json();
  return planets;
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`)
  const launches = await response.json();
  return launches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(data) {
  try {
    const launch = await fetch(`${API_URL}/launches`, {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
    return launch;
  } catch (err) {
    console.log(err);
    return { ok: false }
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'delete'
    })
  } catch (err) {
    console.log(err);
    return { ok: false }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
const { getDriver, getTrips, getVehicle } = require('../api/index');

async function getAllDrivers() {
  const trips = await getTrips();
  const driverIDs = trips.map(trip => trip.driverID);
  const uniqueDriverIDs = new Set(driverIDs);
  const allDrivers = [];

  try {
    for (id of uniqueDriverIDs) {
      const result = await getDriver(id);
      result.id = id;
      allDrivers.push(result);
    }
  } catch (error) {}

  return allDrivers;
}
async function getDriverWithMultipleVehicles() {
  const drivers = await getAllDrivers();
  let noOfdrivers = 0;
  for (let [key, value] of Object.entries(drivers)) {
    if (value.vehicleID.length > 1) {
      noOfdrivers++;
    }
  }
  return noOfdrivers;
}

async function getMostTrips() {
  const trips = await getTrips();
  let drivers = {};
  for (let [index, trip] of trips.entries()) {
    trip.tripTotal = parseInt(trip.billedAmount.replace(/,/, ''));
    const tripTotal = trip.tripTotal;
    let driverId = trip.driverID;

    if (!drivers[driverId]) {
      drivers[driverId] = { driverId, trips: 1, tripTotal };
    } else {
      drivers[driverId].trips++;
      drivers[driverId].tripTotal += tripTotal;
    }
  }
  return drivers;
}


module.exports = {
  getAllDrivers,
  getDriverWithMultipleVehicles,
  getMostTrips
};

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

async function getTripsByDriver(id) {
  const allTripsarray = await getTrips();
  let tripsByDriver = [];

  for (const [index, trip] of allTripsarray.entries()) {
    if (trip.driverID == id) {
      trip.tripTotal = parseInt(trip.billedAmount.replace(/,/, ''));
      const { tripTotal, user, pickup, destination, created, isCash } = trip;
      const trips = {
        user: user.name,
        created,
        pickup: pickup.address,
        destination: destination.address,
        billed: tripTotal,
        isCash
      };
      tripsByDriver.push(trips);
    }
  }
  return tripsByDriver;
}

async function getVehicleDetails(vehicles) {
  const result = [];
  for (const id of vehicles) {
    const details = await getVehicle(id);
    let { plate, manufacturer } = details;
    result.push({ plate, manufacturer });
  }
  return result;
}



module.exports = {
  getAllDrivers,
  getDriverWithMultipleVehicles,
  getMostTrips,
  getTripsByDriver,
  getVehicleDetails
};

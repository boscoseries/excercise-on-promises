const { getDriver, getTrips, getVehicle } = require('../api/index');

const allTrips = getTrips();
const resolvedPromises = Promise.resolve(allTrips).then(data => data);

async function getAllDrivers() {
  const trips = await resolvedPromises;
  const driverIDs = trips.map(trip => trip.driverID);
  const uniqueIDs = new Set(driverIDs);
  uniqueDriverIDs = [...uniqueIDs];

  const e = uniqueDriverIDs.map(id => {
    return getDriver(id)
      .then(driver => {
        driver.id = id;
        return driver;
      })
      .catch(err => {
        return { id, vehicleID: [] };
      });
  });
  return Promise.all(e).then(drivers => {
    return drivers;
  });
}

async function getDriverWithMultipleVehicles() {
  const drivers = await getAllDrivers();
  let noOfdrivers = 0;
  for (const driver of drivers) {
    if (driver.vehicleID.length > 1) {
      noOfdrivers++;
    }
  }
  return noOfdrivers;
}

async function getMostTrips() {
  const trips = await resolvedPromises;
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
  const allTripsarray = await resolvedPromises;
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

async function getVehicleDetails(vehiclesID) {
  const result = [];
  const vehicleDetails = vehiclesID.map(vehicleId => {
    return getVehicle(vehicleId)
      .then(data => {
        let { plate, manufacturer } = data;
        result.push({ plate, manufacturer });
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  });

  return Promise.all(vehicleDetails).then(details => details);
}

module.exports = {
  getAllDrivers,
  getDriverWithMultipleVehicles,
  getMostTrips,
  getTripsByDriver,
  getVehicleDetails
};

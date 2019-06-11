const { getDriver, getTrips, getVehicle } = require('./api');



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

async function getVehicleDetails(vehicles) {
  const result = [];
  for (const id of vehicles) {
    const details = await getVehicle(id);
    let { plate, manufacturer } = details;
    result.push({ plate, manufacturer });
  }
  return result;
}



/**
 * This function should return the trip data analysis
 * Don't forget to write tests
 *
 * @returns {any} Trip data analysis
 */
async function analysis() {
  const trips = await getTrips();

  const cashTrips = trips.filter(trip => trip.isCash === true);
  const cashBilledTotal = cashTrips.reduce((total, trip) => {
    trip.tripTotal = Number(trip.billedAmount.replace(/,/, ''));
    return total + trip.tripTotal;
  }, 0);
  const nonCashTrips = trips.filter(trip => trip.isCash === false);
  const nonCashBilledTotal = nonCashTrips.reduce((total, trip) => {
    trip.tripTotal = Number(trip.billedAmount.replace(/,/, ''));
    totalCash = total + trip.tripTotal;
    return Number(totalCash.toFixed(2));
  }, 0);
  const noOfDriversWithMoreThanOneVehicle = await getDriverWithMultipleVehicles();

  const result = {
    noOfCashTrips: cashTrips.length,
    noOfNonCashTrips: nonCashTrips.length,
    billedTotal: cashBilledTotal + nonCashBilledTotal,
    cashBilledTotal,
    nonCashBilledTotal,
    noOfDriversWithMoreThanOneVehicle
  };

  return result;
}

/**
 * This function should return the data for drivers in the specified format
 * Don't forget to write tests
 *
 * @returns {any} Driver report data
 */
async function driverReport() {}

analysis().then(data => console.log(data));

module.exports = { analysis, driverReport };

const { getDriver, getTrips } = require('./api');
const { getDriverWithMultipleVehicles, getMostTrips } = require('./helpers/index')




// async function getAllDrivers() {
//   const trips = await getTrips();
//   const driverIDs = trips.map(trip => trip.driverID);
//   const uniqueDriverIDs = new Set(driverIDs);
//   const allDrivers = [];

//   try {
//     for (id of uniqueDriverIDs) {
//       const result = await getDriver(id);
//       result.id = id;
//       allDrivers.push(result);
//     }
//   } catch (error) {}

//   return allDrivers;
// }
// async function getDriverWithMultipleVehicles() {
//   const drivers = await getAllDrivers();
//   let noOfdrivers = 0;
//   for (let [key, value] of Object.entries(drivers)) {
//     if (value.vehicleID.length > 1) {
//       noOfdrivers++;
//     }
//   }
//   return noOfdrivers;
// }

// async function getMostTrips() {
//   const trips = await getTrips();
//   let drivers = {};
//   for (let [index, trip] of trips.entries()) {
//     trip.tripTotal = parseInt(trip.billedAmount.replace(/,/, ''));
//     const tripTotal = trip.tripTotal;
//     let driverId = trip.driverID;

//     if (!drivers[driverId]) {
//       drivers[driverId] = { driverId, trips: 1, tripTotal };
//     } else {
//       drivers[driverId].trips++;
//       drivers[driverId].tripTotal += tripTotal;
//     }
//   }
//   return drivers;
// }


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

  const groups = await getMostTrips();

  const sortedByTrips = Object.values(groups).sort((a, b) => b.trips - a.trips);
  const driverWithMostTrips = sortedByTrips[0].driverId;
  let noOfTrips = sortedByTrips[0].trips;
  let totalAmountEarned = sortedByTrips[0].tripTotal;
  let driverDetails = await getDriver(driverWithMostTrips);
  let { name, email, phone } = driverDetails;

  let mostTripsByDriver = { name, email, phone, noOfTrips, totalAmountEarned };

  const sortedByBills = Object.values(groups).sort((a, b) => b.tripTotal - a.tripTotal);
  const driverWithHighestBill = sortedByBills[0].driverId;
  noOfTrips = sortedByBills[0].trips;
  totalAmountEarned = sortedByBills[0].tripTotal;
  driverDetails = await getDriver(driverWithHighestBill);
  driverDetails = { name, email, phone } = driverDetails;

  const highestEarningDriver = { name, email, phone, noOfTrips, totalAmountEarned };

  const result = {
    noOfCashTrips: cashTrips.length,
    noOfNonCashTrips: nonCashTrips.length,
    billedTotal: cashBilledTotal + nonCashBilledTotal,
    cashBilledTotal,
    nonCashBilledTotal,
    noOfDriversWithMoreThanOneVehicle,
    mostTripsByDriver,
    highestEarningDriver
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

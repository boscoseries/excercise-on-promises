const { getDriver, getTrips, getVehicle } = require('./api');
const { getAllDrivers, getDriverWithMultipleVehicles, getMostTrips, getTripsByDriver, getVehicleDetails } = require('./helpers/index')

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
async function driverReport() {
  let result = [];

  const drivers = await getAllDrivers();
  const mostTrips = await getMostTrips();

  for (let driver of drivers) {
    const { name, id, phone, vehicleID } = driver;
    const vehicles = await getVehicleDetails(vehicleID);
    const trips = await getTripsByDriver(id);
    const cashTrips = trips.filter(trip => trip.isCash);
    const nonCashTrips = trips.filter(trip => !trip.isCash);
    const totalCashAmount = cashTrips.reduce((total, amount) => total + amount.billed, 0);
    const totalNonCashAmount = nonCashTrips.reduce((total, amount) => total + amount.billed, 0);

    resultObject = {
      fullName: name,
      id,
      phone,
      noOfTrips: mostTrips[id].trips,
      noOfVehicles: vehicleID.length,
      vehicles,
      noOfCashTrips: cashTrips.length,
      noOfNonCashTrips: nonCashTrips.length,
      totalAmountEarned: totalCashAmount + totalNonCashAmount,
      totalCashAmount,
      totalNonCashAmount,
      trips
    };
    result.push(resultObject);
  }
  return result;
}

analysis().then(data => console.log(data));
driverReport().then(data => console.log(data));

module.exports = { analysis, driverReport };

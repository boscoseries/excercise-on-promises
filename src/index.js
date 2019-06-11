const { getDriver, getTrips, getVehicle } = require('./api');



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

  const result = {
    noOfCashTrips: cashTrips.length
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

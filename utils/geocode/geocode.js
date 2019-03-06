const request = require('request');

const geocodeAddress = (address, callback) =>
{
    const encodedarg = encodeURIComponent(address);
    request(
        {
            url: `https://www.mapquestapi.com/geocoding/v1/address?key=kaZmB1YDDUL2TWWBtpDRL3o2UBesNHDq&location=${encodedarg}`,
            json: true
        }, 
        (error, response, body) => 
        {
          if (error) {
            callback({ errorMessage: 'Unable to connect to google servers'});
            return;
          } else if (!body) {
            callback({ errorMessage: 'Unable to find the address'});
            return;
          } else if (body.info.statuscode === 400) {
            callback({ errorMessage: 'Unable to find the address'});
            return;
          }

          let data =
          {
            address: body.results[0].providedLocation.location,
            latitude: body.results[0].locations[0].latLng.lat,
            longitude: body.results[0].locations[0].latLng.lng
          }
          callback(undefined,data);
        });
}

module.exports = {
    geocodeAddress
}

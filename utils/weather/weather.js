const request = require('request');

const getWeather = (lat, lng, callback) =>
{
    request(
        {
            url: `https://api.darksky.net/forecast/8c3b6fe1118c83e512ebf764daa48d97/${lat},${lng}?units=auto`,
            json: true
        },
        (error, response, body) => {
            if (error) {
                callback({errorMessage: 'Unable to connect to darksky servers'});
                return;
            } else if (response.statusCode !== 200) {
                callback({errorMessage: 'Unable to fetch weather'});
                return;
            } else if (!body) {
                callback({errorMessage: 'Unable to fetch weather'});
                return;
            }
            var message = {
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            };
            callback(undefined, message);
        });
}


module.exports = {
    getWeather
}

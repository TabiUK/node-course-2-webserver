const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path')
const geocode = require('./utils/geocode/geocode');
const weather = require('./utils/weather/weather');

const app = express();
const port = process.env.PORT || 3000

// setup handlebars engine and view location
app.set('view engine', 'hbs'); // tells express to use hbs for rendering
app.set('views', __dirname + '/template') // default folder is views
// setup static directory to serve
app.use(express.static(path.join(__dirname, '/public')));

hbs.registerPartials(path.join(__dirname, '/template/partials'))
hbs.registerHelper('getCurrentYear', () =>
{
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) =>
{
    return text.toUpperCase();
});

// logger
app.use((req, res, next) =>
{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) =>
    {
        if (err) console.log('Unable to append to server.log.');
    });
    next();
});

// maintance
/*
app.use((req, res, next) =>
{
    res.render('maintance.hbs',
    {
        pageTitle: 'Page Under Construction',
        welcomeText: "Website currently under construction"
    });
});
*/

app.get('/home', (request, response) => 
{
    response.render('home.hbs',
    {
        pageTitle: 'Home Page',
        welcomeText: "Welcome Text"
    });
});

app.get('/thelp', (request, response) => 
{
    response.render('home.hbs',
    {
        pageTitle: 'tHelp Page',
        welcomeText: "tHelp Text"
    });
});

app.get('/about', (request, response) => 
{
    response.render('about.hbs',
    {
        pageTitle: 'About Page'
    });
});


app.get('/old', (request, response) => 
{
    response.send('old');
});

app.get('/weather', (request, response) => 
{
    const callback = (errorMessage, weatherData, res) =>
    {
        if (!res) return console.log('No response')

        if (errorMessage) return res.send(errorMessage)

        res.send(weatherData)
    }

    if (!request.query.address) {
        return callback(
            {
            errorMessage: "you must privde an address"
        }, undefined, response)
    }

    geocode.geocodeAddress(request.query.address, (errorMessage, results) => 
    {   
        if (errorMessage) {
            return callback(errorMessage, undefined, response);
        } else {
            weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
                if (errorMessage) {
                    return callback(errorMessage, undefined, response);
                } else {
                    const data = {
                        currentTemprture: weatherResults.temperature,
                        apparentTemperature: weatherResults.apparentTemperature,
                        address: request.query.address
                    }
                    return callback(undefined, data, response);
                }
            });
        }
    });
});

app.get('/products', (req, res) => 
{
    if (!req.query.search) {
        res.send({
            error: "you must privde a search term"
        })
        return;
    }
    console.log(request.query)
    res.send(
        {
            products: []
        })
})

app.get('/bad', (request, response) => 
{
    response.send(
        {
            errorMessage: 'error'
        });
});

app.get('/help/*',  (req, res) =>
{
    res.render('error.hbs',
    {
        pageTitle: '404 Help Page',
        errorMessage: "404 Help Text"
    });
})

app.get('*', (req, res) =>
{
    res.render('error.hbs',
    {
        pageTitle: '404 Page Not Found',
        errorMessage: "Page not found"
    });
})

app.listen(port, () =>
{
    console.log('server is up on port:' +  port);
});
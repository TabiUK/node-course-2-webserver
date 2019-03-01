const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

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

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () =>
{
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) =>
{
    return text.toUpperCase();
});

app.get('/', (request, response) => 
{
    response.render('home.hbs',
    {
        pageTitle: 'Home Page',
        welcomeText: "Welcome Text"
    });
});

app.get('/about.html', (request, response) => 
{
    response.render('about.hbs',
    {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (request, response) => 
{
    response.send(
        {
            errorMessage: 'error'
        });
});

app.listen(3000, () =>
{
    console.log('server is up');
});
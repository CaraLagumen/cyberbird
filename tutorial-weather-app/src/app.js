const forecast = require('./utilities/forecast');
const geocode = require('./utilities/geocode');

const express = require('express'); //WEB FRAMEWORK
const hbs = require('hbs'); //A TOOL FOR BUILDING DYNAMIC WEBPAGES
const path = require('path'); //MAKES IT EASIER TO NAVIGATE FOLDERS
const request = require('request');

// console.log(__dirname);
// console.log(__filename);
console.log(path.join(__dirname, '../public'));

//STATE SERVER
const app = express();
const port = process.env.PORT || 3000; //HEROKU || LOCAL
//DEFINE PATHS FOR EXPRESS CONFIG
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//app.com
//app.com/help
//app.com/about

//SETUP HANDLEBARS ENGINE AND VIEWS LOCATION
app.set('view engine', 'hbs'); //REQUIRING HANDLEBARS.JS FOR EXPRESS
app.set('views', viewsPath); //CREATE VIEWS FOLDER OR SET NEW PATH FOR VIEWS
hbs.registerPartials(partialsPath);

//SETUP STATIC DIR TO SERVE
app.use(express.static(publicDirPath));
//STATIC WEBPAGES CAN'T CHANGE - DYNAMIC DOES
//CUSTOMIZES SERVER, NO NEED TO LINK EACH HTML FILE
//EXPRESS LOADS FIRST INSTANCE, OVERRIDES APP.GET

//SERVE THE TEMPLATES FOR HBS
app.get('', (req, res) => { //WHERE TO RENDER, WHAT TO RENDER
    res.render('index', { //WHERE TO RENDER, WHAT TO RENDER
        title: 'Weather',
        name: 'Cara Lagumen'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Cara Lagumen',
        github: 'https://github.com/CaraLagumen/cyberbird#cyberbird'
    });
})

app.get('/faq', (req, res) => {
    res.render('faq', {
        title: 'FAQ',
        name: 'Cara Lagumen'
    });
})

//TELLS SERVER WHAT TO DO
//URL, WHAT TO DO

//(HTML)
// app.get('', (req, res) => { //OVERRIDDEN BY APP.USE
//     res.send('<h1>Weather</h1>');
// })

//(JSON)
app.get('/help', (req, res) => {
    res.send([{
        name: 'Cara',
        age: 27,
    }, {
        name: 'Pheobe',
        age: 11
    }]);
})

// app.get('/about', (req, res) => {
//     res.send('<h1>About</h1>');
// })

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }
    const address = req.query.address;
    geocode(address, (error, { latitude, longitude, location } = {} ) => {
        if (error) {
            return res.send({
                error: 'Geocode error.'
            })
        }
        forecast(`${latitude},${longitude}`, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: 'Forecast error.'
                })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({ //YOU CAN ONLY SEND RESPONSE ONCE SO YOU MUST RETURN
            error: 'You must provide a search term.'
        })
    }
    //REQ IS THE URL BEING REQUESTED
    console.log(req.query.search);
    res.send({ 
        products: []
    })
})

//ERROR HANDLING
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        name: 'Cara Lagumen',
        message: 'Help article not found.'
    });
})

app.get('*', (req, res) => { //* WILDCARD MEANS ANY URL
    res.render('404', {
        title: 'Error',
        name: 'Cara Lagumen',
        message: 'Page not found.'
    });
})

//STARTS THE SERVER (CMD)
app.listen(port, () => {
    console.log(`server is up on port ${port}`);
})
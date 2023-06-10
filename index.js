const express = require('express');
const app = express();
const path = require('path');
import('node-fetch').then(fetch => {}).catch(err => {});

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

const key = '559b01018d1357db4e2132b83d795dd9';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getWeatherDataPromise = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let description = data.weather[0].description;
                let city = data.name;
                let temp = Math.round(parseFloat(data.main.temp) - 273.15);
                let result = {
                    description: description,
                    city: city,
                    temp: temp,
                    error: null
                };
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
};

app.all('/', function (req, res) {
    let city;
    if (req.method === 'GET') {
        city = 'Tartu';
    }
    if (req.method === 'POST') {
        city = req.body.cityname;
    }

    if (!city) {
        res.render('index', { error: 'Please enter a valid city name' });
        return;
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    getWeatherDataPromise(url)
        .then(data => {
            res.render('index', data);
        })
        .catch(error => {
            res.render('index', { error: 'Problem with getting data, try again' });
        });
});

app.listen(3000, () => {
    console.log('Server has been started! http://localhost:3000');
});

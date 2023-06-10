const express = require('express')
const app = express()
const path = require('path')
import('node-fetch').then(fetch => {
}).catch(err => {
});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
const key = '559b01018d1357db4e2132b83d795dd9'
let city = 'Tartu'
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/', function (req, res) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp) - 273.15)
            res.render('index', {
                description: description,
                city: city,
                temp: temp
            })
        })
})
app.post('/', function (req, res) {
    let city = req.body.cityname
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp) - 273.15)
            res.render('index', {
                description: description,
                city: city,
                temp: temp
            })
        })

})
app.listen(3000, () => {
    console.log('Server has been started! http://localhost:3000')
});
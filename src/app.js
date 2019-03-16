const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')


// Setup handlebarrs engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDir))

app.get('',(req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'HaPhan Tran'
    })
})

app.get('/about',(req,res) => {
    res.render('about', {
        title: 'About me',
        name: 'HaPhan Tran'
    })
})

app.get('/help',(req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'Haphan Tran' ,
        helpMessage: 'This application is created by HaPhan Tran. It uses the data from mapbox and darksky'
    })
})
app.get('/weather',(req,res) => {
    if (!req.query.address){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    geocode(req.query.address, (error, {latitude,longitude,location} = {}) => {

        if (error) {
            return res.send({
                error
            })
        }
        console.log(latitude,longitude)
        forecast(latitude, longitude,  (error, forecast) => {
            if (error) {
                return res.send({
                    error
                })
            }
            return res.send({
                forecast,
                location,
                address: req.query.address
            })
        })
    })        
})

app.get('/product',(req,res) => {
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    res.send({
        product : []
    })
})
app.get('/help/*', (req,res) =>{
    res.render('404', {
        title: 'Help not found',
        name: 'Haphan Tran' ,
        errorMessage: 'Help article not found'
    })
})
app.get('/*', (req,res) =>{
    res.render('404', {
        title: 'Page not found',
        name: 'Haphan Tran' , 
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('server is up on port: ' + port)
})
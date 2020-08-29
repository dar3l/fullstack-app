if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRounter = require('./routes/index')
const directorRounter = require('./routes/directors')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// Database
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
 })

const db = mongoose.connection
db.on('error', error => console.log('here ' + error))
db.once('open', () => console.log('connected to Mongoose'))

// Router
app.use('/', indexRounter)
app.use('/directors', directorRounter)


app.listen(process.env.PORT || 3000)
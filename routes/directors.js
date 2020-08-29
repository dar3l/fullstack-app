const express = require('express')
const router = express.Router()
const Director = require('../models/director')

// All Directors Route
router.get('/', async (request, response) => {
    let searchOptions = {}

    if(request.query.name != null && request.query.name != ''){
        searchOptions.name = new RegExp(request.query.name, 'i')
    }
    try{
        const directors = await Director.find(searchOptions)
        response.render('directors/index', { 
            directors: directors, 
            searchOptions: request.query
        })
    } catch{
        response.redirect('/')
    }
})

// New Director Route
router.get('/new', (request, response) => {
    response.render('directors/new', {  director: new Director() })
})

// Create Director Route
router.post('/', async (request, response) => {
    const director = new Director({
        name: request.body.name
    })
    try{
        const newDirector = await director.save();
        // response.redirect(`directors/${newDirector.id}`) 
        response.redirect('directors') 

    } catch (error){
        response.render('directors/new', {
            director: director,
            errorMessage: 'Error creating Director'
        })
    }
})

module.exports = router
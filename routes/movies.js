const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')

// All Movies Route
router.get('/', async (request, response) => {
    let searchOptions = {}

    if(request.query.name != null && request.query.name != ''){
        searchOptions.name = new RegExp(request.query.name, 'i')
    }
    try{
        const movies = await Movie.find(searchOptions)
        response.render('movies/index', { 
            movies: movies, 
            searchOptions: request.query
        })
    } catch{
        response.redirect('/')
    }
})

// New Movie Route
router.get('/new', (request, response) => {
    response.render('movies/new', {  movie: new Movie() })
})

// Create Movie Route
router.post('/', async (request, response) => {
    const movie = new Movie({
        name: request.body.name
    })
    try{
        const newMovie = await movie.save();
        // response.redirect(`movies/${newMovie.id}`) 
        response.redirect('movies') 

    } catch (error){
        response.render('movies/new', {
            movie: movie,
            errorMessage: 'Error creating Movie'
        })
    }
})

module.exports = router
const express = require('express')
const router = express.Router()
const Book = require('../models/book')

// All Books Route
router.get('/', async (request, response) => {
    response.send('all book route')
})

// New Book Route
router.get('/new', (request, response) => {
    const book = new Book() 
    response.render('books/new', {
        book: book
    })
})

// Create Book Route
router.post('/', async (request, response) => {
    response.send('create book route')
})


module.exports = router
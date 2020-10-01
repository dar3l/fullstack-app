const express = require('express')
const router = express.Router()
const Book = require('../models/book');

const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

// All Books Route
router.get('/', async (request, response) => {
    let query = Book.find();
    
    if(request.query.title != null && request.query.title != ''){
         query = query.regex('title', new RegExp(request.query.title, 'i'))
    }
    try{
        const books = await query.exec()
        response.render('books/index', { 
            books: books, 
            searchOptions: request.query
        })
    } catch{
        response.redirect('/')
    }
})

// New Book Route
router.get('/new', (request, response) => {
    renderNewPage(response, new Book())
})

// Create Book Route
router.post('/', async (request, response) => {
    console.log(request.file)

    const book = new Book({
        title: request.body.title,
        author: request.body.author,
        publishDate: new Date(request.body.publishDate),
        pageCount: request.body.pageCount,
        description: request.body.description,
    })

    // Save Book Cover
    saveBookCover(book, request.body.cover)

    try{
        const newBook = await book.save();
        response.redirect('books') 
    } catch{
        renderNewPage(response, book, true)
    }
})

// Render New Page
function renderNewPage(response, book, hasError = false) {
 
    const params = {
        book: book
    }

    if(hasError) params.errorMessage = 'Error creating book'

    response.render('books/new', params)
}

// Saves Book Cover 
// base64 encoded
function saveBookCover(book, coverEncoded){

    if (coverEncoded == null) return
    
    const cover = JSON.parse(coverEncoded);
    console.log(cover);

    if(cover != null && imageTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

module.exports = router
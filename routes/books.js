const express = require('express')
const path = require('path');
const fs = require('fs');
const multer = require('multer')

const router = express.Router()
const Book = require('../models/book');
const { query } = require('express');

const uploadPath = path.join('public', Book.coverImageBasePath)
const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

const upload = multer({
    dest: uploadPath,
    fileFilter: (request, file, callback) => {
        callback(null, imageTypes.includes(file.mimetype))
    }
});

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
router.post('/', upload.single('cover'), async (request, response) => {

    console.log(request.file)

    const fileName = request.file != null ? request.file.filename : null

    const book = new Book({
        title: request.body.title,
        author: request.body.author,
        publishDate: new Date(request.body.publishDate),
        pageCount: request.body.pageCount,
        description: request.body.description,
        coverImageName: fileName
    })

    console.log(book);

    try{
        const newBook = await book.save();
        response.redirect('books') 
    } catch{
 
        if(book.coverImageName != null) removeBookCover(book.coverImageName)
        renderNewPage(response, book, true)
    }
})

function renderNewPage(response, book, hasError = false) {
 
    const params = {
        book: book
    }

    if(hasError) params.errorMessage = 'Error creating book'

    response.render('books/new', params)
    
}

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}


module.exports = router
const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.trim().toLowerCase();

  const authorBooks = Object.values(books).filter(
    (book) => book.author.trim().toLowerCase() === author
  );

  if (authorBooks.length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.status(200).json(authorBooks);
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.trim().toLowerCase();

  const titleBooks = Object.values(books).filter(
    (book) => book.title.trim().toLowerCase() === title
  );

  if (titleBooks.length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }

  return res.status(200).json(titleBooks);
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});


/*
  TASK 11
  Using Axios with async/await and promises
  These functions are what the assignment is asking for.
  They retrieve book data using Axios.
*/

// Get all books - async/await with Axios
async function getAllBooks() {
  try {
    const response = await axios.get("http://localhost:5000/");
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get book by ISBN - Promises with Axios
function getBookByISBN(isbn) {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

// Get books by author - async/await with Axios
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get books by title - Promises with Axios
function getBooksByTitle(title) {
  return axios.get(`http://localhost:5000/title/${title}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
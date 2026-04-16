const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axioos = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ "username": username, "password": password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });

    const data = await getBooks;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error getting books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  try {
    const getBook = new Promise((resolve, reject) => {
      resolve(books[isbn]);
    });

    const data = await getBook;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error occurred!" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  if (!author) {
    return res.status(400).json({ message: "Author is required" });
  }

  try {
    const aBook = new Promise((resolve, reject) => {
      let authorBook = Object.values(books).filter(
        (book) => book.author.replace(/\s/g, "") == author
      );
      resolve(authorBook);
    });

    const data = await aBook;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const tBook = new Promise((resolve, reject) => {
      let titleBook = Object.values(books).filter(
        (book) => book.title.replace(/\s/g, "") == title
      );
      resolve(titleBook);
    });

    const data = await tBook;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error occurred" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
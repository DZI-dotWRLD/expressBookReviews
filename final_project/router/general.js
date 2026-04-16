const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axioos = require('axios');





public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});


});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try{
    const getBooks = new Promise((resolve,reject)=>{
      resolve(books);
    });

    const data = await getBooks;

    res.status(200).json(data);
  } catch (error){
    res.status(500).json({message:"Eroor getting books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try{
    const getBook = new Promise((resolve,reject)=>{
      resolve(books[isbn]);
    });

    const data = await getBook;
    res.status(200).json(data);
  } catch(error){
    res.status(500).json({message:"Error occure!"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  //Object.values(books).filter((book)=> book.author.replace(/\s/g, "") == author);
try {
  const aBook = new Promise((resolve, reject) => {
    let authorBook = Object.values(books).filter(
      (book) => book.author.replace(/\s/g, "") === author
    );
    resolve(authorBook);
  });

  const data = await aBook;

  if (data.length === 0) {
    return res.status(404).json({
      message: "No books found for this author"
    });
  }

  res.status(200).json(data);

} catch (error) {
  res.status(500).json({ message: "Error occurred" });
}
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
 const title = req.params.title;

  try {
  const tBook = new Promise((resolve, reject) => {
    let titleBook = Object.values(books).filter(
      (book) => book.title.replace(/\s/g, "") === title
    );
    resolve(titleBook);
  });

  const data = await tBook;

  if (data.length === 0) {
    return res.status(404).json({
      message: "No books found with this title"
    });
  }

  res.status(200).json(data);

} catch (error) {
  res.status(500).json({ message: "Error occurred" });
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const time_to_wait = 5000;

// Sign up new user
public_users.post("/register", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  
  const outcome = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },time_to_wait)});

  let book_list = JSON.stringify(await outcome, null, 4);

  res.send(book_list);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  
    const isbn = req.params.isbn;
    const outcome = new Promise((resolve,reject) => {
      setTimeout(() => {
        resolve(books)
      },time_to_wait)});

    let filtered_books = Object.values(await outcome).filter((book) => book.isbn === isbn);
    res.send(JSON.stringify(filtered_books[0], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
 
  const author = req.params.author;
  const outcome = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },time_to_wait)});

  let filtered_books = Object.values(await outcome).filter((book) => book.author === author);
  res.send(JSON.stringify(filtered_books[0], null, 4));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;
  const outcome = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },time_to_wait)});

  let filtered_books = Object.values(await outcome).filter((book) => book.title === title);
  res.send(JSON.stringify(filtered_books[0], null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 
    const isbn = req.params.isbn;
    let filtered_books = Object.values(books).filter((book) => book.isbn === isbn);
    res.send(JSON.stringify(filtered_books[0].reviews, null, 4));
});

module.exports.general = public_users;


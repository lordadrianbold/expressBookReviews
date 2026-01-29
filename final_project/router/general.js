const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Route: Register a new user
public_users.post("/register", (req, res) => {
    // Extract user data from request body
    const { username, email, password } = req.body;
  
    // Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }
  
    // Validate user data (e.g., check if email is valid, password meets requirements)
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
  
    // Check if the username is already taken
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Hash the password before saving it to the database (using bcrypt, for example)
    const hashedPassword = hashPassword(password);
  
    // Save the user data to the database
    const newUser = { username, email, password: hashedPassword };
    users.push(newUser);
  
    return res.status(200).json({ message: "User registered successfully" });
  });
  
  // Function to validate email format
  function isValidEmail(email) {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Function to hash the password
  function hashPassword(password) {
    // Implement password hashing logic (using bcrypt or any other suitable library)
    return password; // For demonstration purposes, returning the password as is
  }
  
  // Route: Get the list of available books
  public_users.get('/', function (req, res) {
    // Retrieve the list of available books from the database or any other source
    res.send(JSON.stringify(books,null,4));

  });
  
  // Route: Get book details based on ISBN
  public_users.get('/isbn/:isbn', function (req, res) {
    // Extract ISBN from request parameters
    const isbn = req.params.isbn;
    res.send(books[isbn]); 
  });
  
  // Route: Get book details based on author
  public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
       let booksByAuthor = [];
       for(let isbn in books){
         if(books[isbn].author == author){
           booksByAuthor.push(books[isbn]);
         }
       }
       if(booksByAuthor.length>0){
         return res.status(200).send(JSON.stringify(booksByAuthor,null,4));
       }
       else{
         return res.status(404).send("No book found with author "+author);
       }
  });
  
  // Route: Get all books based on title
  public_users.get('/title/:title', function (req, res) {
    // Extract title from request parameters
    const title = req.params.title;
  
    // Implement logic to fetch and return book details for the specified title
    const booksWithTitle = books.getBooksByTitle(title); // Assuming a function getBooksByTitle() is defined in booksdb.js to fetch books by title
  
    if (booksWithTitle.length > 0) {
      return res.status(200).json(booksWithTitle);
    } else {
      return res.status(404).json({ message: "Books with this title not found" });
    }
  });
  
  // Route: Get book review
  public_users.get('/review/:isbn', function (req, res) {
    // Extract ISBN from request parameters
    const isbn = req.params.isbn;
  
    // Implement logic to fetch and return book review for the specified ISBN
    const bookReview = books.getBookReviewByISBN(isbn); // Assuming a function getBookReviewByISBN() is defined in booksdb.js to fetch book review by ISBN
  
    if (bookReview) {
      return res.status(200).json({ review: bookReview });
    } else {
      return res.status(404).json({ message: "Review for this book not found" });
    }
  });
  
  // Export the router containing public user routes
  module.exports.general = public_users;


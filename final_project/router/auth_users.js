const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
  let user = users.find(u => u.username === username);
  return user ? true : false;
}

const authenticatedUser = (username, password) => {
  let user = users.find(u => u.username === username && u.password === password);
  return user ? true : false;
}


regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  let accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token: accessToken });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; 
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  let book = books[isbn];

  if (book) {
    book.reviews = book.reviews || {}; 
    const userReview = { username: req.user.username, review };
    book.reviews[req.user.username] = userReview;
    return res.status(200).json({ message: "Review added successfully", reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.user.username; // Ensure you have a way to get the logged-in user's username

  let book = books[isbn];

  if (book && book.reviews && book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
  } else {
      return res.status(404).json({ message: "Review not found" });
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let { username, password } = req.body;

  if (username) {
    if (password) {
      let userExists = users.some((user) => user.username === username);
      if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
      }
      

      users.push({ username, password });
      return res.status(201).json({ message: "User registered successfully" });
    } else {
      return res.status(400).json({ message: "Password not provided" });
    }
  } else {
    return res.status(409).json({ message: "Username not provided" });
  }
});

public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  let book = books[isbn];

  if(book){
    return res.send(JSON.stringify(book)); 
  }else{
    return res.status(404).json({message: "Not found"});
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  booksArr = Object.values(books);
  let book = booksArr.filter(b => b.author === author);

  if(book){
    return res.send(JSON.stringify(book)); 
  }else{
    return res.status(404).json({message: "Not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  booksArr = Object.values(books);
  let book = booksArr.filter(b => b.title === title);

  if(book){
    return res.send(JSON.stringify(book)); 
  }else{
    return res.status(404).json({message: "Not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  let book = books[isbn];

  if(book){
    return res.send(JSON.stringify(book.reviews)); 
  }else{
    return res.status(404).json({message: "Not found"});
  }
});

module.exports.general = public_users;

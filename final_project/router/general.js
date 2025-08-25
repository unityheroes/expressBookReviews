const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(404).json({ message: "User already exists!" });
    } else {
      users.push({"username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
 const author = req.params.author;
  let booksByAuthor = [];
  
  for (let id in books) {
    if (books[id].author === author) {
      booksByAuthor.push(books[id]);
    }
  }
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json({ booksbyauthor: booksByAuthor });
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
const title = req.params.title;
  let booksByTitle = [];
  
  for (let id in books) {
    if (books[id].title === title) {
      booksByTitle.push(books[id]);
    }
  }
  
  if (booksByTitle.length > 0) {
    return res.status(200).json({ booksbytitle: booksByTitle });
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book or reviews not found" });
  }
});
public_users.get('/async/all', async function (req, res) {
  try {
    const allBooks = await new Promise((resolve) => {
      resolve(books);
    });
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = await new Promise((resolve) => {
      let result = [];
      for (let id in books) {
        if (books[id].author === author) {
          result.push(books[id]);
        }
      }
      resolve(result);
    });
    
    if (booksByAuthor.length > 0) {
      return res.status(200).json({ booksbyauthor: booksByAuthor });
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve) => {
      let result = [];
      for (let id in books) {
        if (books[id].title === title) {
          result.push(books[id]);
        }
      }
      resolve(result);
    });
    
    if (booksByTitle.length > 0) {
      return res.status(200).json({ booksbytitle: booksByTitle });
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

module.exports.general = public_users;
module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

return users[username]  && users[username] === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  
  try {
    const {username, password} = req.body;

    if(!username || !password) {
      return res.status(400).json({
        message: "Nombre de usuario y contraseña son obligatorios"
      });
    }

    if(!authenticatedUser(username,password)) {
      return res.status(401).json({
        message: "Nombre de usuario o contraseña incorrectos"
      });
    }

    const token = jwt.sign({username: username}, 'fingerprint_customer', {expiresIn: '1h'});

    return res.status(200).json({
      message: "Login exitoso",
      token: token
    });

  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    if(!books[isbn]) {
      return res.status(404).json({
        message: "Libro no encontrado"
      });
    }

    if(!review) {
      return res.status(400).json({
        message: "Reseña es obligatoria"
      });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: "Reseña agregada",
      book: books[isbn].title,
      review: review,
      username: username
    });

  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.user.username;
    
    if (!books[isbn]) {
      return res.status(404).json({ 
        message: "Libro no encontrado con el ISBN proporcionado" 
      });
    }
    
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ 
        message: "No se encontró ninguna reseña tuya para este libro" 
      });
    }
    
    delete books[isbn].reviews[username];
    
    return res.status(200).json({
      message: "Reseña eliminada exitosamente",
      book_title: books[isbn].title,
      username: username
    });
    
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

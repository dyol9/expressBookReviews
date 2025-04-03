const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
  try {
    const {username, password} = req.body;

    if(!username || !password) {
      return res.status(400).json({
        message: "Nombre de usuario y contraseña son obligatorios"
      });
    }

    if(users[username]) {
      return res.status(409).json({
        message: "El usuario ya existe"
      });
    }

    users[username] = password;

    return res.status(201).json({
      message: "Usuario registrado",
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

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (!books || Object.keys(books).length === 0) {
          reject(new Error("No hay libros disponibles"));
        } else {
          resolve(books);
        }
      });
    };

    const booksList = await getBooks();
    return res.status(200).json({
      message: "Libros disponibles",
      books: booksList
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(404).json({
      message: "No hay libros disponibles",
    });
  }
});

  
  /*
  public_users.get('/', async function (req, res) {

  try {
    if(!books || Object.keys(books).length === 0) {
      return res.status(404).json({message: "No hay libros disponibles"});
    }
    
    return res.status(200).json({
      message: "Libros disponibles",
      books: JSON.stringify(books)
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});
*/

// Get book details based on ISBN

public_users.get('/isbn/:isbn', async function (req, res) {

  try {

    const isbn = req.params.isbn;
    if (!isbn) {
      return res.status(400).json({ message: "ISBN no proporcionado" });
    }

    const getBookByISBN = (isbnCode) => {
      return new Promise((resolve, reject) => {
        if (!books[isbnCode]) {
          reject(new Error("Libro no encontrado"));
        } else {
          setTimeout(() => {
            resolve(books[isbnCode]);
          }, 100);
        }
      });
    };

    const book = await getBookByISBN(isbn);

    return res.status(200).json({
      message: "Detalles del libro",
      book: book
    });

  } catch (error) {
    console.error("Error: ", error);
    return res.status(404).json({
      message: error.message || "Error al obtener detalles del libro"
    });
  }
}); 
  
  /*
  public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    if(!isbn) {
      return res.status(400).json({message: "ISBN no proporcionado"});
    }

    if(!books[isbn]) {
      return res.status(404).json({message: "Libro no encontrado"});
    }

    return res.status(200).json({
      message: "Detalles del libro",
      book: books[isbn]
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});
  */
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const requestedAuthor = req.params.author;

    if (!requestedAuthor) {
      return res.status(400).json({ message: "Autor no proporcionado" });
    }
    
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const booksByAuthor = Object.keys(books);
        const matchedBooks = {};

        for (const key of booksByAuthor) {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchedBooks[key] = books[key];
          }
        }
        if (Object.keys(matchedBooks).length === 0) {
          reject(new Error("No se encontraron libros de ese autor"));
        } else {
          setTimeout(() => {
            resolve(matchedBooks);
          }, 100);
        }
      });
    };

    const authorBooks = await getBooksByAuthor(requestedAuthor);
    
    return res.status(200).json({
      message: "Libros del autor: " + requestedAuthor,
      books: authorBooks
    });
    
  } catch (error) {
    console.error("Error: ", error);
    return res.status(404).json({
      message: error.message || "Error al buscar libros por autor"
    });
  }
});

/*
public_users.get('/author/:author',function (req, res) {

  try {
    const requestedAuthor = req.params.author;

    if(!requestedAuthor) {
      return res.status(400).json({message: "Autor no proporcionado"});
  }

  const booksByAuthor = Object.keys(books);
  const matchedBooks = {};

  for (const key of booksByAuthor) {
    if (books[key].author.toLowerCase() === requestedAuthor.toLowerCase()) {
      matchedBooks[key] = books[key];
    }
}

if (Object.keys(matchedBooks).length === 0) {
  return res.status(404).json({message: "No se encontraron libros de ese autor"});
}

return res.status(200).json({
  message: "Libros del autor: " + requestedAuthor,
  books: matchedBooks
});

  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});
*/

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const requestedTitle = req.params.title;

    if (!requestedTitle) {
      return res.status(400).json({ message: "Título no proporcionado" });
    }

    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const booksByTitle = Object.keys(books);
        const matchedBooks = {};

        for (const key of booksByTitle) {
          if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            matchedBooks[key] = books[key];
          }
        }

        if (Object.keys(matchedBooks).length === 0) {
          reject(new Error("No se encontraron libros con ese título"));
        } else {
          setTimeout(() => {
            resolve(matchedBooks);
          }, 100);
        }
      });
    };

    const titleBooks = await getBooksByTitle(requestedTitle);
    
    return res.status(200).json({
      message: "Libros con el título: " + requestedTitle,
      books: titleBooks
    });
    
  } catch (error) {
    console.error("Error: ", error);
    return res.status(404).json({
      message: error.message || "Error al buscar libros por título"
    });
  }
});

/*
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  try {
    const requestedTitle = req.params.title;

    if(!requestedTitle) {
      return res.status(400).json({message: "Titulo no proporcionado"});
  }

  const booksByTitle = Object.keys(books);
  const matchedBooks = {};

  for (const key of booksByTitle) {
    if (books[key].title.toLowerCase().includes(requestedTitle.toLowerCase())) {
      matchedBooks[key] = books[key];
    }
}

if (Object.keys(matchedBooks).length === 0) {
  return res.status(404).json({message: "No se encontraron libros con ese titulo"});
}

return res.status(200).json({
  message: "Libros con el titulo: " + requestedTitle,
  books: matchedBooks
});

  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});
*/


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  try {
    const isbn = req.params.isbn;

    if(!isbn) {
      return res.status(400).json({message: "ISBN no proporcionado"});
    }

    if(!books[isbn]) {
      return res.status(404).json({message: "Libro no encontrado"});
    }

    const bookReviews = books[isbn].reviews;

    if (bookReviews || Object.keys(bookReviews).length === 0) {
      return res.status(404).json({
        message: "No hay reviews para ese libro",
        book_title: books[isbn].title
      });
    }

    return res.status(200).json({
      message: `Reseñas para "${books[isbn].title}"`,
      book_isbn: isbn,
      reviews: bookReviews
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
});

module.exports.general = public_users;
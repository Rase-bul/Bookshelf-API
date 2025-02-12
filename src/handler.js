const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (
    !name ||
    !year ||
    !author ||
    !summary ||
    !publisher ||
    !pageCount ||
    !readPage ||
    reading === undefined
  ) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }
  if (pageCount < readPage) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBooks);
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    .code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const nameBooks = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
    const response = h.response({
      status: 'success',
      data: {
        books: nameBooks.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (reading) {
    const readBooks = books.filter((book) => Number(book.reading) === reading);
    const response = h.response({
      status: 'success',
      data: {
        books: readBooks.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (finished) {
    const finishedBooks = books.filter((book) => Number(book.finished) === finished);
    const response = h.response({
      status: 'success',
      data: {
        books: finishedBooks.map(({ id, name, publisher })  => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books: books.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });
  response.code(200);
  return response;
};

const getBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
};
const editBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;

  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !==-1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message:  'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBookById
};


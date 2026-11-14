import { 
  getAllBooks, 
  getBookById, 
  createBook as createBookInDb,
  updateBook as updateBookInDb,
  deleteBook as deleteBookInDb,
  authorExists 
} from "../models/books.js";

const getBooksHandler = async (req, res) => {
 try {
    const books = await getAllBooks();
    return res.status(200).json(books);
 } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({message: 'Internal server error'});
 }
};

const getBookByIdHandler = async (req, res) => {
const requestedId = req.params.id;
try {
    const book = await getBookById(requestedId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
} catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({message: 'Internal server error'});
}
}


const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    // Validar campos requeridos
    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({ 
        message: 'Missing required fields: id, authorId, title, and publicationDate are required' 
      });
    }

    // Validar si el id del libro ya existe
    const existingBook = await getBookById(id);
    if (existingBook) {
      return res.status(400).json({ message: 'Book ID already exists' });
    }

    // Validar integridad referencial: el autor debe existir
    const authorIsValid = await authorExists(authorId);
    if (!authorIsValid) {
      return res.status(400).json({ message: 'Referenced authorId does not exist' });
    }

    const newBook = { id, authorId, title, publicationDate };
    const createdBook = await createBookInDb(newBook);
    return res.status(201).json(createdBook);
  } catch (error) {
    console.error('POST /books failed:', error.message);
    return res.status(500).json({ message: 'Unable to create book' });
  }
};

const updateBookHandler = async (req, res) => {
  const requestedId = req.params.id;
  try {
    const { authorId, title, publicationDate } = req.body;

    // Validar campos requeridos
    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validar que el libro exista
    const existingBook = await getBookById(requestedId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Validar que el nuevo authorId exista
    const authorIsValid = await authorExists(authorId);
    if (!authorIsValid) {
      return res.status(400).json({ message: 'Referenced authorId does not exist' });
    }

    const updatedData = { authorId, title, publicationDate };
    const updatedBook = await updateBookInDb(requestedId, updatedData);
    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to update book' });
  }
};

const deleteBookHandler = async (req, res) => {
  const requestedId = req.params.id;
  try {
    const existingBook = await getBookById(requestedId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await deleteBookInDb(requestedId);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete book' });
  }
};

export { 
  getBooksHandler, 
  getBookByIdHandler, 
  createBookHandler, 
  updateBookHandler, 
  deleteBookHandler 
};
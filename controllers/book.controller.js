const Book = require("../models/book.model");

async function createBook(req, res) {
  const { title, author, price, genre, availability } = req.body;
  const newBook = new Book({ title, author, price, genre, availability });
  newBook
    .save()
    .then((book) => {
      res.status(201).send(book);
    })
    .catch((err) => {
      console.error("Error: ", err);
      res.status(500).send("Internal server error");
    });
}

const ITEMS_PER_PAGE = 10;

async function getBooks(req, res) {
  const { title, genre, availability, sort, price } = req.query;
  const page = +req.query.page || 1;
  try {
    if (title || genre || availability || sort || price) {
      const query = {};
      if (title) {
        query.title = { $regex: title, $options: "i" };
      }
      if (genre !== "all") {
        query.genre = genre;
      }
      if (availability !== "all") {
        query.availability = availability;
      }
      if (price) {
        query.price = { $lte: parseInt(price) };
      }
      const sortQuery = {
        latest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        "a-z": { title: 1 },
        "z-a": { title: -1 },
      };

      const sortCriteria = sortQuery[sort];

      const totalBooks = await Book.find(query).countDocuments();
      const numOfPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);
      const books = await Book.find(query)
        .sort(sortCriteria)
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
      res.status(200).send({ books, totalBooks, numOfPages });
      return;
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  }
}

async function deleteBook(req, res) {
  const { id } = req.params;
  try {
    await Book.findByIdAndDelete(id);
    res.status(200).send("Book deleted");
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  }
}

async function updateBook(req, res) {
  const { id } = req.params;
  const { title, author, price, genre, availability } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(
      id,
      { title, author, price, genre, availability },
      { new: true }
    );
    res.status(200).send(book);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  }
}

async function getBookStats(req, res) {
  try {
    const defaultStats = await Book.aggregate([
      { $group: { _id: "$availability", count: { $sum: 1 } } },
    ]);

    const formattedDefaultStats = defaultStats.reduce((acc, stat) => {
      acc[stat._id.toLowerCase()] = stat.count;
      return acc;
    }, {});

    res.status(200).send({ defaultStats: formattedDefaultStats });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  }
}

module.exports = { createBook, getBooks, deleteBook, updateBook, getBookStats };

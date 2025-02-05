const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        genre: { type: String, required: true },
        price: { type: Number, required: true },
        availability: { type: String, required: true},
    },
    {
        collection: "book-mart-books",
        timestamps: true,
    }
);

const Book = mongoose.model("Book", schema);

module.exports = Book;
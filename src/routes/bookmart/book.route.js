const express = require("express");
const router = express.Router();
const {
  createBook,
  getBookStats,
  getBooks,
  deleteBook,
  updateBook,
} = require("../../controllers/bookmart/book.controller");
const authenticateToken = require('../../middleware/authenticateToken');


router.post("/create", authenticateToken, createBook);
router.get("/getBooks", authenticateToken, getBooks);
router.get("/stats", authenticateToken,  getBookStats);
router.delete("/delete/:id", authenticateToken, deleteBook);
router.patch("/update/:id", authenticateToken, updateBook);

module.exports = router;

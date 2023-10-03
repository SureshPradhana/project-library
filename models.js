const mongoose = require("mongoose");
const { Schema } = mongoose;

const BooksSchema = new Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, required: true,  default: 0 }, 
  comments: [String]
});

const Books = mongoose.model("Book", BooksSchema);

exports.Books = Books; 

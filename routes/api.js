const mongoose = require("mongoose");
const BooksModel = require("../models").Books;
require('../connection')

'use strict';

async function handlePostRequest(req, res) {
  try {
    const title = req.body.title;

    if (!title) {
      res.json("missing required field title");
      return;
    }

    const newBook = new BooksModel({
      title,
      comments: [],
      commentcount: 0,
    });


    const savedBook = await newBook.save();
    const responseBook = {
      _id: savedBook._id,
      title: savedBook.title,
    };

    res.json(responseBook);
  } catch (err) {
    res.json("missing required field title");
  }
}

module.exports = function(app) {
  app.route('/api/books')
    .get(async function(req, res) {

      try {
        const allBooks = await BooksModel.find({}, 'title _id commentcount');
        res.json(allBooks);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    })
    .post(async function(req, res) {
      await handlePostRequest(req, res);
    })
    .delete(async function(req, res) {
      try {
        await BooksModel.deleteMany({});
        res.json("complete delete successful");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    });

  app.route('/api/books/:id')
    .get(async function(req, res) {
      try {
        const bookId = req.params.id;
        const bookInfo = await BooksModel.findById(bookId, 'title _id comments');
        if (!bookInfo) {
          return res.json("no book exists");
        }

        res.json(bookInfo);
      } catch (error) {
        // console.error(error);
        res.status(500).json("no book exists");
      }
    })


    .post(async function(req, res) {
      try {
        const bookId = req.params.id;
        const comment = req.body.comment;

        if (!comment) {
          return res.json("missing required field comment");
        }

        const bookInfo = await BooksModel.findById(bookId);

        if (!bookInfo) {
          return res.json("no book exists");
        }
        bookInfo.comments.push(comment);
        bookInfo.commentcount += 1;
        await bookInfo.save();

        res.json(bookInfo);
      } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    })
    .delete(async function(req, res) {
      try {
        const bookId = req.params.id;

        const bookInfo = await BooksModel.findById(bookId);

        if (!bookInfo) {
          return res.json("no book exists");
        }
        await BooksModel.deleteOne({ _id: bookId });

        res.json("delete successful");
      } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
    });
};

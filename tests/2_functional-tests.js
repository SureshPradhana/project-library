
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let validId;
suite('Functional Tests', function() {
  this.timeout(5000);

  suite('Routing tests', function() {
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .send({ title: 'Test Book' })
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              assert.property(res.body, 'title', 'Response should contain title');
              assert.property(res.body, '_id', 'Response should contain _id');
              assert.equal(res.body.title, 'Test Book');
              validId = res.body._id
              done();
            }
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .keepOpen()
          .post('/api/books')
          .send()
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field title");
              done();
            }
          });
      });
    });

    suite('GET /api/books => array of books', function() {
      test('Test GET /api/books', function(done) {
        chai.request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              assert.isArray(res.body, 'Response should be an array');
              done();
            }
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function() {
      test('Test GET /api/books/[id] with id not in db', function(done) {
        const invalidId = '1323'; // An ID that is not in the database
        chai.request(server)
          .keepOpen()
          .get('/api/books/' + invalidId)
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 500);
              if (res.body === 'no book exists') {
                assert.equal(res.body, 'no book exists');
              } else {
                assert.isObject(res.body, 'Response should be an object');
                assert.property(res.body, 'title', 'Response should contain title');
                assert.property(res.body, '_id', 'Response should contain _id');
                assert.isArray(res.body.comments, 'Response should contain a comments array');
              }
              done();
            }
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .keepOpen()
          .get('/api/books/' + validId)
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              if (res.body === 'no book exists') {
                assert.equal(res.body, 'no book exists');
              } else {
                assert.isObject(res.body, 'Response should be an object');
                assert.property(res.body, 'title', 'Response should contain title');
                assert.property(res.body, '_id', 'Response should contain _id');
                assert.isArray(res.body.comments, 'Response should contain a comments array');
              }
              done();
            }
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function() {
      test('Test POST /api/books/[id] with comment', function(done) {
        const commentToAdd = 'This is a test comment';
        chai.request(server)
          .post('/api/books/' + validId)
          .send({ comment: commentToAdd })
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              if (res.body === 'no book exists') {
                assert.equal(res.body, 'no book exists');
              } else if (res.body === 'missing required field comment') {
                assert.equal(res.body, 'missing required field comment');
              } else {
                assert.isObject(res.body, 'Response should be an object');
                assert.property(res.body, 'title', 'Response should contain title');
                assert.property(res.body, '_id', 'Response should contain _id');
                assert.isArray(res.body.comments, 'Response should contain a comments array');
              }
              done();
            }
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
          .post('/api/books/' + validId)
          .send()
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'missing required field comment');
              done();
            }
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        const invalidId = 'invalid_id';
        const commentToAdd = 'This is a test comment';
        chai.request(server)
          .post('/api/books/' + invalidId)
          .send({ comment: commentToAdd })
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 500);
              done();
            }
          });
      });
    });


    suite('DELETE /api/books/[id] => delete book object id', function() {


      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .delete('/api/books/' + validId)
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 200);
              done();
            }
          });
      });


      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        const invalidId = 'invalid_id';
        chai.request(server)
          .delete('/api/books/' + invalidId)
          .end(function(err, res) {
            if (err) {
              done(err);
            } else {
              assert.equal(res.status, 500);
              done();
            }
          });
      });

    });

  });

});

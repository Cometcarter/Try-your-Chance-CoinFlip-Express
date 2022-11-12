const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId
var db, collection;

const url =
  'mongodb+srv://ellie:mindyabusiness@psapapi.yrtvq.mongodb.net/coinFlip?retryWrites=true&w=majority';
const dbName = 'coinFlip';

app.listen(8000, () => {
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (error, client) => {
      if (error) {
        throw error;
      }
      db = client.db(dbName);
      console.log('Connected to `' + dbName + '`!');
    }
  );
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  db.collection('results')
    .find()
    .toArray((err, allDocuments) => {
      if (err) return console.log(err);
      res.render('index.ejs', { coinFlipResults: allDocuments });
    });
});

app.post('/results', (req, res) => {
  let coinResult = Math.ceil(Math.random() * 2);
  let botResult;

  if (coinResult <= 1) {
    botResult = 'heads';
  } else if (coinResult <= 2) {
    botResult = 'tails';
  }

  let outcome;

  if (botResult === req.body.userGuess) {
    outcome = 'You Win!';
  } else {
    outcome = 'You Lose!';
  }

  db.collection('results').insertOne(
    {
      userGuess: req.body.userGuess,
      coinFlipResult: botResult,
      winOrLose: outcome
    },
    (err, result) => {
      if (err) return console.log(err);
      console.log('saved to database');
      res.redirect('/');
    }
  );
});


app.delete('/messages', (req, res) => {
  db.collection('results').findOneAndDelete({
    _id: ObjectId(req.body._id)
  },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send('Message deleted!');
    }
  );
});
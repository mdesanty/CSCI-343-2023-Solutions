require('dotenv').config();

const util = require('./util');

const express = require('express');
const session = require("express-session")

const app = express();

const sessionOptions = {
  secret: "Mike is awesome",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60_000
  }
};

app.use(session(sessionOptions));
app.use((req, res, next) => {
  req.session.commandCount ||= 0;

  if (['/dotted', '/fizzBuzz', '/gradeStats', '/rectangle'].includes(req.path)) {
    req.session.commandCount++;
    req.session.lastCommand = req.path;
  }

  next();
});

app.get('/dotted', dotted);
app.get('/fizzBuzz', fizzBuzz);
app.get('/gradeStats', gradeStats);
app.get('/rectangle', rectangle);
app.get('/stats', stats);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function dotted(req, res) {
  util.dotted(req.query.word1, req.query.word2)
    .then(result => { res.send(`<pre>${result}</pre>`); })
    .catch(error => { res.status(400).send(`<pre>${error.message}</pre>`); });
}

function fizzBuzz(req, res) {
  util.fizzBuzz(req.query.start, req.query.end)
    .then(result => { res.send(`<pre>${result}</pre>`); })
    .catch(error => { res.status(400).send(`<pre>${error.message}</pre>`); });
}

function gradeStats(req, res) {
  const grades = (req.query.grade instanceof Array ? req.query.grade : [req.query.grade]);

  util.gradeStats(grades)
    .then(result => { res.json(result); })
    .catch(error => { res.status(400).json({ error: error.message }); });
}

function rectangle(req, res) {
  util.rectangle(req.query.length, req.query.width)
    .then(result => { res.json(result); })
    .catch(error => { res.status(400).json({ error: error.message }); });
}

function stats(req, res) {
  const result = { commandCount: req.session.commandCount, lastCommand: req.session.lastCommand };
  res.json(result);
}
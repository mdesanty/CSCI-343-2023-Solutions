require('dotenv').config();

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
  try {
    const word1 = req.query.word1;
    const word2 = req.query.word2;

    if (word1 === undefined || word2 === undefined) { throw Error('Both word1 and word2 are required.') };

    const totalWordLength = word1.length + word2.length;

    if (totalWordLength >= 30) { throw Error('The words are too long. There is no room for "." characters.') };

    const dots = '.'.repeat(30 - totalWordLength);
    const result = word1 + dots + word2;

    res.send(`<pre>${result}</pre>`);
  }
  catch (e) {
    res.status(400).send(`<pre>${e.message}</pre>`);
  }
}

function fizzBuzz(req, res) {
  try {
    let start = req.query.start;
    let end = req.query.end;

    if (start === undefined || end === undefined) { throw Error('Both start and end are required.'); }
    if (isNaN(start) || isNaN(end)) { throw Error('Both start and end must be integers.'); }

    start = parseInt(start);
    end = parseInt(end);

    if (start > end) { throw Error('Start cannot be greater than end.'); }

    let result = '';
    for (let i = start; i <= end; i++) {
      const value = ( (i % 3 ? '' : 'Fizz') + (i % 5 ? '' : 'Buzz') || i.toString() );
      result += value + "\n";
    }

    res.send(`<pre>${result}</pre>`);
  }
  catch (e) {
    res.status(400).send(`<pre>${e.message}</pre>`);
  }
}

function gradeStats(req, res) {
  try {
    let grades = req.query.grades;

    if (grades === undefined || grades.length < 1) { throw Error('At least one grades value is required.') };
    grades = grades.map(i => {
      if (isNaN(i)) { throw Error('All grades must be numbers.'); }
      return parseFloat(i);
    });

    const result = {};
    result.minimum = Math.min(...grades);
    result.maximum = Math.max(...grades);
    result.average = grades.reduce((reducer, i) => reducer + i, 0) / grades.length;

    res.json(result);
  }
  catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function rectangle(req, res) {
  try {
    let length = req.query.length;
    let width = req.query.width;

    if (length === undefined || width === undefined) { throw Error('Both length and width are required.') };
    if(isNaN(length) || isNaN(width)) { throw Error('Both length and width must be numbers.') };

    length = parseFloat(length);
    width = parseFloat(width);

    if(length <= 0 || width <= 0) { throw Error('Both length and width must be positive.'); }

    const result = {};
    result.area = length * width;
    result.perimeter = length * 2 + width * 2;

    res.json(result);
  }
  catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function stats(req, res) {
  const result = { commandCount: req.session.commandCount, lastCommand: req.session.lastCommand };
  res.json(result);
}
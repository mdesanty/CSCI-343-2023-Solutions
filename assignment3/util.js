function dotted(word1, word2) {
  const promise = new Promise((resolve, reject) => {
    if (word1 === undefined || word2 === undefined) { reject(new Error('Both word1 and word2 are required.')); };

    const totalWordLength = word1.length + word2.length;

    if (totalWordLength >= 30) { reject(new Error('The words are too long. There is no room for "." characters.')); };

    const dots = '.'.repeat(30 - totalWordLength);
    const result = word1 + dots + word2;

    resolve(result);
  });

  return promise;
}

function fizzBuzz(start, end) {
  const promise = new Promise((resolve, reject) => {
    if (start === undefined || end === undefined) { reject(new Error('Both start and end are required.')); }
    if (isNaN(start) || isNaN(end)) { reject(new Error('Both start and end must be integers.')); }

    start = parseInt(start);
    end = parseInt(end);

    if (start > end) { reject(new Error('Start cannot be greater than end.')); }

    let result = '';
    for (let i = start; i <= end; i++) {
      const value = ( (i % 3 ? '' : 'Fizz') + (i % 5 ? '' : 'Buzz') || i.toString() );
      result += value + "\n";
    }

    resolve(result);
  });

  return promise;
}

function gradeStats(grades) {
  const promise = new Promise((resolve, reject) => {
    if (grades === undefined || grades.length < 1) { reject(new Error('At least one grades value is required.')); };
    grades = grades.map(i => {
      if (isNaN(i)) { reject(new Error('All grades must be numbers.')); }
      return parseFloat(i);
    });

    const result = {};
    result.minimum = Math.min(...grades);
    result.maximum = Math.max(...grades);
    result.average = grades.reduce((reducer, i) => reducer + i, 0) / grades.length;

    resolve(result);
  });

  return promise;
}

function rectangle(length, width) {
  const promise = new Promise((resolve, reject) => {
    if (length === undefined || width === undefined) { reject(new Error('Both length and width are required.')); };
    if(isNaN(length) || isNaN(width)) { reject(new Error('Both length and width must be numbers.')); };

    length = parseFloat(length);
    width = parseFloat(width);

    if(length <= 0 || width <= 0) { reject(new Error('Both length and width must be positive.')); }

    const result = {};
    result.area = length * width;
    result.perimeter = length * 2 + width * 2;

    resolve(result);
  });

  return promise;
}

module.exports = {
  dotted,
  fizzBuzz,
  gradeStats,
  rectangle
};
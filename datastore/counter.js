const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

//creates a 5 digit string by padding with zeros
const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};



const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};


//I - takes in a number and a function
//O - performs a callback on a zero-padded number or logs an error
//Purpose - Attempts to write to  a file (counterfile)
const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

/****NEED TO REFACTOR SO THAT THE CURRENT STATE OF THE COUNTER IS SAVED
TO THE HARD DRIVE (MAKE USE OF READ AND WRITE COUNTER FUNCTIONS)
AND THEN COMMIT*/
//returns the next number (zero padded)
//used where?
exports.getNextUniqueId = (callback) => {
  //read counter file (counterTest.txt?) to know where counter is at currently
  //increment current value of counter
  readCounter((err, count) => {
    count++;
    writeCounter(count, (err, id) => {
      callback(err, id);
    });
  });


  counter = counter + 1;
  //write the counter value to that file (callback can be to read to verify)
  return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');

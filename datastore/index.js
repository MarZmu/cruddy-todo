const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};
var memoryFile = path.join(__dirname, 'counter.txt');
// Public API - Fix these CRUD functions ///////////////////////////////////////
//I-string and function
//O - stores the string at the next zero padded number key
//  - performs allback function on the key and value

/* *** EACH NEW TODO MUST BE SAVED IN ITS OWN FILE
USE THE UNIQUE ID TO CREATE A FILE PATH INSIDE THE DATADIR

WITH EACH POST, SAVE A FILE WITH THE TODO ITEM  IN THIS FOLDER

ONLY SAVE THE TODO TEXT, THE ID IS ENCODED IN THE FILE NAME (DONT STORE AN OBJECT)*/
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('file written sucessfully.');
        callback(null, { id, text });
      }
    });
  } );

  // items[id] = text;
};

//returns objects with the key and value
//performs callback on them
exports.readAll = (callback) => {
  console.log('INDEX.JS --- exports.readAll');
  //read the counter.txt file to get the current number of datadir files
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      console.log('files: ', files);/*  ['0001', '0002', '0003.txt'],*/
      var fileList = _.map(files, (file) => {
        file = file.slice(0, 5);
        //read file  @ [0001.txt]
        return {"id": file, "text": file };
        // fs.readFile(path.join(exports.dataDir, `/${file}`), (err, data) => {
        //   return {id: file, text: data.toString()};
        // });
      });
      console.log('filelist: ', fileList);
      callback(null, fileList);
    }
  }
  );

  //fs.readFile(exports.counterFile, (err, data) => {

  //create a loop that iterates from zero to counter number

  ////use the zero padded function to create each id# (file name)

  ////read each file, making an object out of each one

  //return the array of objects
};

//attempts to identify a specific key value pair in the items object
exports.readOne = (id, callback) => {
  console.log('INDEX.JS --- exports.readone');
  // call readFile using the id argument to specify the file name

  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  console.log('INDEX.JS -- exports.update');
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  console.log('INDEX.JS -- exports.delete');
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};
var memoryFile = path.join(__dirname, 'counter.txt');
var readFilePromise = Promise.promisify(fs.readFile);
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
  });

  // items[id] = text;
};

//returns objects with the key and value
//performs callback on them

exports.readAll = (callback) => {
  debugger;
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('here');
      return callback(err);
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      console.log(file);
      return readFilePromise(path.join(exports.dataDir, file)).then((fileData) => {
        return {id: id, text: fileData.toString()};
      });
    });
    //waiting for all promises to be created
    Promise.all(data)
      .then((items) => {
        callback(null, items);
      });
  });
};


//attempts to identify a specific key value pair in the items object
exports.readOne = (id, callback) => {
  console.log('INDEX.JS --- exports.readone');
  // call readFile using the id argument to specify the file name
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, message) => {
    if (err) {
      callback(err);
    } else {
      var text = { 'id': id, 'text': message.toString() };
      callback(null, text);
    }
  });
};

//readfile (create path using id)
//create object and send to callback
//error message if erorr

exports.update = (id, text, callback) => {
  console.log('INDEX.JS -- exports.update');
  //readfile to see if it exists
  //writefile to replace it with new text

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(err);
        } else {
          var updatedtodo = { 'id': id, 'text': text };
          callback(null, updatedtodo);
        }
      });
    }
  });
};


exports.delete = (id, callback) => {
  console.log('INDEX.JS -- exports.delete');
  //fs.unlink the directory
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(err);
    } else {
      console.log('was deleted');
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

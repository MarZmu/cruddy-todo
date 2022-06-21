const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
//I-string and function
//O - stores the string at the next zero padded number key
//  - performs allback function on the key and value

/* *** EACH NEW TODO MUST BE SAVED IN ITS OWN FILE
USE THE UNIQUE ID TO CREATE A FILE PATH INSIDE THE DATADIR

WITH EACH POST, SAVE A FILE WITH THE TODO ITEM  IN THIS FOLDER

ONLY SAVE THE TODO TEXT, THE ID IS ENCODED IN THE FILE NAME (DONT STORE AN OBJECT)*/
exports.create = (text, callback) => {
  console.log(`index.js - create - ${text}`);
  var id = counter.getNextUniqueId();
  items[id] = text;
  callback(null, { id, text });
};

//returns objects with the key and value
//performs callback on them
exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

//attempts to identify a specific key value pair in the items object
exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
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

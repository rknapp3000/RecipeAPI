const {ObjectId} = require('mongodb');

module.exports = {
  idValidation(id, name) {
    if (!id) throw `A ${name} must be provided`;
    if (typeof id !== 'string') throw `${name} must be a string`;
    id = id.trim();
    if (id.length === 0) throw `${name} cannot be an empty string only spaces`;
    if (!ObjectId.isValid(id)) throw `${name} is not a valid object ID`;
    return id;
  },

  stringValidation(str, name) {
    if (!str) throw `A ${name} must be provided!`;
    if (typeof str !== 'string') throw `${name} must be a string`;
    str = str.trim();
    if (str.length === 0) throw `${name} must not be an empty string or only spaces`;
    if (!isNaN(str)) throw `${str} is not a valid input for ${name}`;
    return str;
  },

  arrayAndStringValidation(arr, name) {
    let invalidArrayFlag = false;
    if (!arr || !Array.isArray(arr)) throw `${name} must be an array`;
    for (i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {invalidArrayFlag = true;
        break;
      }
      arr[i] = arr[i].trim();
    }
    if (invalidArrayFlag) throw `Element(s) in ${name} are not a string or are empty strings`;
    return arr;
  }

};
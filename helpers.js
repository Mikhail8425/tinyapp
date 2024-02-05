const bcrypt = require("bcrypt");

//Generate random string, 6 character  
const generateRandomString = function () {
  return Math.random().toString(36).substring(2,8);
};

// USER FUNCTIONS //
const getUserByEmail = (email, db) => {
  for (let key in db) {
    if (db[key].email === email) {
      return db[key];
    }
  }
  return undefined;
};

// URL FUNCTIONS //
const createUserUrlDataBase = function (userID, urlDatabase) {
  const userUrlDataBase = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      userUrlDataBase[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrlDataBase;
};

const checkURL = function(URLID, urlDatabase) {
  return URLID in urlDatabase;
}

module.exports = { 
  generateRandomString,
  getUserByEmail,
  createUserUrlDataBase,
  checkURL
 }
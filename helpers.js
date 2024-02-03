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

const getUserById = function(id, database) {
  return database[id];
};

const getUserFromCookie = function(sessionCookie) {
  const userIdFromCookie = sessionCookie.user_id;
  return getUserById(userIdFromCookie, users);
};


// URL FUNCTIONS //
const getUrlFromShortUrl = function(shortUrl) {
  return urlDatabase[shortUrl];
};

const updateUrlWithShortUrl = function(shortUrl, urlInfo) {
  urlDatabase[shortUrl] = {longURL: urlInfo.longURL,
    userID: urlInfo.userID};
};

const createNewURL = function(longURL, userID) {
  let newShortUrl = generateNewShortUrl();
  updateUrlWithShortUrl(newShortUrl, {longURL: longURL, userID: userID});
  return newShortUrl;
};

const generateNewShortUrl = function() {
  let newShortUrl = generateRandomString();
  while (urlDatabase[newShortUrl] !== undefined) {
    newShortUrl = generateRandomString();
  }
  return newShortUrl;
};


module.exports = { 
  generateRandomString,
  getUserByEmail,
  getUserFromCookie,
  getUserById,
  getUrlFromShortUrl,
  generateNewShortUrl,
  createNewURL
 }
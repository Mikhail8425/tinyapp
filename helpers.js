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

const getUserFromCookie = function(sessionCookie) {
  const userIdFromCookie = sessionCookie.user_id;
  return getUserById(userIdFromCookie, users);
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
  createUserUrlDataBase,
  checkURL,
  generateNewShortUrl,
  createNewURL
 }
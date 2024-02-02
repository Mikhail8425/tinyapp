//check to see if email exist in database
const findEmail = (email, db) => {
  for (let key in db) {
    if (email === db[key].email) {
      return email;
    }
  }
  return undefined;
};

// A function prepends 'http://' if there is no 'http://' or 'https://'
  const setLongUrl = function(url) {
  if (url.match(/^(https:\/\/|http:\/\/)/)) {
    return url;
  } else {
    return "http://" + url;
  }
};

//Generate random string, 6 character  
const generateRandomString = function () {
  return Math.random().toString(36).substring(2,8);
};

//Return user obj based on email key
const getUserByEmail = (email, db) => {
  for (let key in db) {
    if (db[key].email === email) {
      return db[key];
    }
  }
  return undefined;
};

module.exports = { findEmail, generateRandomString, setLongUrl, getUserByEmail }
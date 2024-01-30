module.exports = () => {
  // A function that takes an email and a users object, loops through the object
  // to find a user with a matching email, and returns the user object.

  //check to see if email exist
  const findEmail = (email, db) => {
    for (let key in db) {
      if (email === db[key].email) {
        return email;
      }
    }
    return undefined;
  };
  // A function that takes a URL, checks if it starts with http:// or https://,
  // and returns the URL as-is if it does, or prepends 'http://' otherwise.
  
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

  // Export an object that contains the three functions.
  return { findEmail, generateRandomString, setLongUrl };
};
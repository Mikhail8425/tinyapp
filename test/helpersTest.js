const { assert } = require('chai');

const { findEmail, generateRandomString, setLongUrl, getUserByEmail } = require("../helpers");

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user.id,expectedOutput);
  });

  it('should return undefined if the email is not valid', function() {
    const user = getUserByEmail("user3@example.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user,expectedOutput);
  });
});

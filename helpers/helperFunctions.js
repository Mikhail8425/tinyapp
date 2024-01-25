
//check to see if email exist 
const findEmail = (email, users) => {
  for (let key in users) {
    if (email === users[key].email) {
      return email;
    }
  }
  return undefined;
};

//check to see if password exist
const findPassword = (email, users) => {
  for (let key in users) {
    if (email === users[key].email) {
      return users[key].password ;
    }
  }
  return undefined;
};

const findUserID = (email, users) => {
  for (let key in users) {
    if (email === users[key].email) {
      return users[key].id ;
    }
  }
  return undefined;
};

module.exports = { findEmail, findPassword, findUserID }
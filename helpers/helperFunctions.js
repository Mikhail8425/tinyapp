
//check to see if email exist 
const findEmail = (email, users) => {
  for (let key in users) {
    if (email === users[key].email) {
      return email; //should return obj user
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

const findUser = (email, users) => {
  for (let key in users) {
    if (email === users[key].email) {
      console.log(users[key]);
      return users[key] //should return obj user
    }
  }
  return undefined;
};


module.exports = { findEmail, findPassword, findUserID, findUser }
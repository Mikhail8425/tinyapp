//npm start - to start

const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080
const { findEmail, findPassword, findUserID, findUser } = require('./helpers/helperFunctions')
app.set("view engine", "ejs"); //Set ejs as the view engine.
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));



//HELPER FUNCTIONS
const generateRandomString = () => { //generates 6-digit random key 
  return Math.random().toString(36).substring(2,8);
};

//OBJECTS

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//SEREVER

//Register

app.post("/register", (req, res) => {
  const newUserID = generateRandomString();
  const email = req.body.email
  const password = req.body.password;
  const newUserObj = {
    id : newUserID,
    email : email,
    password : password
  }; 
  
  const userEmail = findEmail(email, users);
  if (newUserObj.email === "" || newUserObj.password === ""){
    res.send("400 error ! Please enter email and password");
  } 
  if (userEmail) {
    res.send("400 error ! There is already a user with this email");
  } else { 
    console.log("hello new user");
    
    users[newUserID] = newUserObj;
    console.log("userEmail", newUserObj.email);
    res.cookie("user_id", newUserID);
    res.redirect("/urls");    
  }
});

app.get('/register', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["user_id"],
  };
  res.render("register", templateVars)
}); 

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => { 
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["user_id"],
  };
  console.log("templeVars", templateVars)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["user_id"] 
  };
  res.render("urls_show", templateVars);
});




app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); //call function to generate newID
  urlDatabase[shortURL] = req.body.longURL; // add key:value to object
  console.log(urlDatabase)

  console.log(req.body); // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`); //redirect to a page with shortURL
});

//redirect to longURL
app.get("/u/:id", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["user_id"],
  };
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  

  if (longURL) {
    console.log(`Redirecting to ${longURL}`);
    res.redirect(longURL);
  } else {
    res.status(404).send('Short URL not found');
  }
});

// UPDATE
// we want to change an existing quote
// display the quote that we want to change
// resubmit with the change

app.get('/urls/:id', (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["user_id"],
  };
  const urlId = req.params.id;
  console.log('urlID', urlId)
  let urlObj = urlDatabase[urlId];
  res.render({ urlObj }, templateVars);
});

app.post('/urls/:id', (req, res) => {
  let newLongURL = req.body.longURL;
  urlDatabase[req.params.id] = newLongURL;
  res.redirect('/urls');
});

// DELETE
app.post('/urls/:id/delete', (req, res) => {
  // extract the id of the url to be deleted
  const urlId = req.params.id;
  // delete the url from the database
  delete urlDatabase[urlId];
  res.redirect('/urls');
});


//Login
//executed when click "login" from /url page
app.get("/login", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["user_id"] 
  };
  console.log("url => login page")
  console.log(templateVars)
  res.render("login", templateVars);
});

//executed when click "login" from /login page
app.post('/login', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  console.log('email, password', email, password);
  const existingUserEmail = findEmail(email, users);
  const existingUserPassword = findPassword(email, users);
  console.log('existingUser email, password', existingUserEmail, existingUserPassword);
  if (email === existingUserEmail && password === existingUserPassword) {
    const existingUserID = findUserID(email, users);
    const existingUser = findUser(email, users)
    console.log('existingUserID', existingUserID)
  
    res.cookie('user_id', existingUserID, existingUser, templateVars);
    res.redirect('/urls');
  } else {
    res.status(403).send('User does not exist. Please go to register page!');
  }  
});

//Logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
}); 

//should always be at the end
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



//npm start - to start

const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //Set ejs as the view engine.
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => { 
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

const generateRandomString = () => { //generates 6-digit random key 
  const randomString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += randomString.charAt(Math.floor(Math.random() * randomString.length));
  }
  return result;
};

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); //call function to generate newID
  urlDatabase[shortURL] = req.body.longURL; // add key:value to object
  console.log(urlDatabase)

  console.log(req.body); // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`); //redirect to a page with shortURL
});

//redirect to longURL
app.get("/u/:id", (req, res) => {
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
  const urlId = req.params.id;
  console.log('urlID', urlId)
  let urlObj = urlDatabase[urlId];
  res.render({ urlObj });
});

app.post('/urls/:id', (req, res) => {
  let newLongURL = req.body.longURL;
  urlDatabase[req.params.id] = newLongURL;
  res.redirect('/urls');
});



// DELETE
// delete an existing quote

app.post('/urls/:id/delete', (req, res) => {
  // extract the id
  const urlId = req.params.id;
  // delete the quote from the database

  delete urlDatabase[urlId];

  // redirect
  res.redirect('/urls');
});


//Login
app.post('/login', (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect('/urls');
});



//should always be at the end
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
// Mdules
const express = require("express");
const app = express();
const PORT = 8080;

// password hasher
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("123", saltRounds),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("123", saltRounds)
  },
};

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "user01"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user02"
  }
};

app.use(express.static("public"));


// Import helper functions from external file
const { 
  generateRandomString,
  getUserByEmail,
  getUserFromCookie,
  getUserById,
  getUrlFromShortUrl,
  generateNewShortUrl,
  createNewURL
} = require("./helpers");

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie session
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["alpha135", "beta246", "gamma357", "delta468", "epsilon579"],
  })
);
  
// Configure view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Define routes
app.get("/urls.json", (req, res) => {
  res.json(users);
});

// Homepage redirects to urls or login
app.get("/", (req, res) => {
  if (req.session.userID) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});
  
//  LOGIN get/post  //

app.get("/login", (req, res) => {
  // Create an object with user information
  let templateVars = { 
    user: users[req.session["userID"]]
  };  
  // Check if there is already a user logged in, if so, redirect to main page
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    // Render the login page and pass in the user object
    res.render("login", templateVars);
    console.log("No user => register page") //DELETE
  }
});

app.post("/login", (req, res) => {
  // Extract the email and password from the request body
  const { email, password } = req.body;
  // Check if the user exists in the user database
  const user = getUserByEmail(email, users);
  // Check if the provided password matches the password associated with the email
  if (user && bcrypt.compareSync(password, user.password)) {
    // Set the userID cookie and redirect to the urls page
    req.session.userID = user.id;
    res.redirect("/urls");
  } else {
    // Otherwise, send a 401 Unauthorized response
    res.status(401).send("User or password are not correct");
  }
});

// LOGOUT //
app.post("/logout", (req, res) => {
  // Clear the userID cookie and redirect to the login page
  req.session = null;
  res.redirect("/login");
});

// REGISTER get/post // 
app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  // Extract the email and password from the request body, create new random ID
  const { email, password } = req.body;
  const newUserID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // Check if the user already exists
  for (let newUserID in users) {
    if (users[newUserID].email === email) {
      res.status(400).send("User already exist");
      return;
    }
  }
  // Add the new user to the user database
  users[newUserID] = {
    id: newUserID,
    email: email,
    password: hashedPassword,
  };

  if (email && password) {
    // Set the userID cookie and redirect to the urls page
    req.session.userID = newUserID;
    res.redirect("/urls");
  } else {
    // If email and/or password are missing, send a 400 Bad Request response
    res.status(400).send("Please enter email and password");
  }
  req.session.userId = newUserID;
  res.redirect("/urls");
});

//  URLS get/post  //
app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  if (!userID) {
    // Error when user is not logged in
    res.status(401).send("You're not logged in. Please go to login page.");
  } else {
    // Filter urlDatabase to only show URLs created by the current user
    const userUrls = {};
    for (const [id, urlObj] of Object.entries(urlDatabase)) {
      if (urlObj.userID === userID) {
        userUrls[id] = urlObj.longURL;
      }
    }
    // Render URLs index page with user-specific URL data
    const templateVars = {
      user: users[userID],
      urls: userUrls,
    };
    res.render("urls_index", templateVars);
  }
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session["userID"];
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

// Display form for creating a new URL
app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  if (!userID) {
    //rerdirect if there is no user
    res.redirect("/login");
  } else {
    // Render new URL form with user data
    let templateVars = {
      user: users[userID],
    };
    res.render("urls_new", templateVars);
  }
});

// Redirect to long URL associated with a short URL

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const urlObject = urlDatabase[shortURL];

  if (!urlObject) {
    res.status(404).send("url not found");
    return;
  }
  
  const longURL = urlObject.longURL;
  const userID = req.session.userID;

  // if (user_id !== urlObject.userID) {
  //   res.status(403).send("Access to URL denied");
  //   return;
  // }
  
  const templateVars = {
    id: shortURL,
    longURL:longURL,
    user: userID,
    urlObject: urlObject,
  };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.session["userID"]) {
    let longURL = req.body.longURL;
    urlDatabase[req.params.id].longURL = longURL;
    res.redirect('/urls');
  } else {
    res.status(403).send("Not permitted");
  }
});

app.post("/urls/:id/delete", (req, res) => {
  if (!req.session.userID) {
    // Error when user is not logged in
    res.status(401).send("You need to log in to delete a URL");
    return;
  }
  const url = urlDatabase[req.params.id];
  if (!url) {
    res.status(404).send("URL not found (app.post - urls-id-delete)");
    return;
  }

  if (url.userID !== req.session.userID) {
    res.status(403).send("You are not authorized to delete this URL");
    return;
  }
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.send("Please login to shorten URLs");
    return;
  }
  const longURL = req.body.newLongURL;
  const shortURL = req.params.id;
  // Check if shortURL exists in urlDatabase
  if (!urlDatabase[shortURL]) {
    res.status(404).send("URL not found (app.post - urls-id-edit)");
    return;
  }
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(` listening on port ${PORT}!`);
});
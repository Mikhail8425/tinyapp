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
    password: bcrypt.hashSync("2", saltRounds),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("2", saltRounds)
  },
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.static("public"));


// Import helper functions from external file
const { findEmail, generateRandomString, setLongUrl } = require("./helpers")({ users });

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
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});
  
//LOGIN

// Login page
app.get("/login", (req, res) => {
  // Create an object with user information
  let templateVars = { 
    user: users[req.session["user_id"]]
  };  
  // Check if there is already a user logged in, if so, redirect to main page
  if (templateVars.user) {
    res.redirect("/urls");
  } else {
    // Render the login page and pass in the user object
    res.render("urls_register", templateVars);
    console.log("No user => register page") //DELETE
  }
});

//REGISTER USER
  
app.get("/register", (req, res) => {
  // Render the urls_register template with the user data
  let templateVars = { 
    user: users[req.session["user_id"]]
  };
  res.render("urls_register", templateVars);
});

//MAIN PAGE
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
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

// Display form for creating a new URL
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
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

// Create a new short URL
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    // Error when user is not logged in
    res.status(401).send("You're not logged in. Please go to login page.");
  } else {
    // Generate random short URL ID and add new URL to database
    let id = generateRandomString();
    urlDatabase[id] = {
      longURL: setLongUrl(req.body.longURL),
      userID: userID,
    };
    // Redirect to new URL page
    res.redirect(`/urls/${id}`);
  }
});

// Delete a short URL
app.post("/urls/:id/delete", (req, res) => {
  if (!req.session.user_id) {
    // Error when user is not logged in
    res.status(401).send("You need to log in to delete a URL");
    return;
  }
  const url = urlDatabase[req.params.id];
  if (!url) {
    res.status(404).send("URL not found");
    return;
  }

  if (url.userID !== req.session.user_id) {
    res.status(403).send("You are not authorized to delete this URL");
    return;
  }
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// Redirect to long URL associated with a short URL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
  console.log(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session["userID"]) {
    console.log('users', users)
    res.status(400).send("400 error ! Please Login or Register");
  } else if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("404 not found! This URL doesn't exist");
  } else if (urlDatabase[req.params.shortURL].userID === req.session["userID"]) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session["userID"]]
    };
    res.render("urls_show", templateVars);
  } else if (urlDatabase[req.params.shortURL].userID !== req.session["userID"]) {
    res.status(403).send("403 error ! This is not your URL");
  } else {
    res.status(400).send("400 error ! Please Login");
  }
});

// app.get("/urls/:id", (req, res) => {
//   const userID = req.session.user_id;
//   const id = req.params.id;

//   if (!userID) {
//     // Error when user is not logged in
//     res.status(401).send("Login required");
//   } else if (!urlDatabase[id]) {
//     // If the ID does not exist in the database, send an error message
//     res.status(404).send("URL not found");
//   } else {
//     // If user is logged in and the ID exists, render the urls_show template with the provided URL data
//     const templateVars = {
//       user: users.req.session.user_id,
//       id: id,
//       longURL: urlDatabase[id],
//     };
//     res.render("urls_show", templateVars);
//   }
// });

//POST
app.post("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.session["userID"]) {
    let longURL = req.body.longURL;
    urlDatabase[req.params.id].longURL = longURL;
    res.redirect('/urls');
  } else {
    res.status(403).send("Not permitted");
  }
});
// app.post("/urls/:id", (req, res) => {
//   // Error when user is not logged in
//   if (!req.session.user_id) {
//     res.status(401).send("Unauthorized");
//     return;
//   }
//   const id = req.params.id;
//   const longURL = req.body.longURL;
//   if (!urlDatabase[id] || urlDatabase[id].userID !== req.session.user_id) {
//     res.status(403).send("Forbidden");
//     return;
//   }
//   urlDatabase[id].longURL = longURL;
//   res.redirect("/urls");
// });

// Login user

app.post("/login", (req, res) => {
  // Extract the email and password from the request body
  const { email, password } = req.body;
  // Check if the user exists in the user database
  const user = findEmail(email, users);
  // Check if the provided password matches the password associated with the email
  if (user && bcrypt.compareSync(password, user.password)) {
    // Set the user_id cookie and redirect to the urls page
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    // Otherwise, send a 401 Unauthorized response
    res.status(401).send("User or password are not correct");
  }
});

app.post("/logout", (req, res) => {
  // Clear the user_id cookie and redirect to the login page
  req.session = null;
  res.redirect("/login");
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
    email,
    password: hashedPassword,
  };

  if (email && password) {
    // Set the user_id cookie and redirect to the urls page
    req.session.user_id = newUserID;
    res.redirect("/urls");
  } else {
    // If email and/or password are missing, send a 400 Bad Request response
    res.status(400).send("Please enter email and password");
  }
  console.log(users);
  res.redirect("/urls");
});

// This route handles processing the login form submission
app.post("/login", (req, res) => {
  // Extract the email and password from the form submission
  const { email, password } = req.body;

  // Find the user based on their email
  const user = findEmail(email, users);
  // If the user is found and the password matches, set the user_id session cookie and redirect to main page
  if (bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    // If the email or password is incorrect, return a 401 error
    res.status(401).send("User or password are not correct");
  }
});

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(` listening on port ${PORT}!`);
});
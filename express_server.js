const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt');
app.set("view engine", "ejs");
/*const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};*/
const urlDatabase = {
  tsn: { longURL: "https://www.tsn.ca", userID: "amanda" },
  goo: { longURL: "https://www.google.ca", userID: "amanda" },
  exm: { longURL: "https://www.example.com", userID: "clinton" }
};

const users = { //global object called users which will be used to store and access the users in the app
  "amanda": {
    id: "amanda",
    email: "user@example.com",
    //password: "purple-monkey-dinosaur",
    hashPassword : bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "clinton": {
    id: "clinton",
    email: "user2@example.com",
    hashPassword : bcrypt.hashSync("dishwasher-funk", 10)
  }
};


const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};


const urlsForUser = (userID) => { // helper function
  const urls = {};
  for (const shortURL in urlDatabase) {
    if (userID === urlDatabase[shortURL].userID) {
      urls[shortURL] = urlDatabase[shortURL];
    }
  }
  return urls;
};


app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.cookies.user_id),
    user: users[req.cookies.user_id]
  };
  res.render('urls_index', templateVars);
});


app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]]};
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => { // route to shortURL
  if (urlDatabase[req.params.shortURL].userID !== req.cookies.user_id) {
    res.send("You are not authorized");
    return;
  }
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});


app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get('/register', (req, res) => { // GET /register endpoint, which returns the template register
  const templateVars = { user: users[req.cookies["user_id"]]};
  res.render('register', templateVars);
});


app.get('/login', (req, res) => { // GET /login endpoint, which returns the template login
  const templateVars = { user: users[req.cookies["user_id"]]};
  res.render('login', templateVars);
});


app.post('/urls/:shortURL/delete', (req, res) => {// Add a POST route that removes a URL resource: POST /urls/:shortURL/delete
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  console.log(req.body);
  
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies['user_id']
  };
  res.redirect(`/urls/${shortURL}`);
});
  
//console.log(req.body);  // Log the POST request body to the console
//res.send("Ok");         // Respond with 'Ok' (we will replace this)
 
        

app.post('/urls/:shortURL', (req, res) => { // Add a POST route that updates a URL resource;
  const shortURL = req.params.shortURL;
  const longURl = req.body.longURL;
  if (longURl.match(/^(https:\/\/|http:\/\/)/)) {
    urlDatabase[shortURL] = longURl;
  } else {
    urlDatabase[shortURL] = `http://www.${longURl}`;
  }
  res.redirect(`/urls/${shortURL}`);
});


app.post('/login', (req, res) => {// Add a POST route to handle /login
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("<h1>400 Bad Request</h1><p>Please fill up all fields.</p>");
  } else {
    const user = Object.keys(users).find(user => users[user].email === email)
    const hashss = bcrypt.compareSync(password, users[user].hashPassword); // compare password with hash password value
    if (hashss) {
      res.cookie("user_id", user);
      res.redirect('/urls');
    } else {
    res.status(403).send("<h1>Email or Password is not correct</h>");
  }
} 
});


app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/login');
});


app.post('/register', (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  
  if (email === "" || password === '') {
    return res.status(400).send("<h1>400 Bad Request</h1><p>Please fill up all fields.</p>");
  }
  for (const key in users) {
    if (users[key].email === email) {
      return res.status(400).send("<h1>400 Bad Request</h1><p>User is already registered. Please, make sure you are registering a new user.</p>");
    }
  }
  users[id] = {
    id,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  res.cookie("user_id", id);
  return res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




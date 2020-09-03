const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]]
};
  res.render('urls_index', templateVars);
});
app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]]};
  res.render("urls_new", templateVars);

});
app.get("/urls/:shortURL", (req, res) => { // route to shortURL
  console.log('anything');
  console.log(req.params);
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]] };
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

app.post('/urls/:shortURL/delete', (req, res) => {// Add a POST route that removes a URL resource: POST /urls/:shortURL/delete
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  console.log(req.body);
  // app.post('/urls/:shortURL', (req, res) => {
    // const shortURL = req.params.shortURL;
    // const longURl = req.body.longURL;
    // if (longURl.match(/^(https:\/\/|http:\/\/)/)) {
      // urlDatabase[shortURL] = longURl;
    // } else {
      // urlDatabase[shortURL] = longURL;
    // }
    urlDatabase[shortURL] = req.body.longURL;
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
  //const { email, password } = req.body;
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === '') {    
      return res.status(400).send("<h1>400 Bad Request</h1><p>Please fill up all fields.</p>");
      } else {
    for (const key in users) {
      if (users[key].email === email) {//&& users[key].password === password) {
        res.cookie("user_id", key);
        return res.redirect('/urls');
      } else {
        return res.status(400).send("<h1> email not registered</h>")
      }
    }
  }
  //return res.status(400).send("<h1>400 Bad Request </h1><p>User is already registered. Please, make sure you are registering a new user.</p>");
});

app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  users[id] = { id, email, password };
  if (email === "" || password === '') {    
    return res.status(400).send("<h1>400 Bad Request</h1><p>Please fill up all fields.</p>");
    } 
  for (const key in users) {
    if (users[key].email === email) {
      return res.status(400).send("<h1>400 Bad Request </h1><p>User is already registered. Please, make sure you are registering a new user.</p>");
    }
     
    } res.cookie("user_id", key);
    return res.redirect('/urls');
})

  //res.cookie("user_id", id);
  //res.redirect('/urls');
  //console.log('users',users)


function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
};

const users = { //global object called users which will be used to store and access the users in the app
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
}

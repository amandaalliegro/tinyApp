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
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]
};
  res.render('urls_index', templateVars);
});
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);

});
app.get("/urls/:shortURL", (req, res) => {
  console.log('anything');
  console.log(req.params);
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
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
  if (req.body.username !== "") {
    res.cookie("username", req.body.username);
  }
  res.redirect('/urls');
});
app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls');
});

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}
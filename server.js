const express = require("express");
const bp = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts')
var cookieParser = require("cookie-parser");
// routes
const users = require("./routes/api/users");
const jobs = require("./routes/api/jobs");
const applications = require("./routes/api/applications");

const app = express();
app.use(cookieParser());


app.use(expressLayouts)
app.set('layout', './layout/main')
app.set('view engine', 'ejs')

app.use(
    bp.urlencoded({
      extended: false
    })
  );
  app.use(bp.json());

// DB config
const uri = require("./config/keys").mongoURI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => {
  console.log(`MongoDB Connected…`)
})
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.render('login')
})

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

const port = process.env.PORT || 5000;

app.listen(port, () => `Server up at ${port}`);

app.get("/login", (req, res) =>{
  res.render('login');
})

app.get("/register", (req, res) =>{
  res.render('register');
})

app.get('/home', (req, res) => {
  res.render('home');
})

app.get('/logout', (req, res) => {
  res.cookie('jwt', {maxAge: 0});
  res.redirect('/login');
});
// User Routes
app.use("/api/users", users);
app.use("/api/jobs", jobs);
app.use("/api/apply", applications);



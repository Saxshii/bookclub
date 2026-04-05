const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();

require('./config/db');
require('./config/passport')(passport);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'bookclub_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;       // logged in user
  res.locals.success_msg = req.flash('success');   // success flash
  res.locals.error_msg = req.flash('error');       // error flash
  res.locals.error = req.flash('passport_error');  // passport error
  next();
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/books', require('./routes/books'));
app.use('/profile', require('./routes/profile'));
app.use('/communities', require('./routes/community'));

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BookClub running on http://localhost:${PORT}`);
});
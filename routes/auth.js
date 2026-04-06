const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Bookshelf = require('../models/bookshelf');
const { isGuest } = require('../middleware/isAuth');

router.get('/login', isGuest, (req, res) => {
  res.render('pages/login', { title: 'Login — BookClub' });
});

router.post('/login', isGuest, (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true  
  })(req, res, next);
}, (req, res) => {

  const redirectTo = req.session.returnTo || '/';
  delete req.session.returnTo;
  req.flash('success', `Welcome back, ${req.user.name}! 📚`);
  res.redirect(redirectTo);
});

router.get('/signup', isGuest, (req, res) => {
  res.render('pages/signup', { title: 'Join BookClub' });
});

router.post('/signup', isGuest, async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!name || !email || !password || !confirmPassword) {
    errors.push('All fields are required.');
  }
  if (password !== confirmPassword) {
    errors.push('Passwords do not match.');
  }
  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  if (errors.length > 0) {
    return res.render('pages/signup', {
      title: 'Join BookClub',
      errors,
      formData: { name, email } 
    });
  }

  try {
   
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render('pages/signup', {
        title: 'Join BookClub',
        errors: ['An account with that email already exists.'],
        formData: { name, email }
      });
    }

    const newUser = await User.create({ name, email, password });

    await Bookshelf.create({ user: newUser._id, books: [] });

    req.login(newUser, (err) => {
      if (err) {
        req.flash('error', 'Account created! Please log in.');
        return res.redirect('/auth/login');
      }
      req.flash('success', `Welcome to BookClub, ${newUser.name}! Start exploring. 🎉`);
      res.redirect('/');
    });

  } catch (err) {
  console.error('Signup error FULL:', err); // already there
  res.render('pages/signup', {
    title: 'Join BookClub',
    errors: [err.message], // ← change this line, show real error
    formData: { name, email }
  });
}
});


router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'You have been logged out. See you soon! 👋');
    res.redirect('/auth/login');
  });
});

module.exports = router;
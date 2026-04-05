const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Bookshelf = require('../models/bookshelf');
const { isAuth } = require('../middleware/isAuth');

router.get('/', isAuth, async (req, res) => {
  try {
    const bookshelf = await Bookshelf.findOne({ user: req.user._id });

    const stats = {
      total:     bookshelf ? bookshelf.books.length : 0,
      finished:  bookshelf ? bookshelf.books.filter(b => b.readingStatus === 'finished').length : 0,
      reading:   bookshelf ? bookshelf.books.filter(b => b.readingStatus === 'currently-reading').length : 0,
      wantToRead:bookshelf ? bookshelf.books.filter(b => b.readingStatus === 'want-to-read').length : 0
    };

    const recentBooks = bookshelf
      ? bookshelf.books.slice(-4).reverse()
      : [];

    res.render('pages/profile', {
      title: `${req.user.name}'s Profile — BookClub`,
      user: req.user,
      stats,
      recentBooks
    });

  } catch (err) {
    console.error('Profile error:', err);
    req.flash('error', 'Could not load profile.');
    res.redirect('/');
  }
});

router.post('/update', isAuth, async (req, res) => {
  const { name, bio, favoriteGenres } = req.body;

  try {
    await User.findByIdAndUpdate(req.user._id, {
      name: name || req.user.name,
      bio: bio || '',
   
      favoriteGenres: Array.isArray(favoriteGenres)
        ? favoriteGenres
        : favoriteGenres ? [favoriteGenres] : []
    });

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');

  } catch (err) {
    console.error('Profile update error:', err);
    req.flash('error', 'Failed to update profile.');
    res.redirect('/profile');
  }
});

module.exports = router;
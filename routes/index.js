
const express = require('express');
const router  = express.Router();
const User      = require('../models/user');
const Community = require('../models/Community');
const isAdmin   = require('../middleware/isAdmin');

// ── Cover datasets ────────────────────────────────────────────────────────────
const coverMap = {
  'fantasy':     require('../seeds/covers/fantasy'),
  'romance':     require('../seeds/covers/romance'),
  'thriller':    require('../seeds/covers/thriller'),
  'mystery':     require('../seeds/covers/mystery'),
  'horror':      require('../seeds/covers/horror'),
  'historical':  require('../seeds/covers/historical'),
  'non-fiction': require('../seeds/covers/non-fiction'),
  'sci-fi':      require('../seeds/covers/sci-fi'),
};

const genres = [
  { name: 'Fantasy',     slug: 'fantasy',     
    cardImage: '/images/genre-covers/fantasy.jpg',   
    bgImage:   '/images/genres/fantasy.jpg'  }, // for genre page},
  { name: 'Romance',     slug: 'romance',     
    cardImage: '/images/genre-covers/romance.jpg',   
    bgImage:   '/images/genres/romance.jpg'  },
  { name: 'Thriller',    slug: 'thriller',    
    cardImage: '/images/genre-covers/thriller.jpg',  
    bgImage:   '/images/genres/thriller.jpg' }, 
  { name: 'Mystery',     slug: 'mystery',     
    cardImage: '/images/genre-covers/mystery.jpg',   
    bgImage:   '/images/genres/mystery.jpg'  }, 
  { name: 'Sci-Fi',      slug: 'sci-fi',      
    cardImage: '/images/genre-covers/sci-fi.jpg',   
    bgImage:   '/images/genres/sci-fi.jpg'   }, 
  { name: 'Horror',      slug: 'horror',      
    cardImage: '/images/genre-covers/horror.jpg',    
    bgImage:   '/images/genres/horror.jpg'   }, 
  { name: 'Historical',  slug: 'historical',  
    cardImage: '/images/genre-covers/historical.jpg', 
    bgImage:   '/images/genres/historical.jpg' }, 
  { name: 'Non-Fiction', slug: 'non-fiction', 
    cardImage: '/images/genre-covers/non-fiction.jpg',
    bgImage:   '/images/genres/non-fiction.jpg' }, 
];

const featuredCommunities = [
  { name: 'Dragon Readers',     genre: 'Fantasy',  members: 1240, description: 'For those who live and breathe fantasy worlds.' },
  { name: 'Midnight Thrillers', genre: 'Thriller', members: 890,  description: "We read thrillers so you don't have to sleep." },
  { name: 'Hopeless Romantics', genre: 'Romance',  members: 2100, description: 'Love stories, book recs, and lots of feelings.' },
  { name: 'The Mystery Circle', genre: 'Mystery',  members: 670,  description: 'Solving fictional crimes since 2020.' },
];

const carouselBooks = [
  { title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas',       coverUrl: '/images/book-covers/acotar.jpg' },
  { title: 'Fourth Wing',                 author: 'Rebecca Yarros',       coverUrl: '/images/book-covers/fourth-wing.jpg' },
  { title: 'The Wicked King',             author: 'Holly Black',          coverUrl: '/images/book-covers/wicked-king.jpg' },
  { title: 'Verity',                      author: 'Colleen Hoover',       coverUrl: '/images/book-covers/verity.jpg' },
  { title: 'Haunting Adeline',            author: 'H.D. Carlton',         coverUrl: '/images/book-covers/haunting-adeline.jpg' },
  { title: 'Shatter Me',                  author: 'Tahereh Mafi',         coverUrl: '/images/book-covers/shatter-me.jpg' },
  { title: 'Caraval',                     author: 'Stephanie Garber',     coverUrl: '/images/book-covers/caraval.jpg' },
  { title: 'Never Lie',                   author: 'Freida McFadden',      coverUrl: '/images/book-covers/never-lie.jpg' },
  { title: 'Better Than the Movies',      author: 'Lynn Painter',         coverUrl: '/images/book-covers/better-movies.jpg' },
  { title: 'The Inheritance Games',       author: 'Jennifer Lynn Barnes', coverUrl: '/images/book-covers/inheritance-games.jpg' },
];

// ─── GET / ───────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  res.render('pages/index', { title: 'BookClub — Your Virtual Library', genres, featuredCommunities, carouselBooks });
});

// ─── GET /explore ─────────────────────────────────────────────────────────────
router.get('/explore', (req, res) => {
  res.render('pages/explore', { title: 'Explore Genres — BookClub', genres });
});

// ─── GET /developer ───────────────────────────────────────────────────────────
router.get('/developer', (req, res) => {
  res.render('pages/developer', { title: 'Meet the Developer — BookClub' });
});

// ─── GET /admin ───────────────────────────────────────────────────────────────
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const totalUsers       = await User.countDocuments();
    const totalCommunities = await Community.countDocuments();
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const recentUsers  = await User.find().sort({ createdAt: -1 }).limit(6).select('name email avatar createdAt');
    const communities  = await Community.find().sort({ members: -1 }).limit(8).select('name genre members description isFlagged');
    res.render('pages/admin', { title: 'Admin Dashboard — BookClub', totalUsers, totalCommunities, newUsersThisWeek, recentUsers, communities });
  } catch (err) {
    console.error('Admin error:', err.message);
    req.flash('error', 'Could not load admin dashboard.');
    res.redirect('/');
  }
});

// ─── GET /genre/:genreName ────────────────────────────────────────────────────
router.get('/genre/:genreName', (req, res) => {
  const slug  = req.params.genreName.toLowerCase();
  const genre = genres.find(g => g.slug === slug);

  if (!genre) {
    req.flash('error', 'Genre not found.');
    return res.redirect('/explore');
  }

  const allBooks   = coverMap[slug] || [];
  const page       = Math.max(1, parseInt(req.query.page) || 1);
  const perPage    = 18;
  const totalPages = Math.ceil(allBooks.length / perPage);
  const books      = allBooks.slice((page - 1) * perPage, page * perPage);

  res.render('pages/genre', {
    title: `${genre.name} — BookClub`,
    genre,
    books,
    currentPage: page,
    totalPages,
  });
});

module.exports = router;
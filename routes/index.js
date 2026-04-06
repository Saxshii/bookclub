const express = require('express');
const router = express.Router();
const axios = require('axios');

const genres = [
  {slug: 'fantasy',
    bgImage: '/images/genre-covers/fantasy.jpg',
  },{
    slug: 'romance',
    bgImage: '/images/genre-covers/romance.jpg',
  },{
    slug: 'thriller',
    bgImage: '/images/genre-covers/thriller.jpg',
  },{
    slug: 'sci-fi',
    bgImage: '/images/genre-covers/sci-fi.jpg',
  },{
    slug: 'horror',
    bgImage: '/images/genre-covers/horror.jpg',
  },{
    slug: 'mystery',
    bgImage: '/images/genre-covers/mystery.jpg',
  },{
    slug: 'non-fiction',
    bgImage: '/images/genre-covers/non-fiction.jpg',
  },{
    slug: 'historical',
    bgImage: '/images/genre-covers/historical.jpg',
  }
];

const featuredCommunities = [
  { name: 'Dragon Readers',     genre: 'Fantasy',  members: 1240, description: 'For those who live and breathe fantasy worlds.'},
  { name: 'Midnight Thrillers', genre: 'Thriller', members: 890,  description: 'We read thrillers so you don\'t have to sleep.'},  
  { name: 'Hopeless Romantics', genre: 'Romance',  members: 2100, description: 'Love stories, book recs, and lots of feelings.'},  
  { name: 'The Mystery Circle', genre: 'Mystery',  members: 670,  description: 'Solving fictional crimes since 2020.' }
];

// ─── Static carousel books — local covers ────────────────────────────────────
const carouselBooks = [
  { title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas',          coverUrl: '/images/book-covers/acotar.jpg' },
  { title: 'Fourth Wing',                 author: 'Rebecca Yarros',          coverUrl: '/images/book-covers/fourth-wing.jpg' },
  { title: 'The Wicked King',            author: 'Holly Black',             coverUrl: '/images/book-covers/wicked-king.jpg' },
  { title: 'Verity',                      author: 'Colleen Hoover',          coverUrl: '/images/book-covers/verity.jpg' },
  { title: 'Haunting Adeline',            author: 'H.D. Carlton',            coverUrl: '/images/book-covers/haunting-adeline.jpg' },
  { title: 'Shatter Me',                  author: 'Tahereh Mafi',            coverUrl: '/images/book-covers/shatter-me.jpg' },
  { title: 'Caraval',                     author: 'Stephanie Garber',        coverUrl: '/images/book-covers/caraval.jpg' },
  { title: 'Never Lie',                   author: 'Freida McFadden',         coverUrl: '/images/book-covers/never-lie.jpg' },
  { title: 'Better Than the Movies',      author: 'Lynn Painter',            coverUrl: '/images/book-covers/better-movies.jpg' },
  { title: 'The Inheritance Games',       author: 'Jennifer Lynn Barnes',    coverUrl: '/images/book-covers/inheritance-games.jpg' },
];

// ─── GET / ────────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'BookClub — Your Virtual Library',
    genres,
    featuredCommunities,
    carouselBooks
  });
});

// ─── GET /explore ─────────────────────────────────────────────────────────────
router.get('/explore', (req, res) => {
  res.render('pages/explore', {
    title: 'Explore Genres — BookClub',
    genres
  });
});

// ─── GET /genre/:genreName ────────────────────────────────────────────────────
router.get('/genre/:genreName', async (req, res) => {
  const slug = req.params.genreName.toLowerCase();
  const genre = genres.find(g => g.slug === slug);

  if (!genre) {
    req.flash('error', 'Genre not found.');
    return res.redirect('/explore');
  }

  try {
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: genre.searchQuery,
        limit: 18,
        fields: 'key,title,author_name,cover_i,first_publish_year'
      }
    });

    const books = response.data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      coverId: book.cover_i || null,
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : '/images/fallback-cover.jpg',
      year: book.first_publish_year || '',
      openLibraryId: book.key
    }));

    res.render('pages/genre', {
      title: `${genre.name} Books — BookClub`,
      genre,
      books
    });

  } catch (err) {
    console.error('Open Library error:', err.message);
    res.render('pages/genre', {
      title: `${genre.name} Books — BookClub`,
      genre,
      books: [],
      apiError: true
    });
  }
});

module.exports = router;
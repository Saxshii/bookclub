const express = require('express');
const router = express.Router();

const genres = [
  {
    name: 'Fantasy',
    slug: 'fantasy',
    description: 'Magic, mythical creatures, and epic adventures in imagined worlds.',
    bgImage: '/images/genres/fantasy.jpg',
    theme: { primary: '#6d28d9', secondary: '#4c1d95', accent: '#a78bfa' },
    searchQuery: 'fantasy magic dragons',
    emoji: '🐉'
  },
  {
    name: 'Romance',
    slug: 'romance',
    description: 'Love stories that make your heart race and your soul soar.',
    bgImage: '/images/genres/romance.jpg',
    theme: { primary: '#be185d', secondary: '#831843', accent: '#f9a8d4' },
    searchQuery: 'romance love story',
    emoji: '💕'
  },
  {
    name: 'Thriller',
    slug: 'thriller',
    description: 'Edge-of-your-seat suspense that keeps you reading past midnight.',
    bgImage: '/images/genres/thriller.jpg',
    theme: { primary: '#991b1b', secondary: '#450a0a', accent: '#fca5a5' },
    searchQuery: 'thriller suspense crime',
    emoji: '🔪'
  },
  {
    name: 'Mystery',
    slug: 'mystery',
    description: 'Puzzles, clues, and secrets waiting to be unravelled.',
    bgImage: '/images/genres/mystery.jpg',
    theme: { primary: '#1e3a5f', secondary: '#0f1f35', accent: '#93c5fd' },
    searchQuery: 'mystery detective investigation',
    emoji: '🔍'
  },
  {
    name: 'Sci-Fi',
    slug: 'sci-fi',
    description: 'Explore the future, space, technology, and the unknown.',
    bgImage: '/images/genres/sci-fi.jpg',
    theme: { primary: '#0e7490', secondary: '#083344', accent: '#67e8f9' },
    searchQuery: 'science fiction space future',
    emoji: '🚀'
  },
  {
    name: 'Horror',
    slug: 'horror',
    description: 'Fear, dread, and the darkest corners of the imagination.',
    bgImage: '/images/genres/horror.jpg',
    theme: { primary: '#1a1a1a', secondary: '#0a0a0a', accent: '#dc2626' },
    searchQuery: 'horror scary supernatural',
    emoji: '👻'
  },
  {
    name: 'Historical',
    slug: 'historical',
    description: 'Step back in time through vivid stories of the past.',
    bgImage: '/images/genres/historical.jpg',
    theme: { primary: '#92400e', secondary: '#451a03', accent: '#fcd34d' },
    searchQuery: 'historical fiction history',
    emoji: '🏛️'
  },
  {
    name: 'Non-Fiction',
    slug: 'non-fiction',
    description: 'True stories, knowledge, and ideas that change your perspective.',
    bgImage: '/images/genres/non-fiction.jpg',
    theme: { primary: '#065f46', secondary: '#022c22', accent: '#6ee7b7' },
    searchQuery: 'non fiction biography self help',
    emoji: '📖'
  }
];

const featuredCommunities = [
  { name: 'Dragon Readers', genre: 'Fantasy', members: 1240, description: 'For those who live and breathe fantasy worlds.', emoji: '🐉' },
  { name: 'Midnight Thrillers', genre: 'Thriller', members: 890, description: 'We read thrillers so you don\'t have to sleep.', emoji: '🌙' },
  { name: 'Hopeless Romantics', genre: 'Romance', members: 2100, description: 'Love stories, book recs, and lots of feelings.', emoji: '💕' },
  { name: 'The Mystery Circle', genre: 'Mystery', members: 670, description: 'Solving fictional crimes since 2020.', emoji: '🔍' }
];

router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'BookClub — Your Virtual Library',
    genres,
    featuredCommunities,
  
    carouselBooks: [
      { title: 'The Name of the Wind', author: 'Patrick Rothfuss', coverId: '8478870' },
      { title: 'Dune', author: 'Frank Herbert', coverId: '10581973' },
      { title: 'Educated', author: 'Tara Westover', coverId: '8739161' },
      { title: 'The Alchemist', author: 'Paulo Coelho', coverId: '8479576' },
      { title: 'Atomic Habits', author: 'James Clear', coverId: '10286192' },
      { title: 'Gone Girl', author: 'Gillian Flynn', coverId: '8239044' },
      { title: 'It Ends with Us', author: 'Colleen Hoover', coverId: '12980249' },
      { title: '1984', author: 'George Orwell', coverId: '8575708' },
      { title: 'The Midnight Library', author: 'Matt Haig', coverId: '10527843' },
      { title: 'Sapiens', author: 'Yuval Noah Harari', coverId: '8739160' }
    ]
  });
});

router.get('/explore', (req, res) => {
  res.render('pages/explore', {
    title: 'Explore Genres — BookClub',
    genres
  });
});

router.get('/genre/:genreName', async (req, res) => {
  const slug = req.params.genreName.toLowerCase();
  const genre = genres.find(g => g.slug === slug);

  if (!genre) {
    req.flash('error', 'Genre not found.');
    return res.redirect('/explore');
  }

  try {
   
    const axios = require('axios');
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: genre.searchQuery,
        limit: 18,
        fields: 'key,title,author_name,cover_i,first_publish_year,subject'
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
    console.error('Open Library fetch error:', err.message);
   
    res.render('pages/genre', {
      title: `${genre.name} Books — BookClub`,
      genre,
      books: [],
      apiError: true
    });
  }
});

module.exports = router;
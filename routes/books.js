const express = require('express');
const router = express.Router();
const axios = require('axios');
const Bookshelf = require('../models/bookshelf');
const { isAuth } = require('../middleware/isAuth');

router.get('/search', async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim().length < 2) {
    return res.json({ books: [] });
  }

  try {
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: query.trim(),
        limit: 20,
        fields: 'key,title,author_name,cover_i,first_publish_year,subject'
      }
    });

    const books = response.data.docs.map(book => ({
      id: book.key,                        // e.g. "/works/OL45804W"
      openLibraryId: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      coverId: book.cover_i || null,
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : '/images/fallback-cover.jpg',
      year: book.first_publish_year || ''
    }));

    res.json({ books });

  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search failed. Try again.' });
  }
});

router.get('/bookshelf', isAuth, async (req, res) => {
  try {
    let bookshelf = await Bookshelf.findOne({ user: req.user._id });

    if (!bookshelf) {
      bookshelf = await Bookshelf.create({ user: req.user._id, books: [] });
    }

    const grouped = {
      'currently-reading': bookshelf.books.filter(b => b.readingStatus === 'currently-reading'),
      'want-to-read':      bookshelf.books.filter(b => b.readingStatus === 'want-to-read'),
      'finished':          bookshelf.books.filter(b => b.readingStatus === 'finished')
    };

    res.render('pages/bookshelf', {
      title: 'My Bookshelf — BookClub',
      bookshelf,
      grouped,
      totalBooks: bookshelf.books.length
    });

  } catch (err) {
    console.error('Bookshelf error:', err);
    req.flash('error', 'Could not load your bookshelf.');
    res.redirect('/');
  }
});

router.post('/add', isAuth, async (req, res) => {
  const { openLibraryId, title, author, coverId, coverUrl, genre, publishYear } = req.body;

  try {
    let bookshelf = await Bookshelf.findOne({ user: req.user._id });
    if (!bookshelf) {
      bookshelf = await Bookshelf.create({ user: req.user._id, books: [] });
    }

    const alreadyAdded = bookshelf.books.some(b => b.openLibraryId === openLibraryId);
    if (alreadyAdded) {
      return res.json({ success: false, message: 'Book already in your shelf!' });
    }

    bookshelf.books.push({
      openLibraryId,
      title,
      author,
      coverId: coverId || null,
      coverUrl: coverUrl || '',
      genre: genre || 'General',
      publishYear: publishYear || ''
    });

    await bookshelf.save();
    res.json({ success: true, message: `"${title}" added to your shelf! 📚` });

  } catch (err) {
    console.error('Add book error:', err);
    res.status(500).json({ success: false, message: 'Failed to add book.' });
  }
});

router.post('/remove/:bookId', isAuth, async (req, res) => {
  try {
    const bookshelf = await Bookshelf.findOne({ user: req.user._id });
    if (!bookshelf) return res.json({ success: false, message: 'Bookshelf not found.' });

    bookshelf.books = bookshelf.books.filter(
      b => b._id.toString() !== req.params.bookId
    );
    await bookshelf.save();

    req.flash('success', 'Book removed from your shelf.');
    res.redirect('/books/bookshelf');

  } catch (err) {
    console.error('Remove book error:', err);
    req.flash('error', 'Failed to remove book.');
    res.redirect('/books/bookshelf');
  }
});

router.post('/update/:bookId', isAuth, async (req, res) => {
  const { notes, review, rating, quotes, readingStatus } = req.body;

  try {
    const bookshelf = await Bookshelf.findOne({ user: req.user._id });
    if (!bookshelf) return res.json({ success: false, message: 'Bookshelf not found.' });

    const book = bookshelf.books.id(req.params.bookId);
    if (!book) return res.json({ success: false, message: 'Book not found.' });

    
    if (notes      !== undefined) book.notes         = notes;
    if (review     !== undefined) book.review        = review;
    if (rating     !== undefined) book.rating        = rating ? Number(rating) : null;
    if (readingStatus !== undefined) book.readingStatus = readingStatus;
    if (quotes     !== undefined) {
      
      book.quotes = quotes.split('\n').map(q => q.trim()).filter(q => q.length > 0);
    }

    await bookshelf.save();
    res.json({ success: true, message: 'Book updated!' });

  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({ success: false, message: 'Failed to update book.' });
  }
});

module.exports = router;
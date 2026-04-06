const mongoose = require('mongoose');

const SavedBookSchema = new mongoose.Schema({
  openLibraryId: { type: String, required: true },
  title:         { type: String, required: true },
  author:        { type: String, default: 'Unknown Author' },
  coverId:       { type: String, default: null },
  coverUrl:      { type: String, default: '' },
  genre:         { type: String, default: 'General' },
  publishYear:   { type: String, default: '' },
  notes:         { type: String, default: '' },
  review:        { type: String, default: '' },
  rating:        { type: Number, min: 1, max: 5, default: null },
  quotes:        { type: [String], default: [] },
  readingStatus: {
    type: String,
    enum: ['want-to-read', 'currently-reading', 'finished'],
    default: 'want-to-read'
  },
  addedAt: { type: Date, default: Date.now }
});

const BookshelfSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  books: [SavedBookSchema]
});

module.exports = mongoose.model('Bookshelf', BookshelfSchema);
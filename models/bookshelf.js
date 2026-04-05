const mongoose = require('mongoose');

const SavedBookSchema = new mongoose.Schema({
  openLibraryId: {
    type: String,
    required: true   
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Unknown Author'
  },
  coverId: {
    type: String,   
    default: null
  },
  coverUrl: {
    type: String,   
    default: ''
  },
  genre: {
    type: String,
    default: 'General'
  },
  publishYear: {
    type: String,
    default: ''
  },
  
  notes: {
    type: String,
    default: '',
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  review: {
    type: String,
    default: '',
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  quotes: {
    type: [String],  
    default: []
  },
  readingStatus: {
    type: String,
    enum: ['want-to-read', 'currently-reading', 'finished'],
    default: 'want-to-read'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const BookshelfSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true   // one bookshelf per user
  },
  books: [SavedBookSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

BookshelfSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

SavedBookSchema.methods.getCoverUrl = function () {
  if (this.coverId) {
    return `https://covers.openlibrary.org/b/id/${this.coverId}-M.jpg`;
  }
  if (this.coverUrl) return this.coverUrl;
  return '/images/fallback-cover.jpg';
};

module.exports = mongoose.model('Bookshelf', BookshelfSchema);
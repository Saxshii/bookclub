const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Community name is required'],
    trim: true,
    unique: true,
    maxlength: [80, 'Name cannot exceed 80 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  genre: {
    type: String,
    required: true,
    enum: ['Fantasy', 'Romance', 'Thriller', 'Mystery', 'Sci-Fi', 'Horror', 'Historical', 'Non-Fiction', 'General']
  },
  coverImage: {
    type: String,
    default: '' 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
 
  posts: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      maxlength: [500, 'Post cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CommunitySchema.virtual('memberCount').get(function () {
  return this.members.length;
});

CommunitySchema.methods.getCover = function () {
  if (this.coverImage) return this.coverImage;
  const genreImages = {
    'Fantasy':     '/images/communities/fantasy.png',
    'Romance':     '/images/communities/romance.png',
    'Thriller':    '/images/communities/thriller.png',
    'Mystery':     '/images/communities/mystery.png',
    'Sci-Fi':      '/images/communities/sci-fi.png',
    'Horror':      '/images/communities/horror.png',
    'Historical':  '/images/communities/historical.png',
    'Non-Fiction': '/images/communities/general.png',
    'General':     '/images/communities/general.png'
  };
  return genreImages[this.genre] || genreImages['General'];
};

module.exports = mongoose.model('Community', CommunitySchema);
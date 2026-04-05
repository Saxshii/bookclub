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
    Fantasy:     'https://source.unsplash.com/400x250/?fantasy,magic',
    Romance:     'https://source.unsplash.com/400x250/?romance,flowers',
    Thriller:    'https://source.unsplash.com/400x250/?dark,city,night',
    Mystery:     'https://source.unsplash.com/400x250/?mystery,fog',
    'Sci-Fi':    'https://source.unsplash.com/400x250/?space,galaxy',
    Horror:      'https://source.unsplash.com/400x250/?dark,horror,fog',
    Historical:  'https://source.unsplash.com/400x250/?ancient,history',
    'Non-Fiction':'https://source.unsplash.com/400x250/?library,books',
    General:     'https://source.unsplash.com/400x250/?books,reading'
  };

  return genreImages[this.genre] || genreImages['General'];
};

module.exports = mongoose.model('Community', CommunitySchema);
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  summary: {
    type: Map,
    of: String,
    required: true,
    // Keys: fr, en, es, de, it, ar
  },
  country: {
    type: String,
    required: true,
  },
  publishedYear: Number,
  coverImage: String,
  genre: String,
  isbn: String,
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

BookSchema.index({ author: 1 });
BookSchema.index({ country: 1 });
BookSchema.index({ featured: 1 });

export const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

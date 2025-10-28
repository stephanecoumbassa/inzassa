import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: {
    type: Map,
    of: String,
    required: true,
    // Keys: fr, en, es, de, it, ar
  },
  content: {
    type: Map,
    of: String,
    required: true,
  },
  summary: {
    type: Map,
    of: String,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    enum: [
      'senegal', 'mali', 'burkina-faso', 'niger', 'cote-ivoire',
      'benin', 'togo', 'guinea', 'cameroon', 'gabon',
      'congo', 'drc', 'madagascar', 'tunisia', 'morocco', 'algeria'
    ]
  },
  category: {
    type: String,
    enum: ['politique', 'economie', 'sport', 'culture', 'societe', 'international'],
    default: 'societe'
  },
  imageUrl: String,
  publishedAt: {
    type: Date,
    default: Date.now
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
NewsSchema.index({ country: 1, publishedAt: -1 });
NewsSchema.index({ category: 1, publishedAt: -1 });
NewsSchema.index({ featured: 1, publishedAt: -1 });

export const News = mongoose.models.News || mongoose.model('News', NewsSchema);

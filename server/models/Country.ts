import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: Map,
    of: String,
    required: true,
    // Keys: fr, en, es, de, it, ar
  },
  capital: String,
  population: Number,
  languages: [String],
  currency: String,
  flag: String,
  geography: {
    type: Map,
    of: String,
  },
  economy: {
    type: Map,
    of: String,
  },
  culture: {
    type: Map,
    of: String,
  },
  history: {
    type: Map,
    of: String,
  },
  images: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

CountrySchema.index({ code: 1 });
CountrySchema.index({ featured: 1 });

export const Country = mongoose.models.Country || mongoose.model('Country', CountrySchema);

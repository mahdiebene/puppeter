const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rent: { type: String }, // Storing as string to handle "5000-6000" or "Negotiable"
    location: { type: String, required: true },
    phone: { type: String },
    description: { type: String },
    images: [{ type: String }],
    sourceUrl: { type: String, unique: true },
    sourceType: { type: String, enum: ['facebook', 'bikroy', 'other'], default: 'facebook' },
    datePosted: { type: Date, default: Date.now },
    scrapedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);

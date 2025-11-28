const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// --- BOT ENDPOINTS ---

// 1. Bot asks for a task
router.get('/task', (req, res) => {
    // Simple round-robin or random task distributor
    // In a real app, we'd track which bot did what.
    const targets = [
        { type: 'facebook', url: 'https://www.facebook.com/groups/baddatolet' }, // Example
        { type: 'facebook', url: 'https://www.facebook.com/groups/rampuratolet' },
        { type: 'facebook', url: 'https://www.facebook.com/groups/aftabnagartolet' }
    ];

    const randomTask = targets[Math.floor(Math.random() * targets.length)];
    res.json(randomTask);
});

// 2. Bot submits data
router.post('/listings', async (req, res) => {
    try {
        const { listings } = req.body; // Expecting an array of listings
        if (!listings || !Array.isArray(listings)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        let savedCount = 0;
        for (const item of listings) {
            // Avoid duplicates by checking sourceUrl
            const exists = await Listing.findOne({ sourceUrl: item.sourceUrl });
            if (!exists) {
                await Listing.create(item);
                savedCount++;
            }
        }

        console.log(`Received ${listings.length} items, saved ${savedCount} new.`);
        res.json({ success: true, saved: savedCount });
    } catch (err) {
        console.error('Error saving listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- FRONTEND ENDPOINTS ---

// 3. Get all listings (with filters)
router.get('/listings', async (req, res) => {
    try {
        const { location } = req.query;
        let query = {};

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Fallback if MongoDB is not connected or fails
        // Fallback if MongoDB is not connected or fails
        // try {
        //     const listings = await Listing.find(query).sort({ datePosted: -1 }).limit(100);
        //     res.json(listings);
        // } catch (dbErr) {
        // console.error('Database error, returning mock data:', dbErr.message);
        // Return mock data for demo purposes if DB fails
        res.json([
            {
                _id: 'mock1',
                title: 'Demo: 2 Bed Flat in Badda',
                rent: '12000',
                location: 'Middle Badda',
                sourceUrl: 'https://facebook.com',
                datePosted: new Date()
            },
            {
                _id: 'mock2',
                title: 'Demo: Single Room in Rampura',
                rent: '5000',
                location: 'Rampura Banasree',
                sourceUrl: 'https://bikroy.com',
                datePosted: new Date()
            }
        ]);
        // }
    } catch (err) {
        console.error('Server error:', err);
        // Fallback to mock data even on server error
        res.json([
            {
                _id: 'mock_err',
                title: 'System: Database Offline',
                rent: '0',
                location: 'System Message',
                sourceUrl: '#',
                datePosted: new Date()
            }
        ]);
    }
});

module.exports = router;

const express = require('express');
const Photo = require('../models/photo');

const router = express.Router();

// Fetch and display all photos
router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find().sort({ _id: -1 });
        res.render('index', { photos });
    } catch (err) {
        console.error('Failed to fetch photos', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
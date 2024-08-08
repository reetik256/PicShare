const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');


router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find();
        res.render('index', { photos });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
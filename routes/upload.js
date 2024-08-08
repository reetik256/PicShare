const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const Photo = require('../models/photo');

const router = express.Router();

const storage = multer.memoryStorage(); // Store the image in memory for processing
const upload = multer({ storage });

// Render the upload form
router.get('/', (req, res) => {
    res.render('upload', {
        title: '',
        description: '',
        errors: []
    });
});

router.post(
    '/',
    upload.single('photo'),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('upload', {
                errors: errors.array(),
                title: req.body.title || '',
                description: req.body.description || '',
            });
        }

        // Resize the image using sharp
        const filename = Date.now() + path.extname(req.file.originalname);
        const filepath = path.join(__dirname, '../public/images/', filename);

        try {
            await sharp(req.file.buffer)
                .resize(350, 350, {
                    fit: sharp.fit.inside,
                    withoutEnlargement: true
                })
                .toFile(filepath);

            const newPhoto = new Photo({
                title: req.body.title,
                description: req.body.description,
                imageUrl: `/images/${filename}`,
            });

            await newPhoto.save();
            res.redirect('/');
        } catch (err) {
            console.error('Failed to process image', err);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;
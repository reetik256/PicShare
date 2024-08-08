const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');
const Photo = require('../models/Photo');


const storage = multer.diskStorage({
    destination: './public/images/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


router.get('/', (req, res) => {
    res.render('upload', { errors: null, oldTitle: '', oldDescription: '' });
});


router.post('/', [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('description').not().isEmpty().withMessage('Description is required'),
    check('photo').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Photo is required');
        }
        return true;
    })
], upload.single('photo'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('upload', { errors: errors.array(), oldTitle: req.body.title, oldDescription: req.body.description });
    }

    const { title, description } = req.body;
    const photo = req.file.filename;

    try {
        const newPhoto = new Photo({ title, description, photo });
        await newPhoto.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
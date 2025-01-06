const express = require('express');
const Document = require('../models/Document');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Get all documents for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const documents = await Document.find({ owner: req.user.id });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single document by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new document
router.post('/', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    try {
        const newDocument = await Document.create({
            title,
            content,
            owner: req.user.id,
        });
        res.status(201).json(newDocument); // Added status code for creation
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a document
router.put('/:id', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    try {
        let document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        document.title = title;
        document.content = content;
        const updatedDocument = await document.save();
        res.json(updatedDocument);
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a document
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await document.remove();
        res.json({ message: 'Document deleted' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

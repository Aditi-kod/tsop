import express from 'express';
import Meeting from '../models/Meeting.js';

const router = express.Router();

// Get meetings for a specific team
router.get('/team/:teamId', async (req, res) => {
    const meetings = await Meeting.find({ team: req.params.teamId }).sort({ createdAt: -1 });
    res.json(meetings);
});

router.post('/', async (req, res) => {
    try {
        const meeting = await Meeting.create(req.body);
        res.status(201).json(meeting);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;
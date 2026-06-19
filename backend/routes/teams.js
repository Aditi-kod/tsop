import express from 'express';
import Team from '../models/Team.js';
import Meeting from '../models/Meeting.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const teams = await Team.find().sort({ createdAt: 1 });
    res.json(teams);
});

router.post('/', async (req, res) => {
    try {
        const team = await Team.create(req.body);
        res.status(201).json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    await Team.findByIdAndDelete(req.params.id);
    await Meeting.deleteMany({ team: req.params.id });
    res.json({ success: true });
});

export default router;
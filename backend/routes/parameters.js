import express from 'express';
import Parameter from '../models/Parameter.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const params = await Parameter.find().sort({ createdAt: 1 });
    res.json(params);
});

router.post('/', async (req, res) => {
    try {
        const param = await Parameter.create(req.body);
        res.status(201).json(param);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const param = await Parameter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(param);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    await Parameter.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;
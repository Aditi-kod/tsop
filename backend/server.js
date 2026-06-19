import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import teamsRouter from './routes/teams.js';
import parametersRouter from './routes/parameters.js';
import meetingsRouter from './routes/meetings.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/teams', teamsRouter);
app.use('/api/parameters', parametersRouter);
app.use('/api/meetings', meetingsRouter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));
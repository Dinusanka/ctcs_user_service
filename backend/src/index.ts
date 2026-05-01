import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(process.env.MONGO_URL || '', {
    bufferCommands: false,  
})
    .then(() => console.log('MongoDB connected successfully to user_db'))
    .catch((err) => {
        console.error('MongoDB connection error details:');
        console.error(err);
    });

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: User Service is running
 */
app.get('/health', (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
        service: 'User Service',
        status: 'Running',
        mongodb: mongoStatus
    });
});

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});

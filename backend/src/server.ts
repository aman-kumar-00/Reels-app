import express, {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db';
import reelRoutes from './Routes/reelRoutes';
import cloudinaryRoutes from './Routes/cloudinaryRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/reels', reelRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ReelsApp backend is running',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
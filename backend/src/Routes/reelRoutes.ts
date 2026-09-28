import {Router, Request, Response} from 'express';
import Reel from '../Model/Reel';

const router = Router();

// GET all reels
router.get(
  '/',
  async (req: Request, res: Response) => {
    try {
      const reels = await Reel.find()
        .sort({createdAt: -1})
        .lean();

      res.status(200).json({
        success: true,
        count: reels.length,
        data: reels,
      });
    } catch (error) {
      console.error(
        'Error fetching reels:',
        error,
      );

      res.status(500).json({
        success: false,
        message: 'Failed to fetch reels',
      });
    }
  },
);

// CREATE a reel
router.post(
  '/',
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        videoUrl,
        publicId,
        description,
      } = req.body;

      if (!title || !videoUrl || !publicId) {
        res.status(400).json({
          success: false,
          message:
            'title, videoUrl and publicId are required',
        });

        return;
      }

      const reel = await Reel.create({
        title,
        videoUrl,
        publicId,
        description: description || '',
      });

      res.status(201).json({
        success: true,
        message: 'Reel created successfully',
        data: reel,
      });
    } catch (error) {
      console.error(
        'Error creating reel:',
        error,
      );

      res.status(500).json({
        success: false,
        message: 'Failed to create reel',
      });
    }
  },
);

export default router;
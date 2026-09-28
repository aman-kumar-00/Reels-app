import {Router, Request, Response} from 'express';
import cloudinary from '../config/cloudinary';

const router = Router();

router.get('/signature', (req: Request, res: Response) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
      },
      process.env.CLOUDINARY_API_SECRET as string,
    );

    res.status(200).json({
      success: true,
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error('Cloudinary signature error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to generate Cloudinary signature',
    });
  }
});

export default router;
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
      return;
    }

    // 2. Check Bearer format
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        success: false,
        message: 'Invalid authorization format',
      });
      return;
    }

    const token = parts[1];

    // 3. Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // 4. Store user ID for the next route
    req.userId = decoded.userId;

    // 5. Continue to the route
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export default authMiddleware;
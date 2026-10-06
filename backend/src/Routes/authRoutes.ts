import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

import User from '../Model/User';
import authMiddleware from '../Middleware/authMiddleware';

const router = Router();

// REGISTER
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
      return;
    }

    // 2. Check password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    // 3. Check whether email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
      return;
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Generate ReelsApp ID
    const reelsAppId = Math.floor(10000000000 + Math.random() * 90000000000);

    // 6. Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      reelsAppId,
    });

    // 7. Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        reelsAppId: user.reelsAppId,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to register user',
    });
  }
});

// LOGIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    // 2. Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // 3. Compare entered password with stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // 4. Create JWT
    const tokenOptions: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET as string,
      tokenOptions,
    );

    // 5. Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          reelsAppId: user.reelsAppId,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to login',
    });
  }
});

// GET CURRENT USER
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        reelsAppId: user.reelsAppId,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to get user',
    });
  }
});

export default router;

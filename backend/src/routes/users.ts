import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
router.get('/profile', authMiddleware as any, async (req: AuthRequest, res: Response) => {
    console.log('GET /users/profile - Request received for user ID:', req.user?.id);
    try {
        const user = await User.findById(req.user?.id).select('-password');
        if (!user) {
            console.log('GET /users/profile - User not found');
            return res.status(404).json({ msg: 'User not found' });
        }
        console.log('GET /users/profile - User found, sending response');
        res.json(user);
    } catch (err: any) {
        console.error('GET /users/profile - Error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
router.put('/update', authMiddleware as any, async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    try {
        const userFields: any = {};
        if (email) userFields.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            userFields.password = await bcrypt.hash(password, salt);
        }

        const existingUser = await User.findById(req.user?.id);
        if (!existingUser) return res.status(404).json({ msg: 'User not found' });

        const updatedUser = await User.findByIdAndUpdate(
            req.user?.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @swagger
 * /users/{id}/verify:
 *   get:
 *     summary: Verify if a user is an admin
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Returns isAdmin status
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
router.get('/:id/verify', async (req: Request, res: Response) => {
    try {
        console.log(`GET /users/${req.params.id}/verify - Request received to verify admin status`);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found', isAdmin: false });
        }
        const isAdmin = user.role === 'admin';
        res.json({ isAdmin });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/me/admin', authMiddleware as any, async (req: AuthRequest, res: Response) => {
    try {
        console.log('GET /users/me/admin - Checking admin status for user:', req.user?.id);
        
        // Check if user exists in token
        if (!req.user) {
            return res.status(401).json({ msg: 'Unauthorized', isAdmin: false });
        }

        // Extract role from decoded JWT (req.user is populated by authMiddleware)
        const role = req.user.role;
        const isAdmin = role === 'admin';

        console.log(`GET /users/me/admin - User role: ${role}, isAdmin: ${isAdmin}`);
        
        res.json({ 
            isAdmin,
            role 
        });
    } catch (err: any) {
        console.error('GET /users/me/admin - Error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;

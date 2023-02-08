import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequests, BadRequestError } from '@dvticketing/common';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email mush be vaild'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
], validateRequests, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if(!existingUser){
        throw new BadRequestError('Invaild credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password,password)

    if(!passwordsMatch){
        throw new BadRequestError('Invaild credentials');
    }

    // Generate Jwt
    const userJwt = jwt.sign({
        id: existingUser._id,
        email: existingUser.email
    },process.env.JWT_KEY!)

    // Store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);
})

export { router as signinRouter };
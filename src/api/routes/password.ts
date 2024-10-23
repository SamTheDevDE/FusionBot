import { Router, Request, Response } from 'express';

const router = Router();

// Define the correct password
const correctPassword = '123password';

router.get('/id:password', (req: Request, res: Response) => {
    const { password } = req.params;

    // Check if the password is exactly ":correctPassword"
    if (password === `:${correctPassword}`) {
        res.send('Correct');
    } else {
        res.send('Wrong');
    }
});

export default router;

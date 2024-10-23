import { Router, Request, Response } from 'express';
import { query } from '#lib/structures/Database';

const router = Router();

// Route: localhost:4334/db:query
router.get('/', async (req: Request, res: Response) => {
    try {
        // Wait for the query to complete
        const results = await query("SELECT * FROM test");

        // Send the results as a JSON response
        res.json(results);
    } catch (error) {
        // Handle any errors during the query
        console.error("Error executing query:", error);
        res.status(500).send('Database query failed');
    }
});

export default router;

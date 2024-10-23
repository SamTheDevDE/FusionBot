import express from 'express';
import { Logger } from '#lib/structures';
import { LogLevel } from '#lib/enums';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function startAPI() {
    const logger = new Logger();
    const api = express();
    const port = process.env.API_PORT || 4334;

    logger.info('Starting API...');
    logger.setLevel(LogLevel.Debug);

    // Dynamically load all routes from the ./routes folder
    const routesPath = join(__dirname, 'routes');
    const files = readdirSync(routesPath).filter(file => file.endsWith('.ts'));

    for (const file of files) {
        const route = await import(join(routesPath, file));
        const routeName = file.replace('.ts', '');
        api.use(`/${routeName}`, route.default);
        logger.debug(`Loaded route: /${routeName}`);
    }

    // Fix: Include both req and res parameters
    api.get('/', (req, res) => {
        res.send('API Version: V1.8.0');
    });

    api.listen(port, () => {
        logger.info('API is running on port ' + port);
    });
}

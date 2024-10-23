import { createConnection } from 'mysql';
import { Logger } from '#lib/structures';
import { LogLevel } from '#lib/enums';

const logger = new Logger();
logger.setLevel(LogLevel.Debug);

if (process.env.MYSQL_DATABASE === undefined || process.env.MYSQL_HOST === undefined || process.env.MYSQL_PASSWORD === undefined || process.env.MYSQL_PORT === undefined || process.env.MYSQL_USER === undefined) {logger.error('Please Check your .env file if you set all MySQL Credentials right');};

export function connectMySQL() {
    const mysqlConf = {
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),  // Convert port to a number
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    };

    const con = createConnection(mysqlConf);

    logger.info("Connecting to MySQL Database Server...");

    con.connect(err => {
        if (err) {
            logger.error(`Error connecting to MySQL: ${err.message}`);
            return retryConnection(con);  // Optionally try to reconnect if the initial connection fails
        }
        logger.info('MySQL has been connected successfully!');
    });
}

// Optional: Simple reconnection logic
function retryConnection(connection, retries = 5, delay = 3000) {
    if (retries === 0) {
        logger.error("Unable to connect to MySQL after multiple attempts.");
        process.exit(1);  // Exit the process if retries fail
    }
    
    setTimeout(() => {
        logger.info(`Retrying MySQL connection... (${retries} attempts left)`);
        connection.connect(err => {
            if (err) {
                logger.error(`MySQL connection failed: ${err.message}`);
                return retryConnection(connection, retries - 1);
            }
            logger.info('MySQL reconnected successfully!');
        });
    }, delay);
}

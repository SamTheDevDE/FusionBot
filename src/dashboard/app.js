export default function startDashboard() {
	const express = require('express');
	const app = express();
	let port = require('./config.json').port || 3000;
	const { Logger } = require("#lib/structures")
	const logger = new Logger();
	logger.info(`Starting dashboard...`);
	app.set('port', port);
	const session = require('express-session');
	app.set('view engine', 'ejs');
	app.use(express.static('static'));
	app.use(session({
	    secret: '48738924783748273742398747238',
	    resave: false,
	    saveUninitialized: false,
	    expires: 604800000,
	}));
	require('./router')(app);
	app.listen(port, () => logger.info(`Dashboard listening on port ${port}`));
}



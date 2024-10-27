import { Listener, query } from '#lib/structures';

export default new Listener({
	event: 'messageCreate',
	async run(message) {
		// Ignore bot and webhook messages
		if (message.author.bot || message.webhookId) return;

		// Fetch the custom prefix from the database
		let dbPrefix;
		try {
			const result = await query('SELECT prefix FROM guilds WHERE guild_id = ?', [message.guild?.id]);
			dbPrefix = result[0]?.prefix || 'f.'; // Default prefix fallback if none is set
		} catch (error) {
			message.client.logger.error('Error fetching prefix from database:', error);
			return;
		}

		// Check if message starts with the custom or default prefix
		const prefix = dbPrefix;
		if (!message.content.startsWith(prefix)) return;

		// Extract command and arguments from the message
		const [commandWithPrefix, ...args] = message.content.split(/\s+/);
		const commandName = commandWithPrefix.slice(prefix.length);

		// Find command by name or alias
		const command =
			message.client.commands.get(commandName) ||
			message.client.commands.find((cmd) => cmd.aliases?.includes(commandName));

		// Command checks
		if (!command || !command.messageRun) return;
		if (command.ownerOnly && !message.client.ownerIds.includes(message.author.id)) return;
		if (command.runInDM === false && !message.guild) return;

		// Run the command
		try {
			await command.messageRun(message, args);
		} catch (error) {
			message.client.logger.error((error as Error).stack ?? (error as Error).message);
			await message.reply('An error occurred while executing the command.');
		}
	},
});

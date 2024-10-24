import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { query } from '#lib/structures/Database';
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
	type: CommandType.ChatInput,
	description: 'Changes the news message on the help menu',
	ownerOnly: true,
	guildIds: [process.env.TEST_SERVER_ID], // ! Replace it with your test server id
	options: [
		{
			name: 'message',
			description: 'The message that should be on the help menu',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],
	async commandRun(interaction) {
		const newMessage = interaction.options.getString('message', true);

		// Fetch the current message from the database
		const previousMessage = await query('SELECT message FROM news_message WHERE id = 1');
		//console.log(previousMessage)
		let resultMessage;

		if (previousMessage.length > 0) {
			// Update the news message in the database
			await query('UPDATE news_message SET message = ? WHERE id = 1', [newMessage]);
			resultMessage = `News message updated from: "${previousMessage[0].message}" to: "${newMessage}"`;
		} else {
			// If no previous message, insert it for the first time
			await query('INSERT INTO news_message (id, message) VALUES (1, ?)', [newMessage]);
			resultMessage = `News message set to: "${newMessage}"`;
		}

		// Reply with the result message
		await interaction.reply({ content: resultMessage, ephemeral: true });
	},

	async messageRun(message) {
		return message.channel.send('This command is only available via slash commands.');
	},
});

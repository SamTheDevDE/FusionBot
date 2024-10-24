import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { query } from '#lib/structures/Database'
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
	type: CommandType.ChatInput,
	description: 'manipulates the db',
    ownerOnly: true,
	guildIds: [process.env.TEST_SERVER_ID], // ! Replace it with your test server id
	options: [
		{
			name: 'sql',
			description: 'The SQL Query to evaluate',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],
	async commandRun(interaction) {
		const sqlQuery = interaction.options.getString('sql', true);
		const results = await query(sqlQuery);
        await interaction.reply({content: JSON.stringify(results), ephemeral: true});
	},
	async messageRun(message) {
		return message.channel.send('no');
	},
});

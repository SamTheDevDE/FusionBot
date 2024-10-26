import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType, Client, Guild, Snowflake } from 'discord.js';

export default new Command({
	type: CommandType.ChatInput,
	description: 'Emits a client event for testing purposes',
	ownerOnly: true,
	guildIds: [process.env.TEST_SERVER_ID], // Replace it with your test server ID
	options: [
		{
			name: 'event',
			description: 'The name of the event (CASE SENSITIVE)',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],
	async commandRun(interaction) {
		const eventName = interaction.options.getString('event', true);
		const client = interaction.client;

		// Create a mock guild for testing
		const mockGuild = createMockGuild(client, '123456789012345678', 'Mock Guild');

		// Emit the event with client and the mock guild
		client.emit(eventName, client, mockGuild);

		await interaction.reply({ content: `Event ${eventName} emitted!`, ephemeral: true });
	},

	async messageRun(message) {
		return message.channel.send('This command is only available via slash commands.');
	},
});

function createMockGuild(client: Client, id: Snowflake, name: string): Guild {
	return new Guild(client, {
		id,
		name,
	});
}

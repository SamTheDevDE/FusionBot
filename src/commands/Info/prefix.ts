import { CommandType } from '#lib/enums';
import { Command, query } from '#lib/structures';
import { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField, PermissionFlagsBits } from 'discord.js';

export default new Command({
	type: CommandType.ChatInput,
	description: 'Shows or updates the bot prefix for message commands',
	ownerOnly: false,
	options: [
		{
			name: 'new_prefix',
			description: 'The new prefix to replace the old one (Admin Only)',
			required: false,
			type: ApplicationCommandOptionType.String,
		},
	],
	async messageRun(message) {
		message.reply("Hey! You already know the prefix!");
	},
	async commandRun(interaction) {
		const newPrefix = interaction.options.getString('new_prefix');
		const guild = interaction.guild;
		const guildId = guild?.id;
        const oldPrefix = await query('SELECT prefix FROM guilds WHERE guild_id = ?', [guildId]);
		// Check for Manage Guild permission and handle missing or unauthorized cases
		if (!guild) return interaction.reply({ content: 'Guild information is missing.', ephemeral: true });
		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) && newPrefix) {
			return interaction.reply({
				content: 'You are not permitted to change the prefix. Manage Guild permission is required.',
				ephemeral: true,
			});
		}
        console.log(oldPrefix)
		// Update prefix if a new one is provided
		if (newPrefix) {
			try {
				await query(`UPDATE guilds SET prefix = ? WHERE guild_id = ?`, [newPrefix, guildId]);
				interaction.reply({ content: `Prefix updated to \`${newPrefix}\`!`, ephemeral: true });
			} catch (err) {
				interaction.reply({ content: 'An error occurred while updating the prefix.', ephemeral: true });
			}
		} else {
			interaction.reply({ content: `Current prefix is \`${oldPrefix[0].prefix}\`!`, ephemeral: true });
		}
	},
});

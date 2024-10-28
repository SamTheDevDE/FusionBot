import { CommandType } from '#lib/enums';
import { Command, query } from '#lib/structures';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Deletes a specific warning by its ID.',
    ownerOnly: false,
    options: [
        {
            name: 'warn_id',
            description: 'The ID of the warning you want to delete.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
    ],
    async commandRun(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
			return interaction.reply({
				content: 'You are not permitted to warn a user. ManageRoles permission is required.',
				ephemeral: true,
			});
		}
        const warnId = interaction.options.getInteger('warn_id');

        try {
            // Check if the warning exists
            const results = await query(
                'SELECT * FROM warnings WHERE warn_id = ? AND guild_id = ?',
                [warnId, interaction.guild.id]
            );

            if (results.length === 0) {
                return interaction.reply({ content: `Warning with ID ${warnId} does not exist.`, ephemeral: true });
            }

            // Delete the warning
            await query('DELETE FROM warnings WHERE warn_id = ?', [warnId]);

            // Confirmation embed
            const deleteEmbed = new EmbedBuilder()
                .setTitle('Warning Deleted')
                .setColor('#1f2226')
                .addFields(
                    { name: 'Warn ID', value: `${warnId}`, inline: true },
                    { name: 'Deleted By', value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp();

            // Send confirmation
            await interaction.reply({ embeds: [deleteEmbed] });
        } catch (error) {
            console.error("An error occurred while deleting the warning:", error);
            await interaction.reply({ content: 'An error occurred while deleting the warning.', ephemeral: true });
        }
    },

    async messageRun(message) {
        // Optional: implement message command version if needed
    },
});

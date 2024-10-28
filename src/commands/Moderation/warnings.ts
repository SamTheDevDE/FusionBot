import { CommandType } from '#lib/enums';
import { Command, query } from '#lib/structures';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Checks and displays the warnings of you or a mentioned member.',
    ownerOnly: false,
    options: [
        {
            name: 'member',
            description: 'The member whose warnings you want to check.',
            required: false,
            type: ApplicationCommandOptionType.User,
        },
    ],
    async commandRun(interaction) {
        let member = interaction.options.getUser('member');
        const guildId = interaction.guild.id;

        if (member?.bot) {
            return interaction.reply({ content: 'Bots don’t get warned.', ephemeral: true });
        }
        if (!member) {
            member = interaction.user;
        }

        try {
            // Retrieve warnings from the database
            const results = await query(
                'SELECT warn_id, moderator_id, reason FROM warnings WHERE guild_id = ? AND user_id = ?',
                [guildId, member.id]
            );

            if (results.length === 0) {
                return interaction.reply({ content: `${member.tag} has no warnings.`, ephemeral: false });
            }

            // Create the embed to display warnings
            const warnEmbed = new EmbedBuilder()
                .setTitle(`${member.tag}'s Warnings`)
                .setColor('#1f2226')
                .setTimestamp();

            // Loop through results to add fields to the embed
            results.forEach((warn) => {
                warnEmbed.addFields(
                    { name: 'Warn ID', value: `${warn.warn_id}`, inline: true },
                    { name: 'Moderator ID', value: `${warn.moderator_id}`, inline: true },
                    { name: 'Reason', value: warn.reason, inline: false }
                );
            });

            // Send the embed with warnings
            await interaction.reply({ embeds: [warnEmbed], ephemeral: false });
        } catch (error) {
            console.error("An error occurred while fetching warnings:", error);
            await interaction.reply({ content: 'An error occurred while fetching warnings.', ephemeral: false });
        }
    },

    async messageRun(message) {
        // Optional: implement message command version if needed
    },
});

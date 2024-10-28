import { CommandType } from '#lib/enums';
import { Command, query } from '#lib/structures';
import { red } from 'colorette';
import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Warns a member',
    ownerOnly: false,
    options: [
        {
            name: 'member',
            description: 'The member you want to warn.',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'reason',
            description: 'The reason for the warning.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'dm',
            description: 'Whether to DM the user.',
            required: false,
            type: ApplicationCommandOptionType.Boolean,
        }
    ],
    async commandRun(interaction) {
		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
			return interaction.reply({
				content: 'You are not permitted to warn a user. ManageRoles permission is required.',
				ephemeral: true,
			});
		}


        const member = interaction.options.getUser('member');
        const reason = interaction.options.getString('reason');

        if (member?.bot) {
            return interaction.reply({ content: 'You cannot warn a bot.', ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const moderator = interaction.user;

        try {
            // Insert the warning into the database and retrieve the warn_id
            const result = await query(
                'INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)',
                [guildId, member.id, interaction.user.id, reason]
            );

            const warnId = result.insertId; // Assuming `insertId` provides the `warn_id`

            // Create the embed to show warning details in the channel
            const warnEmbed = new EmbedBuilder()
                .setTitle('Member Warned')
                .setColor('#1f2226')
                .addFields(
                    { name: 'Guild', value: `${interaction.guild.name} (${guildId})`, inline: true },
                    { name: 'Warned User', value: `${member.tag} (${member.id})`, inline: true },
                    { name: 'Moderator', value: `${moderator.tag} (${moderator.id})`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setFooter({ text: `Warn ID: ${warnId}` })
                .setTimestamp();

            // Send the embed in the interaction channel
            const message = await interaction.reply({ embeds: [warnEmbed] });
            setTimeout(() => message.delete().catch(console.error), 120000); // Delete after 2 minutes

            if (interaction.options.getBoolean('dm') == true) {

                // Create the embed for the warned user's DM
                const dmEmbed = new EmbedBuilder()
                .setTitle('You Have Been Warned')
                .setColor('#1f2226')
                .addFields(
                    { name: 'Server', value: `${interaction.guild.name} (${guildId})`, inline: true },
                    { name: 'Moderator', value: `${moderator.tag}`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setFooter({ text: `Warn ID: ${warnId}` })
                .setTimestamp();

                // Attempt to DM the warned user
                await member.send({ embeds: [dmEmbed] }).catch(() => {
                    interaction.followUp({ content: `Failed to DM ${member.tag}.`, ephemeral: true });
                });
            } 

        } catch (err) {
            console.error("An error occurred during the warn command:\n" + err);
            interaction.reply({ content: 'An error occurred while issuing the warning.', ephemeral: true });
        }
    },

    async messageRun(message) {
        // Optional: implement message command version if needed
    },
});

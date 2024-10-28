import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Unmutes a member in the server.',
    ownerOnly: false,
    options: [
        {
            name: 'member',
            description: 'The member you want to unmute.',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],
    async commandRun(interaction) {
        const member = interaction.options.getMember('member');

        if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: 'You do not have permission to unmute members.', ephemeral: true });
        }
        if (!member?.isCommunicationDisabled()) {
            return interaction.reply({ content: 'This member is not muted.', ephemeral: true });
        }

        await member.timeout(null); // Removes timeout/mute

        const embed = new EmbedBuilder()
            .setTitle('Member Unmuted')
            .setColor('#1f2226')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Unmuted by', value: `${interaction.user.tag}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
});

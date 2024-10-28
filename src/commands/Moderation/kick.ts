import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Kicks a member from the server.',
    ownerOnly: false,
    options: [
        {
            name: 'member',
            description: 'The member you want to kick.',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'reason',
            description: 'The reason for kicking this member.',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    async commandRun(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.memberPermissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
        }
        if (!member || !member.kickable) {
            return interaction.reply({ content: 'I cannot kick this member.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Member Kicked')
            .setColor('#1f2226')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Kicked by', value: `${interaction.user.tag}`, inline: true },
                { name: 'Reason', value: reason }
            )
            .setTimestamp();

        await member.send(`You have been kicked from **${interaction.guild.name}** for: ${reason}`).catch(() => null);
        await member.kick(reason);

        await interaction.reply({ embeds: [embed] });
    },

    async messageRun(message) {
        // Optional: Implement a message-based version of the kick command
    },
});

import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Bans a member from the server.',
    ownerOnly: false,
    options: [
        {
            name: 'member',
            description: 'The member you want to ban.',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'reason',
            description: 'The reason for banning this member.',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    async commandRun(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        }
        if (!member || !member.bannable) {
            return interaction.reply({ content: 'I cannot ban this member.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Member Banned')
            .setColor('#1f2226')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Banned by', value: `${interaction.user.tag}`, inline: true },
                { name: 'Reason', value: reason }
            )
            .setTimestamp();

        await member.send(`You have been banned from **${interaction.guild.name}** for: ${reason}`).catch(() => null);
        await member.ban({ reason });

        await interaction.reply({ embeds: [embed] });
    },

    async messageRun(message) {
        // Optional: Implement a message-based version of the ban command
    },
});

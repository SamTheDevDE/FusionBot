import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Mutes a member in the server.',
    ownerOnly: false,
    options: [
        {
            name: 'member',
            description: 'The member you want to mute.',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'duration',
            description: 'Duration for the mute (in minutes).',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
        {
            name: 'reason',
            description: 'The reason for muting the member.',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    async commandRun(interaction) {
        const member = interaction.options.getMember('member');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: 'You do not have permission to mute members.', ephemeral: true });
        }
        if (!member?.moderatable) {
            return interaction.reply({ content: 'I cannot mute this member.', ephemeral: true });
        }

        await member.timeout(duration * 60 * 1000, reason); // Mutes the member for the specified duration

        const embed = new EmbedBuilder()
            .setTitle('Member Muted')
            .setColor('#1f2226')
            .addFields(
                { name: 'Member', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Muted by', value: `${interaction.user.tag}`, inline: true },
                { name: 'Duration', value: `${duration} minutes`, inline: true },
                { name: 'Reason', value: reason }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
});

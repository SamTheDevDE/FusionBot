import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Sets a slowmode interval on the current channel.',
    ownerOnly: false,
    options: [
        {
            name: 'duration',
            description: 'Slowmode duration in seconds.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
    ],
    async commandRun(interaction) {
        const duration = interaction.options.getInteger('duration');

        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: 'You lack permission to manage channels.', ephemeral: true });
        }
        await interaction.channel?.setRateLimitPerUser(duration, `Slowmode set by ${interaction.user.tag}`);

        await interaction.reply({ content: `Set slowmode to ${duration} seconds.` });
    },
});

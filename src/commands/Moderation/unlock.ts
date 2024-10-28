import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { PermissionFlagsBits } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Unlocks the current channel for everyone.',
    ownerOnly: false,
    async commandRun(interaction) {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: 'You lack permission to manage channels.', ephemeral: true });
        }

        await interaction.channel?.permissionOverwrites.edit(interaction.guild?.roles.everyone, {
            SendMessages: null,
        });

        await interaction.reply({ content: 'Channel has been unlocked.' });
    },
});

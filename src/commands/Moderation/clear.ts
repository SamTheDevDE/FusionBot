import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Clears a specified number of messages from the channel.',
    ownerOnly: false,
    options: [
        {
            name: 'amount',
            description: 'Number of messages to delete.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
    ],
    async commandRun(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: 'You do not have permission to manage messages.', ephemeral: true });
        }
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Please enter a number between 1 and 100.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true });
    },
});

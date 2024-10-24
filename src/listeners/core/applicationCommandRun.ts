import { Listener } from '#lib/structures';
import { InteractionType } from 'discord.js';

export default new Listener({
	event: 'interactionCreate',
	async run(interaction) {
		const { client } = interaction;
		if (
			interaction.isChatInputCommand() ||
			interaction.isContextMenuCommand()
		) {
			const command = client.commands.get(interaction.commandName);
			if (command && command.commandRun) {
				if (command.ownerOnly && !client.ownerIds.includes(interaction.user.id)) return;
				try {
					await command.commandRun(interaction);
				} catch (error) {
					// Improved error logging
					client.logger.error(`Error in command ${interaction.commandName}: ${(error as Error).message}\nStack Trace: ${(error as Error).stack}`);
				}
			}
		}

		if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
			const command = client.commands.get(interaction.commandName);

			if (command && command.autoCompleteRun && command.commandRun) {
				if (command.ownerOnly && !client.ownerIds.includes(interaction.user.id)) return;

				if (command.name !== interaction.commandName) return;

				try {
					await command.autoCompleteRun(interaction);
				} catch (error) {
					// Improved error logging
					client.logger.error(`Error in autocomplete command ${interaction.commandName}: ${(error as Error).message}\nStack Trace: ${(error as Error).stack}`);
				}
			}
		}
	},
});

import { Listener, query, Client } from '#lib/structures';
import { EmbedBuilder } from 'discord.js';

export default new Listener({
	event: 'guildDelete',
	once: false,
	async run(guild, client) {
		client.logger.info(`Fusion left guild: ${guild.name} (ID: ${guild.id})`);
		
		async function delGuild() {
			client.logger.info(`Deleting guild: ${guild.name} (ID: ${guild.id})`);
			try {
				await query("DELETE FROM guilds WHERE guild_id = ?", [guild.id]);
				client.logger.info(`Guild deleted: ${guild.name} (ID: ${guild.id})`);

			} catch (err) {
				client.logger.error(`Error deleting guild: ${guild.name} (ID: ${guild.id}) - ${err}`);
			}
		}

		await delGuild();
	},
});

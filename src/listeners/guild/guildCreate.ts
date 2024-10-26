import { Listener, query, Client } from '#lib/structures';
import { EmbedBuilder } from 'discord.js';

export default new Listener({
	event: 'guildCreate',
	once: false,
	async run(guild, client) {
		client.logger.info(`Fusion joined guild: ${guild.name} (ID: ${guild.id})`);
		
		async function initGuild() {
			client.logger.info(`Initializing guild: ${guild.name} (ID: ${guild.id})`);
			try {
				await query("INSERT INTO guilds (guild_id, guild_owner, prefix) VALUES (?, ?, ?)", [guild.id, guild.ownerId, "f."]);
				client.logger.info(`Guild initialized: ${guild.name} (ID: ${guild.id})`);

				// Fetch the help command ID from global commands
				const commands = await client.application.commands.fetch();
				const helpCMDID = commands.find(c => c.name === 'help')?.id;

				// Construct the embed with the help command ID
				const TFIF = new EmbedBuilder()
					.setTitle('Thanks For Inviting Fusion!')
					.setAuthor({ name: client.user!.username, iconURL: client.user!.displayAvatarURL() })
					.setColor('#1f2226')
					.setImage('https://i.ibb.co/HTGy6Zk/FUSION-BOT-2-1.png')
					.setTimestamp()
					.setFooter({ text: "Made by SamTheDev" })
					.setDescription(
						`Fusion is a powerful Discord bot designed to enhance your server experience with advanced features! \n\nIf you want to check all available features and commands, use </help:${helpCMDID}>.`
					);

				// Send the embed to the system channel, if available
				await guild.systemChannel?.send({ embeds: [TFIF] });
			} catch (err) {
				client.logger.error(`Error initializing guild: ${guild.name} (ID: ${guild.id}) - ${err}`);
			}
		}

		await initGuild();
	},
});

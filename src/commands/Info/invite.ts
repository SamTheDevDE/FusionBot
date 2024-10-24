import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

const infoEmbed = new EmbedBuilder()
    .setAuthor({ name: 'Fusion', iconURL: 'https://i.ibb.co/HTGy6Zk/FUSION-BOT-2-1.png' })
    .setTitle("Add Fusion now!")
    .setDescription("Fusion Bot is a powerful Discord bot designed to enhance your server experience with advanced features! add it now to get all these features!")
    .setFooter({ text: "Made by SamTheDev"})
    .setTimestamp()
    .setColor('#1f2226')

const inviteButton = new ButtonBuilder()
    .setLabel("Add Fusion")
    .setStyle(ButtonStyle.Link)
    .setURL("https://discord.com/oauth2/authorize?client_id=1296547118445756456")

const row = new ActionRowBuilder()
    .addComponents(inviteButton)

export default new Command({
    type: CommandType.ChatInput,
    description: 'Shows the invite of the bot',
    ownerOnly: true,
    async commandRun(interaction) {
        interaction.reply({ embeds: [infoEmbed], components: [row] });
    },
    async messageRun(message) {
        await message.channel.send({ embeds: [infoEmbed], components: [row] });
    },
});

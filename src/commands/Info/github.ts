import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

const infoEmbed = new EmbedBuilder()
    .setAuthor({ name: 'Fusion' })
    .setTitle("Fusion's Github!")
    .setDescription("YES Fusion has a github where you can self host the bot its based on EvolutionX-10's adv handler im adding functions and commands to it aswell as adding an api and (maybe) a dashboard+website but thats when the database is FULLY integrated! also if you like the github repo Star it it helps me a lot and gives me motivation to keep on and not scrap that project! thx byee!")
    .setFooter({ text: "Made by SamTheDev"})
    .setTimestamp()
    .setColor('#1f2226')
    .setImage("https://i.ibb.co/HTGy6Zk/FUSION-BOT-2-1.png")

const fusionGithub = new ButtonBuilder()
    .setLabel("To Fusion's GitHub Repo")
    .setStyle(ButtonStyle.Link)
    .setURL("https://github.com/SamTheDevDE/FusionBot/")

const evolutionXGithub = new ButtonBuilder()
    .setLabel("To EvolutionX's AdvHandler GitHub Repo")
    .setStyle(ButtonStyle.Link)
    .setURL("https://github.com/EvolutionX-10/discordbot")

const row = new ActionRowBuilder()
    .addComponents(fusionGithub, evolutionXGithub)

export default new Command({
    type: CommandType.ChatInput,
    description: 'Shows the invite of the bot',
    ownerOnly: true,
    async commandRun(interaction) {
        interaction.reply({ embeds: [infoEmbed], components: [row] });
    },
    async messageRun(message) {
        await message.reply({ embeds: [infoEmbed], components: [row] });
    },
});

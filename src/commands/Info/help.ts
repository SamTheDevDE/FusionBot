import { CommandType } from '#lib/enums';
import { Command, Paginator, query } from '#lib/structures';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs';

// Helper function to recursively read files from the commands folder
function getCommandFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getCommandFiles(fullPath, arrayOfFiles);  // Recursively read subfolders
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

export default new Command({
    type: CommandType.ChatInput,
    description: 'Sends the help menu',

    async commandRun(interaction) {
        const newsMessage = await query('SELECT message FROM news_message WHERE id = 1');
        // Bot info embed
        const descriptionInfo = '# Fusion Bot: Your All-in-One Discord Companion!\n\n' +
        'Fusion Bot is a powerful Discord bot designed to enhance your server experience with advanced features:\n' +
        '- **Advanced Moderation**: Manage your server effortlessly with customizable commands for banning, kicking, and muting users.\n' + 
        '- **Automoderation**: Automatically filter out spam, inappropriate content, and rule violations to keep your community clean.\n' + 
        '- **Economy System**: Engage members with a fun economy where they can earn, spend, and trade virtual currency.\n' + 
        '- **Advanced Logging**: Track member activity and moderation actions with detailed logs to analyze server events.\n' +
        '- **Advanced Security**: Protect your server with anti-raid measures, IP logging, and two-factor authentication (2FA).\n' +
        '- **Neat Treats**: Enjoy customizable welcome messages, reaction roles, fun games, and music playback for an engaging community experience.';

        const botInfoEmbed = new EmbedBuilder()
            .setTitle('📜 FusionBot Info')
            .setColor('#1f2226')
            .setDescription(descriptionInfo)
            .setImage('https://i.ibb.co/HTGy6Zk/FUSION-BOT-2-1.png')
            .addFields(
                { name: 'Commands:', value: `${interaction.client.commands.size}`, inline: true },
                { name: 'Guilds:', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: 'WS-Ping:', value: `${interaction.client.ws.ping}ms`, inline: true },
                { name: 'Bot News:', value: newsMessage[0].message, inline: false }
            )
            .setFooter({ text: 'Use the commands wisely!' })
            .setTimestamp();

        // Resolve path to the commands directory
        const commandsPath = path.resolve(__dirname, '../../commands');
        //console.log(`Commands directory path: ${commandsPath}`);

        // Get all command files and categorize them
        const commandFiles = getCommandFiles(commandsPath);
        const categorizedCommands: { [key: string]: { name: string; description: string }[] } = {};

        commandFiles.forEach((file) => {
            const commandName = path.basename(file, path.extname(file));
            const commandModule = require(file).default;  // Load the command module
            const commandDescription = commandModule.description || 'No description provided';

            // Extract folder name for categorization
            const folderName = path.basename(path.dirname(file));
            if (!categorizedCommands[folderName]) {
                categorizedCommands[folderName] = [];
            }
            categorizedCommands[folderName].push({
                name: `\`${commandName}\``,
                description: commandDescription,
            });
        });

        // Prepare fields for categorized commands
        const fields: { name: string; value: string; inline: boolean }[] = [];
        const categoryNames = Object.keys(categorizedCommands);
        for (const folder of categoryNames) {
            fields.push({ name: `**${folder}**`, value: categorizedCommands[folder].map(c => `${c.name}: ${c.description}`).join('\n'), inline: false });
        };
        const selectMenuCategoryOptions = [];
        let i = 1;  // Initialize the counter outside the loop
        selectMenuCategoryOptions.push({
            label: 'Home',
            value: '0',
            description: 'Home of Help Menu',
        });
        for (const selectMenuCategoryOption of categoryNames) {
            selectMenuCategoryOptions.push({
                label: selectMenuCategoryOption,
                value: String(i++),  // Convert the counter to a string for the value
                description: `View commands in ${selectMenuCategoryOption}`,
            });
        }



        // Create the pagination
        const pagination = new Paginator({
            embeds: [
                botInfoEmbed,
                ...fields.map(field => {
                    return new EmbedBuilder()
                        .setTitle('📜 Command Categories')
                        .setColor('#1f2226')
                        .setImage('https://i.ibb.co/HTGy6Zk/FUSION-BOT-2-1.png')
                        .addFields(field)
                        .setFooter({ text: 'Use the commands wisely!' })
                        .setTimestamp();
                }),
            ],
            ephemeral: false,
            time: 60_000,
            includeSelectMenu: true,
            wrongInteractionResponse: 'Invalid selection. Please try again.',
        }).setSelectMenuOptions(selectMenuCategoryOptions);

        return pagination.run(interaction);
    },

    async messageRun(message) {
        const padletButton = new ButtonBuilder()
            .setLabel("to Fusion's Padlet")
            .setStyle(ButtonStyle.Link)
            .setURL("https://padlet.com/SamTheDevReal/fusionbot")
        const row = new ActionRowBuilder()
            .addComponents(padletButton);

        return message.channel.send({ content: 'Help only works as /command right now check the padlet out to see when it is getting added!\ndo you mean this? => </help:1298680825054892073>', components: [row] });
    },
});

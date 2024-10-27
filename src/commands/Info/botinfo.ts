import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { EmbedBuilder } from 'discord.js';
import os from 'os';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Shows info of the bot',
    ownerOnly: true,
    async commandRun(interaction) {
        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Fusion', iconURL: 'https://i.ibb.co/HTGy6Zk/FUSION-BOT-2-1.png' })
            .setTitle("Fusion Info's")
            .setDescription("Fusion Bot is a powerful Discord bot designed to enhance your server experience with advanced features")
            .setColor('#1f2226')
            .setFooter({ text: "Made by SamTheDev"})
            .setTimestamp();
        // Gather the necessary data
        const clientPing = interaction.client.ws.ping; // Client WebSocket ping
        const dbPing = await getDatabasePing(); // Function to get database ping, implement as needed
        const ramUsage = process.memoryUsage(); // RAM usage in bytes
        const totalMemory = os.totalmem(); // Total RAM
        const usedMemory = ramUsage.heapUsed / 1024 / 1024; // Convert to MB
        const totalMemoryMB = totalMemory / 1024 / 1024; // Convert to MB

        // Add fields to the embed
        infoEmbed.addFields(
            { name: 'Client Ping', value: `${clientPing} ms`, inline: false },
            { name: 'Database Ping', value: `${dbPing} ms`, inline: false },
            { name: 'WebSocket Ping', value: `${clientPing} ms`, inline: false },
            { name: 'RAM Usage', value: `${Math.round(usedMemory)} MB / ${Math.round(totalMemoryMB)} MB`, inline: false },
        );

        await interaction.reply({ embeds: [infoEmbed] });
    },
    async messageRun(message) {

        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Fusion', iconURL: 'https://i.ibb.co/HTGy6Zk/FUSION-BOT-2-1.png' })
            .setTitle("Fusion Info's")
            .setDescription("Fusion Bot is a powerful Discord bot designed to enhance your server experience with advanced features")
            .setColor('#1f2226')
            .setFooter({ text: "Made by SamTheDev"})
            .setTimestamp();
        // Gather the necessary data
        const clientPing = message.client.ws.ping; // Client WebSocket ping
        const dbPing = await getDatabasePing(); // Function to get database ping, implement as needed
        const ramUsage = process.memoryUsage(); // RAM usage in bytes
        const totalMemory = os.totalmem(); // Total RAM
        const usedMemory = ramUsage.heapUsed / 1024 / 1024; // Convert to MB
        const totalMemoryMB = totalMemory / 1024 / 1024; // Convert to MB

        // Add fields to the embed
        infoEmbed.addFields(
            { name: 'Client Ping', value: `${clientPing} ms`, inline: false },
            { name: 'Database Ping', value: `${dbPing} ms`, inline: false },
            { name: 'WebSocket Ping', value: `${clientPing} ms`, inline: false },
            { name: 'RAM Usage', value: `${Math.round(usedMemory)} MB / ${Math.round(totalMemoryMB)} MB`, inline: false },
        );

        await message.channel.send({ embeds: [infoEmbed] });
    },
});

// Example function to simulate getting database ping
async function getDatabasePing(): Promise<number> {
    // Simulate a database call
    return new Promise((resolve) => {
        const start = Date.now();
        // Simulate async operation (replace with actual DB query)
        setTimeout(() => {
            resolve(Date.now() - start);
        }, 50);
    });
}

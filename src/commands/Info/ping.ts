import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { EmbedBuilder } from 'discord.js';
import os from 'os';
import { formatDuration, intervalToDuration } from 'date-fns';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Provides detailed latency and system information.',
    ownerOnly: false,
    async commandRun(interaction) {
        const sent = await interaction.reply({ content: 'Calculating...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        // System Information
        const memoryUsage = process.memoryUsage();
        const uptimeDuration = intervalToDuration({ start: 0, end: process.uptime() * 1000 });
        const formattedUptime = formatDuration(uptimeDuration);

        const embed = new EmbedBuilder()
            .setTitle('📊 Bot Performance and Latency')
            .setColor('#1f2226')
            .addFields(
                { name: 'Round-Trip Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
                { name: 'Uptime', value: formattedUptime, inline: false },
                { name: 'Memory Usage', value: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB (RSS)`, inline: true },
                { name: 'Heap Used', value: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: 'Heap Total', value: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: 'Platform', value: `${os.platform()} ${os.release()}`, inline: true },
                { name: 'CPU', value: `${os.cpus()[0].model}`, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    },

    async messageRun(message) {
        const sent = await message.reply('Calculating...');
        const latency = sent.createdTimestamp - message.createdTimestamp;

        // System Information
        const memoryUsage = process.memoryUsage();
        const uptimeDuration = intervalToDuration({ start: 0, end: process.uptime() * 1000 });
        const formattedUptime = formatDuration(uptimeDuration);

        const embed = new EmbedBuilder()
            .setTitle('📊 Bot Performance and Latency')
            .setColor('#1f2226')
            .addFields(
                { name: 'Round-Trip Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(message.client.ws.ping)}ms`, inline: true },
                { name: 'Uptime', value: formattedUptime, inline: false },
                { name: 'Memory Usage', value: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB (RSS)`, inline: true },
                { name: 'Heap Used', value: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: 'Heap Total', value: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: 'Platform', value: `${os.platform()} ${os.release()}`, inline: true },
                { name: 'CPU', value: `${os.cpus()[0].model}`, inline: true }
            )
            .setTimestamp();

        await sent.edit({ content: null, embeds: [embed] });
    },
});

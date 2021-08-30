const ytdl = require('ytdl-core-discord');
var scrapeYt = require("scrape-yt");
const discord = require('discord.js')

exports.run = async (client, message, args) => {

    if(!args[0]) return message.channel.send('Vous n\'avez donner de musique a jouer !')
    let channel = message.member.voice.channel;
    if(!channel) return message.channel.send('Vous devez dabbord etre dans un salon vocal !')

    if (!channel.permissionsFor(message.client.user).has("CONNECT")) return message.channel.send('Euh je n\'ai pas la permission de rejoindre ce salon ... ')
    if (!channel.permissionsFor(message.client.user).has("SPEAK"))return message.channel.send('Euh je n\'ai pas la permission de parler dans ce salon ...')


    const server = message.client.queue.get(message.guild.id);
    let video = await scrapeYt.search(args.join(' '))
    let result = video[0]

    const song = {
        id: result.id,
        title: result.title,
        duration: result.duration,
        thumbnail: result.thumbnail,
        upload: result.uploadDate,
        views: result.viewCount,
        requester: message.author,
        channel: result.channel.name,
        channelurl: result.channel.url
      };

    var date = new Date(0);
    date.setSeconds(song.duration);
    var timeString = date.toISOString().substr(11, 8);

      if (server) {
        server.songs.push(song);
        console.log(server.songs);
        let embed = new discord.MessageEmbed()
        .setTitle('Ajouté a la file d\'attente!')
        .setColor('BLACK')
        .addField('Nom', song.title, true)
        .setThumbnail(song.thumbnail)
        .addField('vues', song.views, true)
        .addField('Demandé par', song.requester, true)
        .addField('Durée', timeString, true)
        return message.channel.send(embed)
    }

    const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        volume: 2,
        playing: true
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);


    const play = async song => {
        const queue = message.client.queue.get(message.guild.id);
        if (!song) {
            queue.voiceChannel.leave();
            message.client.queue.delete(message.guild.id);
            message.channel.send('je n\'ai plus rien a jouer , je m\'en vai!')
            return;
        }

        const dispatcher = queue.connection.play(await ytdl(`https://youtube.com/watch?v=${song.id}`, {
            filter: format => ['251'],
            highWaterMark: 1 << 25
        }), {
            type: 'opus'
        })
            .on('finish', () => {
                queue.songs.shift();
                play(queue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume / 5);
        let noiceEmbed = new discord.MessageEmbed()
        .setTitle('Commencé a joué')
        .setColor("BLACK")
        .setThumbnail(song.thumbnail)
        .addField('Nom', song.title, true)
        .addField('Demandé par', song.requester, true)
        .addField('Vues', song.views, true)
        .addField('Durée', timeString, true)
        queue.textChannel.send(noiceEmbed);
    };


    try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0]);
    } catch (error) {
        console.error(`Je n\'ai pas pu rejoindre le salon.`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`Je n\'ai pas pu rejoindre le salon: ${error}`);
    }
}

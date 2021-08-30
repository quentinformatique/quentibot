const { MessageEmbed } = require('discord.js')

exports.run = async (client, message) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Vous devez etre dans un salon !');
    const queue = message.client.queue.get(message.guild.id)
    let status;
    if(!queue) status = 'Il n\'y a rien dans la file d\'attente!'
    else status = queue.songs.map(x => '• ' + x.title + ' -Demandé par ' + `<@${x.requester.id}>`).join('\n')
    if(!queue) np = status
    else np = queue.songs[0].title
    if(queue) thumbnail = queue.songs[0].thumbnail
    else thumbnail = message.guild.iconURL()
    let embed = new MessageEmbed()
    .setTitle('File d\'attente')
    .setThumbnail(thumbnail)
    .setColor('BLACK')
    .addField('En train de jouer', np, true)
    .setDescription(status)
    message.channel.send(embed)
}


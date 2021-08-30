exports.run = async(client, message) => {
    message.channel.send({
        embed: {
            title: '**aide musique 🎶**',
            description: `
            __**Commandes**__
            
            \`play\` <nom de la musique> => Joue une musique depuis YouTube.
            \`pause\` => Met la musique en pause.
            \`resume\` => Remet la musique en marche.
            \`np\` => donne les informations de la musique en cour.
            \`skip\` => Passe a la musique suivante.
            \`stop\` => Arrete de jouer d la musique.
            \`volume\` <valeur entre 1/10> => Ajuste le volume de la musique.
            \`queue\` => Voir la liste des musique dans la file d'attente.


            `,
            color: 'ORANGE'
        }
    })
}


const { RichEmbed } = require("discord.js")

module.exports = {
    name: "info",
    description: "Pokazuje informacje o bocie!",

    run(msg) {
            const { channel } = msg

            const botAuthor = "DwlGam3ss"
            const botVersion = "v1.0"
            const botName = "Antek"
            const botDescription = "Narazie dużo nie potrafi, ale ciągle sie rozwija."
        
            const embed = new RichEmbed()
            .setTitle(botName)
            .setColor(0xff00ee)
            .setDescription(botDescription)
            .addField("Autor", botAuthor)
            .addField("Wersja", botVersion)
            .setTimestamp()
           
        channel.send(embed)
    },
}     
           

const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "lukasz",
    description: "Mówi Łukaszowi, aby oddał Rainbowa",

    run(msg) {
            const { channel } = msg

            const botAuthor = "DwlGam3ss"
            const botVersion = "v1.0"
            const botName = "Łukasz to siusiak!"
            const botDescription = "Łukasz oddaj **RAINBOWA**"
        
            const embed = new MessageEmbed()
            .setTitle(botName)
            .setColor(0xffbd08)
            .setDescription(botDescription)
           
        channel.send(embed)
    },
}     
          
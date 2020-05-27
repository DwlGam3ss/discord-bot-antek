const Discord = require("discord.js")


module.exports = {
    name: "ping",
    description: "Ping!",

    async run( msg, args, channel ) {
        const m = await msg.channel.send(`Pong!`)
        m.edit(`Pong! ${m.createdTimestamp - msg.createdTimestamp}ms`)
   }
}



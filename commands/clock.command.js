module.exports = {
    name: "zegar",
    description: "Komenda zegara",
    args: true,
    guildOnly: true,
    usage: "<action>[add]",

    async run(msg, args) {
        const { channel, guild, client } = msg 


        const time = new Date().toLocaleTimeString('de-AT', {timeZone:'Europe/Warsaw', hour: '2-digit', minute:'2-digit', hourCycle: 'h24'}).slice(0, 5)
        const channelName = `Godzina 》 ${time}`

        const createdChannel = await guild.createChannel(channelName,{ type: "voice", })

        if (createdChannel) {
            const channelId = createdChannel.id
        
            const { settings } = client
            //Zapisuje Id kanału w configu
            if (!settings.get(guild.id)){
                settings.set(guild.id, {clocks: [] })
            }
            client.settings.get(guild.id).clocks.push(channelId)
            client.saveConfig(guild.id)
            msg.reply("🕒Zegar został utworzony pomyślnie!")
    }
},
}
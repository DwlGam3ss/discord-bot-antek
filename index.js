const { Client }  = require("discord.js")

const { token } = require("./config.js")

const commandHandler = require("./handlers/command.handler.js")
const settingsHandler = require("./handlers/settings.handler.js")
const apiHandler = require("./handlers/api.handler")

const client = new Client()

//Inicjuje moduł obsługi komend
commandHandler(client)
//Inicjuje moduł obsługi ustawień
settingsHandler(client)
//Inicjuje moduł obsługi API
apiHandler(client)


client.on('ready', () => {
  console.log(`${client.user.tag} jest online!`)
  client.user.setActivity("Nowych komend!",{type: 'LISTENING'})

  //Inicjalizuje interval dla każdej gildii
  client.settings.forEach((config, guildId) => {
    const { guilds } = client
    //Sprawdza czy istnieje
    if (guilds.cache.has(guildId)) {
      const guild = guilds.cache.get(guildId)
      //Sprawdza czy jest dostępna
      if (guild.available) {
        // console.log("available")

        //Inicjalizuje interval dla każdej gildii
        const clockChannels = config.clocks
        setInterval(() => {
          const time = new Date().toLocaleTimeString('de-AT', {timeZone:'Europe/Warsaw', hour: '2-digit', minute:'2-digit', hourCycle: 'h24'})
          const channelName = ` Godzina 》 ${time}`
          
          clockChannels.forEach((channelId, index) => {
            //Sprawdza czy kanał istnieje
            if (guild.channels.cache.has(channelId)) {
               //console.log("Kanał istnieje")
               const channelToUpdate = guild.channels.cache.get(channelId)
               channelToUpdate.setName(channelName)
            } else {
              //console.log("Kanał nie istnieje")
              //Usuwanie Id z configu
              clockChannels.splice(index,1)
              client.saveConfig(guildId)
              }
            })
          }, 10 * 3000);
      
    }
  }
})
})

client.login(token)

//Obsługa błędów
client.on("debug", () => {})
client.on("warn", () => {})
client.on("error", () => {})



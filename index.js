const { Client }  = require("discord.js")
const { token, prefix } = require("./config.js")

const commandHandler = require("./handlers/command.handler.js")
const settingsHandler = require("./handlers/settings.handler.js")
const apiHandler = require("./handlers/api.handler")
const eventHandler = require("./handlers/event.handler")


const client = new Client({ partials: ["MESSAGE", "REACTION"] })

//Inicjuje moduł obsługi komend
commandHandler(client)
//Inicjuje moduł obsługi ustawień
settingsHandler(client)
//Inicjuje moduł obsługi API
apiHandler(client)
//Inicjuje moduł obsługi wydarzeń
eventHandler(client)

const rulesMessageId = "715201354548772976"

const guildRoles = {
  VERIFIED: "714937925527273524"
}


client.on('ready', () => {
  console.log(`${client.user.tag} jest online!`)
  client.user.setActivity("!Pomoc",{type: 'PLAYING'})


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
          const time = new Date().toLocaleTimeString('pl-PL', {timeZone:'Europe/Warsaw'})
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
              clockChannels.splice(index, 1)
              client.saveConfig(guildId)
              }
            })
          }, 3000);
      
    }
  }
})
})

client.on("messageReactionAdd", async (reaction, user) => {

  if (reaction.partial) await reaction.fetch()

  const { message } = reaction
  if (message.id === rulesMessageId) {
    const member = message.channel.guild.members.cache.get(user.id)

    if (reaction.emoji.name === "👍") {
      member.roles.add(guildRoles.VERIFIED)

    }
    

  }
})


client.on("messageReactionRemove", async (reaction, user) => {

  if (reaction.partial) await reaction.fetch()

  const { message } = reaction
  if (message.id === rulesMessageId) {
    const member = message.channel.guild.members.cache.get(user.id)

    if (reaction.emoji.name === "👍") {
      member.roles.remove(guildRoles.VERIFIED)

    }
    

  }
})

client.on('guildMemberAdd' , (member) => {

  const channel = member.guild.channels.cache.find(channel => channel.name === "🤗│powitania")
  if(!channel) return
  

  channel.send(`**🥳Cieszymy się, że do nas dołaczyłeś __${member.user.username}__🥳** `)
})




client.login(token)

//Obsługa błędów
client.on("debug", () => {})
client.on("warn", () => {})
client.on("error", () => {})



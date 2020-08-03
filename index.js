const { Client }  = require("discord.js")
const { token, prefix } = require("./config.js")
const ytdl = require("ytdl-core")

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

const rulesMessageId = "724785869738868768"

const guildRoles = {
  VERIFIED: "724044918410182707"
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
              console.log("Kanał istnieje", channelName, channelId)
              const channelToUpdate = guild.channels.cache.get(channelId)
              channelToUpdate.setName(channelName).then(updatedChannel => console.log(`Channel's new name is ${updatedChannel.name}`)).catch(console.error)
            } else {
              //console.log("Kanał nie istnieje")
              //Usuwanie Id z configu
              clockChannels.splice(index, 1)
              client.saveConfig(guildId)
              }
            })
          },60 * 1000);
      
    }
  }
})
})

const moment = require("moment")
const Discord  = require("discord.js")
require("moment-duration-format")




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

  const channel = member.guild.channels.cache.find(channel => channel.name === "🤗╎powitania")
  if(!channel) return
  

  channel.send(`**🥳Cieszymy się, że do nas dołaczyłeś ${member}🥳** `)
})

client.on('guildMemberRemove' , (member) => {

  const channel = member.guild.channels.cache.find(channel => channel.name === "🤗╎powitania")
  if(!channel) return
  

  channel.send(`**😪Nie cieszymy się, że nas opuściłeś ${member.user.username}**😪`)
})

var servers = {}

client.on('message', message => {

  let args = message.content.substring(prefix.length).split(" ")

  switch (args[0]) {
      case 'play':

          function play(connection, message){
              var server = servers[message.guild.id]

              server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}))

              server.queue.shift()

              server.dispatcher.on("end", function(){
                  if(server.queue[0]){
                      play(connection, message)
                  }else {
                      connection.disconnect()
                  }
              })
          }

          if(!args[1]){
              message.channel.send("link!")
              return
          }

          if(!message.member.voice.channel){
              message.channel.send("Kanał!")
              return
          }

          if(!servers[message.guild.id]) servers[message.guild.id] = {
              queue: []
          }

          var server = servers[message.guild.id]

          server.queue.push(args[1])

          if(!message.guild.voiceConnection) message.member.voice.channel.join().then (function(connection){
              play(connection, message)
          })



          break

          case 'skip':
              var server = servers[message.guild.id]
              if(server.dispatcher) server.dispatcher.end()
          break

          case 'stop':
          var server =  servers[message.guild.id]
          if(message.guild.voiceConnection){
              for(var i = server.queue.length -1; i >=0; i--){
                  server.queue.splice(i, 1)
              }
              server.dispatcher.end()
              console.log('stop')
          }
          if(message.guild.connection) message.guild.voiceConnection.disconnect()
          break
  }
})





client.login(token)

//Obsługa błędów
client.on("debug", () => {})
client.on("warn", () => {})
client.on("error", () => {})



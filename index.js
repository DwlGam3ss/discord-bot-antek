const { Client, MessageEmbed }  = require("discord.js")
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



const queue = new Map();


client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}leave`)) {
    stop(message, serverQueue);
    return;
  } else {
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Musisz dołączyć do kanału, abym mógł włączyć muzykę!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Potrzebuje uprawnień, aby dołaczyć i mówić na twoim kanale!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 1,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);




    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    const dodane = new MessageEmbed()
    .setTitle(`Dodane do kolejki`)
    .setDescription(`**${song.title}**`)
    .setColor(0xfcba03)
    serverQueue.songs.push(song);
    return message.channel.send(dodane);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Musisz być na kanale, aby przewinąć muzykę!"
    );
  if (!serverQueue)
    return message.channel.send("Nie ma żadnej piosenki którą moge przewinąć!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Musisz być na kanale, aby wyłączyć muzykę!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const aktualnie = new MessageEmbed()
.setTitle(`Aktualnie gra`)
.setDescription(`**${song.title}**`)
.setColor(0xfcba03)


  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(aktualnie);
}








client.login(token)

//Obsługa błędów
client.on("debug", () => {})
client.on("warn", () => {})
client.on("error", () => {})


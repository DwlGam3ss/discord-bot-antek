const { Collection, MessageEmbed } = require("discord.js")

const { readdirSync } = require("fs")

const { prefix } = require(__dirname + "/../config.js")

const ascii = require("ascii-table")

const table = new ascii().setHeading("Command", "Load status")

module.exports = (client) => {
//Komendy
client.commands = new Collection()

const cooldowns = new Collection()

const commandFiles = readdirSync(__dirname + "/../commands").filter(file => file.endsWith(".command.js"),
)

for (const file of commandFiles) {
    const command = require(__dirname + `/../commands/${file}`)

    if (command.name) {
        client.commands.set(command.name, command)
        table.addRow(file, "✅")
    } else {
        table.addRow(file, "❌ -> brakuje 'nazwy'!")
        continue
    }
}

//Pokazuje tabelke komend
console.log(table.toString())


client.on('message', msg => {
    const { author, guild, channel } = msg
  
    //Sprawdza czy użytkownik jest botem
    if (author.bot) return 
      
    
  
    //Ignoruje wiadomości bez prefixu
    if (!msg.content.startsWith(prefix)) return
  
    const args = msg.content.slice(prefix.length).trim().split(/ +/g)
  
    const cmdName = args.shift().toLocaleLowerCase()
    
  //Sprawdza czy komenda istnieje
  if (!client.commands.has(cmdName)) return

  const cmd = client.commands.get(cmdName)

  if (cmd.guildOnly && !guild) {
    return msg.reply("Co ty robisz?! To nie jest serwer")
  }

  //Sprawdza uprawnienia
  //Sprawdza uprawnienia bota
  if (cmd.botPermissions && cmd.botPermissions.length) {
    if (!guild.me.permissionsIn(channel).has(cmd.botPermissions)) {
      return channel.send(`Potrzebuje więcej uprawnień, aby wykonać komende. Takie uprawnienie potrzebuje: \`${cmd.botPermissions.join("`,`")}\`.`)
    }
  }
  //Sprawdza uprawnienia usera
  if (cmd.userPermissions && cmd.userPermissions.length) {
    if (!msg.member.permissionsIn(channel).has(cmd.userPermissions)) {
      return msg.reply("Nie masz wymaganych uprawnień!")
    }
  }

  if (cmd.args && !args.length) {
      let reply = `Nie podano żadnych argumentów, ${msg.author}!`

      if (cmd.usage) {
          reply += `\nPoprawne użycie: \`${prefix}${cmdName} ${cmd.usage}\``
      }


      return msg.channel.send(reply)
  }

    // Sprawdz cooldown
    if (!cooldowns.has(cmdName)) {
        cooldowns.set(cmdName, new Collection())
      }
  
      const now = Date.now()
      const timestamps = cooldowns.get(cmdName)
      const cooldownAmount = (cmd.cooldown || 3) * 1000
  
      if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount
  
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000
          return msg.reply(
            `musisz poczekać ${timeLeft.toFixed(
              1,
            )} sekund zanim użyjesz ponownie komendy \`${cmdName}\`.`,
          )
        }
      }
  
      timestamps.set(msg.author.id, now)
      setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount)
  try {
      client.commands.get(cmdName).run(msg, args)
  } catch(error) {
      console.log(error)
      const commandName = "Błąd"
      const Description = "Wystąpił błąd podczas próby wykonania tego polecenia!"
  
      const blad = new MessageEmbed()
      .setTitle(commandName)
      .setColor(0xfc0303)
      .setDescription(Description)
      .setTimestamp()
    channel.send(blad)
  }
})
}
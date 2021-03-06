const { prefix } = require("../config.js")
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "pomoc",
  description:
    "Lista wszyskich komend lub informacje o konkretnej komendzie.",
  usage: "[nazwa komendy]",
  cooldown: 5,

  run(msg, args) {
    const {
      client: { commands },
    } = msg

    const data = []


    const embed = new MessageEmbed()
    .setTitle("To jest lista wszystkich moich komend:")
    .setColor(0xfcba03)
    .setDescription(commands.map((command) => command.name).join(" | "))
    .addField("Lub", `\nMożesz napisać \`${prefix}pomoc [nazwa komendy]\` , aby uzyskać informacje na temat określonej komendy`)
    .setTimestamp()

    // =====================================
    //
    // No arguments provided
    //
    // =====================================
    if (!args.length) {
      // Create list with all commands
      data.push(embed)
      

      return msg.author
        .send(data, { split: true })
        .then(() => {
          if (msg.channel.type === "dm") return
          msg.reply("Wysłałem wszystkie moje komendy w wiadomości prywatnej!")
        })
        .catch((err) => {
          console.error(`Nie można wysłać pomoc na DM do ${msg.author.tag}.\n`, err)
          msg.reply("Oops, wygląda na to, że nie moge wysłać do Ciebie wiadomości prywatnej! Sprawdź czy przyjmujesz wiadomości od nieznajomych!")
        })
    }

    // =====================================
    //
    // Arguments provided
    //
    // =====================================
    const name = args[0].toLowerCase()
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name))

    if (!command) {
      return msg.reply("To nie jest poprawna komenda!")
    }


    data.push(`**Nazwa:** ${command.name}`)

    if (command.aliases) data.push(`**Skróty:** ${command.aliases.join(", ")}`)
    if (command.description)
      data.push(`**Opis:** ${command.description}`)
    if (command.usage)
      data.push(`**Użycie:** ${prefix}${command.name} ${command.usage}`)

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

    msg.channel.send(data, { split: true })
  },
}
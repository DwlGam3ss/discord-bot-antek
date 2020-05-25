const { RichEmbed } = require("discord.js")

module.exports = {
    name: "wyczysc",
    description: "Usuwanie wiadomości z kanału tekstowego",
    args: true,
    // !clear <liczba>
    usage: "<liczba>",
    guildOnly: true,
    cooldown: 10,

    run(msg, args) {
        const { channel } = msg 

    const amount = parseInt(args[0])

    if (!Number.isInteger(amount)) {
        return channel.send(`Podaj liczbę wiadomości jaką chcesz usunąć, ${msg.author}!`)
    }

    if (amount < 2 || amount > 100) {
        return channel.send("Ilość wiadomości do usunięcia musi być większa od 1 i mniejsza od 100")

    }


      channel.bulkDelete(amount)

      const commandName = "Wyczyść"
      const Description = `Usunięto, ${amount} wiadomości!`
  
      const wyczysc = new RichEmbed()
      .setTitle(commandName)
      .setColor(0xfcba03)
      .setDescription(Description)
      .setTimestamp()
    channel.send(wyczysc)
    }
}
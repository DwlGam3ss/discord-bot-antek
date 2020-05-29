const {Discord, MessageEmbed} = require("discord.js")

const embed = new MessageEmbed()
.setTitle("Stwórz kanał tekstowy o nazwie \`🤗│powitania\`")
.setColor(0xfcba03)




module.exports = {
    name: "powitania",
    description: "Kanał na którym bot wysyła wiadomości jeśli ktoś dołaczy do",

    async run( msg, args, channel ) {
        const m = await msg.channel.send(embed)
        setInterval(() => {

            const embed1 = new MessageEmbed()
            .setTitle(`I to wszystko bot automatycznie go wykryje i będzie wysyłał wiadomości nie zapomnij o uprawnieniach! \`🤗│powitania\``)
            .setColor(0xfcba03)
            m.edit(embed1)

        }, 5000);
        





   }
}
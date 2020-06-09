const Canvas = require("canvas")
const { MessageAttachment } = require("discord.js")

module.exports = {
    name: "rank",
    description: "Pokazuje banner użytkownika",


     async run( msg, args ) {
        const canvas = Canvas.createCanvas(700, 250)
        const ctx = canvas.getContext("2d")

        const background = await Canvas.loadImage(__dirname + "./../assets/img/wallpaper.jpg")

        const opel = await Canvas.loadImage(__dirname + "./../assets/img/opel.png")

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        ctx.drawImage(opel, 600, 150, 80, 80)


        ctx.font = "40px sans-serif"
        ctx.fillStyle = "white"
        ctx.fillText(msg.member.displayName, 275, 75)

        const attachment =  new MessageAttachment(canvas.toBuffer(), "wallpaper.jpg")

        msg.channel.send("", attachment)
   }
}

const dotenv = require("dotenv").config()

module.exports = {
    token: process.env.TOKEN,
    prefix: "!",
    corona_api: "https://corona.lmao.ninja/v2",
}
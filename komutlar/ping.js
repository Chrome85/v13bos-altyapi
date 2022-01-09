const discord = require("discord.js");

exports.run = async (client, msg, args) => {
const embed = new discord.MessageEmbed()
.setTitle('Pingim')
.setDescription(`Pingim : ${client.ws.ping}`)
msg.channel.send({embeds: [embed]})
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
  }
  exports.help = {
      name: "ping"
  }
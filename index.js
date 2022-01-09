//modüller baş
const fs = require("fs");
const Discord = require("discord.js");  //
const discord = require("discord.js");
const { Intents } = require("discord.js");
const client = new discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); 
require("./util/eventLoader.js")(client);
const ayarlar = require("./ayarlar.json");
const db = require('quick.db')

client.once("ready", () => {
	console.log(`Başarıyla aktif oldum`);
});

client.once("ready", () => {
	console.log(`Logged in as @${client.user.tag}!`);
});

const log = message => {
	console.log(` ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
	if (err) console.error(err); //
	log(`${files.length} komut yüklenecek.`);
	files.forEach(f => {
		let props = require(`./komutlar/${f}`);
		log(`Yüklenen komut: ${props.help.name}.`);
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});
	});
});
       //                              
client.reload = command => {  //
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(`./komutlar/${command}`)];
			let commands = require(`./komutlar/${command}`);
			client.commands.delete(command);
			client.aliases.forEach((commands, alias) => {
				if (commands === command) client.aliases.delete(alias);
			});
			client.commands.set(command, commands);
			commands.conf.aliases.forEach(alias => {
				client.aliases.set(alias, commands.help.name);
			});
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

client.load = command => {
	return new Promise((resolve, reject) => {
		try { //
			let commands = require(`./komutlar/${command}`);
			client.commands.set(command, commands);
			commands.conf.aliases.forEach(alias => {
				client.aliases.set(alias, commands.help.name);
			});
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

client.unload = command => {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(`./komutlar/${command}`)];
			let commands = require(`./komutlar/${command}`);
			client.commands.delete(command);
			client.aliases.forEach((commands, alias) => {
				if (commands === command) client.aliases.delete(alias);
			});
			resolve(); //
		} catch (e) {
			reject(e);
		}
	});
};

client.on("ready", () => {
	client.user.setActivity(`Sıfırdan Bot Yapımı `);
	console.log("Botun durumu ayarlandı.");
}); 
client.login(ayarlar.token);

process.on('warning', e => console.warn(e.stack));

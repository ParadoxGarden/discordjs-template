const fs = require('fs');
const OS = require('process');
try {
	OS.chdir('src');
}
catch (err) {
	console.error(err);
}
const { Client, Collection, Intents } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const { discord } = require('../config/settings.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(discord['token']);

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenu = new Collection();
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
const buttonFiles = fs.readdirSync('./Buttons').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./Events').filter(file => file.endsWith('.js'));
const selectMenuFiles = fs.readdirSync('./SelectMenu').filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
	const command = require(`./Commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

for (const file of buttonFiles) {
	const button = require(`./Buttons/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.buttons.set(button.name, button);
}
for (const file of selectMenuFiles) {
	const selectMenu = require(`./SelectMenu/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.selectMenu.set(selectMenu.name, selectMenu);
}
for (const file of eventFiles) {
	const event = require(`./Events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const rest = new REST({ version: '9' }).setToken(discord['token']);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationGuildCommands(discord['clientID'], discord['guildID']),
			{ body: commands },
		);
		console.log('Successfully registered application commands.');
	}
	catch (error) {
		console.error(error);
	}
})();

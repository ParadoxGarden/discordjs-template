module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const client = interaction.client;
		if (interaction.isButton()) {
			const button = client.buttons.get(interaction.customId);
			if (!button) return;
			try {
				await button.execute(interaction);
			}
			catch (error) {
				console.log(error);
				await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });

			}
		}
		if (interaction.isSelectMenu()) {
			const select = client.selectMenu.get(interaction.customId);
			if (!select) return;
			try {
				await select.execute(interaction);
			}
			catch (error) {
				console.log(error);
				await interaction.reply({ content: 'There was an error while executing this selection!', ephemeral: true });

			}
		}
		if (interaction.isCommand()) {

			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		else {
			return;
		}

	},
};
const { Events } = require("discord.js");
const clientManager = require("../clientManager");
const client = clientManager.getClient();

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(
					`No command matching ${interaction.commandName} was found.`
				);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: "There was an error while executing this command!",
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: "There was an error while executing this command!",
						ephemeral: true,
					});
				}
			}
		} else if (interaction.isButton()) {
			// Button is pressed
			await client.commands.get(interaction.customId).execute(interaction);
		} else if (interaction.isStringSelectMenu()) {
			// Menu option is selected
		}
	},
};

const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Posts the ticket creation panel")
    .setDefaultMemberPermissions(0), // Admin only
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationCommands(
        process.env.APPLICATION_ID,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );
    console.log("✅ Slash commands registered!");
  } catch (error) {
    console.error("Error registering slash commands:", error);
  }
})();

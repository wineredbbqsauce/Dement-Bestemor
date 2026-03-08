const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // requires enabeling in dev portals
  ],
});

client.once("ready", () => {
  console.log("Logged in as " + client.user.tag);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return; // ignore message from bots
  if (message.content === "!ping") {
    message.reply("Pong!");
  }
});

client.login(
  "MTQ4MDI4MDMwMjIzOTg3OTMzOQ.G_uJAA.cAuk1bsgGn-wtBGaHidfats-2ksJ2QAmbKLpqE",
);

require("dotenv").config();
require("./depoly-commands");
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TICKET_CATEGORY_ID = "Tickets";
const SUPPORT_ROLE_NAME = "Support"; // Optional: role that can see tickets

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ─── /setup command to post the "New Ticket" panel ───────────────────────────
client.on("interactionCreate", async (interaction) => {
  // Slash command: /setup
  if (interaction.isChatInputCommand() && interaction.commandName === "setup") {
    const embed = new EmbedBuilder()
      .setTitle("Need Help? Create a Ticket!")
      .setDescription("Click the button below to create a support ticket.")
      .setColor(0x00ff00);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("new_ticket")
        .setLabel("Create Ticket")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🎫"),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
    return;
  }

  // Button: New Ticket
  if (interaction.isButton() && interaction.customId === "new_ticket") {
    await handleNewTicket(interaction);
    return;
  }

  // Button: Close Ticket
  if (interaction.isButton() && interaction.customId === "close_ticket") {
    await handleCloseTicket(interaction);
    return;
  }
});

// ─── prefix command to post the "New Ticket" panel ───────────────────────────

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "Dsetup") {
    const embed = new EmbedBuilder()
      .setTitle("🎫 Support Tickets")
      .setDescription(
        "Need help? Click the button below to open a new support ticket.",
      )
      .setColor(0x5865f2);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("new_ticket")
        .setLabel("New Ticket")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🎫"),
    );

    await message.channel.send({ embeds: [embed], components: [row] });
    message.delete();
  }
});

// ─── Create a new ticket channel ─────────────────────────────────────────────

async function handleNewTicket(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;

  // Crheck if user already has an open ticket
  const existing = guild.channels.cache.find(
    (c) => c.name === `ticket-${user.username.toLowerCase()}`,
  );
  if (existing) {
    await interaction.reply({
      content: `You already have an open ticket: ${existing}`,
      ephemeral: true,
    });
    return;
  }

  // Find or create the "Tickets" category
  let category = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildCategory && c.name === TICKET_CATEGORY_ID,
  );
  if (!category) {
    category = await guild.channels.create({
      name: TICKET_CATEGORY_ID,
      type: ChannelType.GuildCategory,
    });
  }

  // Permission overwrites: only the user and support role can see the channel
  const permissionOverwrites = [
    {
      id: guild.roles.everyone,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    },
  ];

  // Also allow "Support" role if it exists
  const supportRole = guild.roles.cache.find(
    (r) => r.name === SUPPORT_ROLE_NAME,
  );
  if (supportRole) {
    permissionOverwrites.push({
      id: supportRole.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    });
  }

  // Create the ticket channel
  const ticketChannel = await guild.channels.create({
    name: `ticket-${user.username.toLowerCase()}`,
    type: ChannelType.GuildText,
    parent: category.id,
    permissionOverwrites,
  });

  // Post welcome message in ticket channel
  const embed = new EmbedBuilder()
    .setTitle(`🎫 Ticket - ${user.username}`)
    .setDescription(
      `Hello, ${user}! A support team member will be with you shortly.\n\nTo close this ticket, click the button below.`,
    )
    .setColor(0x00ff00)
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("close_ticket")
      .setLabel("Close Ticket")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("🔒"),
  );

  await ticketChannel.send({ embeds: [embed], components: [row] });

  await interaction.reply({
    content: `✅ Your ticket has been created: ${ticketChannel}`,
    ephemeral: true,
  });
}

// ─── Close the ticket channel ───────────────────────────────────────────────

async function handleCloseTicket(interaction) {
  const channel = interaction.channel;

  await interaction.reply({
    content: "🔒 Closing this ticket in 5 seconds...",
  });

  setTimeout(async () => {
    await channel.delete().catch(console.error);
  }, 5000);
}

client.login(process.env.TOKEN);

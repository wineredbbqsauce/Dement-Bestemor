# 🎫 Dement-Bestemor

> A small, friendly Discord ticket bot. Users click a button → a private channel opens → support helps them → channel closes.

![status](https://img.shields.io/badge/status-active-brightgreen)
![node](https://img.shields.io/badge/node-%3E%3D18-blue)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

---

## ✨ Features

- 🎫 **One-click tickets** — users click a button, a private channel is created
- 🔒 **Private by default** — only the ticket creator and `@Support` can see the channel
- 🗂️ **Auto-categorized** — channels land in a `Tickets` category (created on first use)
- 🔁 **Duplicate protection** — one open ticket per user
- 🧹 **Close button** — deletes the ticket channel after a 5-second grace period
- ⚡ **Two panel commands** — `/setup` (slash) and `Dsetup` (prefix)
- 🎭 **Optional role detection** — works with or without a `Support` role

---

## 📋 Requirements

- **Node.js 18+**
- A Discord **bot token** — [create one here](https://discord.com/developers/applications)
- A server where you have **Manage Channels** and **Manage Roles**

---

## 🚀 Installation

### 1. Clone the repo

```bash
git clone https://github.com/wineredbbqsauce/Dement-Bestemor.git
cd Dement-Bestemor
```

### 2. Quick setup (Linux / macOS / WSL)

```bash
chmod +x setup.sh   # only needed if git dropped the +x bit
./setup.sh
```

Checks Node 18+, runs `npm install`. That's it — **you** create `.env` yourself (see next step).

> 🪟 **Windows:** `npm install` manually, or use WSL.

### 3. Configure `.env`

Create a file named `.env` in the project root:

```env
TOKEN=your-bot-token-here
```

> ⚠️ **Never commit `.env`.** It's already in `.gitignore` — keep it that way.
> If a token ever leaks, **reset it immediately** in the Developer Portal.

### 4. Start the bot

```bash
node index.js
```

Expected output:

```
Logged in as Dement#0847
Registering slash commands...
✅ Slash commands registered!
```

---

## 🤖 Discord Setup

### 1. Create the application

1. Open the [Discord Developer Portal](https://discord.com/developers/applications)
2. **New Application** → give it a name → **Bot** tab → **Reset Token** → copy it into `.env`
3. Under **Privileged Gateway Intents**, enable:
   - ✅ **Message Content Intent** _(only needed for the `Dsetup` prefix command — skip if you only use `/setup`)_

### 2. Invite the bot

Replace `<CLIENT_ID>` with the **Application ID** from _General Information_:

```
https://discord.com/oauth2/authorize?client_id=<CLIENT_ID>&permissions=268520464&scope=bot%20applications.commands
```

> `268520464` = Manage Channels, Manage Roles, Send Messages, Read Message History, Manage Messages.
> Add `8` (Administrator) if you want a lazier setup — not recommended for servers you don't own.

### 3. Create the `Support` role (optional)

Create a role named exactly:

```
Support
```

Everyone with **@Support** or **Administrator** will see and respond to tickets. If the role doesn't exist, only the ticket creator can see their own ticket.

### 4. Post the ticket panel

In the channel where users should be able to open tickets, run **one** of:

```
/setup
```

```
Dsetup
```

> 💡 `/setup` is restricted to admins (grantable per-role in _Server Settings → Integrations_).
> `Dsetup` requires the **Message Content** intent.

---

## 🎮 Usage

| Action                     | Result                                                              |
| :------------------------- | :------------------------------------------------------------------ |
| `/setup` or `Dsetup`       | Posts the panel with a **🎫 Create Ticket** button                  |
| Click **🎫 Create Ticket** | Creates a private `ticket-<username>-<id>` channel inside `Tickets` |
| Click **🔒 Close Ticket**  | Replies, then deletes the channel after 5 seconds                   |

---

## ⚙️ Configuration

Edit these at the top of `index.js`:

```js
const TICKET_CATEGORY_NAME = "Tickets"; // Category that holds tickets
const SUPPORT_ROLE_NAME = "Support"; // Role that can see all tickets
```

> ⚠️ `TICKET_CATEGORY_NAME` is a **name**, not an ID. The bot creates the category if it doesn't exist.

---

## 🗂️ Project structure

```
Dement-Bestemor/
├── index.js         # The bot (single file)
├── setup.sh         # Quick setup for Unix-like systems
├── .env             # Secrets — never commit
├── .env.example     # Template for new setups
├── .gitignore
└── package.json
```

---

## 🐛 Troubleshooting

| Symptom                                           | Fix                                                                                                                                                   |
| :------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Invalid Form Body ... application_id: undefined` | Slash command registration must happen inside `clientReady` using `client.application.commands.set(commands)` — not with a hardcoded `APPLICATION_ID` |
| `Used disallowed intents`                         | Enable **Message Content Intent** in the Developer Portal — or delete the `messageCreate` block and the two related intents                           |
| Slash commands don't appear                       | Global commands can take **up to 1 hour**. Re-invite the bot with the `applications.commands` scope                                                   |
| `Missing Permissions` on channel create           | Give the bot **Manage Channels** and **Manage Roles** in that server                                                                                  |
| Duplicate tickets for the same user               | Usernames with spaces/unicode get normalized by Discord — use `ticket-${user.id}` instead of including the username                                   |
| `./setup.sh: Permission denied`                   | `chmod +x setup.sh` — git on Windows/WSL sometimes drops the +x bit                                                                                   |
| `setup.sh: command not found`                     | Run `bash setup.sh` instead, or check you're in the repo root                                                                                         |

---

## 🗺️ Roadmap

- [ ] Send tickets **directly to the client (DM)** instead of channel — better privacy
- [ ] Ticket transcript saved on close
- [ ] Claiming system (`/claim`) so one supporter owns a ticket
- [ ] Rate limiting to prevent spam-clicking

---

## 📄 License

MIT — do whatever you want, just don't blame me if `@everyone` ends up in your ticket.

---

## 🇳🇴 Norsk

**Dement-Bestemor** er en enkel Discord-ticketbot. Når en bruker klikker på knappen, åpnes en privat kanal, og en supporter hjelper dem. Når saken er løst, lukkes kanalen med ett klikk.

**Oppsett:**

1. Klon repoet og kjør `./setup.sh` (eller `npm install` manuelt)
2. Lag en `.env`-fil med `TOKEN=ditt-bot-token` (aldri commit denne filen!)
3. Inviter boten med **Manage Channels** og **Manage Roles**
4. Skriv `/setup` eller `Dsetup` i kanalen der panelet skal ligge
5. (Valgfritt) Lag en rolle som heter `Support`

**Personvern:** Tickets er private — bare brukeren og `@Support` ser kanalen.
**Neste steg:** Sende direkte til klienten (DM) for enda bedre personvern.

---

## 🤝 Contributing

PRs welcome — especially on the **DM tickets** roadmap item. Open an issue first if it's a bigger change so we don't step on each other.

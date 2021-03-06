// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents} = require('discord.js');

const { token, guildId } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
    console.log(command.data.name);
}

// Login to Discord with your client's token
client.login(token);

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
client.on('ready', i=>{
    let guild = client.guilds.cache.get(guildId);
    client.user.setActivity('my code',{type:'WATCHING'});
    console.log(`Ready! Logged in as ${client.user.tag}`);

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(guild,client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(guild,client, ...args));
        }
    }
})


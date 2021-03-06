const {userMention, Embed} = require("@discordjs/builders");
const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
const { guildId } = require('../config.json');
// plugin user role id is 887034141898600468

const types = [['mcs','the Minecraft server','887033315356454954','887035468930232331'],['pls','Plugins Support','887034141898600468','887035750649061416']];

async function process(interaction, id, guild) {// id = component.customId
    const key = id.split("_")[0];
    let type, index;
    for(index in types) {
        if(types[index][0] === key) {
            type = types[index];
            break;
        }
    }
    const action = id.split("_")[1];
    let btn;
    if (action === "join") {
        if (!interaction.member.roles.cache.has(type[2])) {
            await interaction.member.roles.add(type[2]);
            guild.channels.cache.get('887312277554999376').send(userMention(interaction.member.user.id)+' :flag_ch: '+type[1]);
        }
        btn = new MessageButton()
            .setCustomId(key + "_leave")
            .setLabel("Leave " + type[1] + ".")
            .setStyle("DANGER")
            .setEmoji(guild.emojis.cache.get(type[3]))
    } else if (action === "leave") {
        if(interaction.member.roles.cache.has(type[2])) {
            await interaction.member.roles.remove(type[2]);
            guild.channels.cache.get('887312277554999376').send(userMention(interaction.member.user.id)+' :no_entry: '+type[1]);
        }
        btn = new MessageButton()
            .setCustomId(key + '_join')
            .setLabel("Join " + type[1] + ".")
            .setStyle('SUCCESS')
            .setEmoji(guild.emojis.cache.get(type[3]));
    }
    let final = new MessageActionRow();
    let row = interaction.message.components[0].spliceComponents(index, 1, btn).components;
    for(let i in row) {
        final.addComponents(row[i])
    }
    return final
}

module.exports = {
    name: 'interactionCreate',
    async execute(guild,client, interaction) {
        if (!interaction.isButton()) return;
        if (interaction.component.customId === 'open_options') {
            let btn, item;
            const row = new MessageActionRow();
            for(let i in types) {
                item = types[i]
                if (interaction.member.roles.cache.has(item[2])) {
                    btn = new MessageButton()
                        .setCustomId(item[0] + "_leave")
                        .setLabel("Leave " + item[1] + ".")
                        .setStyle("DANGER")
                        .setEmoji(guild.emojis.cache.get(item[3]));
                } else {
                    btn = new MessageButton()
                        .setCustomId(item[0] + '_join')
                        .setLabel("Join " + item[1] + ".")
                        .setStyle('SUCCESS')
                        .setEmoji(guild.emojis.cache.get(item[3]));
                }
                row.addComponents(btn)
            }

            const e1s = "<:minecraftrole:887440139855478785>"


            await interaction.reply({content:'Profile: ' + userMention(interaction.user.id) + '\n__Role options__\n' +
                    '<:minecraftrole:887035468930232331> **`Minecraft`**||Join the Minecraft server||\n' +
                    '<:developerrole:887035750649061416>  **`Plugin support`**||Access plugin support||\n' +
                    ':paintbrush: `Art`||Artists, photographers, all art enthusiasts - coming soon||',
                components: [row],
                ephemeral: true
            });
        } else {
            await interaction.update({components: [await process(interaction, interaction.component.customId, guild)]})
        }
    }
}
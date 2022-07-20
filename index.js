const { Client, Intents, MessageEmbed, MessageActionRow } = require("discord.js");
const Discord = require("discord.js");
const client = new Client({
  intents: [
      Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
],
partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const commands = [{
  name: "levels",
  description: "see levels", 
  options: [{
    type: "USER", 
    name: "user", 
    description: "select user to see levels"
  }]
}]

client.on("ready", () => {
client.application.commands.set(commands)
console.log("Levels system started")
})
const channel_level = "986951193400061992";//هنا ايدي الروم إلي يرسل فيها إنو الشخص وصل لفل جديد
const jsonDB = require("@molo_7/db.json");
const levels = new jsonDB("levels.json")

const talkedRecently = new Set()
client.on("messageCreate", async (msg) => {
  if (talkedRecently.has(msg.author.id))return; 
  const number = Math.floor(Math.random() * 100)
  const aray = {
    id: msg.author.id, 
    xp: 0,
    level: 0
  }
let data = levels.get("level")
if (!data)return levels.push("level",aray);
let found = data.find(l => l.id === `${msg.author.id}`)

if (!found)return levels.push("level",aray);
  
if(found) found.xp += number;

data[data.indexOf(found)] = found

levels.set("level", data)
talkedRecently.add(msg.author.id);
        setTimeout(() => {      talkedRecently.delete(msg.author.id);
        }, 20000);

if (found.xp >= 200 * found.level){
  
if(found) found.level ++;

data[data.indexOf(found)] = found

client.channels.cache.get(channel_level).send({content:`${msg.author} you now level \`${found.level ++}\``});
  
levels.set("level", data)
  }
})

client.on("interactionCreate", async i => {
  if (i.commandName === "levels"){ 
    if (i.options.getUser("user") === null){
    const level = levels.get("level")
    const lvl = level.find(l => l.id === `${i.user.id}`)
   i.reply({content: `\`${lvl.xp}xp level: ${lvl.level}\``})
   } else {
    const us = i.options.getUser("user")
    const level = levels.get("level")
    const lvl = level.find(l => l.id === `${us.id}`)
   i.reply({content: `\`${lvl.xp}xp level: ${lvl.level}\``})
   }
  }
})



client.login(process.env.token)//حط توكن البوت فالقفل

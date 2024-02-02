const { Client, Intents, WebhookClient } = require('discord.js');
const configData = require('./config.json');

const token = configData.token;
const webhookURL = configData.webhook_url; 
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity('SALVO&1943', { type: 'WATCHING' });
  client.user.setStatus('idle');
});

client.on('guildMemberAdd', async (member) => {
  const memberName = member.user.username.toLowerCase();

  await kickMember(member, webhookURL);
});

client.login(token);

async function kickMember(member, webhookURL) {
  try {

    const allowedRoles = ['İzinliRolID1', 'İzinliRolID2']; //GEREKSİZ KULLANMAYIN
    const allowedUserIDs = ['ID', 'ID']; // GÜVENLİ IDYİ BURAYA YAZIN

    const hasAllowedRole = member.roles.cache.some(role => allowedRoles.includes(role.id));
    const isAllowedUser = allowedUserIDs.includes(member.user.id);

    if (hasAllowedRole || isAllowedUser) {
      console.log(`${member.user.tag} isimli üye atılamaz.`);
      return;
    }

 
    const startTime = Date.now();
    await member.kick({ reason: '' });
    const endTime = Date.now();
    const elapsedTimeMs = endTime - startTime;

    const vanityUrl = member.guild.vanityURLCode || 'henüz yok';

    const logMessage = `Atıldı: <@${member.user.id}> [${member.user.tag}] - ms 0.${elapsedTimeMs} - Url: [${vanityUrl}]`;
    console.log(logMessage);

    const webhook = new WebhookClient({ url: webhookURL });
    const logMessageWebhook = `Atıldı: <@${member.user.id}> [${member.user.tag}] - ms 0.${elapsedTimeMs} - Url: ${vanityUrl}`;

    await webhook.send(logMessageWebhook);
  } catch (error) {
    console.error('Üye atılırken hata oluştu:', error);
  }
}
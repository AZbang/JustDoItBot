const motivation = require('../assets/motivation');

var sendMotivation = (bot, chat) => {
	var m = motivation[Math.floor(Math.random()*motivation.length)];

	if(!m.img)
		bot.sendMessage(chat, m.text);
	else
		bot.sendPhoto(chat, '../' + motivation.img);
}

module.exports = sendMotivation;

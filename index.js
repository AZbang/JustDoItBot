'use strict'

var TelegramBot = require('node-telegram-bot-api');
var generateImage = require('./modules/generationImages.js');

var token = '329308405:AAFg4cDIjJ9Fc0M8W8SLNgLYHFXhAjczpFI';
var bot = new TelegramBot(token, { polling: true });


var notes = [];
var isHardMode = false;

bot.onText(/\/remind (.+) in (.+) of (\d\d)/, function (msg, match) {
	console.log(match);
	var text = match[1];
	var time = match[2].split(':');
	var d = new Date();
	var date = [d.getFullYear(), d.getMonth(), match[3] || d.getDay()];

	var fullDate = new Date(date[0], date[1], +date[2], +time[0], +time[1]); 

	bot.sendMessage(msg.chat.id, 'Okay!');
	notes.push({uid: msg.chat.id, text: text, date: fullDate});
});

bot.onText(/\/hard_on/, function (msg, match) {
	isHardMode = true;
	bot.sendMessage(msg.chat.id, 'Hard Mode On!');
});
bot.onText(/\/hard_off/, function (msg, match) {
	isHardMode = false;
	bot.sendMessage(msg.chat.id, 'Hard Mode Off!');
});


setInterval(() => {
	let date = new Date();

	for(let i = 0; i < notes.lenght; i++) {
		let note = notes[i];
		console.log(+note.date, +date);

		if(+note.date >= +date) {
			bot.sendImage(note.uid, generationImages(note.text));
			!isHardMode && notes.splice(i, 1);
		}
	}
}, 60000);
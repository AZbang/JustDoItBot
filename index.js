'use strict'

const TelegramBot = require('node-telegram-bot-api');
const Datastore = require('nedb');

const renderImage = require('./modules/renderImage.js');

const token = '329308405:AAFg4cDIjJ9Fc0M8W8SLNgLYHFXhAjczpFI';
const bot = new TelegramBot(token, { polling: true });
const db = new Datastore({ filename: 'tasks.db', autoload: true });

var tasks;

// load db
db.find({}, (err, docs) => {
	if(err) throw docs;
	tasks = docs;
});

// user text: /remind $text in $time of $day
bot.onText(/\/remind (.+) in (.+) of (\d+)/, (msg, match) => {
	var text = match[1];
	var time = match[2].split(':');

	var d = new Date();
	var date = [d.getFullYear(), d.getMonth(), match[3] || d.getDay()];
	var fullDate = new Date(date[0], date[1], +date[2], +time[0], +time[1]); 

	var data = {uid: msg.chat.id, text: text, date: fullDate};

	tasks.push(data);
	db.insert(data);
	bot.sendMessage(data.uid, 'Okay!');
});


// updates...
setInterval(() => {
	let date = new Date();

	for(let i = 0; i < tasks.length; i++) {
		let note = tasks[i];

		if(+note.date <= +date) {
			bot.sendPhoto(note.uid, renderImage(note.text));

			db.remove({ date: note.date }, {}, (err) => {
				if(err) throw err;
			});
		}
	}
}, 60000);
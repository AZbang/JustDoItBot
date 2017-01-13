'use strict'

const TelegramBot = require('node-telegram-bot-api');
const Datastore = require('nedb');

const sendNoteImage = require('./modules/sendNoteImage.js');
const sendMotivation = require('./modules/sendMotivation.js');

const token = require('./token');
const bot = new TelegramBot(token, { polling: true });
const dbTasks = new Datastore({ filename: 'tasks.db', autoload: true });
const dbChats = new Datastore({ filename: 'chats.db', autoload: true });

var tasks;
var chats;

// load db
dbTasks.find({}, (err, docs) => {
	if(err) throw docs;
	tasks = docs;
});
dbChats.find({}, (err, docs) => {
	if(err) throw docs;
	chats = docs;
});


// init
bot.onText(/\/start/, (msg) => {
	chats.push(msg.chat.id);
	dbChats.insert({uid: msg.chat.id});
	bot.sendMessage(msg.chat.id, 'Привет! Я буду напоминать тебе о вещах, которые ты должен сделать в будущем, а так же, я буду мотивировать тебя цитатками и картиночками котиков, но это не точно... \n\nДля того, чтобы я напомнил тебе, просто напиши \nНапомни $твоя_задача в $час:$минута $число числа \nЗнаю, это долго, но мне лень делать нормальный конструктор задач, может позже...');
});

// user text: /remind $text in $time of $day
bot.onText(/\Напомни (.+) в (.+) (.+) числа/, (msg, match) => {
	var text = match[1];
	var time = match[2].split(':');

	var d = new Date();
	var date = [d.getFullYear(), d.getMonth(), match[3] || d.getDay()];
	var fullDate = new Date(date[0], date[1], +date[2], +time[0], +time[1]); 

	var data = {uid: msg.chat.id, text: text, date: fullDate};

	tasks.push(data);
	dbTasks.insert(data);
	bot.sendMessage(data.uid, 'Хорошо, я напомню, если не упаду, конечно.');
});

// updates...
setInterval(() => {
	let date = new Date();

	for(let i = 0; i < tasks.length; i++) {
		let note = tasks[i];

		if(+note.date <= +date) {
			bot.sendMessage(note.uid, 'Напоминание: В ' + note.date + ', цитирую:');
			sendNoteImage(bot, note.uid, note.text);

			tasks.splice(i, 1);
			dbTasks.remove({ date: note.date }, {}, (err) => {
				if(err) throw err;
			});
		}
	}
}, 60000);

setInterval(() => {
	bot.sendMessage(chats[i].uid, "Время мотивационной ванили!");

	for(let i = 0; i < chats.length; i++) {
		sendMotivation(bot, chats[i].uid);
	}
}, 60000*60*2);
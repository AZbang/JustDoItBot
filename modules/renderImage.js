'use strict'

const fs = require('fs');
const Canvas = require('canvas');
const Image = Canvas.Image;

const w = 400, h = 400;
const canvas = new Canvas(w, h);
const ctx = canvas.getContext('2d');
const images = require('../assets/images');


for(let i = 0; i < images.length; i++) {
	fs.readFile(__dirname + '/../' + images[i].src, (err, squid) => {
		if (err) throw err;

		images[i].img = new Image;
		images[i].img.src = squid;
	});
}

var generateImage = (text) => {
	var src = images[Math.floor(Math.random() * images.length)];

	ctx.clearRect(0, 0, w, h);

	ctx.drawImage(src.img, 0, 0, w, h);
	ctx.font = '30px Impact';
	ctx.fillStyle = '#fff';
	ctx.fillText(text, src.x, src.y);

	return canvas.toBuffer();
}

module.exports = generateImage;
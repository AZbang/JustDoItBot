'use strict'

var Canvas = require('canvas'), 
 	fs = require('fs'),
	Image = Canvas.Image, 
	canvas = new Canvas(400, 400), 
	ctx = canvas.getContext('2d');

var img;
fs.readFile(__dirname + '/../assets/justdoit.jpg', (err, squid) => {
	if (err) throw err;

	img = new Image;
	img.src = squid;
});


var generateImage = (text, img) => {
	ctx.clearRect(0, 0, 400, 400);

	ctx.drawImage(img, 0, 0, 400, 400);
	ctx.font = '30px Impact';
	ctx.fillStyle = '#fff';
	ctx.fillText(text, 30, 180);

	return canvas.toBuffer();
}

module.exports = generateImage;
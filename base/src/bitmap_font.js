/*
 * File:    bitmap_font.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   fnt file parser
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

function BitmapFont() {
}

//http://www.angelcode.com/products/bmfont/doc/file_format.html
BitmapFont.prototype.parseFontLine = function(fontInfo, line) {
	var words = line.split(" ");

	var lineInfo = {};
	var name = words[0];
	var n = words.length;

	for(var i = 1; i < n; i++) {
		var kevValue = words[i].split('=');
		var key = kevValue[0];
		var value = kevValue[1];
		lineInfo[key] = value;
	}

	switch(name) {
		case "page": {
			var pageDesc = {};
			pageDesc.id = lineInfo.id;
			pageDesc.file = lineInfo.file.replace(/"/g,"").replace(/\r/, "");

			fontInfo.pagesDesc[pageDesc.id] = pageDesc;

			break;
		}
		case "char": {
			var charDesc = {};
			var c = String.fromCharCode(lineInfo.id);

			charDesc.c = c;
			charDesc.id = lineInfo.id;
			charDesc.x = parseInt(lineInfo.x);
			charDesc.y = parseInt(lineInfo.y);
			charDesc.w = parseInt(lineInfo.width);
			charDesc.h = parseInt(lineInfo.height);
			charDesc.ox = parseInt(lineInfo.xoffset);
			charDesc.oy = parseInt(lineInfo.yoffset);
			charDesc.rw = parseInt(lineInfo.xadvance);
			charDesc.page = lineInfo.page;

			fontInfo.charsDesc[c] = charDesc;

			break;
		}
	}

	return;
}

BitmapFont.prototype.parse = function(data) {
	var fontInfo = {};
	fontInfo.charsDesc = {};
	fontInfo.pagesDesc = {};

	var lines = data.split("\n");
	for(var i = 0; i < lines.length; i++) {
		this.parseFontLine(fontInfo, lines[i]);
	}

	this.fontInfo = fontInfo;

	return fontInfo;
}

BitmapFont.prototype.getCharDesc = function(c) {
	return this.fontInfo ? this.fontInfo.charsDesc[c] : null;
}

BitmapFont.prototype.getCharsDesc = function(c) {
	return this.fontInfo ? this.fontInfo.charsDesc : null;
}

BitmapFont.prototype.getPagesDesc = function() {
	return this.fontInfo ? this.fontInfo.pagesDesc : null;
}

BitmapFont.prototype.getFontInfo  = function() {
	return this.fontInfo;
}


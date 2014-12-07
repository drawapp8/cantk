/*
 * File: theme.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: cantk theme.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function CanTkImage(src) {
	if(src) {
		this.setImageSrc(src);
	}

	return;
}

CanTkImage.prototype.initFromJson = function(src, json, onLoad) {
	var sharpOffset = src.indexOf("#");
	var jsonURL = src.substr(0, sharpOffset);
	var name = src.substr(sharpOffset+1);
	var path = dirname(jsonURL);
	var filename = json.file ? json.file : json.meta.image;
	var imageSrc = path + "/" + filename;
	var rect = json.frames[name];

	if(!rect) {
		alert("Invalid src: " + src);
		return;
	}

	if(rect.frame) {
		rect = rect.frame;
	}

	var me = this;
	this.rect = rect;
	CanTkImage.onload();
	ResLoader.loadImage(imageSrc, function(img) {
		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
	});

	return;
}

CanTkImage.prototype.initFromRowColIndex = function(src, rowcolIndex, onLoad) {
	var me = this;
	var rows = parseInt(rowcolIndex[1]);
	var cols = parseInt(rowcolIndex[2]);
	var index = parseInt(rowcolIndex[3]);
	rowcolIndex = null;

	this.image = ResLoader.loadImage(src, function(img) {
		var tileW = Math.round(img.width/cols);
		var tileH = Math.round(img.height/rows);
		var col = index%cols;
		var row = Math.floor(index/cols);

		me.rect = {};
		me.rect.x = col * tileW;
		me.rect.y = row * tileH;
		me.rect.w = tileW;
		me.rect.h = tileH;

		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
		CanTkImage.onload();
	});

	return;
}

CanTkImage.prototype.initFromXYWH = function(src, xywh, onLoad) {
	var me = this;
	var x = parseInt(xywh[1]);
	var y = parseInt(xywh[2]);
	var w = parseInt(xywh[3]);
	var h = parseInt(xywh[4]);
	xywh = null;

	this.image = ResLoader.loadImage(src, function(img) {
		me.rect = {};
		me.rect.x = x;
		me.rect.y = y;
		me.rect.w = w;
		me.rect.h = h;

		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
		CanTkImage.onload();
	});

	return;
}

CanTkImage.prototype.setImageSrc = function(src, onLoad) {
	if(!src) {
		this.src = src;
		this.image = CanTkImage.nullImage;

		return;
	}

	if(src.indexOf("data:") == 0) {	
		this.src = src;
		this.image = new Image();
		this.image.src = src;
		
		onLoad(this.image);
		CanTkImage.onload();

		return;
	}

	src = ResLoader.toAbsURL(src);
	this.src = src;

	var me = this;
	var sharpOffset = src.indexOf("#");
	if(sharpOffset > 0) {
		var meta = src.substr(sharpOffset+1);
		var rowcolIndex = meta.match(/r([0-9]+)c([0-9]+)i([0-9]+)/i);
		var xywh = meta.match(/x([0-9]+)y([0-9]+)w([0-9]+)h([0-9]+)/i);

		if(!rowcolIndex && !xywh) {
			var jsonURL = src.substr(0, sharpOffset);
			ResLoader.loadJson(jsonURL, function(json) {
				me.initFromJson(src, json, onLoad);
			});
		}
		else {
			src = src.substr(0, sharpOffset);
			if(rowcolIndex) {
				this.initFromRowColIndex(src, rowcolIndex, onLoad);
			}
			if(xywh){
				this.initFromXYWH(src, xywh, onLoad);
			}

			rowcolIndex = null;
			xywh = null;
		}
	}
	else {
		this.image = ResLoader.loadImage(src, function(img) {
			me.rect = {};
			me.rect.x = 0;
			me.rect.y = 0;
			me.rect.w = img.width;
			me.rect.h = img.height;

			me.image = img;
			if(onLoad) {
				onLoad(img);
			}
			CanTkImage.onload();
		});
	}

	return;
}

CanTkImage.prototype.getImageRect = function() {
	if(this.rect && !this.rect.w && !this.rect.h) {
		return null;
	}

	return this.rect;
}

CanTkImage.prototype.getImageSrc = function() {
	return this.src;
}

CanTkImage.prototype.getRealImageSrc = function() {
	return this.image ? this.image.src : this.src;
}

CanTkImage.prototype.getImage = function() {
	var image = this.image;

	return (image && image.width > 0) ? image : null;
}

CanTkImage.nullImage = new Image();

CanTkImage.onload = function() {
}

function cantkSetOnImageLoad(onImageLoad) {
	if(onImageLoad) {
		CanTkImage.onload = onImageLoad;
	}

	return;
}

//////////////////////////////////////////////////////////////////

function Gc(font, bg, fg, image) {
   this.bg = bg;
   this.fg = fg;
   this.font = font;	
   this.image = image;

   this.dup = function() {
     var nGc = new Gc(this.font, this.bg, this.fg, this.image);

     return nGc;
   }

   return;
}

function themeCreate() {
	var theme = new Array();

	theme.push(new Gc("13pt bold sans-serif ", "#FFFFFF", "#000000", null));
	theme.push(new Gc("13pt bold sans-serif ", "#FFFFFF", "#000000", null));
	theme.push(new Gc("13pt bold sans-serif ", "#FFFFFF", "#000000", null));
	theme.push(new Gc("13pt bold sans-serif ", "#FFFFFF", "Gray", null));

	return theme;
}

function CanTkTheme() {
}

CanTkTheme.themes = {};
CanTkTheme.defaultTheme = themeCreate();

CanTkTheme.MENU_GRID_BG    = "MENU_GRID_BG";
CanTkTheme.TOOLBAR_BG      = "TOOLBAR_BG";
CanTkTheme.MENU_BG         = "MENU_BG";
CanTkTheme.CONTEXT_MENU_BG = "CONTEXT_MENU_BG";
CanTkTheme.MESSAGE_BOX_BG  = "MESSAGE_BOX_BG";
CanTkTheme.TOOLBAR_BOX_BG  = "TOOLBAR_BOX_BG"
CanTkTheme.MENU_BAR_BG     = "MENU_BAR_BG";
CanTkTheme.MENU_BAR_ITEM_ACTIVE_BG  = "MENU_BAR_ITEM_ACTIVE_BG";
CanTkTheme.MENU_BAR_ITEM_OVER_BG    = "MENU_BAR_ITEM_OVER_BG";
CanTkTheme.MENU_ITEM_H_SEPERATOR    = "MENU_ITEM_H_SEPERATOR";
CanTkTheme.MENU_ITEM_NORMAL_BG      = "MENU_ITEM_NORMAL_BG";
CanTkTheme.MENU_ITEM_ACTIVE_BG      = "MENU_ITEM_ACTIVE_BG";
CanTkTheme.MENU_ITEM_OVER_BG        = "MENU_ITEM_OVER_BG";
CanTkTheme.MENU_GRID_ITEM_NORMAL_BG = "MENU_GRID_ITEM_NORMAL_BG";
CanTkTheme.MENU_GRID_ITEM_ACTIVE_BG = "MENU_GRID_ITEM_ACTIVE_BG";
CanTkTheme.MENU_GRID_ITEM_OVER_BG   = "MENU_GRID_ITEM_OVER_BG";

CanTkTheme.bgImageURL = "/ide/images/ide.json";

CanTkTheme.setBgImageURL = function(bgImageURL) {
	CanTkTheme.bgImageURL = bgImageURL;

	return;
}

CanTkTheme.getBgImageURL = function() {
	return CanTkTheme.bgImageURL;
}

CanTkTheme.get = function(name, noDefault) {
	name = name.toString();

	var theme = CanTkTheme.themes[name];

	if(!theme && !noDefault) {
		theme = CanTkTheme.defaultTheme;
	}

	return theme;
}

CanTkTheme.set = function(name, state, font, textColor, bgColor, bgImage) {
	name = name.toString();

	var theme = CanTkTheme.themes[name];

	if(!theme) {
		theme = themeCreate();
		CanTkTheme.themes[name] = theme;
	}

	if(font) {
		theme[state].font = font;
	}
	
	if(textColor) {
		theme[state].fg = textColor;
	}

	if(bgColor) {
		theme[state].bg = bgColor;
	}

	if(bgImage) {
		theme[state].image = bgImage;
	}

	return;
}

//////////////////////////////////////////////////////////////////

function dappGetWidgetStyle(type) {
	return CanTkTheme.get(type);
}

function dappSetWidgetStyle(type, state, font, textColor) {
	return CanTkTheme.set(type, state, font, textColor);
}

dappSetWidgetStyle("menubar.item", Widget.STATE_NORMAL, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.item", Widget.STATE_ACTIVE, "13pt sans-serif", "Black");
dappSetWidgetStyle("menubar.item", Widget.STATE_OVER, "13pt sans-serif", "Black");
dappSetWidgetStyle("menubar.item", Widget.STATE_INSENSITIVE, "14pt sans-serif", "Gray");

dappSetWidgetStyle("menubar.button", Widget.STATE_NORMAL, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", Widget.STATE_ACTIVE, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", Widget.STATE_OVER, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", Widget.STATE_INSENSITIVE, "10pt bold sans-serif", "Gray");

dappSetWidgetStyle("menu.item", Widget.STATE_NORMAL, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", Widget.STATE_ACTIVE, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", Widget.STATE_OVER, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", Widget.STATE_INSENSITIVE, "12pt bold sans-serif", "Gray");

dappSetWidgetStyle("grid.item", Widget.STATE_NORMAL, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", Widget.STATE_ACTIVE, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", Widget.STATE_OVER, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", Widget.STATE_INSENSITIVE, "14pt bold sans-serif", "Gray");

dappSetWidgetStyle("contextmenu.item", Widget.STATE_NORMAL, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", Widget.STATE_ACTIVE, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", Widget.STATE_OVER, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", Widget.STATE_INSENSITIVE, "14pt bold sans-serif", "Gray");

dappSetWidgetStyle("toolbar.button.fill", Widget.STATE_NORMAL, null, "#C0C0C0");
dappSetWidgetStyle("toolbar.button.fill", Widget.STATE_ACTIVE, null, "#E0E0E0");
dappSetWidgetStyle("toolbar.button.fill", Widget.STATE_INSENSITIVE, null, "#D0D0D0");
dappSetWidgetStyle("toolbar.button.border", Widget.STATE_NORMAL, null, "Gray");
dappSetWidgetStyle("toolbar.button.border", Widget.STATE_ACTIVE, null, "Gray");
dappSetWidgetStyle("toolbar.button.border", Widget.STATE_INSENSITIVE, null, "#D0D0D0");

dappSetWidgetStyle("messagebox", Widget.STATE_NORMAL, "14pt bold sans-serif", "#303030");


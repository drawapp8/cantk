/*
 * File: theme.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: cantk theme.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function CanTkImage(src, onLoad) {
	var me = this;
	this.src = src;

	this.initFromJson = function(src, json) {
		var sharpOffset = src.indexOf("#");
		var jsonURL = src.substr(0, sharpOffset);
		var name = src.substr(sharpOffset+1);
		var path = dirname(jsonURL);
		var filename = json.file ? json.file : json.meta.image;
		var imageSrc = path + "/" + filename;
		var rect = json.frames[name];

		if(rect.frame) {
			rect = rect.frame;
		}

		this.rect = rect;
		this.image = CanTkImage.createImage(imageSrc, onLoad);

		return;
	}

	this.setImageSrc = function(src) {
		if(!src) {
			this.src = src;
			this.image = CanTkImage.nullImage;
			return;
		}

		this.src = CanTkImage.toAbsURL(src);
		var sharpOffset = src.indexOf("#");
		var rectOffset = src.indexOf("?r=");
		var jsonURL = src.substr(0, sharpOffset);

		if(sharpOffset > 0) {

			if(CanTkImage.jsons[jsonURL]) {
				var json = CanTkImage.jsons[jsonURL];
				me.initFromJson(src, json);
			}
			else {
				httpGetJSON(jsonURL, function(json) {
					me.initFromJson(src, json);
					CanTkImage.jsons[jsonURL] = json;
				});
			}
		}
		else if(rectOffset > 0) {
			var str = src.substr(rectOffset+3);
			var src = src.substr(0, rectOffset);
			var arr = str.split(",");

			this.image = CanTkImage.createImage(src, function(img) {
				me.rect = {};

				if(arr.length == 4) {
					me.rect.x = parseInt(arr[0]);
					me.rect.y = parseInt(arr[1]);
					me.rect.w = parseInt(arr[2]);
					me.rect.h = parseInt(arr[3]);
				}
				else {
					me.rect.x = 0;
					me.rect.y = 0;
					me.rect.w = img.width;
					me.rect.h = img.height;
				}
				if(onLoad) {
					onLoad();
				}
			});
		}
		else {
			this.image = CanTkImage.createImage(src, function(img) {
				me.rect = {};
				me.rect.x = 0;
				me.rect.y = 0;
				me.rect.w = img.width;
				me.rect.h = img.height;

				if(onLoad) {
					onLoad();
				}
			});
		}

		return;
	}

	this.getImageRect = function() {
		if(this.rect && !this.rect.w && !this.rect.h) {
			return null;
		}

		return this.rect;
	}

	this.getImageSrc = function() {
		return this.src;
	}
	
	this.getRealImageSrc = function() {
		return this.image ? this.image.src : this.src;
	}

	this.getImage = function() {
		var image = this.image;
		return (image && image.width > 0) ? image : null;
	}

	if(src) {
		this.setImageSrc(src);
	}

	return;
}

CanTkImage.resRoot = null;
CanTkImage.setResRoot = function(resRoot) {
	CanTkImage.resRoot = resRoot;

	return;
}

CanTkImage.toAbsURL = function(url) {
	var absURL = url;

	if(!url) {
		return url;
	}

	if(CanTkImage.resRoot && url.indexOf("://") < 0) {
		absURL = CanTkImage.resRoot + url;

		return absURL;
	}

	if(url.indexOf("://") < 0) {
		if(url[0] === '/') {
			absURL = location.protocol + "//" + location.host + url;
		}
		else {
			var href = location.href;
			var offset = href.indexOf("?");
			if(offset >= 0) {
				href = href.substr(0, offset);
			}
			absURL = href.substr(0, href.lastIndexOf("/")) + "/" + url;
		}
	}

	return absURL;
}

CanTkImage.onload = function() {
}

function setRefreshAfterImageLoaded(redrawUI) {
	if(redrawUI) {
		CanTkImage.onload = redrawUI;
	}

	return;
}

CanTkImage.images = [];
CanTkImage.jsons = {};

CanTkImage.nullImage = new Image();
CanTkImage.loadingImages = 0;

CanTkImage.getLoadProgress = function() {
	var percent = 100;

	var n = CanTkImage.images.length;
	if(n) {
		percent = 100 * (n - CanTkImage.loadingImages)/n;
	}

	return percent;
}

CanTkImage.loadImage = function (src, onLoad) {
	var image = new Image();

	CanTkImage.images.push(image);
	CanTkImage.loadingImages++;

	image.onload = function (e) {
		CanTkImage.onload();

		if(onLoad) {
			onLoad(image);
		}
	
		CanTkImage.loadingImages--;
	};

	image.onerror = function (e) {
		CanTkImage.loadingImages--;
		console.log("load " + src + " failed:" + e.message);
	};

	image.onabort = function (e) {
		CanTkImage.loadingImages--;
		console.log("load " + src + " failed(abort):" + e.message);
	};

	image.src = src;

	return image;
}

CanTkImage.getImageInCache = function(src, onLoad) {
	var images = CanTkImage.images;
	if(images) {
		for(var i = 0; i < images.length; i++) {
			var iter = images[i];

			if(iter.src && iter.src.indexOf(src) >= 0) {
				if(onLoad) {
					onLoad(iter);
				}

				return iter;
			}
		}
	}

	return null;
}

CanTkImage.createImage = function (src, onLoad) {
	var image = null;

	if(!src) {
		return CanTkImage.nullImage;
	}
	
	src = CanTkImage.toAbsURL(src);

	image = CanTkImage.getImageInCache(src, onLoad);
	if(image) {
		if(onLoad) {
			onLoad(image);
		}
		return image;
	}

	return CanTkImage.loadImage(src, onLoad);
}

//////////////////////////////////////////////////////////////////

var CanTkBg40Image = {
	MENU_GRID_BG : 5,
	TOOLBAR_BG : 6,
	MENU_BG : 7,
	CONTEXT_MENU_BG : 8,
	MESSAGE_BOX_BG : 9,
	TOOLBAR_BOX_BG : 10
};

var CanTkBgImage = {
	MENU_BAR_BG : 0,
	MENU_BAR_ITEM_ACTIVE_BG : 1,
	MENU_BAR_ITEM_OVER_BG : 2,
	MENU_ITEM_H_SEPERATOR : 3,
	MENU_ITEM_NORMAL_BG : 4,
	MENU_ITEM_ACTIVE_BG : 5,
	MENU_ITEM_OVER_BG : 6,
	MENU_GRID_ITEM_NORMAL_BG : 7,
	MENU_GRID_ITEM_ACTIVE_BG : 8,
	MENU_GRID_ITEM_OVER_BG : 9
};

var gCanTkBgIcon = null;
function cantkGetBgIconInfo() {
	if(!gCanTkBgIcon) {
		gCanTkBgIcon = new IconInfo(cantkGetImageURL("cantk.png"), 1, 30, 20, 50);
	}

	return gCanTkBgIcon;
}

var gCanTkBgIcon40 = null;
function cantkGetBgIcon40Info() {
	if(!gCanTkBgIcon40) {
		gCanTkBgIcon40 = new IconInfo(cantkGetImageURL("cantk.png"), 1, 15, 40, 50);
	}

	return gCanTkBgIcon40;
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

dappSetWidgetStyle("menubar.item", C_WIDGET_STATE_NORMAL, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.item", C_WIDGET_STATE_ACTIVE, "13pt sans-serif", "Black");
dappSetWidgetStyle("menubar.item", C_WIDGET_STATE_OVER, "13pt sans-serif", "Black");
dappSetWidgetStyle("menubar.item", C_WIDGET_STATE_INSENSITIVE, "14pt sans-serif", "Gray");

dappSetWidgetStyle("menubar.button", C_WIDGET_STATE_NORMAL, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", C_WIDGET_STATE_ACTIVE, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", C_WIDGET_STATE_OVER, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", C_WIDGET_STATE_INSENSITIVE, "10pt bold sans-serif", "Gray");

dappSetWidgetStyle("menu.item", C_WIDGET_STATE_NORMAL, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", C_WIDGET_STATE_ACTIVE, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", C_WIDGET_STATE_OVER, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", C_WIDGET_STATE_INSENSITIVE, "12pt bold sans-serif", "Gray");

dappSetWidgetStyle("grid.item", C_WIDGET_STATE_NORMAL, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", C_WIDGET_STATE_ACTIVE, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", C_WIDGET_STATE_OVER, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", C_WIDGET_STATE_INSENSITIVE, "14pt bold sans-serif", "Gray");

dappSetWidgetStyle("contextmenu.item", C_WIDGET_STATE_NORMAL, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", C_WIDGET_STATE_ACTIVE, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", C_WIDGET_STATE_OVER, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", C_WIDGET_STATE_INSENSITIVE, "14pt bold sans-serif", "Gray");

dappSetWidgetStyle("toolbar.button.fill", C_WIDGET_STATE_NORMAL, null, "#C0C0C0");
dappSetWidgetStyle("toolbar.button.fill", C_WIDGET_STATE_ACTIVE, null, "#E0E0E0");
dappSetWidgetStyle("toolbar.button.fill", C_WIDGET_STATE_INSENSITIVE, null, "#D0D0D0");
dappSetWidgetStyle("toolbar.button.border", C_WIDGET_STATE_NORMAL, null, "Gray");
dappSetWidgetStyle("toolbar.button.border", C_WIDGET_STATE_ACTIVE, null, "Gray");
dappSetWidgetStyle("toolbar.button.border", C_WIDGET_STATE_INSENSITIVE, null, "#D0D0D0");

dappSetWidgetStyle("messagebox", C_WIDGET_STATE_NORMAL, "14pt bold sans-serif", "#303030");


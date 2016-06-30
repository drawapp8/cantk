/*
 * File: theme.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: cantk theme.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function WThemeManager() {
}

WThemeManager.newStyle = function(font, fillColor, textColor, lineColor, bgImage) {
	var style = {};

	if(font) {
		style.font = font;
	}

	if(bgImage) {
		style.bgImage = bgImage;
	}

	if(fillColor) {
		style.fillColor = fillColor;
	}

	if(textColor) {
		style.textColor = textColor;
	}

	if(lineColor) {
		style.lineColor = lineColor;
	}

	return style;
}

WThemeManager.newTheme = function() {
	var theme = {};

	theme[WWidget.STATE_NORMAL]  = WThemeManager.newStyle("13pt bold sans-serif ", null, "#000000", "#000000");
	theme[WWidget.STATE_ACTIVE]  = WThemeManager.newStyle("13pt bold sans-serif ", null, "#000000");
	theme[WWidget.STATE_OVER]    = WThemeManager.newStyle("13pt bold sans-serif ", null, "#000000");
	theme[WWidget.STATE_DISABLE] = WThemeManager.newStyle("13pt bold sans-serif ", null, "Gray");
	theme[WWidget.STATE_SELECTED]= WThemeManager.newStyle("13pt bold sans-serif ", null, "Gray");

	return theme;
}

WThemeManager.themes = {};
WThemeManager.imagesURL = null;
WThemeManager.defaultTheme = WThemeManager.newTheme();
WThemeManager.themeURL = "/ide/theme/default/theme.json";

WThemeManager.setImagesURL = function(imagesURL) {
	WThemeManager.imagesURL = imagesURL;

	return;
}

WThemeManager.getIconImageURL = function() {
	return WThemeManager.imagesURL;
}

WThemeManager.getImageURL = function() {
	return WThemeManager.imagesURL;
}

WThemeManager.imagesCache = {};
WThemeManager.createImage = function(url) {
	var image = WThemeManager.imagesCache[url];
	if(!image) {
		image = WImage.create(url);
	}

	return image;
}

WThemeManager.getIconImage = function(name) {
	if(name.endWith(".png")) {
		return WThemeManager.getImage(name);
	}
	else {
		return WThemeManager.getImage(name + ".png");
	}
}

WThemeManager.getBgImage = function(name) {
	return this.getImage(name);
}

WThemeManager.getImage = function(name) {
	if(!WThemeManager.imagesURL) {
		return null;
	}
	
	var url = WThemeManager.imagesURL + "#" + name;
	return this.createImage(url);
}

WThemeManager.setTheme = function(theme) {
	WebStorage.set("wtkTheme", theme);
	location.href = location.href;

	return;
}

WThemeManager.getThemeURL = function() {
	var themeURL = getQueryParameter("theme-url");
	if(themeURL) {
		return themeURL;
	}
	
	var theme = getQueryParameter("theme");
	if(theme) {
		return "/ide/images/"+theme+"/theme.json";
	}

	var wtkTheme = WebStorage.get("wtkTheme");
	if(wtkTheme) {
		return "/ide/images/"+wtkTheme+"/theme.json";
	}

	return WThemeManager.themeURL;
}

WThemeManager.getDefaultFont = function(themeJson) {
	var font = null;
	var global = themeJson.global;
	if(global && global.font) {
		if(browser.isWindows()) {
			font = global.font.windows;
		}
		else if(browser.isLinux()) {
			font = global.font.linux;
		}
		else if(browser.isMacOSX()) {
			font = global.font.macosx;
		}
	}

	return font;
}

WThemeManager.applyDefaultFont = function(style, defaultFont) {
	var font = style.font || {};
	
	if(defaultFont) {
		if(!font.family) {
			font.family = defaultFont.family || "sans";
		}

		if(!font.size) {
			font.size = defaultFont.size || 10;
		}

		if(!font.weight) {
			font.weight = "normal";
		}
	}

	style.fontInfo = font;
	style.fontSize = font.size;
	style.font =font.weight + " " + font.size + "px " + font.family;
	
	return;
}

WThemeManager.loadTheme = function(themeURL, themeJson) {
	var path = dirname(themeURL);
	var imagesURL = path + "/" + (themeJson.imagesURL ? themeJson.imagesURL : "images.json");
	WThemeManager.setImagesURL(imagesURL);

	var font = WThemeManager.getDefaultFont(themeJson);
	var widgetsTheme = themeJson.widgets;

	for(var name in widgetsTheme) {
		var widgetTheme = widgetsTheme[name];
		for(var state in widgetTheme) {
			var style = widgetTheme[state];
			if(typeof style !== "object") continue;

			if(style.bgImage) {
				style.bgImage = WThemeManager.getImage(style.bgImage);
			}
			if(style.fgImage) {
				style.fgImage = WThemeManager.getImage(style.fgImage);
			}
			if(style.bgImageTips) {
				style.bgImageTips = WThemeManager.getImage(style.bgImageTips);
			}
			if(style.checkedImage) {
				style.checkedImage = WThemeManager.getImage(style.checkedImage);
			}
			if(style.uncheckedImage) {
				style.uncheckedImage = WThemeManager.getImage(style.uncheckedImage);
			}
			WThemeManager.applyDefaultFont(style, font);
		}
	}

	WThemeManager.themes = widgetsTheme;
	WThemeManager.themesLoaded = true;
	WThemeManager.jqueryTheme = themeJson.jqueryTheme;
	WThemeManager.codeEditorTheme = themeJson.codeEditorTheme;

	if(WThemeManager.overrideThemeData) {
		WThemeManager.mergeTheme(WThemeManager.overrideThemeData);
	}

	return;
}

WThemeManager.setOverrideThemeData = function(widgetsTheme) {
	if(WThemeManager.themesLoaded) {
		WThemeManager.mergeTheme(widgetsTheme);
	}else {
		WThemeManager.overrideThemeData = widgetsTheme;
	}

	return;
}

WThemeManager.mergeTheme = function(widgetsTheme) {
	for(var name in widgetsTheme) {
		var widgetTheme = widgetsTheme[name];
		for(var state in widgetTheme) {
			var style = widgetTheme[state];
			if(typeof style !== "object") continue;

			if(style.bgImage) {
				style.bgImage = WThemeManager.createImage(style.bgImage);
			}
			if(style.fgImage) {
				style.fgImage = WThemeManager.createImage(style.fgImage);
			}
			if(style.bgImageTips) {
				style.bgImageTips = WThemeManager.createImage(style.bgImageTips);
			}
			if(style.checkedImage) {
				style.checkedImage = WThemeManager.createImage(style.checkedImage);
			}
			if(style.uncheckedImage) {
				style.uncheckedImage = WThemeManager.createImage(style.uncheckedImage);
			}
			if(style.font) {
				style.fontSize = getFontSizeInFont(style.font);
				if(style.fontSize) {
					style.fontSize = 12;
				}
			}
		}
	
		WThemeManager.themes[name] = widgetsTheme[name]
	}

	return;
}

WThemeManager.getCodeEditorTheme = function() {
	return WThemeManager.codeEditorTheme;
}

WThemeManager.getJQueryTheme = function() {
	return WThemeManager.jqueryTheme;
}

WThemeManager.loadThemeURL = function(url) {
	if(!url) {
		url = WThemeManager.getThemeURL();
	}

	httpGetJSON(url, function onThemeData(themeJson) {
		WThemeManager.loadTheme(url, themeJson);
		var wm = WWindowManager.getInstance();
		if(wm) {
			wm.postRedraw();
		}
	});

	return;
}

WThemeManager.exist = function(name) {
	return WThemeManager.themes[name] != null;
}

WThemeManager.dump = function() {
	var str = JSON.stringify(WThemeManager.themes, null, "\t");
	console.log(str);

	return;
}

WThemeManager.get = function(name, noDefault) {
	name = name.toString();

	var theme = WThemeManager.themes[name];

	if(!theme) {
		if(noDefault) {
			WThemeManager.themes[name] = WThemeManager.newTheme();
			theme = WThemeManager.themes[name];
		}
		else {
			theme = WThemeManager.defaultTheme;
		}
	}

	return theme;
}

WThemeManager.set = function(name, state, font, textColor, fillColor, lineColor, bgImage) {
	if(state === null) {
		WThemeManager.setOneState(name, WWidget.STATE_NORMAL, font, textColor, fillColor, lineColor, bgImage);
		WThemeManager.setOneState(name, WWidget.STATE_ACTIVE, font, textColor, fillColor, lineColor, bgImage);
		WThemeManager.setOneState(name, WWidget.STATE_OVER, font, textColor, fillColor, lineColor, bgImage);
		WThemeManager.setOneState(name, WWidget.STATE_SELECTED, font, textColor, fillColor, lineColor, bgImage);
		WThemeManager.setOneState(name, WWidget.STATE_DISABLE, font, textColor, fillColor, lineColor, bgImage);
	}
	else {
		WThemeManager.setOneState(name, state, font, textColor, fillColor, lineColor, bgImage);
	}

	return;
}

WThemeManager.setOneState = function(name, state, font, textColor, fillColor, lineColor, bgImage) {
	name = name.toString();

	var theme = WThemeManager.themes[name];

	if(!theme) {
		theme = WThemeManager.newTheme();
		WThemeManager.themes[name] = theme;
	}

	if(font) {
		theme[state].font = font;
	}
	
	if(textColor) {
		theme[state].textColor = textColor;
	}

	if(bgColor) {
		theme[state].fillColor = bgColor;
	}

	if(lineColor) {
		theme[state].lineColor = lineColor;
	}

	if(bgImage) {
		theme[state].bgImage = bgImage;
	}

	return;
}


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
WThemeManager.themeURL = "/ide/images/light/theme.json";

WThemeManager.setImagesURL = function(imagesURL) {
	WThemeManager.imagesURL = imagesURL;

	return;
}

WThemeManager.getIconImageURL = function() {
	return WThemeManager.imagesURL;
}

WThemeManager.getBgImageURL = function() {
	return WThemeManager.imagesURL;
}

WThemeManager.imagesCache = {};
WThemeManager.getImage = function(url) {
	var image = WThemeManager.imagesCache[url];
	if(!image) {
		image = new WImage();
		image.setImageSrc(url);
	}

	return image;
}

WThemeManager.getIconImage = function(name) {
	if(!WThemeManager.imagesURL) {
		return null;
	}

	var url = WThemeManager.imagesURL + "#" + name + ".png";
	return this.getImage(url);
}

WThemeManager.getBgImage = function(name) {
	if(!WThemeManager.imagesURL) {
		return null;
	}
	
	var url = WThemeManager.imagesURL + "#" + name;
	return this.getImage(url);
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

WThemeManager.loadTheme = function(themeURL, themeJson) {
	var path = dirname(themeURL);
	var imagesURL = path + "/" + (themeJson.imagesURL ? themeJson.imagesURL : "images.json");
	WThemeManager.setImagesURL(imagesURL);

	var widgetsTheme = themeJson.widgets;

	for(var name in widgetsTheme) {
		var widgetTheme = widgetsTheme[name];
		for(var state in widgetTheme) {
			var style = widgetTheme[state];
			if(style.bgImage) {
				style.bgImage = WThemeManager.getBgImage(style.bgImage);
			}
			if(style.font) {
				style.fontSize = getFontSizeInFont(style.font);
				if(style.fontSize) {
					style.fontSize = 12;
				}
			}
		}
	}

	WThemeManager.themes = widgetsTheme;
	WThemeManager.jqueryTheme = themeJson.jqueryTheme;
	WThemeManager.codeEditorTheme = themeJson.codeEditorTheme;

	return;
}

WThemeManager.getCodeEditorTheme = function() {
	return WThemeManager.codeEditorTheme;
}

WThemeManager.getJQueryTheme = function() {
	return WThemeManager.jqueryTheme;
}

WThemeManager.loadThemeURL = function() {
	var url = WThemeManager.getThemeURL();

	httpGetJSON(url, function onThemeData(themeJson) {
		WThemeManager.loadTheme(url, themeJson);
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


/*
 * File:    locales.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   functions to handle locale strings.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

Locales = {};

Locales.getLang = function() {
	var lang = navigator.language || navigator.userLanguage;

	return lang;
}

Locales.getLanguageName = Locales.getLang;

Locales.setTextTable = function(textTable) {
	Locales.textTable = textTable;

	return;
}

Locales.setLanguageSupportList = function(langList) {
    Locales.languageList = langList;
}

Locales.getLanguageSupportList = function() {
    return Locales.languageList;
}

Locales.getTextTable = function() {
	return Locales.textTable;
}

Locales.addTextTable = function(textTable) {
	if(!Locales.textTable) {
		Locales.textTable = {};
	}

	for(var key in textTable) {
		Locales.textTable[key] = textTable[key];
	}

	return;
}

Locales.getText = function(text) {
	var str = null;
	
	if(Locales.textTable) {
		str = Locales.textTable[text];
		if(!str) {
			Locales.textTable[text] = text;
		}
	}

	return str ? str : text;
}

window.dappGetText = function(text) {	
	return Locales.getText(text);
}

window.dappGetTitle = function(text) {	
	return dappGetText(text) + ":";
}

window.cantkGetLocale = function() {
	return Locales.getLang();
}
window.Locales = Locales;


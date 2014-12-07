/*
 * File: config.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var WTK_HOST_NAME = "http://www.drawapp8.com";

function cantkGetHostName() {
	return "";//WTK_HOST_NAME;
}

function cantkSetHostName(name) {
	WTK_HOST_NAME = name;
	return;
}

function cantkGetImageRoot() {
	return cantkGetHostName() + "/base/images/";
}

function cantkGetImageURL(name) {
	return cantkGetHostName() + "/base/images/" + name;
}


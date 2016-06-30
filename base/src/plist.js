/*
 * File:    plist.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief:   plist parser
 * 
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
function PList() {
	this.options = {};
}

PList.ST_NONE = 0;
PList.ST_TEXT = 1;
PList.ST_END_TAG = 2;
PList.ST_START_TAG = 3;

PList.prototype.onStateChanged = function(state, str) {
	switch(this._parseState) {
		case PList.ST_START_TAG: {
			this.tagName = str;
			break;
		}
		case PList.ST_END_TAG: {
			this.tagName = null;
			break;
		}
		case PList.ST_TEXT: {
			if(this.tagName === "key") {
				this._propName = str;
			}
			else if(this.tagName === "real") {
				this.options[this._propName] = parseFloat(str);
			}
			else if(this.tagName === "integer") {
				this.options[this._propName] = parseInt(str);
			}
			else if(this.tagName === "string") {
				this.options[this._propName] = str;
			}

			break;
		}
	}

	this._parseState = state;
}

PList.prototype.dump = function() {
	console.log(JSON.stringify(this.options, null, "\t"))
}

PList.prototype.get = function(name) {
	if(name) {
		return this.options[name];
	}
	else {
		return this.options;
	}
}

PList.prototype.parse = function(buff) {
	var str = "";
	var n = buff.length;
	this.options = {};

	this._parseState = PList.ST_NONE;
	for(var i = 0; i < n; i++) {
		var c = buff[i];
		if(c === "<") {
			if(buff[i+1] === "/") {
				i++;
				this.onStateChanged(PList.ST_END_TAG, str);
			}
			else {
				this.onStateChanged(PList.ST_START_TAG, str);
			}
			str = "";
		}
		else if(c === ">") {
			this.onStateChanged(PList.ST_TEXT, str);
			str = "";
		}
		else {
			str += c;
		}
	}

	return this.options;
}


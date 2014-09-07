/*
 * File:   ui-suggestion.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Suggestion Input
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function SuggestionProvider() {
	this.query = function(key, onDone) {
	}

	this.init = function(options) {
	}

	return;
}

function StaticSuggestionProvider() {
	this.init = function(options) {
		if(typeof options == "string") {
			options = options.split("\n");
		}

		this.options = options;
		if(this.options) {
			this.options.sort();
		}

		return;
	}

	this.query = function(key, onDone) {
		if(!key || !this.options) {
			onDone([]);
			return;
		}

		function compareStr(str1, str2) {
			if(str1.indexOf(str2) == 0) {
				return 0;
			}

			if(str1 < str2) {
				return -1;
			}
			else {
				return 1;
			}
		}

		var arr = [];
		var start = this.options.binarySearch(key, compareStr);
		
		if(start >= 0) {
			var n = this.options.length;
			
			for(;start >= 0; start--) {
				var iter = this.options[start];
				if(iter.indexOf(key) !== 0) {
					start = start+1;
					break;
				}
			}

			for(var i = start; i < n; i++) {
				var iter = this.options[i];
				if(iter.indexOf(key) === 0) {
					arr.push(iter);
				}
				else {
					break;
				}
			}
		}

		onDone(arr);

		return;
	}

	return;
}

function createSuggestionProvider(type, args) {
	var suggestionProvider = null;
	if(type === "static") {
		suggestionProvider = new StaticSuggestionProvider();
	}

	if(suggestionProvider) {
		suggestionProvider.init(args);
	}

	return suggestionProvider;
}

function UISuggestion() {
	return;
}

UISuggestion.prototype = new UIListView();
UISuggestion.prototype.isUISuggestion = true;

UISuggestion.prototype.initUISuggestion = function(type) {
	this.initUIListView(type, 5, 100, null);	
	this.maxSuggestionItems = 10;
	this.suggestionProviderParams = "";
	this.suggestionProviderName = "static";

	return this;
}

UISuggestion.prototype.onInit = function() {
	this.suggestionProvider = createSuggestionProvider(this.suggestionProviderName, this.suggestionProviderParams);

	return;
}

UISuggestion.prototype.setSuggestionProvider = function(suggestionProvider) {
	this.suggestionProvider = suggestionProvider;

	return;
}

UISuggestion.prototype.getSuggestionProvider = function() {
	return this.suggestionProvider;
}

//override this.
UISuggestion.prototype.onSuggestionSelected = function(str) {

}

UISuggestion.prototype.showSuggestion = function(suggestions) {
	var data = {children:[]};
	
	if(suggestions.length > this.maxSuggestionItems) {
		suggestions.length = this.maxSuggestionItems;
	}

	for(var i = 0; i < suggestions.length; i++) {
		var item = {children:[]};
		var value = suggestions[i];
		item.children.push({text: value});
		data.children.push(item);
	}
		
	this.bindData(data, null, true);

	return;

}

UISuggestion.prototype.onSuggestionShow = function() {
}

UISuggestion.prototype.query = function(key) {
	var me = this;
	this.suggestionProvider.query(key, function(arr) {
		me.showSuggestion(arr);
		me.onSuggestionShow();
	});
}

function UISuggestionCreator() {
	var args = ["ui-suggestion", "ui-suggestion", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISuggestion();
		return g.initUISuggestion(this.type);
	}
	
	return;
}

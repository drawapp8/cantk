/*
 * File: shape_factory.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: register all built-in shapes.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var C_CREATE_FOR_USER = 0;
var C_CREATE_FOR_ICON = 1;
var C_CREATE_FOR_PROGRAM = 2;
var C_CATE_RECENT_USED = "Recent Used";

function ShapeCreator(type, name, icon, visible) {
	this.type = type;
	this.icon = icon;
	this.name = name;
	this.visible = visible;
	this.useCount = 0;// cantkLocalStorageGetInt(type);

	this.incUseCount = function() {
		this.useCount++;

		//cantkLocalStorageSet(this.type, this.useCount);

		return;
	}

	this.isVisibleToUser = function() {
		return this.visible;
	}
	
	this.getID = function() {
		return this.type;
	}
	
	this.getIcon = function() {
		return this.icon;
	}
	
	this.getName = function() {
		return this.name;
	}

	this.createIconShape = function() {
		if(!this.iconShape) {
			this.iconShape = this.createShape(C_CREATE_FOR_ICON);
		}
		
		return this.iconShape;
	}
	
	this.createShape = function(createReason) {
		return null;
	}
	
	return;
}

function ShapeFactory() {
	this.defaultCategory = null;
	this.recentUsed = [];
	this.creators = [];
	this.categories = {};
	this.categoryNames = [];
	this.diagramTypes = [];
	this.OnCategoryChangeListeners = {};

	this.setOnCategoryChangeListener = function(category, listener) {
		this.OnCategoryChangeListeners[category] = listener;

		return;
	}

	this.setDefaultCategory = function(defaultCategory) {
		this.defaultCategory = defaultCategory;
		var listener = this.OnCategoryChangeListeners[defaultCategory];

		if(listener) {
			listener(defaultCategory);
		}

		return;
	}

	this.getDiagramTypes = function() {
		return this.diagramTypes;
	}

	this.addDiagramType = function(type, defaultCategory) {
		var obj = {name:type, defaultCategory:defaultCategory};

		this.diagramTypes.push(obj);

		return;
	}

	this.removeCategoryName = function(name) {
		this.categoryNames.remove(name);

		return;
	}

	this.removeShapeCreator = function(type, category) {
		var c = this.find(type);
		var creators = this.categories[category];
		if(c) {
			this.creators.remove(c);

			if(creators) {
				creators.remove(c);
				if(creators.length === 0) {
				//	this.categoryNames.remove(category);
				}
			}
		}

		return;
	}

	this.isPlacehodler = function(category) {
		return category === "---";
	}

	this.addPlaceholder = function() {
		this.categoryNames.push("---");

		return;
	}

	this.loadRecentUsedShapeCreators = function() {
		var types = localStorage.recentUsed ? JSON.parse(localStorage.recentUsed) : [];

		for(var i = 0; i < types.length; i++) {
			var type = types[i];
			var creator = this.find(type);
			if(creator) {
				this.addShapeCreator(creator, C_CATE_RECENT_USED);
				this.recentUsed.push(type);
			}
		}

		return;
	}

	this.addRecentUsedShapeCreator = function(type) {
		var creator = this.find(type);
		if(creator) {
			this.recentUsed.remove(type);
			this.recentUsed.push(type);

			if(this.recentUsed.length > 10) {
				this.recentUsed.shift();
			}
			localStorage.recentUsed = JSON.stringify(this.recentUsed);

			this.addShapeCreator(creator, C_CATE_RECENT_USED);
		}
	}

	this.addShapeCreator = function(creator, category) {
		if(category != C_CATE_RECENT_USED) {
			this.creators.push(creator);
		}

		if(category) {
			if(!this.defaultCategory) {
				this.setDefaultCategory(category);
			}

			if(!this.categories[category]) {
				this.categories[category] = [];

				if(category == C_CATE_RECENT_USED) {
					this.categoryNames.unshift(category);
				}
				else {
					this.categoryNames.push(category);
				}
			}
			
			this.categories[category].remove(creator);
			if(category == C_CATE_RECENT_USED) {
				this.categories[category].unshift(creator);
			}
			else {
				this.categories[category].push(creator);
			}
		}
//		console.log("Register: category=" + category + " id=" + creator.getID());

		return;
	}

	this.getCategoryNames = function() {
		return this.categoryNames;
	}
	
	this.sortDefaultCategoryByUseCount = function() {
		return;
		var arr = this.categories[this.defaultCategory];
	
		if(arr && arr.length > 30) {
			arr.sort(function(a, b) { 
				return b.useCount - a.useCount;
			});
		}

		return;
	}

	this.getDefaultCategory = function() {
		return this.categories[this.defaultCategory];
	}

	this.getByCategory = function(category) {
		return this.categories[category];
	}
	
	this.find = function(type) {
		for(var i = 0; i < this.creators.length; i++) {
			var c = this.creators[i];
			if(c.getID() === type) {
				return c;
			}
		}
		
		return null;
	}

	this.createShape = function(type, createReason) {
		var c = this.find(type);
		if(c) {
			c.incUseCount();
			return c.createShape(createReason);
		}
		else {
			return null;
		}
	}
	
	return;
}

var gShapeFactory = null;

function ShapeFactoryGet() {
	if(!gShapeFactory) {
		gShapeFactory = new ShapeFactory();

		setTimeout(function() {
			gShapeFactory.loadRecentUsedShapeCreators();
		}, 2000);
	}

	return gShapeFactory;
}

function dappSetDefaultCategory(name) {
	return ShapeFactoryGet().setDefaultCategory(name);
}

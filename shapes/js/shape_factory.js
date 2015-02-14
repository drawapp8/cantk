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

function ShapeCreator(type, name, icon, visible) {
	this.type = type;
	this.icon = icon;
	this.name = name;
	this.visible = visible;

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
	this.listeners = [];

	ShapeFactory.CATEGORY_RECENT_USED = "Recent Used";
	ShapeFactory.CATEGORY_USER_COMPONENTS = "User Component";

	this.setDefaultCategory = function(defaultCategory) {
		this.defaultCategory = defaultCategory;

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
		var creator = this.find(type);
		var categoryCreators = this.categories[category];
		if(creator) {
			this.creators.remove(creator);
			if(categoryCreators) {
				categoryCreators.remove(creator);
				this.notifyChanged("remove", category, creator);
			}
		}

		return;
	}

	this.isPlacehodler = function(category) {
		return category === "---";
	}
	
	this.isUserComponents = function(category) {
		return category === ShapeFactory.CATEGORY_USER_COMPONENTS;
	}

	this.addPlaceholder = function() {
		this.categoryNames.push("---");

		return;
	}

	this.loadRecentUsedShapeCreators = function() {
		var str = WebStorage.get("recentUsed");
		var types = str ? JSON.parse(str) : [];

		for(var i = 0; i < types.length; i++) {
			var type = types[i];
			var creator = this.find(type);
			if(creator) {
				this.addShapeCreator(creator, ShapeFactory.CATEGORY_RECENT_USED);
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
			WebStorage.set("recentUsed", JSON.stringify(this.recentUsed));

			this.addShapeCreator(creator, ShapeFactory.CATEGORY_RECENT_USED);
		}
	}

	this.addShapeCreator = function(creator, category) {
		this.notifyChanged("add", category, creator);

		if(category != ShapeFactory.CATEGORY_RECENT_USED) {
			this.creators.push(creator);
		}

		if(category) {
			if(!this.defaultCategory) {
				this.setDefaultCategory(category);
			}

			if(!this.categories[category]) {
				this.categories[category] = [];

				if(category == ShapeFactory.CATEGORY_RECENT_USED) {
					this.categoryNames.unshift(category);
				}
				else {
					this.categoryNames.push(category);
				}
			}
			
			this.categories[category].remove(creator);
			if(category == ShapeFactory.CATEGORY_RECENT_USED) {
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

	this.createShape = function(type, createReason, exactly) {
		if(!type) {
			return null;
		}

		var c = this.find(type);
		if(c) {
			return c.createShape(createReason);
		}
		
		console.log("not found type " + type + ", create ui-unkown instead.");

		if(!exactly) {
			c = this.find("ui-unkown");
			if(c) {
				return c.createShape(createReason);
			}

			return null;
		}
	}

	this.addListener = function(func) {
		this.listeners.push(func);

		return this;
	}

	this.removeListener = function(func) {
		this.listeners.remove(func);

		return this;
	}
	
	this.notifyChanged = function(type, category, creator) {
		var listeners = this.listeners;
		for(var i = 0; i < listeners.length; i++) {
			var func = listeners[i];
			if(func) {
				func(type, category, creator);
			}
		}

		return;
	}

	return;
}

ShapeFactory.instance = null;

ShapeFactory.getInstance = function() {
	if(!ShapeFactory.instance) {
		ShapeFactory.instance = new ShapeFactory();
		setTimeout(function() {
			ShapeFactory.instance.loadRecentUsedShapeCreators();
		}, 2000);
	}

	return ShapeFactory.instance;
}


function ShapeFactoryGet() {
	return ShapeFactory.getInstance();
}

function dappSetDefaultCategory(name) {
	return ShapeFactory.getInstance().setDefaultCategory(name);
}

function cantkRegShapeCreator(creator, category) {
	return ShapeFactory.getInstance().addShapeCreator(creator, category);
}

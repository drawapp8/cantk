/*
 * File: app_base.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: the base application.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function AppBase(canvasID, type) {
	this.win  = null;
	this.view = null;
	this.type = type;
	this.minHeight = 0;

	AppBase.type = type;

	this.getView = function() {
		return this.view;
	}

	this.setMinHeight = function(minHeight) {
		this.minHeight = minHeight;

		return;
	}

	this.exec = function(cmd) {
		cmd.doit();
		delete cmd;

		return;
	}

	this.init = function() {
		if(this.type === AppBase.TYPE_INLINE_EDITOR) {
			this.isInlineEdit = true;
		}
		else {
			this.isInlineEdit = false;
		}

		this.canvas	 = CantkRT.getMainCanvas();
		this.adjustCanvasSize();
		this.manager = WWindowManager.create(this, this.canvas);
		canvasAttachManager(this.canvas, this.manager, this);
		
		return;
	}

	this.onShapeSelected = function(shape) {

		return;
	}

	this.onSizeChanged = function() {
		return;
	}

	this.adjustCanvasSize = function() {
		var w = 0;
		var h = 0;
		var canvas = this.canvas;
		var view = cantkGetViewPort();
		
		switch(this.type) {
			case AppBase.TYPE_WEBAPP: {
				w = view.width;
				h = view.height;
				break;
			}
			case AppBase.TYPE_PREVIEW: {
				w = view.width;
				h = view.height;
				this.setMinHeight(1500);
				break;
			}
			default: {
				if(!this.minHeight) {
					this.setMinHeight(600);
				}
				w  = view.width - 20;
				h = view.height * 1.5;
				break;
			}
		}

		h = Math.max(h, this.minHeight);

		this.resizeCanvasTo(w, h);

		return;
	}
	
	this.resizeCanvasTo = function(w, h) {
		var canvas = this.canvas;

		canvas.width  = w;
		canvas.height = h;
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.position = "absolute";

		return;
	}

	this.loadData = function(data)  {
		return this.view.loadFromJson(data);
	}

	this.exitApp = function() {
		console.log("exitApp");

		return;
	}

	this.init();

	return this;
}

AppBase.isDevApp = function() {
	return AppBase.type === AppBase.TYPE_PC_EDITOR 
		|| AppBase.type === AppBase.TYPE_MOBILE_EDITOR 
		|| AppBase.type === AppBase.TYPE_INLINE_EDITOR;
}

AppBase.TYPE_WEBAPP = 1;
AppBase.TYPE_PREVIEW = 2;
AppBase.TYPE_PC_VIEWER = 3;
AppBase.TYPE_PC_EDITOR = 4;
AppBase.TYPE_MOBILE_EDITOR = 5;
AppBase.TYPE_INLINE_EDITOR = 6;

/*
 * File:   ui-list-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List View (Scrollable)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListView() {
	return;
}

UIListView.prototype = new UIVScrollView();
UIListView.prototype.isUIList = true;
UIListView.prototype.isUILayout = true;
UIListView.prototype.isUIListView = true;
UIListView.prototype.setItemHeight = UIList.prototype.setItemHeight;
UIListView.prototype.sortChildren = UIList.prototype.sortChildren;
UIListView.prototype.initUIList = UIList.prototype.initUIList;
UIListView.prototype.shapeCanBeChild = UIList.prototype.shapeCanBeChild;
UIListView.prototype.paintSelfOnly = UIList.prototype.paintSelfOnly;
UIListView.prototype.fixListItemImage = function(item, position) {};
UIListView.prototype.afterChildAppended = UIList.prototype.afterChildAppended;
UIListView.prototype.childIsBuiltin = UIList.prototype.childIsBuiltin;
UIListView.prototype.onKeyUpRunning = UIList.prototype.onKeyUpRunning;
UIListView.prototype.onKeyDownRunning = UIList.prototype.onKeyDownRunning;
UIListView.prototype.getValue = UIList.prototype.getValue;
UIListView.prototype.setValue = UIList.prototype.setValue;

UIListView.UPDATE_STATUS_NONE = 0;
UIListView.UPDATE_STATUS_TIPS = 1;
UIListView.UPDATE_STATUS_SYNC = 2;

UIListView.prototype.beginUpdate = function() {
	this.updateStatus = UIListView.UPDATE_STATUS_SYNC;
	var statusItem = this.findChildByName("ui-list-item-update-status");
	if(statusItem) {
		var waitBox = statusItem.findChildByName("ui-wait-box");
		if(waitBox) {
			waitBox.show();
			waitBox.start();
		}

		var loading = statusItem.findChildByName("ui-label-loading");
		if(loading) {
			loading.setText(dappGetText("Loading..."));
		}
	}

	return;
}

UIListView.prototype.endUpdate = function() {
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;
	var statusItem = this.findChildByName("ui-list-item-update-status");
	if(statusItem) {
		var waitBox = statusItem.findChildByName("ui-wait-box");
		if(waitBox) {
			waitBox.stop();
		}
		this.setLastUpdateTime(new Date());
	}

	return;
}

UIListView.prototype.initUIListView = function(type, border, itemHeight, bg) {
	this.initUIList(type, border, itemHeight, bg);
	this.initUIVScrollView(type, 0, bg, null);	
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;
	this.addEventNames(["onUpdateData"]);
	this.setTextType(Shape.TEXT_INPUT);

	return this;
}

UIListView.prototype.onModeChanged = function() {
	this.offset = 0;
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;

	return;
}

UIListView.prototype.updateDone = function() {
	var list = this;

	list.endUpdate();
	setTimeout(function() {
		list.relayoutChildren();
		list.postRedraw();
	}, 1000);

	return;
}

UIListView.prototype.callOnUpdateData = function() {
	this.callOnUpdateDataHandler();

	this.beginUpdate();
	var listView = this;
	setTimeout(function() {
		listView.updateDone();
	}, 10000);

	return true;
}

UIListView.prototype.setLastUpdateTime = function(lastUpdateTime) {
	var tipsItem = this.findChildByName("ui-list-item-update-tips");

	if(tipsItem && lastUpdateTime) {
		var str = "";
		var now = new Date();
		
		if(now.getFullYear() === lastUpdateTime.getFullYear() 
			&& now.getDate() === lastUpdateTime.getDate()
			&& now.getMonth() === lastUpdateTime.getMonth()) {
			
			str = dappGetText("Today");
		}
		else {
			str = lastUpdateTime.getMonth() + "-" + lastUpdateTime.getDate();
		}

		str = str + " " + lastUpdateTime.getHours() + ":" + lastUpdateTime.getMinutes();

		var updateTime = tipsItem.findChildByName("ui-label-update-time");
		if(updateTime) {
			updateTime.setText(str);
		}
		
		var updateTime = tipsItem.findChildByName("ui-label-update-time");
		if(updateTime) {
			updateTime.setText(str);
		}
		
		var updateTimeTips = tipsItem.findChildByName("ui-label-update-time-tips");
		if(updateTimeTips) {
			updateTimeTips.setText(dappGetText("Last Update:"));
		}
	}

	return;
}

UIListView.prototype.onDrag = function(offset) {
	var tipsItem = this.findChildByName("ui-list-item-update-tips");

	if(tipsItem) {
		var indicator = tipsItem.findChildByName("ui-image");
		var tips = tipsItem.findChildByName("ui-label-tips");

		if(indicator) {
			
			if(offset < -115) {
				if(indicator.rotation === 0) {
					function animationRotate() {
						var angle = indicator.rotation + 0.2 * Math.PI;
						if(angle > Math.PI) {
							angle = Math.PI;
						}
						indicator.setRotation(angle);
						if(angle < Math.PI) {
							setTimeout(animationRotate, 50);
						}
						indicator.postRedraw();

						return;
					}
					
					animationRotate();
					if(tips) {
						tips.setText(dappGetText("Release To Update."));
					}
				}
			}
			else {
				indicator.setRotation(0);
				if(tips) {
					tips.setText(dappGetText("Pull To Update."));
				}
			}
		}
	}

	return;
}

UIListView.prototype.onOutOfRange = function(offset) {

	if(offset < -115) {
		this.callOnUpdateData();
		this.relayoutChildren();
	}

	return;
}

UIListView.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var border = this.getHMargin();

	var x = border;
	var y = border;
	var w = this.w - 2 * border;
	var h = this.itemHeight;
	var n = this.children.length;
	var itemHeightVariable = this.itemHeightVariable;
	var range = this.getScrollRange();
	var pageSize = this.getPageSize();
	var userMovable = true;

	
	for(var i = 0; i < n; i++) {
		var config = {};
		var isBuiltin = false;
		var child = this.children[i];
		
		if(itemHeightVariable || child.isHeightVariable()) {
			h = child.measureHeight(this.itemHeight);
		}
		else {
			h = this.itemHeight;
		}

		if(child.name === "ui-list-item-update-tips") {
			if(this.mode !== Shape.MODE_EDITING) {
				child.move(x, -h);
				child.x = x;
				child.y = -h;
				child.w = w;
				child.h = h;
				child.setUserMovable(false);
				child.setUserResizable(false);
				child.setVisible(this.updateStatus !== UIListView.UPDATE_STATUS_TIPS);

				continue;
			}
			else {
				child.setVisible(true);
			}
			isBuiltin = true;
		}
		else if(child.name === "ui-list-item-update-status") {
			if(this.mode !== Shape.MODE_EDITING) {
				if(this.updateStatus !== UIListView.UPDATE_STATUS_SYNC) {
					child.setVisible(false);
				}else {
					child.setVisible(true);
				}
			}
			else {
				child.setVisible(true);
			}
			isBuiltin = true;
		}
		
		if(!child.visible) {
			continue;
		}

		animatable =  child.isVisible() && !isBuiltin && (y < this.h) && (animHint || this.mode === Shape.MODE_EDITING);
		if(animatable && (x != child.x || y != child.y || w != child.w || h != child.h)) {
			config.xStart = child.x;
			config.yStart = child.y;
			config.wStart = child.w;
			config.hStart = child.h;
			config.xEnd = x;
			config.yEnd = y;
			config.wEnd = w;
			config.hEnd = h;

			config.delay = 10;
			config.duration = 1000;
			config.element = child;
			config.onDone = function (el) {
				el.relayoutChildren();
			}
			child.animate(config);
		}
		else {
			child.move(x, y);
			child.setSize(w, h);
			child.relayoutChildren();
		}

		child.widthAttr = UIElement.WIDTH_FILL_PARENT;
		if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
			child.heightAttr = UIElement.HEIGHT_FIX;
		}
		child.setUserMovable(userMovable);
		child.setUserResizable(itemHeightVariable || child.isHeightVariable());

		y += h;
	}

	return;
}

UIListView.prototype.drawText = UIList.prototype.drawText;

UIListView.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);
	
	if(this.mode === Shape.MODE_EDITING) {
		this.drawPageDownUp(canvas);
	}

	return;
}

function UIListViewCreator(border, itemHeight, bg) {
	var args = ["ui-list-view", "ui-list-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListView();
		return g.initUIListView(this.type, border, itemHeight, bg);
	}
	
	return;
}


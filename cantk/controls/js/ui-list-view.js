/*
 * File:   ui-list-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List View (Scrollable)
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIListView
 * @extends UIList
 * 列表视图。和UIList一样，只是可以滚动。建议使用UIListViewX。
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

UIListView.prototype.saveProps = UIList.prototype.saveProps;
UIListView.prototype.beginUpdate = function() {
	this.updateStatus = UIListView.UPDATE_STATUS_SYNC;
	var statusItem = this.findChildByName("ui-list-item-update-status");
	if(statusItem) {
		var waitBox = statusItem.findChildByName("ui-wait-box");
		if(waitBox) {
			waitBox.show();
		}

		var loading = statusItem.findChildByName("ui-label-loading");
		if(loading) {
			loading.setText(dappGetText("Loading..."));
		}
	}

	return;
}

UIListView.prototype.drawBgImage = function(canvas) {
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	UIElement.prototype.drawBgImage.call(this, canvas);

	return this;
}

UIListView.prototype.endUpdate = function() {
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;
	var statusItem = this.findChildByName("ui-list-item-update-status");
	if(statusItem) {
		this.setLastUpdateTime(new Date());
	}
	this.relayoutChildren(true);

	return;
}

UIListView.prototype.initUIListView = function(type, border, itemHeight, bg) {
	this.spacer = 0;
	this.initUIList(type, border, itemHeight, bg);
	this.initUIVScrollView(type, 0, bg, null);	
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;
	this.addEventNames(["onUpdateData", "onScrollOutOfRange"]);
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
		if(list.parentShape) {
			list.relayoutChildren();
			list.postRedraw();
		}
	}, 1000);

	return;
}

UIListView.prototype.callOnUpdateData = function() {
	this.callOnUpdateDataHandler();

	this.beginUpdate();
	var listView = this;
	setTimeout(function() {
		if(listView.parentShape) {
			listView.updateDone();
		}
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

UIListView.prototype.whenScrollOutOfRange = function(offset) {

	if(offset < -115) {
		this.callOnUpdateData();
		this.relayoutChildren();
	}

	this.callOnScrollOutOfRangeHandler(offset);

	return;
}

UIListView.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var hMargin = this.getHMargin();
	var vMargin = this.getVMargin();

	var x = hMargin;
	var y = vMargin;
	var w = this.getWidth(true);
	var h = this.itemHeight;
	var itemHeightVariable = this.itemHeightVariable;
	var range = this.getScrollRange();
	var pageSize = this.getPageSize();
	var userMovable = true;

	
	var i = 0;
	var spacer = this.spacer || 0;
	var n = this.children.length;
	var children = this.children;
	for(var k = 0; k < n; k++) {
		var child = children[k];
		
		var config = {};
		var isBuiltin = false;
		if(child.removed || !child.visible) continue;
		
		if(itemHeightVariable || child.isHeightVariable()) {
			h = child.measureHeight(this.itemHeight);
		}
		else {
			h = this.itemHeight;
		}

		if(child.name === "ui-list-item-update-tips") {
			if(!this.isInDesignMode()) {
				child.move(x, -h);
				child.left = x;
				child.top = -h;
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
			if(!this.isInDesignMode()) {
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

		animatable =  child.isVisible() && !isBuiltin && (y < this.h) && (animHint || this.isInDesignMode());
		if(animatable && (x != child.left || y != child.top || w != child.w || h != child.h)) {
			child.setSize(w, h);

			config.xStart = child.left;
			config.yStart = child.top;
			config.wStart = child.w;
			config.hStart = child.h;
			config.xEnd = x;
			config.yEnd = y;
			config.wEnd = w;
			config.hEnd = h;

			config.delay = 10;
			config.duration = 1000;
			config.element = child;
			config.onDone = function (name) {
				this.relayoutChildren();
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

		y += h + spacer;
		i++;
	}

	return;
}

UIListView.prototype.drawText = UIList.prototype.drawText;

UIListView.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);
	
	if(this.isInDesignMode()) {
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

ShapeFactoryGet().addShapeCreator(new UIListViewCreator(5, 114, null));


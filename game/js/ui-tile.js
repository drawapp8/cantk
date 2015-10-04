/*
 * File:   ui-tile.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  tile shape
 * 
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

function UITile() {
	return;
}

UITile.prototype = new UIElement();
UITile.prototype.isUITile = true;

UITile.prototype.initUITile = function(type, w, h) {
	this.initUIElement(type);	
	this.setSize(w, h);

	return this;
}

UITile.Layer = function() {
}

UITile.Layer.prototype.init = function(tile, info) {
	this.tile = tile;
	this.info = info;

	return this;
}

UITile.Layer.prototype.drawOrthogonal = function(canvas, rect) {
	var info = this.info;
	var ox = info.x || 0;
	var oy = info.y || 0;
	var data = info.data;
	var rows = info.height;
	var cols = info.width;
	var tile = this.tile;
	var tileW = tile.tileWidth;
	var tileH = tile.tileHeight;
	
	var w = tileW * cols;
	var top = Math.max(Math.floor(rect.y/tileH), 0);
	var left = Math.max(Math.floor(rect.x/tileW), 0);
	var right = Math.min(Math.ceil((rect.x + rect.w)/tileW), cols);
	var bottom = Math.min(Math.ceil((rect.y + rect.h)/tileH), rows);

	var x = left * tileW + ox;
	var y = top * tileH + oy;
	var rect = {x:x, y:y, w:tileW, h:tileH};

	ox = x;
	canvas.globalAlpha = info.opacity;
	for(var r = top; r <= bottom; r++) {
		for(var c = left; c <= right; c++) {
			var i = r * cols + c;
			var imgIndex = data[i]

			if(imgIndex) {
				rect.x = x;
				rect.y = y;
				tile.drawTile(canvas, rect, imgIndex);
			}

			x += tileW;
		}
		x = ox;
		y += tileH;
	}

	return;
}

UITile.Layer.prototype.drawIsometric = function(canvas, rect) {
	var top = rect.y;
	var left = rect.x;
	var right = left + rect.w;
	var bottom = top + rect.h;

	var i = 0;
	var info = this.info;
	var x = info.x || 0;
	var y = info.y || 0;
	var data = info.data;
	var rows = info.height;
	var cols = info.width;
	var tile = this.tile;
	var tileW = tile.tileWidth;
	var tileH = tile.tileHeight;

	canvas.globalAlpha = info.opacity;

	var originY = y;
	var originX = x + (this.info.width*tileW)/2 - tileW/2;
	var rect = {x:x, y:y, w:tileW, h:tileH};

	for(var r = 0; r < rows; r++) {
		for(var c = 0; c < cols; c++, i++) {
			var imgIndex = data[i]
			x = (c - r)*tileH + originX;
			y = (c + r)*tileW/4 + originY;
			if(!imgIndex || x > right || y > bottom || (x + tileW) < left || (y + tileH) < top) {
				continue;
			}
			rect.x = x;
			rect.y = y;
			tile.drawTile(canvas, rect, imgIndex);
		}
	}

	return;
}

UITile.Layer.prototype.draw = function(canvas, rect) {
	var info = this.info;

	if(!info.visible) return;

	switch(this.tile.orientation) {
		case 'orthogonal': {
			this.drawOrthogonal(canvas, rect);
			break;
		}
		case 'isometric': {
			this.drawIsometric(canvas, rect);
			break;
		}
		default: {
			throw new Error('unknow orientation: ', this.tile.orientation);
		}
	}

	return;
}

UITile.Layer.prototype.getTileByPoint = function(x, y) {
	var tile = this.tile;
	var tileW = tile.tileWidth;
	var tileH = tile.tileHeight;
	var row = Math.floor(y/tileH);
	var col = Math.floor(x/tileW);
	var index = row * this.info.width + col;
	var imageIndex = this.info.data[index];

	return {row:row, col:col, index:index, imageIndex:imageIndex};
}

UITile.TileSet = function() {
}

UITile.TileSet.prototype.init = function(tile, rootURL, info) {
	this.tile = tile;
	this.info = info;
	this.imageURL = rootURL + "/" + info.image;
	this.image = WImage.create(this.imageURL);
	this.tileWidth = info.tilewidth+info.spacing;
	this.tileHeight = info.tileheight+info.spacing;
	this.cols = Math.floor((info.imagewidth-2*info.margin)/this.tileWidth);
	this.rows = Math.floor((info.imageheight-2*info.margin)/this.tileHeight);
	this.tileNr = this.cols * this.rows;
	this.startIndex = info.firstgid;

	return this;
}

UITile.TileSet.prototype.testImageIndex = function(imageIndex) {
	return imageIndex >= this.startIndex && imageIndex < (this.startIndex + this.tileNr);
}

UITile.TileSet.prototype.drawTile = function(canvas, x, y, imageIndex) {
	var image = this.image.getImage();
	var index = imageIndex - this.startIndex;

	if(index < 0 || index >= this.tileNr || !image || !image.width) {
		return;
	}

	var info = this.info;
	var c = index%this.cols;
	var r = Math.floor(index/this.cols);
	var sx = c * this.tileWidth + info.margin;
	var sy = r * this.tileHeight + info.margin;
	var w = info.tilewidth;
	var h = info.tileheight;

	if(this.tileHeight !== this.tile.tileHeight) {
		y = y - (this.tileHeight - this.tile.tileHeight);
	}

	canvas.drawImage(image,sx, sy, w, h, x, y, w, h);

	return;
}

UITile.prototype.loadTileSets = function(url, tilesets) {
	this.tilesets = [];
	var n = tilesets.length;
	var rootURL = url.dirname();

	this.images = {};
	for(var i = 0; i < n; i++) {
		var tileSet = new UITile.TileSet();
		tileSet.init(this, rootURL, tilesets[i]);

		this.setImage("option_image_"+i, tileSet.imageURL);
		this.tilesets.push(tileSet);
	}

	return this;
}

UITile.prototype.loadLayers = function(layers) {
	this.layers = [];
	var n = layers.length;

	for(var i = 0; i < n; i++) {
		this.layers.push((new UITile.Layer()).init(this, layers[i]));
	}

	return this;
}

UITile.prototype.getMapWidth = function() {
	return this.mapWidth;
}

UITile.prototype.getMapHeight = function() {
	return this.mapHeight;
}

UITile.prototype.getLayerNr = function() {
	return this.layers ? this.layers.length : 0;
}

UITile.prototype.getLayerByIndex = function(index) {
	if(this.layers && index < this.layers.length) {
		return this.layers[index];
	}

	return null;
}

UITile.prototype.loadJSON = function(url, json) {
	if(this.isIcon) return;

	if(!json || !json.width || !json.height) {
		console.log("invalid tiled json");
		return;
	}

	this.tileRows = json.height;
	this.tileCols = json.width;
	this.tileWidth = json.tilewidth;
	this.tileHeight = json.tileheight;
	this.orientation = json.orientation;
	this.renderorder = json.renderorder;
	this.properties = json.properties;
	this.mapWidth = this.tileWidth * this.tileCols;
	this.mapHeight = this.tileHeight * this.tileRows;

	this.loadTileSets(url, json.tilesets);
	this.loadLayers(json.layers);

	if(this.enable) {
		var win = this.getWindow();
		if(win && win.isUIScene) {
			win.setMap(this);
		}
	}

	return;
}

UITile.prototype.loadURL = function(url) {
	var me = this;
	httpGetJSON(url, function(json) {
		me.loadJSON(url, json);
	});

	return;
}

UITile.prototype.load = function() {
	if(this.tiledJsonURL) {
		this.loadURL(this.tiledJsonURL);
	}

	return;
}

UITile.prototype.setClipRegion = function(rects) {
	this.clipRegion = rects;

	return this;
}

UITile.prototype.isInClipRegion = function(r) {
	if(!this.clipRegion) return true;

	var rects = this.clipRegion;
	var n = rects.length;

	for(var i = 0; i < n; i++) {
		var rect = rects[i];
		if(Rect.hasIntersection(rect, r)) {
			return true;
		}
	}

	return false;
}

UITile.prototype.drawTile = function(canvas, rect, imageIndex) {
	if(!this.isInClipRegion(rect)) {
		return;
	}

	var n = this.tilesets.length;
	for(var i = 0; i < n; i++) {
		var iter = this.tilesets[i];
		if(iter.testImageIndex(imageIndex)) {
			iter.drawTile(canvas, rect.x, rect.y, imageIndex);
			break;
		}
	}

	return;
}

UITile.prototype.draw = function(canvas, rect) {
	if(!this.layers) {
		return;
	}

	var layers = this.layers;
	var n = layers.length;

	for(var i = 0; i < n; i++) {
		layers[i].draw(canvas, rect);	
	}

	return;
}

UITile.prototype.onAppendedInParent = function() {
	this.load();
}

UITile.prototype.createBody = function(world, name, x, y, w, h, prop) {
	var hw = w >> 1;
	var hh = h >> 1;
	var cx = x + hw;
	var cy = y + hh;
	var fixtureDef = new b2FixtureDef();
	fixtureDef.density = prop.density;
	fixtureDef.friction = prop.friction;
	fixtureDef.restitution = prop.restitution;

	if(prop.groupIndex) {
		fixtureDef.filter.groupIndex = prop.groupIndex;
	}

	if(prop.isSensor) {
		fixtureDef.isSensor = true;
	}
		
	fixtureDef.shape = new b2PolygonShape();
	fixtureDef.shape.SetAsBox(Physics.toMeter(hw), Physics.toMeter(hh));

	var bodyDef = new b2BodyDef();
	bodyDef.type = prop.density ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
	bodyDef.position.Set(Physics.toMeter(cx), Physics.toMeter(cy));
	bodyDef.allowSleep = true;
	body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	body.name = name;

	return;
}

UITile.prototype.createLayerBodies = function(world, layerIndex, info) {
	var data = info.data;
	var n = data.length;
	var prop = info.properties || {};
	var rows = info.height;
	var cols = info.width;
	var tileW = this.tileWidth;
	var tileH = this.tileHeight;
	var ox = info.x ? info.x : 0;
	var oy = info.y ? info.y : 0;

	prop.density = 0;
	prop.restitution = prop.restitution ? parseFloat(prop.restitution) : 0.5;
	prop.friction    = prop.friction ? parseFloat(prop.friction) : 0.5;

	for(var i = 0; i < n; i++) {
		var imageIndex = data[i];
		if(!imageIndex) continue;
		var r = Math.floor(i/cols);
		var c = i%cols;
		var x = ox + c * tileW;
		var y = oy + r * tileH;
		this.createBody(world, layerIndex+"-"+i, x, y, tileW, tileH, prop);
	}

	return;
}

UITile.prototype.createBodies = function(world) {
	var layers = this.layers;
	var n = layers.length;

	for(var i = 0; i < n; i++) {
		var layer = layers[i];
		var prop = layer.info.properties;
		if(prop && prop.physics) {
			this.createLayerBodies(world, i, layer.info);	
		}
	}

	return;
}

UITile.prototype.onFromJsonDone = function(js) {
	this.load();
}

UITile.prototype.setTiledJsonURL = function(url) {
	this.tiledJsonURL = url;
	this.load();
}

UITile.prototype.getTiledJsonURL = function() {
	return this.tiledJsonURL;	
}

UITile.prototype.setEnable = function(enable) {
	var parent = this.getParent();

	if(!parent || this.enable == enable) {
		return this;
	}

	var win = this.getWindow();
	if(win && win.isUIScene) {
		if(enable) {
			win.setMap(this);
		}
		else {
			if(win.getMap() === this) {
				win.setMap(null);
			}
		}
	}
	this.enable = enable;

	return;
}

function UITileCreator() {
	var args = ["ui-tile", "ui-tile", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITile();
		return g.initUITile(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UITileCreator());


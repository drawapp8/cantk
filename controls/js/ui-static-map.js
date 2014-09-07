/*
 * File:   ui-static-map.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Static Map 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIStaticMap() {
	return;
}

UIStaticMap.prototype = new UIImage();
UIStaticMap.prototype.isUIStaticMap = true;

UIStaticMap.prototype.initUIStaticMap = function(type) {
	this.initUIImage(type, 200, 200, null);

	return this;
}

UIStaticMap.prototype.setMapProvider = function(value) {
	this.mapProvider = value;

	return;
}

UIStaticMap.prototype.setMapType = function(value) {
	this.mapType = value;

	return;
}

UIStaticMap.prototype.setMapZoom = function(value) {
	this.mapZoom = value;

	return;
}

UIStaticMap.prototype.setMapCenter = function(value) {
	this.mapCenter = value;

	return;
}

UIStaticMap.prototype.setMapWidth = function(value) {
	this.mapWidth = value;

	return;
}

UIStaticMap.prototype.setMapHeight = function(value) {
	this.mapHeight = value;

	return;
}

UIStaticMap.prototype.setMapExtraParams = function(value) {
	this.mapEtraParams = value;

	return;
}

UIStaticMap.prototype.getMapType = function() {
	return this.mapType ? this.mapType : "";
}

UIStaticMap.prototype.getMapProvider = function() {
	return this.mapProvider ? this.mapProvider : "google";
}

UIStaticMap.prototype.getMapZoom = function() {
	return this.mapZoom ? this.mapZoom : 10;
}

UIStaticMap.prototype.getMapWidth = function() {
	return this.mapWidth ? this.mapWidth : 600;
}

UIStaticMap.prototype.getMapHeight = function() {
	return this.mapHeight ? this.mapHeight : 600;
}

UIStaticMap.prototype.getMapCenter = function() {
	if(!this.mapCenter && this.currentLocation) {
		return this.currentLocation;
	}
	else {
		return this.mapCenter ? this.mapCenter : "China";
	}
}

UIStaticMap.prototype.getMapExtraParams = function() {
	return this.mapEtraParams ? this.mapEtraParams : "";
}

//http://developer.baidu.com/map/staticimg.htm
//https://developers.google.com/maps/documentation/staticmaps/?hl=zh-CN&csw=1

UIStaticMap.prototype.getMapURL = function() {
	var url = "";
	if(this.mapProvider === "baidu") {
		url = "http://api.map.baidu.com/staticimage?center="+this.getMapCenter()
			+ "&width=" + this.getMapWidth()
			+ "&height="+ this.getMapHeight()
			+ "&zoom=" + this.getMapZoom()
			+ this.getMapExtraParams();
	}
	else if(this.mapProvider === "google"){
		url = "http://maps.googleapis.com/maps/api/staticmap?center="+this.getMapCenter()
			+ "&size=" + this.getMapWidth() + "x"+this.getMapHeight()
			+ "&zoom=" + this.getMapZoom()
			+ "&maptype=" + this.getMapType() + "&sensor=true"
			+ this.getMapExtraParams();
	}

	console.log("Map URL:" + url);

	return url;
}

UIStaticMap.prototype.updateMap = function() {
	var url = this.getMapURL();

	this.setImageSrc(url);

	return;
}

UIStaticMap.prototype.onInit = function() {
	var map = this;
	
	function onCurrentLocation(position) {
		map.currentLocation = position.coords.latitude+","+position.coords.longitude;
		map.updateMap();

		return;
	}

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onCurrentLocation);
	}
	this.updateMap();

	return;
}

UIStaticMap.prototype.drawImage =function(canvas) {

	this.drawBgImage(canvas);

	return;
}

function UIStaticMapCreator() {
	var args = ["ui-static-map", "ui-static-map", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIStaticMap();
		return g.initUIStaticMap(this.type);
	}
	
	return;
}

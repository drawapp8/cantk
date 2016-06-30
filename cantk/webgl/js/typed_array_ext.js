/*
 * File: typed_array_ext.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: some functions to extend typed array.
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

Int16Array.prototype.push = function() {
	var arr = arguments;
	var size = this.size;
	var length = this.length;

	var n = arr.length;
	for(var i = 0; i < n && size < length; i++) {
		this[size++] = arr[i];
	}
	this.size = size;

	return this;
}

Int16Array.prototype.extend = function() {
	var size = this.size;
	var newSize = this.length + 1024;
	var newDataBuffer = Int16Array.create(newSize);

	newDataBuffer.size = size;
	for(var i = 0; i < size; i++) {
		newDataBuffer[i] = this[i];
	}

	return newDataBuffer;
}

Float32Array.prototype.extend = function() {
	var size = this.size;
	var newSize = this.length + 1024;
	var newDataBuffer = Float32Array.create(newSize);

	newDataBuffer.size = size;
	for(var i = 0; i < size; i++) {
		newDataBuffer[i] = this[i];
	}

	return newDataBuffer;
}

Int16Array.prototype.pushX = function() {
	var me = this;
	var arr = arguments;
	var n = arr.length;

	if((this.size + 1024 + n) > this.length) {
		me = this.extend();
	}

	var start = this.size;
	for(var i = 0; i < n; i++, start++) {
		me[start] = arr[i];
	}
	me.size += n;

	return me;
}

Int16Array.prototype.push1 = function(a) {
	var me = this;
	if((this.size + 10) >= this.length) {
		me = this.extend();
	}
	
	me[this.size++] = a;

	return me;
}

Float32Array.prototype.push1 = function(a) {
	var me = this;
	if((this.size + 10) >= this.length) {
		me = this.extend();
	}
	
	me[this.size++] = a;

	return me;
}

Int16Array.prototype.push2 = function(a, b) {
	var me = this;
	if((this.size + 10) >= this.length) {
		me = this.extend();
	}
	
	me[this.size++] = a;
	me[this.size++] = b;

	return me;
}

Float32Array.prototype.push2 = function(a, b) {
	var me = this;
	if((this.size + 10) >= this.length) {
		me = this.extend();
	}
	
	me[this.size++] = a;
	me[this.size++] = b;

	return me;
}

Float32Array.prototype.pushX = function() {
	var me = this;
	var arr = arguments;
	var n = arr.length;

	if((this.size + 1024 + n) > this.length) {
		me = this.extend();
	}

	var start = this.size;
	for(var i = 0; i < n; i++, start++) {
		me[start] = arr[i];
	}
	me.size += n;

	return me;
}

Float32Array.prototype.pushArr = Int16Array.prototype.pushArr = function(arr) {
	var me = this;
	var n = arr.length;

	if((this.size + 1024 + n) > this.length) {
		me = this.extend();
	}

	var start = this.size;
	for(var i = 0; i < n; i++, start++) {
		me[start] = arr[i];
	}
	me.size += n;

	return me;
}

Float32Array.prototype.reset = Int16Array.prototype.reset = function() {
	this.size = 0;

	return this;
}

Int16Array.create = function(data) {
	var arr = new Int16Array(data);	
	arr.size = 0;

	return arr;
}

Float32Array.create = function(data) {
	var arr = new Float32Array(data);	
	arr.size = 0;

	return arr;
}

Int16Array.prototype.dup = function() {
	var size = this.size;
	var newDataBuffer = Int16Array.create(size);

	for(var i = 0; i < size; i++) {
		newDataBuffer[i] = this[i];
	}
	newDataBuffer.size = size;

	return newDataBuffer;
}

Float32Array.prototype.dup = function() {
	var size = this.size;
	var newDataBuffer = Float32Array.create(size);

	for(var i = 0; i < size; i++) {
		newDataBuffer[i] = this[i];
	}
	newDataBuffer.size = size;

	return newDataBuffer;
}

Float32Array.prototype.slice = Int16Array.prototype.slice = Array.prototype.slice;


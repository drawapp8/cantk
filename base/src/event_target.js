/*
 * File: event_target.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: event target
 * 
 * Copyright (c) 2011 - 2015	Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016	Holaverse Inc.
 * 
 */
function TEvent() {
}

TEvent.prototype.preventDefault = function() {
	this.defaultPrevented = true;

	return this;
}

TEvent.prototype.isDefaultPrevented = function() {
	return this.defaultPrevented;
}

TEvent.create = function(type) {
	var event = new TEvent();
	event.type = type;

	return event;
}

function TEventTarget() {
}

TEventTarget.apply = function(obj) {
	if (!obj) {
		return;
	}

	obj.createEvent = TEvent.create;
	obj.hasEventListener = TEventTarget.prototype.hasEventListener;
	obj.dispatchEvent = TEventTarget.prototype.dispatchEvent;
	obj.addEventListener = TEventTarget.prototype.addEventListener;
	obj.removeEventListener = TEventTarget.prototype.removeEventListener;
	obj.resetEvents = TEventTarget.prototype.resetEvents;
	obj.on = TEventTarget.prototype.on;
	obj.off = TEventTarget.prototype.off;

	return;
}

TEventTarget.prototype.resetEvents = function() {
	this.eventListeners = {};
}

TEventTarget.prototype.hasEventListener = function(type) {
	return this.eventListeners && this.eventListeners[type] && this.eventListeners[type].length > 0;
}

TEventTarget.prototype.on = TEventTarget.prototype.addEventListener = function(type, callback) {
	if(!callback || !type) {
		return;
	}

	if(!this.eventListeners) {
		this.eventListeners = {};
	}

	var callbacks = this.eventListeners[type];
	
	if(!callbacks) {
		callbacks = [];
		this.eventListeners[type] = callbacks;
	}

	if(callback) {
		callbacks.push({callback:callback});
	}

	return;
}

TEventTarget.prototype.off = TEventTarget.prototype.removeEventListener = function(type, callback) {
	if(!this.eventListeners || !callback || !type) {
		return;
	}

	var callbacks = this.eventListeners[type];
	if(callbacks) {
		for(var i = 0; i < callbacks.length; i++) {
			var iter = callbacks[i];
			if(iter && iter.callback === callback) {
				callbacks.splice(i, 1);
			}
		}
	}

	return;
}

TEventTarget.prototype.dispatchEvent = function(event) {
	if(!this.eventListeners || !event || !event.type) {
		return false;
	}
	
	var type = event.type;
	var callbacks = this.eventListeners[type];
	
	event.target = this;
	if(callbacks) {
		var n = callbacks.length;
		callbacks = callbacks.slice();

		for(var i = 0; i < n; i++) {
			var iter = callbacks[i];
			var callback = iter.callback;
			try {
				if(callback.call(this, event)) {
					return true;
				}
			}catch(e){
				console.log("%cWarning: dispatchEvent " + type + "(" + e.message + ")\n" + e.stack, "color: red; font-weight: bold");
			}
		}
	}

	return false;
}

/*
 * File: command_history.js 
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: command history
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function Command() {
	this.count = 0;
	
	this.doit = function() {
		this.count = this.count + 1;
		console.log("command: doit " + this.count);
		
		return;
	}
	
	this.undo = function() {
		this.count = this.count - 1;
		console.log("command: undo " + this.count);
		
		return;
	}	
}

function CompositeCommand() {
}

CompositeCommand.prototype.init = function() {
	this.cmds = [];

	return this;
}

CompositeCommand.prototype.addCommand = function(cmd) {
	this.cmds.push(cmd);

	return this;
}
	
CompositeCommand.prototype.destroy = function() {
	return this.clear();
}

CompositeCommand.prototype.clear = function() {
	this.cmds.clear();
	
	return this;
}
	
CompositeCommand.prototype.doit = function() {
	for(var i = 0; i < this.cmds.length; i++) {
		var cmd = this.cmds[i];
		cmd.doit();
	}
	
	return this;
}
	
CompositeCommand.prototype.undo = function() {
	for(var i = 0; i < this.cmds.length; i++) {
		var cmd = this.cmds[i];
		cmd.undo();
	}
	
	return this;
}	

CompositeCommand.create = function() {
	var cmd = new CompositeCommand();

	return cmd.init();
}

function CommandHistory() {
	this.listeners = new Array();
	this.redos = [];
	this.undos = [];

	this.maxUndos = 20;

	this.setMaxUndos= function(maxUndos) {
		this.maxUndos = maxUndos;

		return;
	}

	this.clear = function () {
		this.redos.clear();
		this.undos.clear();

		return;
	}

	this.notify = function() {
		for(var i = 0; i < this.listeners.length; i++) {
			var listener = this.listeners[i];
			listener.onChanged(this.redos.length, this.undos.length);
		}
		
		return;
	}
	
	this.exec = function(cmd) {
		cmd.doit();
		
		this.undos.push(cmd);
		this.redos.clear();
		this.notify();
	
		if(this.undos.length > this.maxUndos) {
//			console.log("Max Undos reached: " + this.maxUndos + " remove this first one.");
			var cmd = this.undos.shift();
			delete cmd;
		}

		return;
	}
	
	this.redo = function() {
		if(this.redos.length > 0) {
			var cmd = this.redos.pop();
			cmd.doit();
			this.undos.push(cmd);
			this.notify();
		}

		return;
	}
	
	this.undo = function() {
		if(this.undos.length > 0) {
			var cmd = this.undos.pop();
			cmd.undo();
			this.redos.push(cmd);
			this.notify();
		}
		
		return;
	}
	
	this.countRedo = function() {
		return this.redos.length;
	}
	
	this.countUndo = function() {
		return this.undos.length;
	}
	
	this.addListener = function(listener) {
		this.listeners.push(listener);
		
		return;
	}
	
	this.removeListener = function(listener) {
		this.listeners.remove(listener);
		
		return;
	}
	
	return;
}

UIElement.prototype.getScence= function() {
	return this.getWindow();
}

UIElement.prototype.getFootprints = function(name) {
	var x = 0;
	var y = 0;
	var footPrints = [];
	var arr = this.isUIWindow ? this : this.getParent().children;

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(!iter.isUIFootprint) {
			continue;
		}

		if(name && name != iter.name) {
			continue;
		}

		x = iter.left + (iter.w >> 1);
		y = iter.top + (iter.h >> 1);

		footPrints.push({x:x, y:y});
	}

	return footPrints;
}

UIElement.prototype.moveAlongPath = function(name, duration, enableRotation, onDone) {
	var footPrints = this.getFootprints(name);

	return this.moveAlongPoints(footPrints, duration, enableRotation, onDone);
}

UIElement.prototype.moveAlongPoints = function(points, duration, enableRotation, onDone) {
	var d = 0;
	var dx = 0;
	var dy = 0;
	var moveInfo = {};
	var distances = [];
	var totalDistance = 0;

	if(!points.length) {
		console.log("no footprint found.");
	}

	for(var i = 0; i < points.length; i++) {
		var iter = points[i];
		if(i) {
			dx = points[i].x - points[i-1].x;
			dy = points[i].y - points[i-1].y;

			d = Math.sqrt(dx*dx+dy*dy);
			distances.push(d);
			totalDistance += d;
		}
	}

	moveInfo.onDone = onDone;
	moveInfo.duration = duration;
	moveInfo.distances = distances;
	moveInfo.points = points;
	moveInfo.totalDistance = totalDistance;
	moveInfo.enableRotation = enableRotation;

	this.startMove(moveInfo);

	return;
}

UIElement.prototype.startMove = function(moveInfo) {
	var x = 0;
	var y = 0;
	var index = 0;
	var me = this;
	var hw = this.w >> 1;
	var hh = this.h >> 1;

	var duration = moveInfo.duration;
	var distances = moveInfo.distances;
	var points = moveInfo.points;
	var totalDistance = moveInfo.totalDistance;
	var enableRotation = moveInfo.enableRotation;

	function moveToNext() {
		if((index+1) >= points.length) {
			if(moveInfo.onDone) {
				moveInfo.onDone();
			}

			return;
		}

		var start = Date.now();
		var endPoint = points[index+1];
		var startPoint = points[index];
		var dt = duration * (distances[index]/totalDistance);
		var dx = endPoint.x - startPoint.x;
		var dy = endPoint.y - startPoint.y;

		var angle = Math.asin(Math.abs(dy)/Math.sqrt(dx * dx + dy * dy));

		if(dy <= 0 && dx < 0 ) {
			angle = Math.PI - angle;
		}
		
		if(dy > 0 && dx < 0 ) {
			angle = Math.PI + angle;
		}
		
		if(dy > 0 && dx >= 0 ) {
			angle = 2 * Math.PI - angle;
		}

		angle = -angle;
		function step() {
			var percent = (Date.now() - start)/dt;
			if(percent < 1) {
				x = startPoint.x + dx * percent - hw;
				y = startPoint.y + dy * percent - hh;

				me.setPosition(x, y);
				if(enableRotation) {
					me.setRotation(angle);
				}
				me.postRedraw();
				
				return true;
			}
			else {
				index++;
				x = endPoint.x - hw;
				y = endPoint.y - hh;

				me.setPosition(x, y);
				me.postRedraw();
				moveToNext();

				return false;
			}
		}

		UIElement.setAnimTimer(step);
	}

	moveToNext();

	return;
}

UIElement.prototype.setPositionWithSticky = function(x, y) {
	this.setPosition(x, y);

	if(this.sticky) {
		this.orgX = this.x;		
		this.orgY = this.y;	
	}

	return this;
}

UIElement.prototype.setAngle = UIElement.prototype.setRotation;

UIElement.prototype.setPositionByBody = function(left, top) {
    if(this.anchor) {
        this._x = left + this.w * this.anchor.x;
        this._y = top + this.h * this.anchor.y;
        this.setLeftTop(left, top);
    }
    else {
        this._x = left;
        this._y = top;
        this.setLeftTop(this._x, this._y);
    }

	this.callOnMovedHandler();

	return this;
}

UIElement.prototype.setSoundMusicVolume = function(volume) {
	this.getWindowManager().setSoundMusicVolume(volume);

	return this;
}

UIElement.prototype.setSoundEffectVolume = function(volume) {
	this.getWindowManager().setSoundEffectVolume(volume);

	return this;
}

UIElement.prototype.playSoundEffect = function(name, onDone) {
	this.getWindowManager().playSoundEffect(name, onDone);

	return this;
}

UIElement.prototype.playSoundMusic = function(name, onDone) {
	this.getWindowManager().playSoundMusic(name, onDone);

	return this;
}

UIElement.prototype.stopSoundMusic = function(name) {
	this.getWindowManager().stopSoundMusic(name);

	return this;
}

UIElement.prototype.stopSoundEffect = function(name) {
	this.getWindowManager().stopSoundEffect(name);

	return this;
}

UIElement.prototype.setSoundEnable = function(enable) {
	var wm = this.getWindowManager();

	wm.setSoundEnable(enable);

	return this;
}

UIElement.prototype.isSoundEnable = UIElement.prototype.getSoundEnable = function() {
	var wm = this.getWindowManager();

	return wm.getSoundEnable();
}

UIElement.prototype.setSoundEffectEnable = function(enable) {
	var wm = this.getWindowManager();

	wm.setSoundEffectsEnable(enable);

	return this;
}

UIElement.prototype.isSoundEffectEnable = UIElement.prototype.getSoundEffectEnable = function() {
	var wm = this.getWindowManager();

	return wm.soundEffectsEnalbe;
}

UIElement.prototype.setSoundMusicEnable = function(enable) {
	var wm = this.getWindowManager();

	wm.setSoundMusicsEnable(enable);

	return this;
}

UIElement.prototype.isSoundMusicEnable = UIElement.prototype.getSoundMusicEnable = function() {
	var wm = this.getWindowManager();

	return wm.soundMusicsEnalbe;
}

UIElement.prototype.setVOf = function(name, x, y) {
	var el = this.getWindow().findChildByName(name, true);
	if(el) {
		el.setV(x, y);
	}
	else {
		console.log("not found " + name);
	}

	return this;
}

UIElement.prototype.setV = function(x, y) {
	var body = this.body;
	if(body) {
		this.setVisible(true);

		if(!body.IsActive()) {
			body.SetActive(true);
		}

		if(!body.IsAwake()) {
			body.SetAwake(true);
		}

		var v = body.GetLinearVelocity();
		if(x !== null && x !== undefined) {
			v.x = x;
		}

		if(y !== null && y !== undefined) {
			v.y = y;
		}

		body.SetLinearVelocity(v);
	}

	return this;
}

UIElement.prototype.onRemoved = function(parent) {
	if(!parent) {
		return;
	}

	var win = parent.getWindow();
	if(!win) {
		return;
	}

	var world = win.world;

	if(this.body) {
		Physics.destroyBodyForElement(world, this);
		this.body = null;
	}

	if(this.joint) {
		Physics.destroyJointForElement(world, this);
		this.joint = null;
	}

	return this;
}


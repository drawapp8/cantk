UIElement.prototype.getScence= function() {
	return this.getWindow();
}

UIElement.prototype.setEnable = function(enable) {
	this.enable = enable;
	if(this.body) {
		this.body.SetActive(enable);
	}

	return this;
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

		x = iter.x + (iter.w >> 1);
		y = iter.y + (iter.h >> 1);

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

UIElement.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;

	if(this.body) {
		var p = {};
		var pos = this.getParent().getPositionInWindow();

		x += pos.x;
		y += pos.y;

		p.x = Physics.toMeter(x + (this.w >> 1)); 
		p.y = Physics.toMeter(y + (this.h >> 1)); 
		this.body.SetPosition(p);
	}

	return this;
}

UIElement.prototype.setRotation = function(rotation) {
	this.rotation = rotation;

	if(this.body) {
		this.body.SetAngle(rotation);
	}

	return this;
}


UIElement.prototype.setAngle = UIElement.prototype.setRotation;

UIElement.prototype.setPositionByBody = function(x, y) {
	this.x = x;
	this.y = y;

	this.callOnMovedHandler();

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

UIElement.prototype.getV = function() {
	return this.body ? this.body.GetLinearVelocity() : {x:0, y:0};
}

UIElement.prototype.addV = function(dx, dy) {
	var v = this.getV();

	if(dx !== null && dx !== undefined) {
		v.x += dx;
	}
	
	if(dy !== null && dy !== undefined) {
		v.y += dy;
	}

	return this.setV(v.x, v.y);
}


UIElement.prototype.playSoundEffect = function(name) {
	this.getWindowManager().playSoundEffect(name);

	return this;
}

UIElement.prototype.playSoundMusic = function(name) {
	this.getWindowManager().playSoundMusic(name);

	return this;
}

UIElement.prototype.stopSoundMusic = function(name) {
	this.getWindowManager().stopSoundMusic(name);

	return this;
}


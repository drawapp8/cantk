function Physics() {
};

Physics.pixelsPerMeter = 10;

Physics.toMeter = function(pixel) {
	return pixel / Physics.pixelsPerMeter;
}

Physics.toPixel = function(meter) {
	return Math.round(meter * Physics.pixelsPerMeter);
}

Physics.createFixtureDef = function(world, element) {
	var hw = element.w >> 1;
	var hh = element.h >> 1;
	var fixtureDef = new b2FixtureDef();
	var x = element.x + hw;
	var y = element.y + hh;

	fixtureDef.density = element.density;
	fixtureDef.friction = element.friction;
	fixtureDef.restitution = element.restitution;

	if(element.categoryBits) {
		fixtureDef.filter.categoryBits = element.categoryBits;
	}
	
	if(element.maskBits) {
		fixtureDef.filter.maskBits = element.maskBits;
	}
	
	if(element.groupIndex) {
		fixtureDef.filter.groupIndex = element.groupIndex;
	}
	
	if(element.isSensor) {
		fixtureDef.isSensor = true;
	}
	
	if(element.isUICircle || element.physicsShape === "circle") {
		hw = element.getWidth(true) >> 1;
		hh = element.getHeight(true) >> 1;
		var radius = Physics.toMeter(Math.min(hw, hh));
		fixtureDef.shape = new b2CircleShape(radius);
	}
	else if(element.isUIBox || element.physicsShape === "rectangle") {
		hw = element.getWidth(true) >> 1;
		hh = element.getHeight(true) >> 1;
		fixtureDef.shape = new b2PolygonShape();
		fixtureDef.shape.SetAsBox(Physics.toMeter(hw), Physics.toMeter(hh));
	}
	else if(element.isUIPolygon) {
		var cx = hw;
		var cy = hh;
		var arr = [];
		var fixtureDefs = [];
		var n = element.children.length;

		for(var i = 0; i < n; i++) {
			var p = {};
			var iter = element.children[i];

			if(!iter.isUIPoint) {
				continue;
			}

			p.x = Physics.toMeter(iter.x + (iter.w >> 1) - cx);
			p.y = Physics.toMeter(iter.y + (iter.h >> 1) - cy);

			if(arr.length === 5) {
				fixtureDef = new b2FixtureDef();
				fixtureDef.density = element.density;
				fixtureDef.friction = element.friction;
				fixtureDef.restitution = element.restitution;
				fixtureDef.shape = new b2PolygonShape();
				fixtureDef.shape.SetAsArray(arr, arr.length);
				fixtureDefs.push(fixtureDef);
				arr = [];
			}
			arr.push(p);
		}

		if(arr.length > 2) {
			fixtureDef = new b2FixtureDef();
			fixtureDef.density = element.density;
			fixtureDef.friction = element.friction;
			fixtureDef.restitution = element.restitution;
			fixtureDef.shape = new b2PolygonShape();
			fixtureDef.shape.SetAsArray(arr, arr.length);
			fixtureDefs.push(fixtureDef);
			arr = [];
		}

		return fixtureDefs.length > 1 ? fixtureDefs : fixtureDefs[0];
	}
	else if(element.isUIEdge) {
		var p0 = element.points[0];
		var p1 = element.points[1];
		var c = {x: (p0.x+p1.x) >> 1, y: (p0.y+p1.y) >> 1};
		var v0 = new b2Vec2(Physics.toMeter(p0.x-c.x), Physics.toMeter(p0.y-c.y));
		var v1 = new b2Vec2(Physics.toMeter(p1.x-c.x), Physics.toMeter(p1.y-c.y));
		fixtureDef.density = 0;
		fixtureDef.isSensor = false;
		fixtureDef.shape = new b2EdgeShape(v0, v1);
	}

	return fixtureDef;
}

Physics.createBody = function(world, element) {
	var body = null;
	var pos = element.getPositionInWindow();
	var hw = element.getWidth() >> 1;
	var hh = element.getHeight() >> 1;
	var x  = pos.x + hw;
	var y  = pos.y + hh;
	var density = element.density;
	var bodyDef = new b2BodyDef();
	var fixtureDef = Physics.createFixtureDef(world, element);

	if(density < 0) {
		b2BodyDef.type = b2Body.b2_kinematicBody;
	}
	else {
		bodyDef.type = density ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
	}

	bodyDef.position.Set(Physics.toMeter(x), Physics.toMeter(y));
	
	if(element.fixedRotation) {
		bodyDef.fixedRotation = true;
	}
	
	if(element.isBullet) {
		bodyDef.bullet = true;
	}
	
	if(element.allowSleep) {
		bodyDef.awake = true;
		bodyDef.allowSleep = true;
	}
	else {
		bodyDef.allowSleep = false;
	}
					
	if(element.linearDamping !== undefined) {
		bodyDef.linearDamping = element.linearDamping;
	}
	
	if(element.angularDamping !== undefined) {
		bodyDef.angularDamping = element.angularDamping;
	}

	body = world.CreateBody(bodyDef);
	if(fixtureDef.length) {
		for(var i = 0; i < fixtureDef.length; i++) {
			body.CreateFixture(fixtureDef[i]);
		}
		console.log("Create Composite Polygon: n=" + fixtureDef.length);
	}
	else {
		body.CreateFixture(fixtureDef);
	}

	body.element = element;
	body.name = element.name;
	element.body = body;

	if(element.rotation) {
		body.SetAngle(element.rotation);
	}

	if(!element.enable) {
		body.SetActive(false);
	}

	if(element.xInitVelocity || element.yInitVelocity) {
		element.setV(element.xInitVelocity, element.yInitVelocity);
	}

	return body;
}

Physics.createEmbedBody = function(world, parentElement, childElement) {
	var bodyDef = null;
	var fixtureDef = Physics.createFixtureDef(world, childElement);

	if(!bodyDef) {
		var pos = parentElement.getPositionInWindow();
		var hw = parentElement.w >> 1;
		var hh = parentElement.h >> 1;
		var x  = pos.x + hw;
		var y  = pos.y + hh;
		
		bodyDef = new b2BodyDef();
		if(fixtureDef.density < 0) {
			delete fixtureDef.density;
			b2BodyDef.type = b2Body.b2_kinematicBody;
		}
		else {
			bodyDef.type = fixtureDef.density ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
		}
		bodyDef.position.Set(Physics.toMeter(x), Physics.toMeter(y));
	
		if(parentElement.fixedRotation || childElement.fixedRotation) {
			bodyDef.fixedRotation = true;
		}

		if(parentElement.isBullet || childElement.isBullet) {
			bodyDef.bullet = true;
		}

		if(parentElement.allowSleep || childElement.allowSleep) {
			bodyDef.awake = true;
			bodyDef.allowSleep = true;
		}
		else {
			bodyDef.allowSleep = false;
		}
		
		if(childElement.linearDamping !== undefined) {
			bodyDef.linearDamping = childElement.linearDamping;
		}
		
		if(childElement.angularDamping !== undefined) {
			bodyDef.angularDamping = childElement.angularDamping;
		}

		var body = world.CreateBody(bodyDef);
		body.element = parentElement;
		parentElement.body = body;
		
		if(!parentElement.enable || !childElement.enable) {
			body.SetActive(false);
		}
	}

	body.CreateFixture(fixtureDef);

	return body;
}

Physics.createBodyForElement = function(world, parentElement, childElement) {
	if(childElement.physicsShape) {
		Physics.createBody(world, childElement);	
	}
	else if(childElement.isUIPhysicsShape) {
		if(parentElement.isUIWindow) {
			Physics.createBody(world, childElement);
		}
		else if(parentElement.isUISprite || parentElement.isUISkeletonAnimation 
			|| parentElement.isUITransformAnimation || parentElement.isUIFrameAnimation){
			Physics.createEmbedBody(world, parentElement, childElement);
		}
		else {
			Physics.createBody(world, childElement);
		}
	} else {
		Physics.createWorldShapes(world, childElement);
	}

	return;
}

Physics.destroyBodyForElement = function(world, element) {
	for(var i = 0; i < element.children.length; i++) {
		var iter = element.children[i];

		Physics.destroyBodyForElement(world, iter);
	}
	
	if(element.body) {
		var body = element.body;
		body.SetActive(false);
		
		setTimeout(function() {			
			world.DestroyBody(body);
		}, 5);

		body.element = null;
		element.body = null;
	}

	return;
}

Physics.destroyJointForElement = function(world, element) {
	var joint = element.joint;

	if(joint) {
		world.DestroyJoint(joint);
		joint.element = null;
	}

	return;
}

Physics.createWorldShapes = function(world, element) {
	var x = 0;
	var y = 0;
	var bodyDef = null;
	var fixtureDef = null;

	for(var i = 0; i < element.children.length; i++) {
		var iter = element.children[i];

		Physics.createBodyForElement(world, element, iter);
	}

	return;
}

Physics.findBodiesAtPoint = function(scene, point, zIndex) {
	var arr = [];
	var n = scene.children.length;
	var canvas = cantkGetTempCanvas(scene.w, scene.h);
	var ctx = canvas.getContext("2d");

	for(var i = zIndex; i >= 0; i--) {
		var iter = scene.children[i];
		if(!iter.body) {
			continue;
		}

		var rect = {x:iter.x, y:iter.y, w:iter.w, h:iter.h};

		ctx.save();
		ctx.beginPath();
		ctx.translate(rect.x, rect.y);
		if(iter.rotation) {
			ctx.translate(rect.w >> 1, rect.h >> 1);
			ctx.rotate(iter.rotation);
			ctx.translate(-(rect.w >> 1), -(rect.h >> 1));
		}
		ctx.rect(0, 0, rect.w, rect.h);
		if(ctx.isPointInPath(point.x, point.y)) {
			arr.push(iter.body);
		}
		ctx.restore();
	}

	return arr;
}

Physics.createJoint = function(world, element, scene) {
	var scene = element.getWindow();
	if(!element.isUIJoint) {
		return;
	}

	if(element.isUIOneJoint) {
		var p = {};
		var arr = null;
		p.x = element.x + (element.w >> 1);
		p.y = element.y + (element.h >> 1);

		var zIndex = element.getZIndex();
		arr = Physics.findBodiesAtPoint(scene, p, zIndex);

		if(arr.length == 1) {
			arr = [world.GetGroundBody(), arr[0]];
		}

		if(arr.length > 1) {
			var rJointDef = null;
			var anchorPoint = new b2Vec2(Physics.toMeter(p.x), Physics.toMeter(p.y));

			if(element.isUIRevoluteJoint) {
				rJointDef = new b2RevoluteJointDef();
				rJointDef.Initialize(arr[0], arr[1], anchorPoint);

				rJointDef.lowerAngle = (element.lowerAngle ? element.lowerAngle : 0)*Math.PI/180;
				rJointDef.upperAngle = (element.upperAngle ? element.upperAngle : 0)*Math.PI/180;
				rJointDef.motorSpeed = element.motorSpeed ? element.motorSpeed : 0;
				rJointDef.maxMotorTorque = element.maxMotorTorque ? element.maxMotorTorque : 0;
				rJointDef.enableLimit = element.enableLimit ? element.enableLimit : false;
				rJointDef.enableMotor = element.enableMotor ? element.enableMotor : false;
			}
			else if(element.isUIWeldJoint) {
				rJointDef = new b2WeldJointDef();
				rJointDef.Initialize(arr[0], arr[1], anchorPoint);
			}

			var joint = world.CreateJoint(rJointDef);
			joint.element = element;
			element.joint = joint;
		}
		else {
			console.log("not found body");
		}
	}
	else if(element.isUITwoJoint) {
		var rJointDef = null;
		var p0 = element.points[0];
		var p1 = element.points[1];
		var zIndex = element.getZIndex();
		var arr0 = Physics.findBodiesAtPoint(scene, p0, zIndex);
		var arr1 = Physics.findBodiesAtPoint(scene, p1, zIndex);

		if(arr0.length && arr1.length) {
			var anchorPoint0 = new b2Vec2(Physics.toMeter(p0.x), Physics.toMeter(p0.y));
			var anchorPoint1 = new b2Vec2(Physics.toMeter(p1.x), Physics.toMeter(p1.y));

			if(element.isUIDistanceJoint) {
				rJointDef = new b2DistanceJointDef();
				rJointDef.Initialize(arr0[0], arr1[0], anchorPoint0, anchorPoint1);
				if(element.frequencyHz) {
					rJointDef.frequencyHz = element.frequencyHz;
				}
				if(element.dampingRatio) {
					rJointDef.dampingRatio = element.dampingRatio;
				}
			}
			else if(element.isUILineJoint) {
				var dx = anchorPoint1.x - anchorPoint0.x;
				var dy = anchorPoint1.y - anchorPoint0.y;
				var axis = {};

				axis.x = dx/Math.sqrt(dx*dx+dy*dy);
				axis.y = dy/Math.sqrt(dx*dx+dy*dy);

				rJointDef = new b2LineJointDef();
				rJointDef.Initialize(arr0[0], arr0[1], anchorPoint0, axis);
				rJointDef.enableLimit = true;
				rJointDef.lowerTranslation = 0;
				rJointDef.upperTranslation = 10;
				rJointDef.enableMotor = false;
				rJointDef.maxMotorForce = 300000;
				rJointDef.motorSpeed = 1;
			}

			var joint = world.CreateJoint(rJointDef);
			joint.element = element;
			element.joint = joint;
		}
		else {
			console.log("not found body");
		}
	}
	else if(element.isUIPulleyJoint) {
		var rJointDef = null;
		var p0 = element.points[0];
		var p1 = element.points[1];
		var p2 = element.points[2];
		var p3 = element.points[3];
		var zIndex = element.getZIndex();
		var arr0 = Physics.findBodiesAtPoint(scene, p0, zIndex);
		var arr1 = Physics.findBodiesAtPoint(scene, p3, zIndex);

		if(arr0.length && arr1.length) {
			rJointDef = new b2PulleyJointDef();
			var ratio = 1;
			var anchorPoint0 = new b2Vec2(Physics.toMeter(p0.x), Physics.toMeter(p0.y));
			var anchorPoint1 = new b2Vec2(Physics.toMeter(p1.x), Physics.toMeter(p1.y));
			var anchorPoint2 = new b2Vec2(Physics.toMeter(p2.x), Physics.toMeter(p2.y));
			var anchorPoint3 = new b2Vec2(Physics.toMeter(p3.x), Physics.toMeter(p3.y));

			rJointDef.Initialize(arr0[0], arr1[0], anchorPoint1, anchorPoint2, anchorPoint0, anchorPoint3, ratio);
			
			var joint = world.CreateJoint(rJointDef);
			joint.element = element;
			element.joint = joint;
		}
		else {
			console.log("not found body");
		}
	}

	return;
}

Physics.createWorldJoints = function(world, scene, element) {
	for(var i = 0; i < element.children.length; i++) {
		var iter = element.children[i];

		Physics.createWorldJoints(world, scene, iter);
	}

	Physics.createJoint(world, element, scene);
}

Physics.updateBodyElementsPosition = function(world) {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		var element = b.element;

		if(element) {
			var a = b.GetAngle();
			var p = b.GetPosition();

			if(p.x !== undefined && p.y !== undefined) {
				var x = Physics.toPixel(p.x) - (element.w >> 1);
				var y = Physics.toPixel(p.y) - (element.h >> 1);
				

				var parent = element.getParent();
				if(!parent.isUIWindow) {
					var pos = parent.getPositionInWindow();
					x = x - pos.x;
					y = y - pos.y;
				}

				var ox = element.x;
				var oy = element.y;

				element.setRotation(a);
				if(ox != x || oy != y) {
					element.setPositionByBody(x, y);
				}
			}
		}
	}

	for (var joint = world.m_jointList; joint; joint = joint.m_next) {
		switch (joint.m_type) {
			case b2Joint.e_distanceJoint: {
				var p0 = joint.GetAnchorA();
				var p1 = joint.GetAnchorB();
				var element = joint.element;

				element.points[0].x = Physics.toPixel(p0.x);
				element.points[0].y = Physics.toPixel(p0.y);

				element.points[1].x = Physics.toPixel(p1.x);
				element.points[1].y = Physics.toPixel(p1.y);
				break;
			}
			case b2Joint.e_pulleyJoint: {
				var p0 = joint.GetAnchorA();
				var p1 = joint.GetGroundAnchorA();
				var p2 = joint.GetGroundAnchorB();
				var p3 = joint.GetAnchorB();

				var element = joint.element;

				element.points[0].x = Physics.toPixel(p0.x);
				element.points[0].y = Physics.toPixel(p0.y);

				element.points[1].x = Physics.toPixel(p1.x);
				element.points[1].y = Physics.toPixel(p1.y);

				element.points[2].x = Physics.toPixel(p2.x);
				element.points[2].y = Physics.toPixel(p2.y);

				element.points[3].x = Physics.toPixel(p3.x);
				element.points[3].y = Physics.toPixel(p3.y);
				break;
			}
			default: {
				var p = joint.GetAnchorA();
				var element = joint.element;
				var x = Physics.toPixel(p.x) - (element.w >> 1);
				var y = Physics.toPixel(p.y) - (element.h >> 1);
				element.setPositionByBody(x, y);

				break;
			}
		}
	}

	return;
}

Physics.destroyWorld = function(world) {
	var b = world.m_bodyList;
	do {
		if(!b) break;

		var next = b.m_next;
		if(b.element) {
			b.element.body = null;
			b.element = null;
		}
		
		world.DestroyBody(b);

		b = next;
	}while(true);

	var joint = world.m_jointList;
	do {
		if(!joint) break;
		var next = joint.m_next;

		if(joint.element) {
			joint.element = null;
		}
			
		world.DestroyJoint(joint);

		joint = next;
	}while(true);

	return;
}

Physics.reparentPhysicsToScene = function(scene) {
	var arr = [];

	function onVisit(el) {
		var parentShape = el.getParent();
		if(el.isUISkeletonAnimation || el.isUISprite || el.isUIFrameAnimation || el.isUITransformAnimation) {
			if(!parentShape.isUIWindow) {
				arr.push(el);
			}
		}
		else if(el.isUIPhysicsShape) {
			if(!parentShape.isUISkeletonAnimation && !parentShape.isUISprite 
				&& !parentShape.isUIFrameAnimation && !parentShape.isUITransformAnimation
				&& !parentShape.isUIWindow) {
					arr.push(el);
			}
		}
	}

	scene.forEach(onVisit);

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		iter.reparent(scene, true);
	}

	return;
}

Physics.createWorld = function(scene) {
	if(scene.world || !window.b2World) {
		return;
	}

	var world = null;
	var maxX = scene.w >> 1;
	var maxY = scene.h >> 1;
	var minX = -scene.w >> 1;
	var minY = -scene.h >> 1;
	var fps = scene.getFPS();
	var allowSleep = scene.allowSleep ? scene.allowSleep : true;
	var gravityX = scene.gravityX ? scene.gravityX : 0;
	var gravityY = scene.gravityY ? scene.gravityY : 0;
	var pixelsPerMeter = scene.pixelsPerMeter ? scene.pixelsPerMeter : 10; 
	var gravity = new b2Vec2(gravityX, gravityY);
	var worldAABB = new b2AABB();
	var stepSize = 1;

	Physics.pixelsPerMeter = pixelsPerMeter;

	worldAABB.lowerBound.Set(minX, minY);
	worldAABB.upperBound.Set(maxX, maxY);

	world = new b2World(gravity, allowSleep);

	Physics.createWorldShapes(world, scene);
	Physics.createWorldJoints(world, scene, scene);

	var listener = new b2ContactListener();
	listener.BeginContact = function (contact) {
		var body1 = contact.GetFixtureA().GetBody();
		var body2 = contact.GetFixtureB().GetBody();

		if(body1.element && body2.element) {
			var element1 = body1.element;
			if(element1.handleBeginContactSync) {
				element1.handleBeginContactSync(body2, contact);
			}
			var element2 = body2.element;
			if(element2.handleBeginContactSync) {
				element2.handleBeginContactSync(body1, contact);
			}
			setTimeout(function() {
				if(body1.element) {
					body1.element.callOnBeginContactHandler(body2, contact);
				}
				if(body2.element) {
					body2.element.callOnBeginContactHandler(body1, contact);
				}
			}, 5);
		}
	}
	
	listener.EndContact = function (contact) {
		var body1 = contact.GetFixtureA().GetBody();
		var body2 = contact.GetFixtureB().GetBody();

		if(body1.element && body2.element) {
			var element1 = body1.element;
			if(element1.handleEndContactSync) {
				element1.handleEndContactSync(body2, contact);
			}
			var element2 = body2.element;
			if(element2.handleEndContactSync) {
				element2.handleEndContactSync(body1, contact);
			}

			setTimeout(function() {
				if(body1.element) {
					body1.element.callOnEndContactHandler(body2, contact);
				}
				if(body2.element) {
					body2.element.callOnEndContactHandler(body1, contact);
				}
			}, 5);
		}
	}
	
	listener.PreSolve = function (contact, oldManifold) {
		var body1 = contact.GetFixtureA().GetBody();
		var body2 = contact.GetFixtureB().GetBody();

		if(body1.element && body2.element) {
			var element1 = body1.element;
			if(element1.handlePreSolve) {
				element1.handlePreSolve(body2, oldManifold);
			}
			var element2 = body2.element;
			if(element2.handlePreSolve) {
				element2.handlePreSolve(body1, oldManifold);
			}
		}
	}

	listener.PostSolve = function (contact, impulse) {
		var body1 = contact.GetFixtureA().GetBody();
		var body2 = contact.GetFixtureB().GetBody();

		if(body1.element && body2.element) {
			var element1 = body1.element;
			if(element1.handlePostSolve) {
				element1.handlePostSolve(body2, impulse);
			}
			var element2 = body2.element;
			if(element2.handlePostSolve) {
				element2.handlePostSolve(body1, impulse);
			}
		}
	}

	world.SetContactListener(listener);

	var velocityIterations = scene.velocityIterations ? scene.velocityIterations : 8;
	var positionIterations = scene.positionIterations ? scene.positionIterations : 5;

	console.log("Box2d:" + velocityIterations + ":" + positionIterations + ":" + fps);

	var timeStep = 1/fps;
	var intervalID = 0;
	function stepIt() {
		if(scene.world != world) {
			clearInterval(intervalID);
			console.log("World is recreated.");
			return false;
		}

		if(scene.isVisible() && scene.isTopWindow() && scene.isPlaying()) {
			world.Step(timeStep, velocityIterations, positionIterations);
		
			scene.postRedraw();
			if(scene.autoClearForce) {
				world.ClearForces();
			}
			Physics.updateBodyElementsPosition(world);
		}

		return true;
	}

	scene.world = world;
	intervalID = setInterval(stepIt, timeStep * 1000);

	return;
}



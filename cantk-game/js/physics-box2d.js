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
		var radius = Physics.toMeter(Math.min(hw, hh));
		fixtureDef.shape = new b2CircleShape(radius);
	}
	else if(element.isUIBox || element.physicsShape === "rectangle") {
		fixtureDef.shape = new b2PolygonShape();
		fixtureDef.shape.SetAsBox(Physics.toMeter(hw), Physics.toMeter(hh));
	}
	else if(element.isUIPolygon) {
		var cx = hw;
		var cy = hh;
		var arr = [];

		for(var i = 0; i < element.children.length; i++) {
			var p = {};
			var iter = element.children[i];

			p.x = Physics.toMeter(iter.x + (iter.w >> 1) - cx);
			p.y = Physics.toMeter(iter.y + (iter.h >> 1) - cy);

			arr.push(p);
		}

		fixtureDef.shape = new b2PolygonShape();
		fixtureDef.shape.SetAsArray(arr, arr.length);
	}
	else if(element.isUIEdge) {
		var p0 = element.points[0];
		var p1 = element.points[1];
		var c = {x: (p0.x+p1.x) >> 1, y: (p0.y+p1.y) >> 1};
		var v0 = new b2Vec2(Physics.toMeter(p0.x-c.x), Physics.toMeter(p0.y-c.y));
		var v1 = new b2Vec2(Physics.toMeter(p1.x-c.x), Physics.toMeter(p1.y-c.y));
		fixtureDef.c = c;
		fixtureDef.shape = new b2EdgeShape(v0, v1);
	}

	return fixtureDef;
}

Physics.createBody = function(world, element) {
	var body = null;
	var hw = element.getWidth() >> 1;
	var hh = element.getHeight() >> 1;
	var x  = element.getX() + hw;
	var y  = element.getY() + hh;
	var bodyDef = new b2BodyDef();
	var fixtureDef = Physics.createFixtureDef(world, element);

	if(fixtureDef.density < 0) {
		delete fixtureDef.density;
		b2BodyDef.type = b2Body.b2_kinematicBody;
	}
	else {
		bodyDef.type = fixtureDef.density ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
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
					
	if(element.linearDamping !== undefined) {
		bodyDef.linearDamping = element.linearDamping;
	}
	
	if(element.angularDamping !== undefined) {
		bodyDef.angularDamping = element.angularDamping;
	}

//	if(element.gravityScale !== undefined) {
//		bodyDef.gravityScale = element.gravityScale;
//	}

	body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	body.element = element;
	body.name = element.name;
	element.body = body;

	if(element.rotation) {
		body.SetAngle(element.rotation);
	}

	return body;
}

Physics.createBodyForElement = function(world, parentElement, childElement) {
	var bodyDef = null;

	if(childElement.physicsShape) {
		Physics.createBody(world, childElement);	

		return;
	}
	else if(childElement.isUIPhysicsShape) {
		if(parentElement.isUIWindow) {
			Physics.createBody(world, childElement);

			return;
		}
		else {
			var fixtureDef = Physics.createFixtureDef(world, childElement);
			if(childElement.isUICircle) {
				var p = {};
				p.x = Physics.toMeter(childElement.x + (childElement.w >> 1) - (parentElement.w >> 1));
				p.y = Physics.toMeter(childElement.y + (childElement.h >> 1) - (parentElement.h >> 1));
				/*TODO*/
			//	fixtureDef.shape.SetLocalPosition(p);
			}

			if(!bodyDef) {
				var hw = parentElement.w >> 1;
				var hh = parentElement.h >> 1;
				var x  = parentElement.x + hw;
				var y  = parentElement.y + hh;
				
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
				
				if(childElement.linearDamping !== undefined) {
					bodyDef.linearDamping = childElement.linearDamping;
				}
				
				if(childElement.angularDamping !== undefined) {
					bodyDef.angularDamping = childElement.angularDamping;
				}

//					if(childElement.gravityScale !== undefined) {
//						bodyDef.gravityScale = childElement.gravityScale;
//					}

				var body = world.CreateBody(bodyDef);
				body.element = parentElement;
				parentElement.body = body;
			}

			body.CreateFixture(fixtureDef);
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

		element.body = null;
	}

	return;


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

Physics.findBodiesAtPoint= function(scene, point) {
	var arr = [];
	var n = scene.children.length;
	for(var i = n-1; i >= 0; i--) {
		var iter = scene.children[i];
		if(!iter.body) {
			continue;
		}

		if(point.x > iter.x && point.y > iter.y && point.x < (iter.x + iter.w) && point.y < (iter.y + iter.h)) {
			arr.push(iter.body);
		}
	}

	return arr;
}

Physics.createWorldJoints = function(world, scene, element) {
	for(var i = 0; i < element.children.length; i++) {
		var iter = element.children[i];

		Physics.createWorldJoints(world, scene, iter);
	}

	if(!element.isUIJoint) {
		return;
	}

	if(element.isUIOneJoint) {
		var p = {};
		var arr = null;
		p.x = element.x + (element.w >> 1);
		p.y = element.y + (element.h >> 1);

		arr = Physics.findBodiesAtPoint(scene, p);

		if(arr.length == 1) {
			arr = [world.GetGroundBody(), arr[0]];
		}

		if(arr.length > 1) {
			var rJointDef = null;
			var anchorPoint = new b2Vec2(Physics.toMeter(p.x), Physics.toMeter(p.y));

			if(element.isUIRevoluteJoint) {
				rJointDef = new b2RevoluteJointDef();
				rJointDef.Initialize(arr[0], arr[1], anchorPoint);

				rJointDef.lowerAngle = element.lowerAngle ? element.lowerAngle : 0;
				rJointDef.upperAngle = element.upperAngle ? element.upperAngle : 0;
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
		}
		else {
			console.log("not found body");
		}
	}
	else if(element.isUITwoJoint) {
		var rJointDef = null;
		var p0 = element.points[0];
		var p1 = element.points[1];
		var arr0 = Physics.findBodiesAtPoint(scene, p0);
		var arr1 = Physics.findBodiesAtPoint(scene, p1);

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
		var arr0 = Physics.findBodiesAtPoint(scene, p0);
		var arr1 = Physics.findBodiesAtPoint(scene, p3);

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
		}
		else {
			console.log("not found body");
		}
	}

	return;
}

Physics.updateBodyElementsPosition = function(world) {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		var element = b.element;

		if(element) {
			var p = b.GetWorldCenter();
			var a = b.GetAngle();

			if(p.x && p.y) {
				var x = Physics.toPixel(p.x) - (element.w >> 1);
				var y = Physics.toPixel(p.y) - (element.h >> 1);
				element.setRotation(a);
				element.setPositionByBody(x, y);
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

Physics.clearAllBodyAndJoints = function(world) {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		if(b.element) {
			b.element.body = null;
			b.element = null;

			world.DestroyBody(b);
		}
	}

	for (var joint = world.m_jointList; joint; joint = joint.m_next) {
		if(joint.element) {
			joint.element = null;
			world.DestroyJoint(joint);
		}
	}

	return;
}

Physics.createWorld = function(scene) {
	if(scene.world) {
		return;
	}

	var world = null;
	var maxX = scene.w >> 1;
	var maxY = scene.h >> 1;
	var minX = -scene.w >> 1;
	var minY = -scene.h >> 1;
	var fps = scene.fps ? scene.fps : 60;
	var doSleep = scene.doSleep ? scene.doSleep : true;
	var gravityX = scene.gravityX ? scene.gravityX : 0;
	var gravityY = scene.gravityY ? scene.gravityY : 0;
	var pixelsPerMeter = scene.pixelsPerMeter ? scene.pixelsPerMeter : 10; 
	var gravity = new b2Vec2(gravityX, gravityY);
	var worldAABB = new b2AABB();
	var timeStep = 1.0/fps;
	var stepSize = 1;

	Physics.pixelsPerMeter = pixelsPerMeter;

	worldAABB.lowerBound.Set(minX, minY);
	worldAABB.upperBound.Set(maxX, maxY);

	world = new b2World(gravity, doSleep);

	Physics.createWorldShapes(world, scene);
	Physics.createWorldJoints(world, scene, scene);

	var listener = new b2ContactListener();
	listener.BeginContact = function (contact) {
		var body1 = contact.GetFixtureA().GetBody();
		var body2 = contact.GetFixtureB().GetBody();

		if(body1.element && body2.element) {
			setTimeout(function() {
				body1.element.callOnBeginContact(body2);
				body2.element.callOnBeginContact(body1);
			}, 10);
		}
	}
	
	listener.EndContact = function (contact) {
		var body1 = contact.GetFixtureA().GetBody();
		var body2 = contact.GetFixtureB().GetBody();

		if(body1.element && body2.element) {
			setTimeout(function() {
				body1.element.callOnEndContact(body2);
				body2.element.callOnEndContact(body1);
			}, 10);
		}
	}
	
	listener.PreSolve = function (contact, oldManifold) {
		/*TODO*/
	}

	listener.PostSolve = function (contact, impulse) {
		/*TODO*/
	}

	world.SetContactListener(listener);

	var velocityIterations = scene.velocityIterations ? scene.velocityIterations : 8;
	var positionIterations = scene.positionIterations ? scene.positionIterations : 3;

	function stepIt() {
		if(scene.world != world) {
			console.log("World is recreated.");
			return;
		}

		if(scene.isVisible()) {
			world.Step(timeStep, velocityIterations, positionIterations);

			scene.postRedraw();
			world.ClearForces();
			Physics.updateBodyElementsPosition(world);
		}
	
		UIElement.setAnimTimer(stepIt);
	}

	scene.world = world;
	stepIt();

	return;
}



function Physics() {
};

Physics.pixelsPerMeter = 10;

Physics.toMeter = function(pixel) {
	return pixel / Physics.pixelsPerMeter;
}

Physics.toPixel = function(meter) {
	return meter * Physics.pixelsPerMeter;
}

Physics.createFixtureDef = function(world, element) {
	var hw = element.w >> 1;
	var hh = element.h >> 1;
	var fixtureDef = new b2FixtureDef();
	var x = element.left + hw;
	var y = element.top + hh;

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
	else if(element.isUIBox || element.physicsShape ===	"rectangle") {
	        hw = element.getWidth(true) >> 1;
	        hh = element.getHeight(true) >> 1;
	        fixtureDef.shape = new b2PolygonShape();
	        fixtureDef.shape.SetAsBox(Physics.toMeter(hw),	Physics.toMeter(hh));
	}
	else if(element.isUIPolygon) {
		    var cx = hw;
	        var cy = hh;
	        var arr = [];
	        var fixtureDefs = [];
	        var n = element.children.length;
			if(n < 3) {
				alert("Polygon has no enough points");
				return null;
			}
            var result = element.getVerticesArray();
            var vertices = result.vertices;
            if(result.complex) {
                for(var i = 0; i < vertices.length; i = i + 3) {
                    var arr = vertices.slice(i, i + 3);
                    arr = arr.map(function(p){return new b2Vec2(Physics.toMeter(p.x -cx), Physics.toMeter(p.y -cy))});
                    fixtureDef = new b2FixtureDef();
                    fixtureDef.density = element.density;
                    fixtureDef.friction = element.friction;
                    fixtureDef.restitution = element.restitution;
                    fixtureDef.isSensor = element.isSensor;
                    if(element.categoryBits) {
                        fixtureDef.filter.categoryBits = element.categoryBits;
                    }
                    if(element.maskBits) {
                        fixtureDef.filter.maskBits = element.maskBits;
                    }
                    if(element.groupIndex) {
                        fixtureDef.filter.groupIndex = element.groupIndex;
                    }

                    fixtureDef.shape = new	b2PolygonShape();
                    fixtureDef.shape.SetAsArray(arr, arr.length);
                    fixtureDefs.push(fixtureDef);
                }
            } else {
                fixtureDef = new b2FixtureDef();
                fixtureDef.density = element.density;
                fixtureDef.friction = element.friction;
                fixtureDef.restitution = element.restitution;
                fixtureDef.isSensor = element.isSensor;
                if(element.categoryBits) {
                    fixtureDef.filter.categoryBits = element.categoryBits;
                }
                if(element.maskBits) {
                    fixtureDef.filter.maskBits = element.maskBits;
                }
                if(element.groupIndex) {
                    fixtureDef.filter.groupIndex = element.groupIndex;
                }

                var arr = vertices.map(function(p){return new b2Vec2(Physics.toMeter(p.x -cx), Physics.toMeter(p.y -cy))});
                fixtureDef.shape = b2PolygonShape.AsArray(arr, arr.length);
                fixtureDefs.push(fixtureDef);
            }

	        return fixtureDefs.length > 1 ? fixtureDefs : fixtureDefs[0];
	}
	else if(element.isUIEdge) {
			var parent = element.getParent();
			var p0 = parent.localToGlobal(element.points[0]);
			var p1 = parent.localToGlobal(element.points[1]);

			var cx = (p0.x + p1.x) >> 1;
			var cy = (p0.y + p1.y) >> 1;
			var x0 = p0.x - cx;
			var y0 = p0.y - cy;
			var x1 = p1.x - cx;
			var y1 = p1.y - cy;
			var v0 = new b2Vec2(Physics.toMeter(x0), Physics.toMeter(y0));
			var v1 = new b2Vec2(Physics.toMeter(x1), Physics.toMeter(y1));
			fixtureDef.shape = new b2PolygonShape()
			fixtureDef.shape.SetAsEdge(v0, v1);
	}

	return fixtureDef;
}

Physics.createBody = function(world, element) {
    if(element.fixture || element.body) {
        return;
    }
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
		bodyDef.type = b2Body.b2_kinematicBody;
	}
	else {
		bodyDef.type = density ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;
	}

	if(element.isUIEdge) {
		var parent = element.getParent();
		var p0 = parent.localToGlobal(element.points[0]);
		var p1 = parent.localToGlobal(element.points[1]);
		x = (p0.x + p1.x) >> 1;
		y = (p0.y + p1.y) >> 1;
		bodyDef.position.Set(Physics.toMeter(x), Physics.toMeter(y));
	}
	else {
		bodyDef.position.Set(Physics.toMeter(x), Physics.toMeter(y));
	}
	
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
					
	bodyDef.linearDamping = element.linearDamping || 0;
	bodyDef.angularDamping = element.angularDamping || 0;

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

    body.GetFixtureList().m_shape.element = element;
    element.fixture = body.GetFixtureList().m_shape;
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

	element.onBodyCreated();

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
		}, 0);

		body.element = null;
		element.body = null;
	}

	return;
}

Physics.destroyJointForElement = function(world, element) {
	if(element.joint) {
        var joint = element.joint;
        element.joint = null;
		setTimeout(function() {
			world.DestroyJoint(joint);
            joint = null;
		}, 0);
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

Physics.findBodiesAtPoint = function(scene, point, index) {
	var arr = [];
	var n = scene.children.length;

	var canvas = cantkGetTempCanvas(scene.w, scene.h);
	var ctx = canvas.getContext("2d");

	for(var i = index; i >= 0; i--) {
		var iter = scene.children[i];
		if(!iter.body) {
			continue;
		}

		var rect = {x:iter.left, y:iter.top, w:iter.w, h:iter.h};
		if(iter.rotation) {
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
		else {
			if(isPointInRect(point, rect)) {
				arr.push(iter.body);
			}
		}
	}

	return arr;
}

Physics.createJoint = function(world, element, scene) {
	var scene = element.getWindow();
	if(!element.isUIJoint || element.isUIMouseJoint) {
		return;
	}

	if(element.isUIOneJoint) {
		var p = {};
		var arr = null;
		p.x = element.left + (element.w >> 1);
		p.y = element.top + (element.h >> 1);

		var index = element.getIndex();
		arr = Physics.findBodiesAtPoint(scene, p, index);

		if(arr.length == 1) {
			arr = [world.GetGroundBody(), arr[0]];
		}

		if(arr.length > 1) {
			var rJointDef = null;
			var anchorPoint = new b2Vec2(Physics.toMeter(p.x), Physics.toMeter(p.y));

			if(arr[0].GetType() === b2Body.b2_staticBody && arr[1].GetType() === b2Body.b2_staticBody) {
				console.log("%cWarning: it seems no meanings to pin two static body together.", 
					"color: red; font-weight: bold");
			}
			
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
		var index = element.getIndex();
		var arr0 = Physics.findBodiesAtPoint(scene, p0, index);
		var arr1 = Physics.findBodiesAtPoint(scene, p1, index);

		if(arr0.length && arr1.length) {
			var anchorPoint0 = new b2Vec2(Physics.toMeter(p0.x), Physics.toMeter(p0.y));
			var anchorPoint1 = new b2Vec2(Physics.toMeter(p1.x), Physics.toMeter(p1.y));

			if(element.disableBounce) {
				var anchorPoint = new b2Vec2(Physics.toMeter((p0.x+p1.x) >> 1), Physics.toMeter((p0.y + p1.y)>>1));
				rJointDef = new b2RevoluteJointDef();
				rJointDef.Initialize(arr0[0], arr1[0], anchorPoint);

				rJointDef.lowerAngle = (element.lowerAngle ? element.lowerAngle : 0)*Math.PI/180;
				rJointDef.upperAngle = (element.upperAngle ? element.upperAngle : 0)*Math.PI/180;
				rJointDef.motorSpeed = element.motorSpeed ? element.motorSpeed : 0;
				rJointDef.maxMotorTorque = element.maxMotorTorque ? element.maxMotorTorque : 0;
				rJointDef.enableLimit = element.enableLimit ? element.enableLimit : false;
				rJointDef.enableMotor = element.enableMotor ? element.enableMotor : false;
				rJointDef.collideConnected = element.collideConnected;
			}else if(element.isUIDistanceJoint) {
				rJointDef = new b2DistanceJointDef();
				rJointDef.Initialize(arr0[0], arr1[0], anchorPoint0, anchorPoint1);

				rJointDef.frequencyHz = element.frequencyHz || 0;
				rJointDef.dampingRatio = element.dampingRatio || 0;
				rJointDef.collideConnected = element.collideConnected;
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
		var index = element.getIndex();
		var arr0 = Physics.findBodiesAtPoint(scene, p0, index);
		var arr1 = Physics.findBodiesAtPoint(scene, p3, index);

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

Physics.getBodySize = function(body) {
    var fixture = body.GetFixtureList();
    var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
    var pb = body.GetPosition();
    while(fixture) {
        var shape = fixture.m_shape;
        if(shape instanceof b2CircleShape){
            if(maxX < pb.x + shape.m_p.x + shape.m_radius) {
                maxX = pb.x + shape.m_p.x + shape.m_radius
            } 
            if(maxY < pb.y + shape.m_p.y + shape.m_radius){
                maxY = pb.y + shape.m_p.y + shape.m_radius
            }
            if(minX > pb.x + shape.m_p.x - shape.m_radius) {
                minX = pb.x + shape.m_p.x - shape.m_radius
            } 
            if(minY > pb.y + shape.m_p.y - shape.m_radius){
                minY = pb.y + shape.m_p.y - shape.m_radius
            }
        } else if(shape instanceof b2PolygonShape) {
            for(var i = 0; i < shape.m_vertexCount; i++) {
                var vert = shape.m_vertices[i];
                if(minX > pb.x + vert.x) {
                    minX = pb.x + vert.x;
                }
                if(maxX < pb.x + vert.x) {
                    maxX = pb.x + vert.x;
                }
                if(minY > pb.y + vert.y) {
                    minY = pb.y + vert.y
                }
                if(maxY < pb.y + vert.y) {
                    maxY = pb.y + vert.y;
                }
            }
        }
        fixture = fixture.m_next;
    }
    return {w:Physics.toPixel(maxX - minX), h:Physics.toPixel(maxY - minY)}
}

Physics.createUIRubeBody = function(body, world, scene) {
    var rubeBody = ShapeFactoryGet().createShape("ui-rube-body", "from RUBE");
    rubeBody.setBody(body);
    rubeBody.setGravityScale({x:body.gravityScale, y:body.gravityScale});
    rubeBody.name = body.name;
    rubeBody.setZIndex(0);
    rubeBody.setAnchor(0.5, 0.5);
    var size = Physics.getBodySize(body);
    rubeBody.resize(size.w, size.h);
    body.element = rubeBody;
    scene.addChild(rubeBody);
    
    return rubeBody;
}

Physics.createElementForJoint = function(joint, world, scene) {
    var shape = joint;
    if(shape instanceof b2RevoluteJoint) {
        console.log("create b2RevoluteJoint");
    } else if(shape instanceof b2DistanceJoint){
        console.log("create b2DistanceJoint");
    } else if(shape instanceof b2PrismaticJoint) {
        console.log("crate b2PrismaticJoint");
    } else if(shape instanceof b2FrictionJoint) {
        console.log("create b2FrictionJoint");
    } else if(shape instanceof b2WeldJoint) {
        console.log("create b2WeldJoint");
    } else {
        console.warn("RUBE: unknown joint type");
    }
}

Physics.updateBodyElementsPosition = function(world) {
	for (var b = world.m_bodyList; b; b = b.m_next) {
        var element = b.element;
        
		if(element && element.getParent()) {
			var a = b.GetAngle();
			var p = b.GetPosition();
            if(p.x !== undefined && p.y !== undefined) {
                var x = Physics.toPixel(p.x) - (element.getWidth() >> 1);
                var y = Physics.toPixel(p.y) - (element.getHeight() >> 1);

                var parent = element.getParent();
                if(!parent.isUIWindow) {
                    var pos = parent.getPositionInWindow();
                    x = x - pos.x;
                    y = y - pos.y;
                }

                var ox = element.left;
                var oy = element.top;

                element.setRotation(a);
                if(ox !== x || oy !== y) {
                    element.setPositionByBody(x, y);
                }
            }
		}
	}

	for (var joint = world.m_jointList; joint; joint = joint.m_next) {
		var element = joint.element;
		if(!element || !element.getParent()) continue;

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
				if(element.isUIDistanceJoint) {
					var p0 = joint.GetAnchorA();
					var p1 = joint.GetAnchorB();

					element.points[0].x = Physics.toPixel(p0.x);
					element.points[0].y = Physics.toPixel(p0.y);

					element.points[1].x = Physics.toPixel(p1.x);
					element.points[1].y = Physics.toPixel(p1.y);
				}
				else {
					var x = Physics.toPixel(p.x) - (element.w >> 1);
					var y = Physics.toPixel(p.y) - (element.h >> 1);
					element.setPositionByBody(x, y);
				}

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

Physics.setEventListeners = function(world) {
	var listener = new b2ContactListener();
	listener.BeginContact = function (contact) {
        var body1 = contact.GetFixtureA().GetBody();
        var body2 = contact.GetFixtureB().GetBody();
		var element1 = body1.element;
		var element2 = body2.element;
		
        if(element1 && element2) {
			element1.callOnBeginContactHandler(body2, contact);
			element2.callOnBeginContactHandler(body1, contact);
		}
	}
	
	listener.EndContact = function (contact) {
        var body1 = contact.GetFixtureA().GetBody();
        var body2 = contact.GetFixtureB().GetBody();
		var element1 = body1.element;
		var element2 = body2.element;

		if(element1 && element2) {
			element1.callOnEndContactHandler(body2, contact);
			element2.callOnEndContactHandler(body1, contact);
		}
	}
	
	listener.PreSolve = function (contact, oldManifold) {
        var body1 = contact.GetFixtureA().GetBody();
        var body2 = contact.GetFixtureB().GetBody();
		var element1 = body1.element;
		var element2 = body2.element;

		if(element1 && element2) {
			element1.callOnPreSolveHandler(body2, contact, oldManifold);
			element2.callOnPreSolveHandler(body1, contact, oldManifold);
		}
	}

	listener.PostSolve = function (contact, impulse) {
        var body1 = contact.GetFixtureA().GetBody();
        var body2 = contact.GetFixtureB().GetBody();
		var element1 = body1.element;
		var element2 = body2.element;

		if(element1 && element2) {
			element1.callOnPostSolveHandler(body2, contact, impulse);
			element2.callOnPostSolveHandler(body1, contact, impulse);
		}
	}

	world.SetContactListener(listener);
}

Physics.createWorld = function(scene) {
	if(scene.world || !window.b2World) {
		return;
	}
	
	if(!scene.pixelsPerMeter) {
		scene.pixelsPerMeter = 100;
	}
	var velocityIterations = scene.velocityIterations || 8;
	var positionIterations = scene.positionIterations || 3;
	var gravity = new b2Vec2(scene.gravityX || 0, scene.gravityY || 0);
	var world = new b2World(gravity, scene.allowSleep || false);
	Physics.pixelsPerMeter = scene.pixelsPerMeter || 100;

	Physics.createWorldShapes(world, scene);
	Physics.createWorldJoints(world, scene, scene);
	Physics.setEventListeners(world);
    world.SetWarmStarting(scene.warmStarting);

	scene.world = world;
	Physics.startTimer(world, scene, velocityIterations, positionIterations);
}

Physics.startTimer = function(world, scene, velocityIterations, positionIterations) {
	var timeStep = 1/40;
	var timerID = setInterval(stepIt, timeStep * 1000);

	function stepIt(timestamp) {
		if(scene.world !== world) {
			console.log("World is recreated.");
			clearInterval(timerID);
			return false;
		}

		var realTimeStep = scene.scaleTime(timeStep);
		if(scene.timeScaleIsZero()) {
			realTimeStep = 0;
		}

		if(scene.isCurrent() && realTimeStep > 0) {
			world.Step(realTimeStep, velocityIterations, positionIterations);
		
			if(scene.autoClearForce) {
				world.ClearForces();
			}

			Physics.pixelsPerMeter = scene.pixelsPerMeter;
			Physics.updateBodyElementsPosition(world);
		}
	}

	return;
}


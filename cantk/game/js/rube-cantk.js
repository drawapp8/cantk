function RubeCantk(scene) {
    this.cantkScene = scene;
    this.PTM = scene.pixelsPerMeter;
    this.world = scene.world;
    this.lastMousePosPixel = { x: 0, y: 0 };
    this.mousePosWorld = { x: 0, y: 0 };
    this.mouseDownQueryCallback = null;
    this.mouseJointGroundBody = null;
    this.mouseJoint = null;
    this.debugDraw = null;
}

var hasOwnProperty = function(obj, property) {
	return typeof (obj[property]) !== 'undefined'
};

RubeCantk.prototype.getWorldPointFromPixelPoint = function(pixelPoint) {
    return {                
        x: (pixelPoint.x)/this.PTM,
        y: (pixelPoint.y)/this.PTM
    };
}

RubeCantk.prototype.getPixelPointFromWorldPoint = function(worldPoint) {
    return {                
        x: (this.worldPoint.x * this.PTM),
        y: (this.worldPoint.y * this.PTM)
    };
}

RubeCantk.prototype.updateMousePos = function(event) {
    this.mousePosWorld = this.getWorldPointFromPixelPoint(event.point);        
}

RubeCantk.MouseDownQueryCallback = function() {
    this.m_fixture = null;
    this.m_point = new b2Vec2();
}

RubeCantk.MouseDownQueryCallback.prototype.ReportFixture = function(fixture) {
    if(fixture.GetBody().GetType() == 2) { //dynamic bodies only
        if ( fixture.TestPoint(this.m_point) ) {
            this.m_fixture = fixture;
            return false;
        }
    }
    return true;
};

RubeCantk.prototype.tryStartMouseJoint = function() {
    if ( this.mouseJoint != null )
        return;
   
    // Make a small box.
    var aabb = new b2AABB();
    var d = 0.001;
    aabb.lowerBound.Set(this.mousePosWorld.x - d, this.mousePosWorld.y - d);
    aabb.upperBound.Set(this.mousePosWorld.x + d, this.mousePosWorld.y + d);
    
    // Query the this.world for overlapping shapes.            
    this.mouseDownQueryCallback.m_fixture = null;
    this.mouseDownQueryCallback.m_point.Set(this.mousePosWorld.x, this.mousePosWorld.y);
    this.world.QueryAABB(function(fixture){
    	if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
			if (fixture.GetShape().TestPoint(
					fixture.GetBody().GetTransform(), this.mousePosWorld)) {
				 this.mouseDownQueryCallback.m_fixture = fixture;
				 selectedBody = fixture.GetBody();
				return false;
			}
		}
    	selectedBody = undefined;
		return true;
    }.bind(this), aabb);

    if (this.mouseDownQueryCallback.m_fixture)
    {
        var body = this.mouseDownQueryCallback.m_fixture.GetBody();
        var md = new b2MouseJointDef();
        md.bodyA = this.mouseJointGroundBody;
        md.bodyB = body;
        md.target.Set(this.mousePosWorld.x, this.mousePosWorld.y);
        md.maxForce = 300 * body.GetMass();
        md.collideConnected = true;
        
        this.mouseJoint = this.world.CreateJoint(md);
        body.SetAwake(false);
    }
}

RubeCantk.prototype.setAssetsLoader = function(assetsLoader) {
    this.assetsLoader = assetsLoader;
}

RubeCantk.prototype.onImageAssetLoaded = function(image, data, index) {
    var element = ShapeFactoryGet().createShape("ui-image", "from RUBE");
    element.setAnchor(0.5, 0.5);
    element.isUIRubeImage = true;
    element.name = image.name || "ui-image";
    image.element = element;
    element.setZIndex(index);

    element.setImageSrc(data.src);
    element.w = data.width;
    element.h = data.height;
    image.pixelHeight = element.h;
    element.images.display = UIElement.IMAGE_DISPLAY_SCALE;
    this.cantkScene.addChild(element);
    
    if(this.createdCallback) {
        this.createdCallback(element);
    } 
}

RubeCantk.prototype.createRube = function(worldJso, options) {    
    //set debug draw
    if(!worldJso) {
        return;
    }
    options = options || {};
    this.createdCallback = options.createdCallback;
 
    var scene = this.cantkScene;
    function overridePhysicsValue(key) {
        if(worldJso[key] !== undefined) {
            scene[key] = worldJso[key];
        }
    }
    var keys = [
        "allowSleep",
        "autoClearForce",
        "positionIterations",
        "velocityIterations",
        "warmStarting",
        "subStepping",
        "stepsPerSecond",
    ];
    var length = keys.length;
    for(var i = 0; i < length; i++) {
        //overridePhysicsValue(keys[i]);
    }

    if(!scene.world) {
        scene.setEnablePhysics(true);
        scene.startPhysics(); 
    }

    this.world = scene.world;
    if(!this.world) {
        console.error("Start physics failed, igrone RUBE json");

        return;
    }
    this.loadSceneFromRUBE(worldJso, this.world, scene);

    this.interactive = options.interactive || true; 

    if(this.world.images) {
        for (var i = 0; i < this.world.images.length; i++) {
            (function(i) {
                var index = i;
                var image = this.world.images[i];
                var src = this.world.images[i].file;
                this.assetsLoader.loadImage(basename(src), function(data) {
                    this.onImageAssetLoaded(image, data, index);
                }.bind(this));
            }.bind(this))(i)
        }
    }
        
    this.mouseJointGroundBody = this.world.CreateBody( new b2BodyDef() );
    this.mouseDownQueryCallback = new RubeCantk.MouseDownQueryCallback();
 
    if(this.interactive) { 
        scene.addEventListener("pointerdown", this.onPointerDown.bind(this));
        scene.addEventListener("pointermove", this.onPointerMove.bind(this));
        scene.addEventListener("pointerup", this.onPointerUp.bind(this));
    }
    var debug = options.debug || true;
    if(debug) {
        var debugDraw = new b2DebugDraw;
        debugDraw.SetSprite(UIElement.getMainCanvas().getContext("2d"));
        debugDraw.SetDrawScale(Physics.pixelsPerMeter);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.debugDraw = debugDraw;
        this.world.SetDebugDraw(debugDraw);
    }
    scene.addEventListener("updatetransform", this.onUpdateTransform.bind(this));
}

RubeCantk.prototype.onPointerDown = function(event) {
    if(!event || event.beforeChild) {
        return;
    }
    this.updateMousePos(event);
    
    this.tryStartMouseJoint();
   
    this.lastMousePosPixel = {x:event.point.x, y:event.point.y};
}

RubeCantk.prototype.onPointerMove = function(event) {
    if(!event || event.beforeChild) {
        return;
    }

    this.updateMousePos(event);
    if (this.cantkScene.pointerDown) {
        if ( this.mouseJoint != null ) {
            // move mouse joint
            this.mouseJoint.SetTarget( this.mousePosWorld );
        }
    }
    
    this.lastMousePosPixel = {x:event.point.x, y:event.point.y};
}

RubeCantk.prototype.onPointerUp = function(event) {
    if(!event || event.beforeChild) {
        return;
    }

    if ( this.mouseJoint ) {
        this.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
    }
}

RubeCantk.prototype.positionImages = function() {
    var images = this.world.images;
    if ( this.world.images ) {
        var length = images.length; 
        var PTM = this.PTM;
        for (var i = 0; i < length; i++) {
            var image = images[i];
            element = image.element;
            if(!element) {
                continue;
            }
            
            element.setRotation(image.angle);
            var imageScale = PTM / image.pixelHeight * image.scale;
            element.setScale(image.aspectScale * imageScale, imageScale);
            if(image.flip ) {
                element.scale.x *= -1;
            }

            if(image.body ) {
                var ic = new b2Vec2(image.center.x, -image.center.y);
                var imageWorldCenter = image.body.GetWorldPoint(ic);
                element.setPosition(imageWorldCenter.x, imageWorldCenter.y);
                element.setRotation(image.body.GetAngle() + image.angle);
                if(image.body.element) {
                    image.body.element.setVisible(false);
                }
            }
            else {
                // no body
                element.setPosition(this.pCenter.x + image.center.x, this.pCenter.y);
            }
            element.x *= PTM;
            element.y *= PTM;
        }
    }
}

RubeCantk.prototype.onUpdateTransform = function() {
    this.positionImages();
}

// remove the body and all related images/sprites
RubeCantk.prototype.removeBodyFromScene = function(body) {
    var imagesToRemove = [];
    for (i = 0; i < this.world.images.length; i++) {
        if ( this.world.images[i].body == body )
            imagesToRemove.push(this.world.images[i]);
    }
    for (var i = 0; i < imagesToRemove.length; i++) {
        imagesToRemove[i].element.remove(true);
        removeFromArray(this.world.images, imagesToRemove[i]);
    }
    if(body.element){
        body.element.remove(true);
    }
    this.world.DestroyBody( body );
}

// remove an image/sprite from the scene
RubeCantk.prototype.removeImageFromScene = function(image) {
    image.element.remove(true);
    removeFromArray(this.world.images, image);
}

RubeCantk.prototype.getVerticesArray = function(vertices) {
    var complex = false;
    if(ClockWise(vertices) === CLOCKWISE) {
        console.warn("clock wise polygon");
        vertices.reverse();
    }
    if(Convex(vertices) === CONCAVE) {
        complex = true;
    }
    
    var array = complex ? process(vertices) : vertices;
    return {complex: complex, vertices: array};
}

RubeCantk.prototype.loadFixtureFromRUBE = function(body, fixtureJso) {
	// console.log(fixtureJso);
	var fd = new b2FixtureDef();
	if (hasOwnProperty(fixtureJso, 'friction'))
		fd.friction = fixtureJso.friction;
	if (hasOwnProperty(fixtureJso, 'density'))
		fd.density = fixtureJso.density;
	if (hasOwnProperty(fixtureJso, 'restitution'))
		fd.restitution = fixtureJso.restitution;
	if (hasOwnProperty(fixtureJso, 'sensor'))
		fd.isSensor = fixtureJso.sensor;
	if (hasOwnProperty(fixtureJso, 'filter-categoryBits'))
		fd.filter.categoryBits = fixtureJso['filter-categoryBits'];
	if (hasOwnProperty(fixtureJso, 'filter-maskBits'))
		fd.filter.maskBits = fixtureJso['filter-maskBits'];
	if (hasOwnProperty(fixtureJso, 'filter-groupIndex'))
		fd.filter.groupIndex = fixtureJso['filter-groupIndex'];
	if (hasOwnProperty(fixtureJso, 'circle')) {
		fd.shape = new b2CircleShape();
		fd.shape.m_radius = fixtureJso.circle.radius;
		if (fixtureJso.circle.center)
			fd.shape.m_p.SetV(fixtureJso.circle.center);
        fd.shape.m_p.y *= -1;
		var fixture = body.CreateFixture(fd);
		if (fixtureJso.name)
			fixture.name = fixtureJso.name;
	} else if (hasOwnProperty(fixtureJso, 'polygon')) {
		fd.shape = new b2PolygonShape();
		var verts = [];
		for (v = 0; v < fixtureJso.polygon.vertices.x.length; v++)
			verts.push(new b2Vec2(fixtureJso.polygon.vertices.x[v],
					-fixtureJso.polygon.vertices.y[v]));
        var result = this.getVerticesArray(verts);
        if(result.complex) {
            console.error("input vertices has convex polygon?");
        } else {
            verts = result.vertices;
        }
        
		fd.shape.SetAsArray(verts, verts.length);
		var fixture = body.CreateFixture(fd);
		if (fixture && fixtureJso.name)
			fixture.name = fixtureJso.name;
	} else if (hasOwnProperty(fixtureJso, 'chain')) {
		fd.shape = new b2PolygonShape();
		var lastVertex = new b2Vec2();
		for (v = 0; v < fixtureJso.chain.vertices.x.length; v++) {
			var thisVertex = new b2Vec2(fixtureJso.chain.vertices.x[v],
					fixtureJso.chain.vertices.y[v]);
			if (v > 0) {
				fd.shape.SetAsEdge(lastVertex, thisVertex);
				var fixture = body.CreateFixture(fd);
				if (fixtureJso.name)
					fixture.name = fixtureJso.name;
			}
			lastVertex = thisVertex;
		}
	} else {
		console.log("Could not find shape type for fixture");
	}

	if (fixture) {
		if (hasOwnProperty(fixtureJso, 'customProperties'))
			fixture.customProperties = fixtureJso.customProperties;
	}
}

RubeCantk.prototype.loadBodyFromRUBE = function(bodyJso, world, cantkScene) {
    if ( ! bodyJso.hasOwnProperty('type') ) {
        console.log("Body does not have a 'type' property");
        return null;
    }    

    var bd = new b2BodyDef();
    if ( bodyJso.type == 2 )
        bd.type = b2Body.b2_dynamicBody;
    else if ( bodyJso.type == 1 )
        bd.type = b2Body.b2_kinematicBody;
    else
        bd.type = b2Body.b2_staticBody;

    var angle = (bodyJso.angle || 0);
    if (hasOwnProperty(bodyJso, 'angularVelocity')) {
        bd.angularVelocity = bodyJso.angularVelocity; 
        bd.angularVelocity.y *= -1;
    }

    if (hasOwnProperty(bodyJso, 'angularDamping')) {
        bd.angularDamping = bodyJso.angularDamping;
    }
    
    bd.awake = (bodyJso.awake || false);
    bd.bullet = (bodyJso.bullet || false);
    bd.fixedRotation = (bodyJso.fixedRotation || false);
    if (hasOwnProperty(bodyJso, 'linearDamping')) {
        bd.linearDamping = bodyJso.linearDamping;
    }

    if ( bodyJso.hasOwnProperty('linearVelocity') && bodyJso.linearVelocity instanceof Object ) {
        bd.linearVelocity = (parseVec( bodyJso.linearVelocity ));
        bd.linearVelocity.y *= -1;
    }
    else {
        bd.linearVelocity = (new b2Vec2(0,0));
    }

    var pCenter = {x: Physics.toMeter(cantkScene.w >> 1), y:Physics.toMeter(cantkScene.h >> 1)};
    this.pCenter = pCenter;
    var position;
    if ( bodyJso.hasOwnProperty('position') && bodyJso.position instanceof Object ) {
        var p = parseVec(bodyJso.position );
        position = (new b2Vec2(pCenter.x + p.x, pCenter.y - p.y));
    } else
        position = (new b2Vec2(pCenter.x, pCenter.y));

    if (bodyJso.hasOwnProperty('gravityScale') && !isNaN(parseFloat(bodyJso.gravityScale)) && isFinite(bodyJso.gravityScale)) {
        bd.gravityScale = bodyJso.gravityScale;
    } else {
        bd.gravityScale = 1;
    }

    var body = world.CreateBody(bd);
    body.gravityScale = bd.gravityScale;
    var md = new b2MassData();
    md.mass = (bodyJso['massData-mass'] || 0);
    if ( bodyJso.hasOwnProperty('massData-center') && bodyJso['massData-center'] instanceof Object )
        md.center = (parseVec(bodyJso['massData-center']));
    else
        md.center = (new b2Vec2(0,0));

    md.I = (bodyJso['massData-I'] || 0);

    body.SetMassData(md);
    
    if ( bodyJso.hasOwnProperty('fixture') ) {
        for (var k = 0; k < bodyJso['fixture'].length; k++) {
            var fixtureJso = bodyJso['fixture'][k];
            this.loadFixtureFromRUBE(body, fixtureJso);
        }
    }
    body.SetPositionAndAngle(position, -angle);
    body.SetAngle(-angle);
    if ( bodyJso.hasOwnProperty('name') )
        body.name = bodyJso.name;
    if ( bodyJso.hasOwnProperty('customProperties') )
        body.customProperties = bodyJso.customProperties;
    return body;
}

function getVectorValue(val) {
    if ( val instanceof Object )
        return val;
    else
        return { x:0, y:0 };
}

function parseVec(obj) {
    if (obj instanceof Object)
      return new b2Vec2(obj.x || 0, obj.y || 0);
    else
      return new b2Vec2(0,0);
}

function makeClone(obj) {
  var newObj = (obj instanceof Array) ? [] : {};
  for (var i in obj) {
    if (obj[i] && typeof obj[i] == "object") 
      newObj[i] = makeClone(obj[i]);
    else
        newObj[i] = obj[i];
  }
  return newObj;
};

RubeCantk.prototype.loadJointCommonProperties = function(jd, jointJso, loadedBodies) {
	jd.bodyA = loadedBodies[jointJso.bodyA];
	jd.bodyB = loadedBodies[jointJso.bodyB];
	jd.localAnchorA.SetV(getVectorValue(jointJso.anchorA));
	jd.localAnchorA.y *= -1;
    jd.localAnchorB.SetV(getVectorValue(jointJso.anchorB));
	jd.localAnchorB.y *= -1;
	if (jointJso.collideConnected)
		jd.collideConnected = jointJso.collideConnected;
}

RubeCantk.prototype.loadJointFromRUBE = function(jointJso, world, loadedBodies) {
	if (!hasOwnProperty(jointJso, 'type')) {
		console.log("Joint does not have a 'type' property");
		return null;
	}
	if (jointJso.bodyA >= loadedBodies.length) {
		console.log("Index for bodyA is invalid: " + jointJso.bodyA);
		return null;
	}
	if (jointJso.bodyB >= loadedBodies.length) {
		console.log("Index for bodyB is invalid: " + jointJso.bodyB);
		return null;
	}

	var joint = null;
	if (jointJso.type == "revolute") {
		var jd = new b2RevoluteJointDef();
		this.loadJointCommonProperties(jd, jointJso, loadedBodies);
		if (hasOwnProperty(jointJso, 'refAngle'))
			jd.referenceAngle = jointJso.refAngle;
		if (hasOwnProperty(jointJso, 'lowerLimit'))
			jd.lowerAngle = jointJso.lowerLimit;
		if (hasOwnProperty(jointJso, 'upperLimit'))
			jd.upperAngle = jointJso.upperLimit;
		if (hasOwnProperty(jointJso, 'maxMotorTorque'))
			jd.maxMotorTorque = jointJso.maxMotorTorque;
		if (hasOwnProperty(jointJso, 'motorSpeed'))
			jd.motorSpeed = -1 * jointJso.motorSpeed;
		if (hasOwnProperty(jointJso, 'enableLimit'))
			jd.enableLimit = jointJso.enableLimit;
		if (hasOwnProperty(jointJso, 'enableMotor'))
			jd.enableMotor = jointJso.enableMotor;
		joint = world.CreateJoint(jd);
	} else if (jointJso.type == "distance" || jointJso.type == "rope") {
		if (jointJso.type == "rope")
			console.log("Replacing unsupported rope joint with distance joint!");
		var jd = new b2DistanceJointDef();
		loadJointCommonProperties(jd, jointJso, loadedBodies);
		if (hasOwnProperty(jointJso, 'length'))
			jd.length = jointJso.length;
		if (hasOwnProperty(jointJso, 'dampingRatio'))
			jd.dampingRatio = jointJso.dampingRatio;
		if (hasOwnProperty(jointJso, 'frequency'))
			jd.frequencyHz = jointJso.frequency;
		joint = world.CreateJoint(jd);
	} else if (jointJso.type == "prismatic") {
		var jd = new b2PrismaticJointDef();
		loadJointCommonProperties(jd, jointJso, loadedBodies);
		if (hasOwnProperty(jointJso, 'localAxisA'))
			jd.localAxisA.SetV(getVectorValue(jointJso.localAxisA));
		if (hasOwnProperty(jointJso, 'refAngle'))
			jd.referenceAngle = jointJso.refAngle;
		if (hasOwnProperty(jointJso, 'enableLimit'))
			jd.enableLimit = jointJso.enableLimit;
		if (hasOwnProperty(jointJso, 'lowerLimit'))
			jd.lowerTranslation = jointJso.lowerLimit;
		if (hasOwnProperty(jointJso, 'upperLimit'))
			jd.upperTranslation = jointJso.upperLimit;
		if (hasOwnProperty(jointJso, 'enableMotor'))
			jd.enableMotor = jointJso.enableMotor;
		if (hasOwnProperty(jointJso, 'maxMotorForce'))
			jd.maxMotorForce = jointJso.maxMotorForce;
		if (hasOwnProperty(jointJso, 'motorSpeed'))
			jd.motorSpeed = jointJso.motorSpeed;
		joint = world.CreateJoint(jd);
	} else if (jointJso.type == "wheel") {
		// Make a fake wheel joint using a line joint and a distance joint.
		// Return the line joint because it has the linear motor controls.
		// Use ApplyTorque on the bodies to spin the wheel...

		var jd = new b2DistanceJointDef();
		loadJointCommonProperties(jd, jointJso, loadedBodies);
		jd.length = 0.0;
		if (hasOwnProperty(jointJso, 'springDampingRatio'))
			jd.dampingRatio = jointJso.springDampingRatio;
		if (hasOwnProperty(jointJso, 'springFrequency'))
			jd.frequencyHz = jointJso.springFrequency;
		world.CreateJoint(jd);

		jd = new b2LineJointDef();
		loadJointCommonProperties(jd, jointJso, loadedBodies);
		if (hasOwnProperty(jointJso, 'localAxisA'))
			jd.localAxisA.SetV(getVectorValue(jointJso.localAxisA));

		joint = world.CreateJoint(jd);
	} else if (jointJso.type == "friction") {
		var jd = new b2FrictionJointDef();
		loadJointCommonProperties(jd, jointJso, loadedBodies);
		if (hasOwnProperty(jointJso, 'maxForce'))
			jd.maxForce = jointJso.maxForce;
		if (hasOwnProperty(jointJso, 'maxTorque'))
			jd.maxTorque = jointJso.maxTorque;
		joint = world.CreateJoint(jd);
	} else if (jointJso.type == "weld") {
		var jd = new b2WeldJointDef();
		loadJointCommonProperties(jd, jointJso, loadedBodies);
		if (hasOwnProperty(jointJso, 'referenceAngle'))
			jd.referenceAngle = jointJso.referenceAngle;
		joint = world.CreateJoint(jd);
	} else {
		console.log("Unsupported joint type: " + jointJso.type);
		console.log(jointJso);
	}
	if (joint) {
		if (jointJso.name)
			joint.name = jointJso.name;
		if (hasOwnProperty(jointJso, 'customProperties'))
			joint.customProperties = jointJso.customProperties;
	}
	return joint;

}

RubeCantk.prototype.loadImageFromRUBE = function(imageJso, world, loadedBodies) {
	var image = makeClone(imageJso);

	if (image.hasOwnProperty('body') && image.body >= 0)
		image.body = loadedBodies[image.body];// change index to the actual
												// body
	else
		image.body = null;

	if (!image.hasOwnProperty('aspectScale'))
		image.aspectScale = 1;
	if (!image.hasOwnProperty('angle'))
		image.angle = 0;
	if (!image.hasOwnProperty('colorTint'))
		image.colorTint = [ 255, 255, 255, 255 ];

	image.center = new b2Vec2();
	image.center.SetV(getVectorValue(imageJso.center));

	return image;
}

//load the scene into an already existing world variable
RubeCantk.prototype.loadSceneFromRUBE = function(worldJso, world, cantkScene) {
    var success = true;
    
    var loadedBodies = [];
    if ( hasOwnProperty(worldJso, 'body') ) {
        for (var i = 0; i < worldJso.body.length; i++) {
            var bodyJso = worldJso.body[i];
            var body = this.loadBodyFromRUBE(bodyJso, world, cantkScene);
            if ( body ) {
                loadedBodies.push( body );
                if(cantkScene) {
                    var rubeBody = cantkScene.onCreateRUBEBody(body);
                    if(this.createdCallback) {
                        this.createdCallback(rubeBody);
                    }
                }
            }
            else
                success = false;
        }
    }
    
    var loadedJoints = [];
    if ( hasOwnProperty(worldJso, 'joint') ) {
        for (var i = 0; i < worldJso.joint.length; i++) {
            var jointJso = worldJso.joint[i];
            var joint = this.loadJointFromRUBE(jointJso, world, loadedBodies);
            if ( joint ) {
                loadedJoints.push( joint );
                if(cantkScene) {
                    cantkScene.onRUBEJointCreated(joint);
                }
            }
            //else
            //    success = false;
        }
    }
    
	var loadedImages = [];
	if (hasOwnProperty(worldJso, 'image')) {
		for (var i = 0; i < worldJso.image.length; i++) {
			var imageJso = worldJso.image[i];
			var image = this.loadImageFromRUBE(imageJso, world, loadedBodies);
			if (image)
				loadedImages.push(image);
			else
				success = false;
		}
		world.images = loadedImages;
	}

    return success;
}

function getNamedBody(world, name) {
	for (b = world.m_bodyList; b; b = b.m_next) {
		if (b.name == name)
			return b;
	}
	return null;
}

function getNamedBodies(world, name) {
    var bodies = [];
    for (b = world.m_bodyList; b; b = b.m_next) {
        if ( b.name == name )
            bodies.push(b);
    }
    return bodies;
}

function getNamedFixtures(world, name) {
    var fixtures = [];
    for (var b = world.m_bodyList; b; b = b.m_next) {
        for (var f = b.m_fixtureList; f; f = f.m_next) {
            if ( f.name == name )
                fixtures.push(f);
        }
    }
    return fixtures;
}

function getNamedJoints(world, name) {
    var joints = [];
    for (var j = world.m_jointList; j; j = j.m_next) {
        if ( j.name == name )
            joints.push(j);
    }
    return joints;
}

function getNamedImages(world, name) {
	var images = [];
	for (i = 0; i < world.images.length; i++) {
		if (world.images[i].name == name)
			images.push(world.images[i]);
	}
	return images;
}


//custom properties
function getBodiesByCustomProperty(world, propertyType, propertyName, valueToMatch) {
    var bodies = [];
    for (var b = world.m_bodyList; b; b = b.m_next) {
        if ( ! b.hasOwnProperty('customProperties') )
            continue;
        for (var i = 0; i < b.customProperties.length; i++) {
            if ( ! b.customProperties[i].hasOwnProperty("name") )
                continue;
            if ( ! b.customProperties[i].hasOwnProperty(propertyType) )
                continue;
            if ( b.customProperties[i].name == propertyName &&
                 b.customProperties[i][propertyType] == valueToMatch)
                bodies.push(b);
        }        
    }
    return bodies;
}

function hasCustomProperty(item, propertyType, propertyName) {
    if ( !item.hasOwnProperty('customProperties') )
        return false;
    for (var i = 0; i < item.customProperties.length; i++) {
        if ( ! item.customProperties[i].hasOwnProperty("name") )
            continue;
        if ( ! item.customProperties[i].hasOwnProperty(propertyType) )
            continue;
        return true;
    }
    return false;
}

function getCustomProperty(item, propertyType, propertyName, defaultValue) {
    if ( !item.hasOwnProperty('customProperties') )
        return defaultValue;
    for (var i = 0; i < item.customProperties.length; i++) {
        if ( ! item.customProperties[i].hasOwnProperty("name") )
            continue;
        if ( ! item.customProperties[i].hasOwnProperty(propertyType) )
            continue;
        if ( item.customProperties[i].name == propertyName )
            return item.customProperties[i][propertyType];
    }
    return defaultValue;
}

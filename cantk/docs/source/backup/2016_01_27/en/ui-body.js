/**
 * @class UIBody
 * @extends UIElement
 * A rigidbody in the physics engine. It is a parent class of the box, circle, and polygonal body types. It is an abstract type, and can't be used to create an object.
 * 
 * You can set its physics engine properties, such as friction, elasticity, density, and more. Density set to 0 indicates that it is a static rigidbody. Density greater than 0 indicates that it is an active rigidbody.
 * Static bodies will not have active state behaviors like speed. This is commonly used to represent the land or other immobile rigidbodies, but its position can still be moved through the program.
 *
 * Images and animations can be added to a rigidbody to decorate it.
 *
 * Note: Rigidbodies can only be added to scenes. If a rigidbody is placed in an element when designing, it will not inherit the positional properties of its parent. It will not move when the parent rigidbody is moved. 
 */

/**
 * @event onBeginContact
 * An onBeginContact event will be fired when two rigidbodies collide. Typical event call order is: onBeginContact ->  onPreSolve -> onPostSolve ->onPreSolve -> onPostSolve -> ………… -> onPreSolve -> onPostSolve -> onEndContact.
 *
 *
 * @param {Object} body Refers to a rigidbody which touches the current body. body.element can be used to return the corresponding body element.
 * @param {Object} contact [collision information] (http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html)
 *
 * See: http://www.box2dflash.org/docs/2.1a/reference/
 *
 *     @example small frame
 *     if(body.element.name === "ui-coin") {
 *          body.element.remove(true);
 *     }
 */

/**
 * @event onEndContact
 * Event on collision end. The event for when collision ends between two rigidbodies. 
 * @param {Object} body Refers to a rigidbody which touches the current body. body.element can be used to return the corresponding body element.
 * @param {Object} contact [collision information] (http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html)
 *
 */

/**
 * @event onPreSolve
 * PreSolve
 * @param {Object} body Refers to a rigidbody which touches the current body. body.element can be used to return the corresponding body element.
 * @param {Object} contact [collision information] (http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html)
 * @param {Object} oldManifold [b2Manifold](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Collision/b2Manifold.html)
 *
 * See: http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactListener.html
 */

/**
 * @event onPostSolve
 * Post Solve 
 * @param {Object} body Refers to a rigidbody which touches the current body. body.element can be used to return the corresponding body element.
 * @param {Object} contact [collision information] (http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/Contacts/b2Contact.html)
 * @param {Object} impulse [b2ContactImpulse](http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactImpulse.html)
 *
 * See: http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2ContactListener.html
 */

/**
 * @event onMoved
 * This event is fired when a rigidbody is moved.
 *
 */

/**
 * @method setSensor
 * Sets the rigidbody to be a sensor. Sensors can create collision events, but won't produce collision effects (they will pass through the other body).
 * @param {Boolean} isSensor Whether or not this is a sensor.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getDensity
 * Gets the rigidbody's density.
 * @return {Number} Returns the rigidbody's density.
 *
 */

/**
 * @method setDensity
 * Sets the rigidbody's density.
 * @param {Number} density The rigidbody's density. 
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setV
 * Sets the rigidbody's velocity. Original values are retained when the values of x and y are null/undefined.
 * @param {Number} x Speed on the horizontal axis. Right is positive, left is negative.
 * @param {Number} y Speed on the vertical axis. Down is positive, up is negative.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getV
 * Gets the rigidbody's velocity.
 * @return {Point} Returns the rigidbody's velocity.
 *
 */

/**
 * @method addV
 * Increases the rigidbody's velocity.
 * @param {Number} dx Increases speed on the horizontal axis.
 * @param {Number} dy Increases speed on the vertical axis.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getMass
 * Gets the rigidbody's mass.
 * @return {Number} Returns the rigidbody's mass.
 *
 */

/**
 * @method applyTorque
 * Applies torque to the rigidbody.
 * @param {Number} torque
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method applyForce
 * Applies force to the rigidbody.
 * @param {Number} forceX Force along X.
 * @param {Number} forceY Force along Y.
 * @param {Number} x Applies point X.
 * @param {Number} y Applies point Y.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setGroupIndex
 * Sets the rigidbody's group.
 * @param {Number} groupIndex Bodies with the same negative groups will not collide with each other.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getGroupIndex
 * Gets the rigidbody's group.
 * @return {Number} Returns the element's group.
 *
 */

/**
 * @method getBody
 * Get box2d's rigidbody object. In certain situations, when you need to directly control box2d, please use this function.
 * @return {Object} Returns box2d's rigidbody object.
 *
 * See: http://www.box2dflash.org/docs/2.1a/reference/
 */


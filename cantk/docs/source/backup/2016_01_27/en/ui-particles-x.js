/**
 * @class UIParticlesX
 * @extends UIElement
 * Particle emitter.
 *
 *Note:
 * 
 * 1. When the system loads a particle settings file, it will read image name the settings file points to by default. This image must be in the same directory as the settings file.
 *
 * 2. Using our officially-specified particle emitter creates a JSON file. This file contains image resources by default. Particles created with other tools have settings and image files.
 *
 * 3. Special properties: When selecting resources, you only need to specify a plist or JSON file. The image file does not need to be specified, as the engine will read it.
 */

/**
 * @method emit
 * Fire particles.
 * @param {Boolean} once Whether to fire once.
 * @return {UIElement} Returns element.
 *
 *     @example small frame
 *     this.win.find("ui-particles-general").emit(true);
 *
 */

/**
 * @method start
 * Once the particle emitter is started, it typically doesn't need to be manually called, unless there is a stop() call.
 * If this interface is called after a particle emitter has been started, the system will clear the current particle emitter's state and reload it.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method stop
 * If this interface is called, the particle emitter will not fire new particles. Particles that have been fired will end and disappear as their life cycles end.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method pause
 * Pause. If this interface is called, it pauses the effects of time. The particle emitter will temporarily stop firing new particles. Fired particles will remain in their current state at that time.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method resume 
 * Unpause. Unpauses particle firing and updates particle states.
 * @return {UIElement} Returns element.
 *
 */


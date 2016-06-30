/**
 * @class UIElement 
 * The base class of all modules. It is typically a rectangular area with certain appearance states, that can handle user events.
 */

/**
 * @property {String} type
 * Name of element's class. Please don't change a button's class if it is "ui-button".
 */

/**
 * @property {String} name
 * The name of the element.
 */

/**
 * @property {UIElement} win
 * The window or scene the element is located in.
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */

/**
 * @property {Number} x
 * The X coordinate in the parent element.
 */

/**
 * @property {Number} y
 * The Y coordinate in the parent element.
 */

/**
 * @property {Number} anchorX
 * The element's X anchor point.
 */

/**
 * @property {Number} anchorY
 * The element's Y anchor point.
 */

/**
 * @property {Number} width
 * The width of the element.
 */

/**
 * @property {Number} height 
 * The height of the element.
 */

/**
 * @property {Number} scaleX 
 * The scaling index in the X direction of the element.
 */

/**
 * @property {Number} scaleY
 * The scaling index in the Y direction of the element.
 */

/**
 * @property {Number} rotation 
 * The element's rotation angle (arc).
 */

/**
 * @property {Number} opacity
 * The element's opacity (0-1).
 */

/**
 * @property {Boolean} flipX 
 * Whether the element flips on the X axis.
 */

/**
 * @property {Boolean} flipY 
 * Whether the element flips on the Y axis.
 */

/**
 * @property {Boolean} visible
 * Whether the element is visible to the user.
 */

/**
 * @property {Boolean} enable 
 * Whether the element accepts user events (for rigidbodies, this will also determine whether they take part in movement in the physical world).
 */

/**
 * @property {Boolean} pointerDown
 * Whether the pointed is pressed down.
 */

/**
 * @method setPosition
 * Sets the element's position.
 * @param {Number} x The X coordinate on the parent element.
 * @param {Number} y The Y coordinate on the parent element.
 * @return {UIElement} Returns element.
 *
 * Example:
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */

/**
 * @method setAnchor
 * Sets the element's anchor.
 * @param {Number} x 0 - 1 indicates the element's position from left to right. For example, 0.5 indicates the center.
 * @param {Number} y 0 - 1 indicates the element's position from top to bottom. For example, 0.5 indicates the center.
 * @return {UIElement} Returns element.
 *
 * Example: moves the object to the center of the scene.
 *
 *     @example small frame
 *     var win = this.win;
 *     var ball = win.find("ball");
 *     ball.setAnchor(0.5, 0.5);
 *     ball.setPosition(win.width>>1, win.height>>1);
 */

/**
 * @method setPivot
 * Sets the rotation axis of the element (not applicable to rigidbodies).
 * @param {Number} x 0 - 1 indicates the element's position from left to right. For example, 0.5 indicates the center.
 * @param {Number} y 0 - 1 indicates the element's position from top to bottom. For example, 0.5 indicates the center.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setName
 * Sets the name of the element.
 * @param {String} name Name.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setOpacity
 * Sets the element's opacity.
 * @param {Number} opacity Transparency, (range from 0- 1).
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method forEach
 * Traverses all child elements. Stops traversing when a callback returns true.
 * @param {Function} callback Function prototype  function(child) {}
 *
 */

/**
 * @method getTarget
 * Gets the child element of the pointer event. Typically used to determine which element the player has clicked.
 * @return {UIElement} Handles the child element of the pointer event.
 *
 */

/**
 * @method getOpacity
 * Gets the element's opacity.
 * @return {Number} Returns the object's opacity.
 *
 */

/**
 * @method setValue
 * Sets the value of the element. Values have different significance across different elements. Example: the loading bar's value is the loading progress. The button's value is the above text.
 * @param {Number} value New value.
 * @param {Boolean} notify Sets whether to fire an onChanged event. 
 * @param {Boolean} animation Sets whether to use animation (only accepts numerical values)
 * @return {UIElement} Returns element.
 *
 * Example: Sets the progress of the progress bar.
 *
 *     @example small frame
 *     var win = this.win;
 *     var progressbar = win.find("progressbar");
 *     progressbar.setValue(80, false, true);
 */

/**
 * @method getValue
 * Gets the value of the element.
 * @return {Number} Returns the object's value.
 *
 */

/**
 * @method addValue 
 * Extends the current value (only accepts numerical values). 
 * @param {Number} delta Extension, can be a negative value. 
 * @param {Boolean} notify Sets whether to fire an onChanged event.
 * @param {Boolean} animation Sets whether or not to use animation.
 * @return {UIElement} Returns element.
 *
 * Example: Sets the progress of the progress bar.
 *
 *     @example small frame
 *     var win = this.win;
 *     var progressbar = win.find("progressbar");
 *     progressbar.addValue(20, false, true);
 */

/**
 * @method setValueOf
 * Sets the element's value.
 * @param {String} name The name of the child element.
 * @param {Number} value Value.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getValueOf
 * Gets the value of the child element. 
 * @param {String} name The name of the child element.
 * @return {Number} Returns the object's value.
 *
 */

/**
 * @method setScale
 * Sets the scaling proportion of the element.
 * @param {Number} x The scaling proportion in the X direction.
 * @param {Number} y The scaling proportion in the Y direction.
 * @return {UIElement} Returns element.
 *
 * Note: The scaling proportion won't change the element's actual size and the area for rigidbody collision detection.
 */

/**
 * @method setScaleX
 * Sets the scaling proportion in the X direction of the element.
 * @param {Number} scale The scaling proportion in the X direction.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setScaleY
 * Sets the scaling proportion in the Y direction of the element.
 * @param {Number} scale The scaling proportion in the Y direction.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getScaleX
 * Gets the scaling proportion in the X direction of the element.
 * @return {Number} The scaling proportion in the X direction.
 *
 */

/**
 * @method getScaleY
 * Gets the scaling proportion in the Y direction of the element.
 * @return {Number} The scaling proportion in the Y direction.
 *
 */

/**
 * @method setSize
 * Sets the element's position.
 * @param {Number} w The width of the element.
 * @param {Number} h The height of the element.
 * @return {UIElement} Returns element.
 *
 * Example:
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setSize(100, 100);
 */

/**
 * @method setText
 * Sets text content in the element, such as the text on the element.
 * @param {String} text Text string.
 * @param {Boolean} notify Sets whether to fire an onChanged event.
 * @return {UIElement} Returns element.
 */

/**
 * @method getText
 * Gets text content in the element, such as the text on the element.
 * @return {String} Text string.
 */

/**
 * @method getParent
 * Gets the parent of the element.
 * @return {UIElement} Parent element.
 */

/**
 * @method find
 * Searches for child elements by name.
 * @param {String} name The name of the child element.
 * @param {Boolean} recursive Whether to search recursively.
 * @return {UIElement} Returns child element.
 *
 *     @example small frame
 *     var ball = this.win.find("ball");
 *     ball.setPosition(100, 100);
 */

/**
 * @method findChildByPoint
 * Searches for child elements by click location.
 * @param {Point} point
 * @param {Boolean} recursive Whether to search recursively.
 * @param {Function} checkFunc Callback function used to check whether element is required.
 * @return {UIElement} Returns child element.
 *
 *     @example small frame
 *     var targetElement = this.findChildByPoint(point, true, function(child) {
 *         //Skip dragger self
 *         return child !== dragger;
 *     });
 */

/**
 * @method isAnimating
 * Determines whether animation has completed. 
 * @return {Boolean}
 */

/**
 * @method animate
 * Makes element move.
 * @param {AnimationConfig} config Animation settings information or name of the animation created with the animation editor.
 * @param {Function} onDone (optional) Callback function when finished.
 * @param {Function} onStep (optional) Callback function for each step.
 *
 * Moves the element from x=100 to x=300:
 *
 *     @example small frame
 *     this.animate({xStart:100, xEnd:300});
 *
 * Moves the element from its current position to x=300:
 * 
 *     @example small frame
 *     this.animate({x:300});
 * 
 * Makes the element move repeatedly between x=100 and x=300:
 *     
 *     @example small frame
 *     var toLeft ={xStart:100, xEnd:300};
 *     var toRight = {xEnd:100, xStart:300}
 *     toLeft.next = toRight;
 *     toRight.next = toLeft;
 *     this.animate(toLeft);
 *
 * Plays another animation when finished:
 *     
 *     @example small frame
 *     var me = this;
 *     var win = this.getWindow();
 *     var tree = win.find("tree");
 *     var config = {xStart:100, xEnd:300};
 *     config.onDone = function() {
 *         this.animate({xEnd:config.xStart, xStart:config.xEnd});
 *     }
 *     tree.animate(config);
 *
 * If a state needs to be changed to another state, please use the Start/End method. If a state needs to be changed from its current state to another state, you can directly designate its value.
 */

/**
 * @method stopAnimation
 * Stops the animation started by the animate function.
 * @param {Boolean} callOnDone Callback function for whether to call OnDone.
 */

/**
 * @method postRedraw
 * Requests that the system redraws the element.
 * @param {Rect} rect Requests an area update. Typically null.
 */

/**
 * @method addChildWithJson
 * Creates an element using JSON data, and adds it to the current element as a child element.  (We recommend using dupChild to actively create an object)
 * @param {Object} json JSON data
 * @param {Number} index zIndex
 * @return {UIElement} Returns child element.
 * 
 *     @example small frame
 *     var win = this.getWindow();
 *     
 *     var json = {
 *         "type": "ui-button",
 *         "name": "ui-button2-general",
 *         "w": 200,
 *         "h": 69,
 *         "x": 209,
 *         "y": 155,
 *         "text": "ok",   
 *         "images": {
 *             "display": 2,
 *             "active_bg": "drawapp8/images/common/buttons/green_button_active.png",
 *             "normal_bg": "drawapp8/images/common/buttons/green_button.png",
 *             "disable_bg": "drawapp8/images/common/buttons/green_button.png"
 *         }
 *     }
 *     
 *     var button = win.addChildWithJson(json, 0);
 */

/**
 * @method addChild
 * Adds element to current element. Used with the clone function.
 * @param {UIElement} child The element this will be added to.
 * @param {Number} index zIndex
 * @return {UIElement} Returns child element.
 */

/**
 * @method clone
 * The clone's current element. The clone's object is disassociated, and addChild must be called to add it to an element.
 * @return {UIElement} Returns new element.
 */

/**
 * @method remove 
 * Removes the current element from its parent element.
 * @param {Boolean} destroyIt Whether to destroy this element when it is removed. If you plan on adding it to another element, don't destroy it. Otherwise, destroy it.
 * @param {Boolean} syncExec Whether to perform in synch. If it is being performed in the current element's event, please carry it out asynchronously.
 */

/**
 * @method dupChild
 * Copies the designated child element and adds it to the current element.
 * @param {String} name The name of the child element.
 * @param {Number} index The zIndex of the new element
 * @return {UIElement} Returns new element.
 * 
 * Simple method
 *
 *     @example small frame
 *     var newImage = this.dupChild("image");
 *     newImage.setPosition(10, 10);
 *
 *     Copy the child object and move it to another element.
 *
 *     @example small frame
 *     var win = this.getWindow();
 *     
 *     var newImage = win.dupChild("image");
 *     newImage.remove(false, true);
 *     newImage.setPosition(0, 0);
 *     win.find("ball").addChild(newImage);
 */

/**
 * @method getWindow
 * Gets element's current window/scene. The win property can be used to replace this.
 * This is a common function. You can use this function to return the window's object, then use the window's find function to find other elements in the window.
 * @return {UIElement} The window/scene the element is located in.
 */

/**
 * @method openWindow 
 * Opens a new window. There are currently three types of windows: normal windows, game scenes, and dialogs.
 * @param {String} name Name of the new window.
 * @param {Function} onWindowClose onWindowClose(retInfo) (optional) Callback function when the new window closes.
 * @param {Boolean} closeCurrent (optional) Whether the current window is closed on opening a new window.
 * @param {Object} initData (optional) Passes data to the new window, as an onOpen/onBeforeOpen event which passes parameters to the new window.
 * @param {Object} options (optional) Other parameters. options.closeOldIfOpened If the target window is opened, closes and re-opens it. options.openNewIfOpened If the target window is opened, opens a new window.
 *
 *     @example small frame
 *     this.openWindow("win-bonus",  function (retInfo) {console.log("window closed.");});
 */

/**
 * @method openScene
 * This function is a wrapper for openWindow. Opening the current scene is the same as resetting the current scene, and can be used to reset the game.
 * @param {String} name The new scene's name. Opening the current scene is the same as resetting the current scene, and can be used to reset the game.
 * @param {Object} initData Passes data to the new window, as an onOpen/onBeforeOpen event which passes parameters to the new window.
 */

/**
 * @method closeWindow
 * Closes current window.
 * @param {Object} retInfo If the onWindowClose callback function is designated during openWindow, retInfo will be a parameter for the onWindowClose callback function.
 *
 *     @example small frame
 *     var retCode = 0;
 *     this.closeWindow(retCode);
 *
 */

/**
 * @method setFillColor
 * Sets the element's fill color.
 * @param {String} color Color.
 * @return {UIElement} Returns element.
 */

/**
 * @method setLineColor
 * Sets the element's line color.
 * @param {String} color Color.
 * @return {UIElement} Returns element.
 */

/**
 * @method setTextColor
 * Sets the element's text color.
 * @param {String} color Color.
 * @return {UIElement} Returns element.
 */

/**
 * @method getFillColor
 * Gets the element's fill color.
 * @param {String} color Color.
 * @return {String} Color.
 */

/**
 * @method getLineColor
 * Gets the element's line color.
 * @param {String} color Color.
 * @return {String} Color.
 */

/**
 * @method getTextColor
 * Gets the element's text color.
 * @param {String} color Color.
 * @return {String} Color.
 */

/**
 * @method setImage
 * Sets the image of the element.
 * @param {String} type (optional, default is the background image). Different elements support different types. See the element's specific file.
 * @param {Object} src This can be an image's URL, Image object, WImage object, or optional image index.
 * @return {UIElement} Returns element.
 *
 * Sets image 1 to be the current image (you need to set the element's image 1 in the IDE ahead of time).
 *
 *     @example small frame
 *     this.win.find("image").setImage(1);
 *
 * Sets the button's normal and pointerdown images:
 *
 *     @example small frame
 *     this.setImage(UIElement.IMAGE_NORMAL, 0);
 *     this.setImage(UIElement.IMAGE_ACTIVE, 1);
 *
 */

/**
 * @method getImageByType
 * Gets the image of the element.
 * @param {String} type Different elements support different types. See the element's specific file.
 * @return {WImage} Images
 */

/**
 * @method getImageSrcByType
 * Gets the image of the element.
 * @param {String} type Different elements support different types. See the element's specific file.
 * @return {String} Image source
 */

/**
 * @method setTimeScale
 * Sets time scale index, making game time faster or slower.
 * @param {Number} timeScale Time scale index. 0 = pause, (0-1) = slower, 1 = normal, >1 = faster.
 * @return {UIElement} Returns element.
 *
 * Pauses game.
 *
 *     @example small frame
 *     this.setTimeScale(0);
 */

/**
 * @method playSoundEffect
 * Plays sound effects. First, place a sound effect element in the scene, and add a sound file in the sound effect element's unique properties.
 * We suggest using a code generator to create the code for the played sound effect.
 * @param {String} name Sound effect file name (does not contain path).
 * @param {Function} onDone (optional) Callback function for after sound is played.
 * @return {UIElement} Returns element.
 */

/**
 * @method playSoundMusic
 * Plays background music. First, place a background music element in the scene, and add a sound file in the background music element's unique properties.
 * We suggest using a code generator to create the code for the played background music.
 * @param {String} name Background music file name (does not contain path).
 * @param {Function} onDone (optional) Callback function for after the background music is finished.
 * @return {UIElement} Returns element.
 */

/**
 * @method stopSoundEffect
 * Stops sound effects.
 * @param {String} name (optional) Sound effect file name (does not contain path).
 * @return {UIElement} Returns element.
 */

/**
 * @method stopSoundMusic
 * Stops background music.
 * @param {String} name (optional) Music file name (does not contain path).
 * @return {UIElement} Returns element.
 */

/**
 * @method setSoundEffectVolume
 * Sets the volume of sound effects.
 * @param {Number} volume Volume, from 0 to 1.
 * @return {UIElement} Returns element.
 */

/**
 * @method setSoundMusicVolume
 * Sets the volume of the music.
 * @param {Number} volume Volume, from 0 to 1.
 * @return {UIElement} Returns element.
 */

/**
 * @method setSoundEnable
 * Enable/disable playing of sound effects and background music.
 * @param {Boolean} value Enable/disable playing of sound effects and background music. 
 * @return {UIElement} Returns element.
 */

/**
 * @method getSoundEnable
 * Gets the enabled/disabled state of sound effects and background music.
 * @return {Boolean} Whether to enable the playing of sound effects and background music.
 */

/**
 * @method setSoundEffectsEnable
 * Enable/disable playing of sound effects.
 * @param {Boolean} value Enable/disable playing of sound effects. 
 * @return {UIElement} Returns element.
 */

/**
 * @method setSoundMusicsEnable
 * Enable/disable playing of background music.
 * @param {Boolean} value Enable/disable playing of background music. 
 * @return {UIElement} Returns element.
 */

/**
 * @method getAppInfo
 * Gets game's APP information
 * @return {Object} APP information
 *
 * APP information example: 
 *
 *     @example small frame
 *     {
 *       "appid":"com.tangide.demo",
 *       "appversion":"1.0.0",
 *       "appname":"Demo",
 *       "appdesc":"Demo",
 *       "gapversion":"1.0",
 *       "screenscale":"fix-width",
 *       "orientation":"portrait",
 *       "developer":"Unkown <unkown@tangide.com>",
 *       "appIcon":"/drawapp8/images/appicons/96.png",
 *       "screenShot1":"",
 *       "screenShot2":"",
 *       "screenShot3":""
 *     }
 */

/**
 * @method getChild
 * Gets child element at designated location.
 * @param {Number} index The index of the child element.
 * @return {UIElement} Returns child element.
 */

/**
 * @method getChildrenNr
 * Gets the number of the child element.
 * @return {Number} Returns the number of the child element.
 */

/**
 * @method setClipCircle
 * Sets the element's circular clipping area.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @return {UIElement} Returns element.
 */

/**
 * @method setClipRect
 * Sets the element's rectangular clipping area.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @return {UIElement} Returns element.
 *
 * For clipping of unique shapes, please use onClip:
 *
 *     @example small frame
 *     var el = this.getWindow().find("el");
 *     
 *     el.onClip = function(ctx2d) {
 *         ctx2d.beginPath();
 *         ctx2d.moveTo(0, 0);
 *         ctx2d.lineTo(100, 100);
 *         ctx2d.lineTo(100, 200);
 *         ctx2d.closePath();
 *         ctx2d.clip();
 *     }
 */

/**
 * @method setRotation
 * Sets the element's rotation angle.
 * @param {Number} rotation The rotation angle, unit is radian.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setFlipX
 * Sets whether the element flips horizontally.
 * @param {Boolean} flipX Whether the element flips horizontally.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setFlipY
 * Sets whether the element flips vertically.
 * @param {Boolean} flipY Whether the element flips vertically.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getPositionInWindow
 * Returns element's position in the window.
 * @return {Point} Position information.
 *
 */

/**
 * @method getVisible
 * Whether element is visible.
 * @return {Boolean} Whether is visible.
 *
 */

/**
 * @method setVisible
 * Displays/hides element.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setAnchorX
 * Sets the element's horizontal anchor.
 * @param {Number} x (range 0 - 1).
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setAnchorY
 * Sets the element's vertical anchor.
 * @param {Number} y (range 0 - 1).
 * @return {UIElement} Returns element
 *
 */

/**
 * @method relayout
 * Re-lays out the element.
 *
 */

/**
 * @method removeChild
 * Removes specified child. If destroyIt = true, also destroys it.
 * @param {UIElement} child Child element's object.
 * @param {Boolean} destroyIt Whether the child object should be destroyed as well.
 * @param {Boolean} sync Whether to perform in synch. Default is asynchronous.
 * @return {UIElement} Returns element.
 * 
 */

/**
 * @method setEnable
 * Enables/disables element. Different element's performance have different significance. If UITimer is disabled, it won't fired an onTimer event. If UIGSensor is disabled, it won't report gravity sensor information.
 * @param {Boolean} enable Whether or not to use element.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setZIndex
 * Sets the element's Z index in its parent element.
 * @param {Number} z The z-index.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getZIndex
 * Gets the element's Z index in its parent element.
 * @return {Number} Returns the z-index.
 *
 */

/**
 * @method pickImage 
 * Selects one image from the current system and returns its file object and DataURL.
 * @param {Function} onDone(file, dataURL)  Callback function after an image is successfully selected.
 * @return Whether reading the image locally is supported.
 *
 * Choose image:
 *
 *     @example pick image
 *     var image = this.getWindow().find("image");
 *     this.pickImage(function(name, url) {
 *         image.setValue(url);
 *         image.postRedraw();
 *     });
 *
 */

/**
 * @event onClick
 * onClick event.
 * @param {Point} point Click position.
 */

/**
 * @event onUpdateTransform
 * preDraw event.
 * @param {Object} canvas HTMLCanvasContext2d
 *
 * Magnification effect on pointer down:
 *
 *     @example small frame
 *     this.setScale(this.pointerDown ? 1.1 : 1);
 */

/**
 * @event onInit
 * Initialization event.
 * 
 * This needs to be added during the custom module in order to be listed among IDE events. 
 *
 */

/**
 * @event onPointerDown
 * Pointer Down event. This will fire once before handled by the child element, and once after being handled by the child element.
 * 
 * This needs to be added during the custom module in order to be listed among IDE events.
 *
 * @param {Point} point Position.
 * @param {Boolean} beforeChild Indicates that this will fire before/after being handled by the child element.
 */

/**
 * @event onPointerMove
 * Pointer Move event. This will fire once before handled by the child element, and once after being handled by the child element.
 * 
 * This needs to be added during the custom module in order to be listed among IDE events.
 *
 * @param {Point} point Position.
 * @param {Boolean} beforeChild Indicates that this will fire before/after being handled by the child element.
 */

/**
 * @event onPointerUp
 * Pointer Up event. This will fire once before handled by the child element, and once after being handled by the child element.
 * 
 * This needs to be added during the custom module in order to be listed among IDE events.
 *
 * @param {Point} point Position.
 * @param {Boolean} beforeChild Indicates that this will fire before/after being handled by the child element.
 */


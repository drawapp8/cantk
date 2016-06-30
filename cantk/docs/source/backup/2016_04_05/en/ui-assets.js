/**
 * @class UIAssets
 * @extends UIElement
 * Resource manager element. Can add a group of resources (such as images, JSON data, and other data), which it automatically exports when exporting. Can use loadImage/loadData/loadJson to get corresponding resources when running. 
 *
 * The resources manager element is mainly used to manage ordinary elements that haven't been allocated resources, such as level data needed for a game, images and JSON data needed to dynamically create elements, etc. 
 *
 * How to use:  
 *
 * 1. Place it in a UIAssets element. 
 *
 * 2. Double click UIAssets to open the resource manager dialog. 
 *
 * 3. Click on "Add" to add a resource.  
 *
 * 4. Click on "Okay" to save the configuration. 
 *
 * 5. For usage in a program, please refer to the example later on. 
 *
 */

/**
 * @method getAssetInfo
 * Gets related information of the designated resource. 
 * @param {String} name Resource name. 
 * @return {Object} Returns resource information.  name is the name of the resource, url is its url, and type is its type. 
 *
 */

/**
 * @method getAssetURL
 * Gets the URL of the designated resource. 
 * @param {String} name Resource name. 
 * @return {Object} Returns resource URL. 
 *
 *     @example small frame
 *
 *     var win = this.win;
 *     var url = win.find("assets").getAssetURL("t.jpg");
 *     win.find("image").setValue(url);
 */

/**
 * @method loadJSON 
 * Loads JSON data of designated resource. 
 * @param {String} name Resource name. 
 * @param {Function} onDone onDone(json) Callback function when finished loading. 
 * @return {Boolean} false indicates that the designated resource was not found, and the onDone callback won't be called.  true indicates that loading has begun. onDone callback function will be called whether or not loading is successful.  
 *
 *     @example small frame
 *
 *     function onJsonLoad(json) {
 *          console.log("onJsonLoad:" + JSON.stringify(json, null, "\t"));
 *     }
 *     this.win.find("assets").loadJSON("test.json", onJsonLoad.bind(this));
 */

/**
 * @method loadImage
 * Loads image of designated resource. 
 * @param {String} name Resource name. 
 * @param {Function} onDone onDone(img) Callback function when finished loading. 
 * @return {Boolean} false indicates that the designated resource was not found, and the onDone callback won't be called.  true indicates that loading has begun. onDone callback function will be called whether or not loading is successful. 
 *
 *     @example small frame
 *
 *     function onImageLoad(img) {
 *          this.win.find("image").setValue(img);
 *     }
 *     this.win.find("assets").loadImage("t.jpg", onImageLoad.bind(this));
 */

/**
 * @method loadData
 * Loads text data of designated resource. 
 * @param {String} name Resource name. 
 * @param {Function} onDone onDone(str) Callback function when finished loading. 
 * @return {Boolean} false indicates that the designated resource was not found, and the onDone callback won't be called.  true indicates that loading has begun. onDone callback function will be called whether or not loading is successful. 
 *
 *     @example small frame
 *     
 *     function onDataLoad(data) {
 *          console.log("onDataLoad:" + data);
 *     }
 *     this.win.find("assets").loadData("test.txt", onDataLoad.bind(this));
 */


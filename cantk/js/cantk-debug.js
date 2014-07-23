/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-touch-teststyles-prefixes
 */



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.5.3',

    Modernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,


    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node,
          div = document.createElement('div'),
                body = document.body, 
                fakeBody = body ? body : document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style>', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if(!body){
                fakeBody.style.background = "";
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        !body ? fakeBody.parentNode.removeChild(fakeBody) : div.parentNode.removeChild(div);

      return !!ret;

    },
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProperty = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProperty = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F;

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }


    var testBundle = (function( styles, tests ) {
        var style = styles.join(''),
            len = tests.length;

        injectElementWithStyles(style, function( node, rule ) {
            var style = document.styleSheets[document.styleSheets.length - 1],
                                                    cssText = style ? (style.cssRules && style.cssRules[0] ? style.cssRules[0].cssText : style.cssText || '') : '',
                children = node.childNodes, hash = {};

            while ( len-- ) {
                hash[children[len].id] = children[len];
            }

                       Modernizr['touch'] = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch || (hash['touch'] && hash['touch'].offsetTop) === 9; 
                                }, len, tests);

    })([
                       ,['@media (',prefixes.join('touch-enabled),('),mod,')',
                                '{#touch{top:9px;position:absolute}}'].join('')           ],
      [
                       ,'touch'                ]);



    tests['touch'] = function() {
        return Modernizr['touch'];
    };



    for ( var feature in tests ) {
        if ( hasOwnProperty(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }
    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;

    Modernizr.testStyles    = injectElementWithStyles;
    return Modernizr;

})(this, this.document);
;

(function(exports) {
  var MOUSE_ID = 1;

  function Pointer(identifier, type, event) {
    this.screenX = event.screenX || 0;
    this.screenY = event.screenY || 0;
    this.pageX = event.pageX || 0;
    this.pageY = event.pageY || 0;
    this.x = event.x || 0;
    this.y = event.y || 0;
    this.clientX = event.clientX || 0;
    this.clientY = event.clientY || 0;
    this.tiltX = event.tiltX || 0;
    this.tiltY = event.tiltY || 0;
    this.pressure = event.pressure || 0.0;
    this.hwTimestamp = event.hwTimestamp || 0;
    this.pointerType = type;
    this.identifier = identifier;
  }

  var PointerTypes = {
    TOUCH: 'touch',
    MOUSE: 'mouse',
    PEN:   'pen'
  };

  function setMouse(mouseEvent) {
    mouseEvent.target.mouseEvent = mouseEvent;
  }

  function unsetMouse(mouseEvent) {
    mouseEvent.target.mouseEvent = null;
  }

  function setTouch(touchEvent) {
    touchEvent.target.touchList = touchEvent.targetTouches;
  }

  /**
   * Returns an array of all pointers currently on the screen.
   */
  function getPointerList() {
    // Note: "this" is the element.
    var pointers = [];
    var pointer;
    if (this.touchList) {
      for (var i = 0; i < this.touchList.length; i++) {
        var touch = this.touchList[i];
        // Add 2 to avoid clashing with the mouse identifier.
        pointer = new Pointer(touch.identifier + 2, PointerTypes.TOUCH, touch);
        pointers.push(pointer);
      }
    } else if (this.msPointerList) {
      for (var identifier in this.msPointerList) {
        if (!this.msPointerList.hasOwnProperty(identifier)) continue;
        pointer = this.msPointerList[identifier];
        pointer = new Pointer(identifier, pointer.textPointerType, pointer);
        pointers.push(pointer);
      }
    }
    if (this.mouseEvent) {
      pointers.push(new Pointer(MOUSE_ID, PointerTypes.MOUSE, this.mouseEvent));
    }
    return pointers;
  }

  function createCustomEvent(eventName, target, payload) {
    //var event = document.createEvent('Event');
    //event.initEvent(eventName, true, true);
    var event = {};
    for (var k in payload) {
      event[k] = payload[k];
    }
    event.type = eventName;
    event.target = target;
    target.dispatchEvent(event);
  }

  /*************** Mouse event handlers *****************/

  function mouseDownHandler(event) {
    event.preventDefault();
    setMouse(event);
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerdown', event.target, payload);
  }

  function mouseMoveHandler(event) {
    event.preventDefault();
    //if (event.target.mouseEvent) {
    setMouse(event);
   //}
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function mouseUpHandler(event) {
    event.preventDefault();
    //unsetMouse(event);
    setMouse(event);
    var payload = {
      pointerType: 'mouse',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  /*************** Touch event handlers *****************/

  function touchStartHandler(event) {
    console.log('touchstart');
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerdown', event.target, payload);
  }

  function touchMoveHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function touchEndHandler(event) {
    event.preventDefault();
    setTouch(event);
    var payload = {
      pointerType: 'touch',
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  function mouseOutHandler(event) {
    if (event.target.mouseEvent) {
      console.log(event);
      event.preventDefault();
      //unsetMouse(event);
      var payload = {
        pointerType: 'mouse',
        getPointerList: getPointerList.bind(this),
        originalEvent: event
      };
      createCustomEvent('pointerup', event.target, payload);
    }
  }

  /*************** MSIE Pointer event handlers *****************/

  function pointerDownHandler(event) {
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE) {
        event.target.msMouseDown = true;
    }
    if (!event.target.msPointerList) event.target.msPointerList = {};
    event.target.msPointerList[event.pointerId] = event;
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };

    createCustomEvent('pointerdown', event.target, payload);
  }

  function pointerMoveHandler(event) {
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE && !event.target.msMouseDown) {
      return;
    }
    if (!event.target.msPointerList) event.target.msPointerList = {};
    event.target.msPointerList[event.pointerId] = event;
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointermove', event.target, payload);
  }

  function pointerUpHandler(event) {
    if (event.target.msPointerList) {
      delete event.target.msPointerList[event.pointerId];
    }
    if (event.pointerType == 2) {
      event.textPointerType = PointerTypes.TOUCH;
    } else if (event.pointerType == 3) {
      event.textPointerType = PointerTypes.PEN;
    } else if (event.pointerType == 4) {
      event.textPointerType = PointerTypes.MOUSE;
    }
    if (event.textPointerType == PointerTypes.MOUSE) {
        event.target.msMouseDown = false;
    }
    var payload = {
      pointerType: event.textPointerType,
      getPointerList: getPointerList.bind(this),
      originalEvent: event
    };
    createCustomEvent('pointerup', event.target, payload);
  }

  /**
   * Causes the passed in element to broadcast pointer events instead
   * of mouse/touch/etc events.
   */
  function emitPointers(el) {
    if (!el.isPointerEmitter) {
      // Latch on to all relevant events for this element.
      if (isPointer()) {
        el.addEventListener('pointerdown', pointerDownHandler);
        el.addEventListener('pointermove', pointerMoveHandler);
        el.addEventListener('pointerup', pointerUpHandler);
      } else if (isMSPointer()) {
        el.addEventListener('MSPointerDown', pointerDownHandler);
        el.addEventListener('MSPointerMove', pointerMoveHandler);
        el.addEventListener('MSPointerUp', pointerUpHandler);
      } else {
        if (isTouch()) {
          el.addEventListener('touchstart', touchStartHandler);
          el.addEventListener('touchmove', touchMoveHandler);
          el.addEventListener('touchend', touchEndHandler);
        }

        if(!CanTK.isAndroid()) {
			el.addEventListener('mousedown', mouseDownHandler);
			el.addEventListener('mousemove', mouseMoveHandler);
			el.addEventListener('mouseup', mouseUpHandler);
			// Necessary for the edge case that the mouse is down and you drag out of
			// the area.
			el.addEventListener('mouseout', mouseOutHandler);
        }
      }

      el.listeners = {};
      el.addEventListener = function(type, listener, useCapture) {
      	var listeners = el.listeners[type] ? el.listeners[type] : [];
      	listeners.push(listener);
      	el.listeners[type] = listeners;
      	console.log("addEventListener: " + type);
      	return;
      }

      el.dispatchEvent = function(event) {
      	var type = event.type;
      	var listeners = el.listeners[type] ? el.listeners[type] : [];

        for(var i = 0; i < listeners.length; i++) {
        	var iter = listeners[i];
        	iter(event);
        }

        return;
      }
      
      for(var type in Gesture._gestureHandlers) {
          var handler = Gesture._gestureHandlers[type];
		  if (handler) {
			handler(el);
		  }
      }

      el.isPointerEmitter = true;
    }
  }

  /**
   * @return {Boolean} Returns true iff this user agent supports touch events.
   */
  function isTouch() {
    return Modernizr.touch;
  }

  /**
   * @return {Boolean} Returns true iff this user agent supports MSIE pointer
   * events.
   */
  function isMSPointer() {
    return window.navigator.msPointerEnabled;
  }

   /**
   * @return {Boolean} Returns true iff this user agent supports pointer
   * events.
   */
  function isPointer() {
    return window.navigator.pointerEnabled;
  }

  /**
   * Option 1: Require emitPointers call on all pointer event emitters.
   */
  exports.pointer = {
    emitPointers: emitPointers,
  };

  /**
   * Option 2: Replace addEventListener with a custom version.
   */
  function augmentAddEventListener(baseElementClass, customEventListener) {
    var oldAddEventListener = baseElementClass.prototype.addEventListener;
    baseElementClass.prototype.addEventListener = function(type, listener, useCapture) {
      customEventListener.call(this, type, listener, useCapture);
      oldAddEventListener.call(this, type, listener, useCapture);
    };
  }

//  function synthesizePointerEvents(type, listener, useCapture) {
//    if (type.indexOf('pointer') === 0) {
//      emitPointers(this);
//    }
//  }
//
//  // Note: Firefox doesn't work like other browsers... overriding HTMLElement
//  // doesn't actually affect anything. Special case for Firefox:
//  if (navigator.userAgent.match(/Firefox/)) {
//    // TODO: fix this for the general case.
//    augmentAddEventListener(HTMLDivElement, synthesizePointerEvents);
//    augmentAddEventListener(HTMLCanvasElement, synthesizePointerEvents);
//  } else {
//    augmentAddEventListener(HTMLElement, synthesizePointerEvents);
//  }

  exports._createCustomEvent = createCustomEvent;
  exports._augmentAddEventListener = augmentAddEventListener;
  exports.PointerTypes = PointerTypes;
})(window);

(function(exports) {

  function synthesizeGestureEvents(type, listener, useCapture) {
    if (type.indexOf('gesture') === 0) {
      var handler = Gesture._gestureHandlers[type];
      if (handler) {
        handler(this);
      } else {
        console.error('Warning: no handler found for {{evt}}.'
                      .replace('{{evt}}', type));
      }
    }
  }

  // Note: Firefox doesn't work like other browsers... overriding HTMLElement
  // doesn't actually affect anything. Special case for Firefox:
  //if (navigator.userAgent.match(/Firefox/)) {
  // TODO: fix this for the general case.
  //  window._augmentAddEventListener(HTMLDivElement, synthesizeGestureEvents);
  //  window._augmentAddEventListener(HTMLCanvasElement, synthesizeGestureEvents);
  //} else {
  //  window._augmentAddEventListener(HTMLElement, synthesizeGestureEvents);
  //}
  //window._augmentAddEventListener(HTMLCanvasElement, synthesizeGestureEvents);

  exports.Gesture = exports.Gesture || {};
  exports.Gesture._gestureHandlers = exports.Gesture._gestureHandlers || {};

})(window);

/**
 * Gesture recognizer for the `doubletap` gesture.
 *
 * Taps happen when an element is pressed and then released.
 */
(function(exports) {
  var DOUBLETAP_TIME = 500;
  var WIGGLE_THRESHOLD = 30;

  /**
   * A simple object for storing the position of a pointer.
   */
  function PointerPosition(pointer) {
    this.x = pointer.clientX;
    this.y = pointer.clientY;
  }

  /**
   * calculate the squared distance of the given pointer from this 
   * PointerPosition's pointer
   */
  PointerPosition.prototype.calculateSquaredDistance = function(pointer) {
    var dx = this.x - pointer.clientX;
    var dy = this.y - pointer.clientY;
    return dx*dx + dy*dy;
  };

  function pointerDown(e) {
    var pointers = e.getPointerList();
    if (pointers.length != 1) return;
    var now = new Date();
    var rightButton = e.originalEvent && CanTK.isRightMouseEvent(e.originalEvent);
    if (now - this.lastDownTime < DOUBLETAP_TIME && this.lastPosition && this.lastPosition.calculateSquaredDistance(pointers[0]) < WIGGLE_THRESHOLD * WIGGLE_THRESHOLD && !rightButton) {
      this.isDoubleTap = true;
      this.eTarget = e.target;
    }
    this.lastPosition = new PointerPosition(pointers[0]);
    this.lastDownTime = now;
  }
  
  function pointerUp(e) {
      if(this.isDoubleTap) {
		  this.isDoubleTap = false;
		  this.lastDownTime = 0;
		  this.lastPosition = null;

		  var payload = {
		  };
		  clearTimeout(this.longPressTimer);
		  window._createCustomEvent('gesturedoubletap', this.eTarget, payload);
      }
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitDoubleTaps(el) {
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointerup', pointerUp);
  }

  exports.Gesture._gestureHandlers.gesturedoubletap = emitDoubleTaps;

})(window);

/**
 * Gesture recognizer for the `longpress` gesture.
 *
 * Longpress happens when pointer is pressed and doesn't get released
 * for a while (without movement).
 */
(function(exports) {
  var LONGPRESS_TIME = 600;
  var WIGGLE_THRESHOLD = 5;

  /**
   * A simple object for storing the position of a pointer.
   */
  function PointerPosition(pointer) {
    this.x = pointer.clientX;
    this.y = pointer.clientY;
  }

  /**
   * calculate the squared distance of the given pointer from this 
   * PointerPosition's pointer
   */
  PointerPosition.prototype.calculateSquaredDistance = function(pointer) {
    var dx = this.x - pointer.clientX;
    var dy = this.y - pointer.clientY;
    return dx*dx + dy*dy;
  };


  function pointerDown(e) {

    // Something went down. Clear the last press if there was one.
    clearTimeout(this.longPressTimer);

    var pointers = e.getPointerList();

    // check that we only have one pointer down
    if(pointers.length === 1) {

      // cache the position of the pointer on the target
      e.target.longpressInitPosition = new PointerPosition(pointers[0]);

      // Start a timer.
      this.longPressTimer = setTimeout(function() {
        payload = {};
        window._createCustomEvent('gesturelongpress', e.target, payload);
      }, LONGPRESS_TIME);

    }
    
  }

  function pointerMove(e) {
    var pointers = e.getPointerList();
    
    if(e.pointerType === PointerTypes.MOUSE) {
      // if the pointer is a mouse we cancel the longpress 
      // as soon as it starts wiggling around
      clearTimeout(this.longPressTimer);
    }
    else if(pointers.length === 1) {
      // but if the pointer is something else we allow a 
      // for a bit of smudge space
      var pos = e.target.longpressInitPosition;
      
      if(pos && pos.calculateSquaredDistance(pointers[0]) > WIGGLE_THRESHOLD * WIGGLE_THRESHOLD) {
        clearTimeout(this.longPressTimer);
      }
    }
    
  }

  function pointerUp(e) {
    clearTimeout(this.longPressTimer);
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitLongPresses(el) {
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointermove', pointerMove);
    el.addEventListener('pointerup', pointerUp);
  }

  exports.Gesture._gestureHandlers.gesturelongpress = emitLongPresses;

})(window);

/**
 * Gesture recognizer for the `scale` gesture.
 *
 * Scale happens when two fingers are placed on the screen, and then
 * they move so the the distance between them is greater or less than a
 * certain threshold.
 */
(function(exports) {

  var SCALE_THRESHOLD = 0.2;

  function PointerPair(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  /**
   * Calculate the center of the two pointers.
   */
  PointerPair.prototype.center = function() {
    return [(this.p1.pageX + this.p2.pageX) / 2, (this.p1.pageY + this.p2.pageY) / 2];
  };

  /**
   * Calculate the distance between the two pointers.
   */
  PointerPair.prototype.span = function() {
    var dx = this.p1.pageX - this.p2.pageX;
    var dy = this.p1.pageY - this.p2.pageY;
    return Math.sqrt(dx*dx + dy*dy);
  };

  /**
   * Given a reference pair, calculate the scale multiplier difference.
   */
  PointerPair.prototype.scaleSince = function(referencePair) {
    var originalSpan = this.span();
    var referenceSpan = referencePair.span();
    if (referenceSpan === 0) {
      return 0;
    }
    else return originalSpan / referenceSpan;
  };

  function pointerDown(e) {
    var pointerList = e.getPointerList();
    // If there are exactly two pointers down,
    if (pointerList.length == 2) {
      // Record the initial pointer pair.
      e.target.scaleReferencePair = new PointerPair(pointerList[0],
                                                    pointerList[1]);
        var payload = {
          scale: 1,
          scaleStart: true
        };
        window._createCustomEvent('gesturescale', e.target, payload);
        this.isGestureScale = true;
    }
    else {
        this.isGestureScale = false;
    }
  }

  function pointerMove(e) {
    var pointerList = e.getPointerList();
    // If there are two pointers down, compare to the initial pointer pair.
    if (pointerList.length == 2 && e.target.scaleReferencePair) {
      var pair = new PointerPair(pointerList[0], pointerList[1]);
      // Compute the scaling value according to the difference.
      var scale = pair.scaleSince(e.target.scaleReferencePair);
      // If the movement is drastic enough:
      if (Math.abs(1 - scale) > SCALE_THRESHOLD) {
        // Create the scale event as a result.
        var payload = {
          scale: scale,
          centerX: (e.target.scaleReferencePair.p1.clientX + e.target.scaleReferencePair.p2.clientX) / 2,
          centerY: (e.target.scaleReferencePair.p1.clientY + e.target.scaleReferencePair.p2.clientY) / 2
        };
        window._createCustomEvent('gesturescale', e.target, payload);
      }
    }
  }

  function pointerUp(e) {
  	if(this.isGestureScale) {
        var payload = {
          scale: 1,
          scaleEnd: true
        };
        window._createCustomEvent('gesturescale', e.target, payload);
	}

    e.target.scaleReferencePair = null;
  }

  /**
   * Make the specified element create gesturetap events.
   */
  function emitScale(el) {
    el.addEventListener('pointerdown', pointerDown);
    el.addEventListener('pointermove', pointerMove);
    el.addEventListener('pointerup', pointerUp);
  }

  exports.Gesture._gestureHandlers.gesturescale = emitScale;

})(window);

(function(){

    var root = this;
    
    root.CanTK = function() {

    }

/*
 * File: config.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var WTK_HOST_NAME = "http://www.drawapp8.com";

function cantkGetHostName() {
	return "";//WTK_HOST_NAME;
}

function cantkSetHostName(name) {
	WTK_HOST_NAME = name;
	return;
}

function cantkGetImageRoot() {
	return cantkGetHostName() + "/base/images/";
}

function cantkGetImageURL(name) {
	return cantkGetHostName() + "/base/images/" + name;
}


/*
 * File: trace.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: portable log
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var browser = {    
	versions:function(){            
	var u = navigator.userAgent, app = navigator.appVersion;            
	return {                
		ie9: u.indexOf('MSIE 9.0') > -1,
		ie10: u.indexOf('MSIE 10.0') > -1,
		ie: u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
		oldIE: u.indexOf('MSIE 8.0') > -1||u.indexOf('MSIE 7.0') > -1 || u.indexOf('MSIE 6.0') > -1,
		android: u.indexOf('Android') > -1 && u.indexOf('Linux') > -1, 
		iPhone: u.indexOf('iPhone') > -1, 
		iPad: u.indexOf('iPad') > -1, 
		blackberry: u.indexOf('BlackBerry') > -1, 
		firefoxMobile:u.indexOf('Mobile') > -1 && u.indexOf('Firefox') > -1,
		windowPhone: u.indexOf('Windows Phone') > -1,
		webkit: u.indexOf("WebKit") > -1,
		weixin: u.indexOf("MicroMessenger") >= 0
	};
	}()
} 

function isWeiXin() {
	return browser.versions.weixin;
}

function isWebkit() {
	return browser.versions.webkit;
}

if(browser.versions.oldIE || browser.versions.ie9) {
	window.console = {};
	window.console.log = function(str) {};
}

var gForceMobile = false
function setForceMobile(value) {
	gForceMobile = value;

	return;
}

function isOldIE() {
	return browser.versions.oldIE;
}

function isIE() {
	return browser.versions.ie;
}

if(browser.versions.oldIE) {
	console.log("oldIE "+browser.versions.oldIE);
}

function isMobile() {
	return gForceMobile || browser.versions.android 
		|| browser.versions.iPhone 
		|| browser.versions.blackberry
		|| browser.versions.windowPhone
		|| browser.versions.firefoxMobile;
}

function isAndroid() {
	return browser.versions.android;
}

function isIPhone() {
	return browser.versions.iPhone;
}

function isIPad() {
	return browser.versions.ipad;
}

function isWinPhone() {
	return browser.versions.windowPhone;
}

function isBlackBerry() {
	return browser.versions.blackberry;
}

function isFirefoxMobile() {
	return browser.versions.firefoxMobile;
}

function isFirefoxOS () {
	return browser.versions.firefoxMobile;
}

function isPhoneGap() {
	return (window.cordova || window.Cordova || window.PhoneGap || window.phonegap) 
		&& /^file:\/{3}[^\/]/i.test(window.location.href) 
		&& /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function isTizen() {
	return window.tizen;
}

function getBrowserVersionNumber() {
	var ua = navigator.userAgent;
	var keys = ["AppleWebKit/", "AppleWebKit ", "AppleWebKit", "MSIE ", "Firefox/", "Safari/", "Opera ", "Opera/"];

	for(var i = 0; i < keys.length; i++) {
		var iter = keys[i];
		var offset = ua.indexOf(iter);
		if(offset >= 0) {
			var str = ua.substr(offset + iter.length);
			var version = parseFloat(str);

			return version;
		}
	}

	return 1.0;
}

browser.versions.number = getBrowserVersionNumber();

function browserVersion() {
	return browser.versions.number;
}

console.log(navigator.userAgent + " version number=" + browserVersion()); 


var gBuildMonth = "14*12+07";
var gBuildDate = "2014-07-22 17:40:41";

/*
 * File: utils.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: some tool functions.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

Array.prototype.remove = function(obj, all) {
    for (var i=0; i < this.length; ++i ) {
        if ( this[i] === obj ) {
            this.splice(i, 1); 

            if(!all) 
	           break;
        }
    }
    
    return;
}

Array.prototype.insert = function(index, obj) {
	if(index >= 0 && index < this.length) {
		this.splice(index, 0, obj);
	}
	else {
		this.push(obj);
	}

	return;
}

Array.prototype.indexOf = function(obj) {
    for (var i=0; i < this.length; ++i ) {
        if ( this[i] === obj ) {
        	return i;
        }
    }
    
    return -1;
}

Array.prototype.binarySearch = function(find, comparator) {
	var i = 0;
    var low = 0;
	var comparison = 0; 
	var high = this.length - 1;

    while (low <= high) {
        i = (low + high) >> 1;
        comparison = comparator(this[i], find);
        if (comparison < 0) { low = i + 1; continue; };
        if (comparison > 0) { high = i - 1; continue; };

        return i;
    }

    return -1;
};

Array.prototype.has = function(obj) {
    return this.indexOf(obj) >= 0;
}

Array.prototype.clear = function() {  
	for(var i = 0; i < this.length; i++) {
		var iter = this[i];

		if(typeof iter != "object") {
			continue;
		}

		if(iter && iter.destroy && typeof iter.destroy == "function") {
			iter.destroy();
		}
		delete iter;
	}

    this.length=0;  
} 

Array.prototype.copy = function(src) {  
	this.clear();

    for (var i= 0 ; i < src.length ; ++i ) {
    	var obj = src[i];

    	if(obj && obj.dup) {
    		obj = obj.dup();
    	}

    	this.push(obj);	
    }

	return;
} 

function makeUniqRandArray(start, end) {
	if(start >= end) {
		return null;
	}

	var arr = [];
	var range = end - start + 1;

	for(var i = 0; i < range; i++) {
		do {
			var num = start + Math.floor(Math.random() * range);
			if(!arr.has(num)) {
				arr.push(num);
				break;
			}
		}while(1);
	}
	
	return arr;
}

///////////////////////////////////////////////////////////////////

function fixRect(rect) {
	if(rect.w < 0) {
		rect.x = rect.x + rect.w;
		rect.w = -rect.w;
	}

	if(rect.h < 0) {
		rect.y = rect.y + rect.h;
		rect.h = -rect.h;
	}

	return rect;
}

function isPointInRect(point, rect) {
    return point.x >= rect.x
        && point.y >= rect.y
        && point.x < (rect.x + rect.w)
        && point.y < (rect.y + rect.h);
}

var XHRHttp = (function () {
    if (typeof window === 'undefined') {
        throw new Error('no window object present');
    }
    else if (window.XMLHttpRequest) {
        return window.XMLHttpRequest;
    }
    else if (window.ActiveXObject) {
        var axs = [
            'Msxml2.XMLHTTP.6.0',
            'Msxml2.XMLHTTP.3.0',
            'Microsoft.XMLHTTP'
        ];
        for (var i = 0; i < axs.length; i++) {
            try {
                var ax = new(window.ActiveXObject)(axs[i]);
                return function () {
                    if (ax) {
                        var ax_ = ax;
                        ax = null;
                        return ax_;
                    }
                    else {
                        return new(window.ActiveXObject)(axs[i]);
                    }
                };
            }
            catch (e) {}
        }
        throw new Error('ajax not supported in this browser')
    }
    else {
        throw new Error('ajax not supported in this browser');
    }
})();

function createXMLHTTTPRequest() {
	var xhr = new XHRHttp();

	return xhr;
}

function cantkAddEventListener(name, handler) {
	if (window.attachEvent) {
		//IE and Opera
		window.attachEvent(name, handler);
	} else if (window.addEventListener) {
		// IE 6
		window.addEventListener(name, handler);
	} else {
		//FireFox
		document.addEventListener(name, handler, true);
	}

	return;
}

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {   
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {   
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);   
	}
	 else {   
	 	return this.replace(reallyDo, replaceWith);   
	 }   
}   

/*WordPress convert " to “ ”, we need convert it back.*/
function fixJson(json) {
	var i = 0;
	var str = "";

	json = json.replaceAll("<br>", "");
	
	var n = json.length;
	for(i = 0; i < n; i++) {
		var c = json.charAt(i);

		if(c === '“' || c === '”') {
			c = '"';
		}

		str = str + c;
	}

	return str;
}

String.prototype.trim = function() 
{
	return String(this).replace(/^\s+|\s+$|^\n+|\n+$/g, '');
}

function drawDashedRect(canvas, x, y, w, h) {
	var f = 8;
	var e = 4;

	canvas.beginPath();
	drawDashedLine(canvas, {x:x, y:y}, {x:w+x, y:y}, f, e);
	drawDashedLine(canvas, {x:x, y:h+y}, {x:w+x, y:h+y}, f, e);
	drawDashedLine(canvas, {x:x, y:y}, {x:x, y:h+y}, f, e);
	drawDashedLine(canvas, {x:w+x, y:y}, {x:w+x, y:h+y}, f, e);

	return;
}

function drawDashedLine(canvas, start_p, end_p, f, e) {
	if(!canvas || !start_p || !end_p || !f) return;
	

	var x = start_p.x;
	var y = start_p.y;
	
	canvas.moveTo(x, y);
	if(!e) {
		canvas.lineTo(end_p.x, end_p.y);
		
		return;
	}
	
	var dx = end_p.x - start_p.x;
	var dy = end_p.y - start_p.y;
	var length = Math.sqrt(dx*dx + dy*dy);	
	var angle = Math.atan(dy/dx);

	canvas.save();
	canvas.translate(start_p.x, start_p.y);
	canvas.rotate(angle);
	if(end_p.x < start_p.x) {
		canvas.translate(-length, 0);
	}
	canvas.moveTo(0, 0);			
	x = 0;
	while(x < length) {
		x += f;
		if(x > length) {
			x = length;
		}
		canvas.lineTo(x, 0);

		if(x == length) {
			break;
		}

		x += e;
		if(x > length) {
			x = length;
		}
		canvas.moveTo(x, 0);			
	}
	canvas.restore();

	return;
}

var C_ARROW_NONE   = 0;
var C_ARROW_NORMAL = 1;
var C_ARROW_CIRCLE = 2;
var C_ARROW_RECT   = 3;
var C_ARROW_DIAMOND  = 4;
var C_ARROW_TRI    = 5;
var C_ARROW_FILL_CIRCLE = 1 << 8 | C_ARROW_CIRCLE;
var C_ARROW_FILL_RECT   = 1 << 8 | C_ARROW_RECT;
var C_ARROW_FILL_DIAMOND  = 1 << 8 | C_ARROW_DIAMOND;
var C_ARROW_FILL_TRI    = 1 << 8 | C_ARROW_TRI;

function drawArrowHeaderNormal(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.moveTo(-size/2, -size/2);
	canvas.lineTo(size/2, 0);
	canvas.lineTo(-size/2, size/2);
	canvas.stroke();
	canvas.beginPath();

	return;
}

function drawArrowHeaderTri(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.moveTo(size/2, 0);
	canvas.lineTo(-size/2, -size/2);
	canvas.lineTo(-size/2, size/2);
	canvas.lineTo(size/2, 0);
	
	return;
}

function drawArrowHeaderCircle(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.arc(0, 0, size/2, Math.PI*2, 0);
	
	return;
}

function drawArrowHeaderRect(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.rect(-size/2, -size/2, size, size);
	
	return;
}

function drawArrowHeaderRRect(canvas, size) {
	canvas.translate(-size/2, 0);
	canvas.rotate(Math.PI/4);
	canvas.rect(-size/2, -size/2, size, size);
		
	return;
}

var arrow_draw_header = 
[
	null,
	drawArrowHeaderNormal,
	drawArrowHeaderCircle,
	drawArrowHeaderRect,
	drawArrowHeaderRRect,
	drawArrowHeaderTri
];

function drawArrow(canvas, type, start_p, end_p, a_size) {
	var size = 10;
	if(!canvas || !start_p || !end_p) return;
	var fill = type >> 8;
	
	type = type & 0xff;	
	if(type <= 0 || type >= arrow_draw_header.length) {
		return;
	}
	
	if(a_size) {
		size = a_size;
	}
	
	var k = (end_p.y - start_p.y)/(end_p.x - start_p.x)
	var angle = Math.atan(k);
	

	if(end_p.x < start_p.x) {
		angle = angle + Math.PI;
	}
	
	var fillStyle =  canvas.fillStyle;
	var strokeStyle = canvas.strokeStyle;
	
	canvas.save();
	
	canvas.translate(end_p.x, end_p.y);
	canvas.rotate(angle);
	
	canvas.beginPath();
	size = size + canvas.lineWidth - 1;
	arrow_draw_header[type](canvas, size);
	canvas.closePath();
	
	if(fill) {
		canvas.fillStyle = strokeStyle;
	}
	else {
		canvas.fillStyle = "White";
	}

	if(type > 1) {
		canvas.fill();
	}
	canvas.stroke();

	canvas.restore();
	
	canvas.fillStyle =  fillStyle;
	canvas.strokeStyle = strokeStyle;
	
	return;
}

var gCacheCanvas = null;
function CacheCanvasGet(width, height) {
	if(!gCacheCanvas) {
		gCacheCanvas = document.createElement("canvas");

		gCacheCanvas.type = "backend_canvas";
		gCacheCanvas.width = width;
		gCacheCanvas.height = height;
	}

	if(gCacheCanvas) {
		if(gCacheCanvas.width < width) {
			gCacheCanvas.width = width;
		}

		if(gCacheCanvas.height < height) {
			gCacheCanvas.height = height;
		}
	}

	return gCacheCanvas;
}

function drawNinePatchEx(context, image, s_x, s_y, s_w, s_h, x, y, w, h) {
	var dx = 0;
	var dy = 0;
	var tw = 0;
	var th = 0;
	var cw = 0;
	var ch = 0;
	var dcw = 0;
	var dch = 0;
	
	if(!image) {
		context.fillRect(x, y, w, h);
		return;
	}

	if(!s_w || s_w > image.width) {
		s_w = image.width;
	}

	if(!s_h || s_h > image.height) {
		s_h = image.height;
	}

	if(w < s_w && h < s_h) {
		canvas.drawImage(image, s_x, s_y, s_w, s_h, x, y, w, h);

		return;
	}

	tw = Math.floor(s_w/3);
	th = Math.floor(s_h/3);
	cw = s_w - tw - tw;
	ch = s_h - th - th;
    
    dcw = w - tw - tw;
    dch = h - th - th;

    /*draw four corner*/
    context.drawImage(image, s_x, s_y, tw, th, x, y, tw, th);
    context.drawImage(image, s_x+s_w-tw, s_y, tw, th, x+w-tw, y, tw, th);
    context.drawImage(image, s_x, s_y+s_h-th, tw, th, x, y+h-th, tw, th);
    context.drawImage(image, s_x+s_w-tw, s_y+s_h-th, tw, th, x+w-tw, y+h-th, tw, th);


	if(dcw > 0) {
    	if(isWebkit()) {
	    	context.drawImage(image, s_x+tw, s_y, cw, th, x+tw, y, dcw, th);
    		context.drawImage(image, s_x+tw, s_y+s_h-th, cw, th, x+tw, y+h-th, dcw, th);
    	}
    	else {
			context.drawImage(image, s_x+tw, s_y, cw, th, x+tw-0.5, y, dcw+1, th);
			context.drawImage(image, s_x+tw, s_y+s_h-th, cw, th, x+tw-0.5, y+h-th, dcw+1, th);
    	}
	}

	if(dch > 0) {
		if(isWebkit()) {
			context.drawImage(image, s_x, s_y+th, tw, ch, x, y+th, tw, dch);
			context.drawImage(image, s_x+s_w-tw, s_y+th, tw, ch, x+w-tw, y+th, tw, dch);
		}
		else {
			context.drawImage(image, s_x, s_y+th, tw, ch, x, y+th-0.5, tw, dch+1);
			context.drawImage(image, s_x+s_w-tw, s_y+th, tw, ch, x+w-tw, y+th-0.5, tw, dch+1);
		}
	}

	//center
	if(dcw > 0 && dch > 0) {
    	context.drawImage(image, s_x+tw, s_y+th, cw, ch, x+tw-1, y+th-1, dcw+2, dch+2);
	}

    return;
}


function drawNinePatch(context, image, x, y, w, h) {
	if(!image) {
		context.fillRect(x, y, w, h);
		return;
	}

	return drawNinePatchEx(context, image, 0, 0, image.width, image.height, x, y, w, h);
}

function drawNinePatchIcon(context, icon, x, y, w, h) {
	var image = icon.getImage();
	var s_x = icon.getX();
	var s_y = icon.getY();
	var s_w = icon.getWidth();
	var s_h = icon.getHeight();

	if(!image) {
		context.fillRect(x, y, w, h);
		return;
	}

	return drawNinePatchEx(context, image, s_x, s_y, s_w, s_h, x, y, w, h);
}

function RoundRect() {
}

RoundRect.TL = 1;
RoundRect.TR = 2;
RoundRect.BL = 4;
RoundRect.BR = 8;

function drawRoundRect(canvas, w, h, r, which) {
	var hw = w >> 1;
	var hh = h >> 1;

	if(w < 0 || h < 0) {
		return;
	}

	if(r >= hw || r >= hh) {
		canvas.arc(hw, hh, Math.min(hh, hw), 0, Math.PI * 2);
		return;
	}

	if(!which) {
		which = RoundRect.TL | RoundRect.TR | RoundRect.BL | RoundRect.BR;
	}

	if(r) {
		if(which & RoundRect.TL) {
			canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
		}
		else {
			canvas.moveTo(0, 0);
		}

		if(which & RoundRect.TR) {
			canvas.lineTo(w - r, 0);
			canvas.arc(w-r, r, r, 1.5*Math.PI, 2*Math.PI,  false);
		}
		else {
			canvas.lineTo(w, 0);
		}
	
		if(which & RoundRect.BR) {
			canvas.lineTo(w, h-r);
			canvas.arc(w-r, h-r, r, 0, 0.5*Math.PI, false);
		}
		else {
			canvas.lineTo(w, h);
		}

		if(which & RoundRect.BL) {
			canvas.lineTo(r, h);
			canvas.arc(r, h-r, r, 0.5 * Math.PI, Math.PI, false);
		}
		else {
			canvas.lineTo(0, h);
		}
		
		if(which & RoundRect.TL) {
			canvas.lineTo(0, r);
		}
		else {
			canvas.lineTo(0, 0);
		}
	}
	else {
		canvas.rect(0, 0, w, h);
	}

	return;
}

function getViewPort() {
	 var viewportwidth;
	 var viewportheight;
		
	 if (typeof window.innerWidth != 'undefined'){
	  viewportwidth = window.innerWidth;
	  viewportheight = window.innerHeight;
	 }
	 else if (typeof document.documentElement != 'undefined'
	  && typeof document.documentElement.clientWidth !=
	  'undefined' && document.documentElement.clientWidth != 0)
	 {
	  viewportwidth = document.documentElement.clientWidth;
	  viewportheight = document.documentElement.clientHeight;
	 }
	 else{
	  viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
	  viewportheight = document.getElementsByTagName('body')[0].clientHeight;
	 }

	 return {width:viewportwidth, height:viewportheight};
}

if(!window.orgViewPort) {
	window.orgViewPort = getViewPort();
	//console.log("OrgViewPort: " + window.orgViewPort.width + "x" + window.orgViewPort.height);
}

function layoutText(canvas, fontSize, str, width) {
	var i = 0;
	var j = 0;
	var wordW = 0;
	var lineW = 0;
	var logicLine = "";
	var logicLines = new Array();
	var phyLines = str.split("\n");
	var textLayout = new TextLayout(canvas);

	for(i = 0; i < phyLines.length; i++) {
		var line = phyLines[i];

		if(line) {
			textLayout.setText(line);
			while(textLayout.hasNext()) {
				var lineInfo = textLayout.nextLine(width, fontSize);
				logicLines.push(lineInfo.text);
			}
		}
		else {
			logicLines.push(" ");
		}
	}

	return logicLines;
}

function codeIsLetter(code) {
	return ((code >= 0x61 && code <= 0x7a) || (code >= 0x41 && code <= 0x5a));
}

function TextLayout(canvas) {
	this.canvas = canvas;

	this.setText = function(str) {
		this.str = str;
		this.startOffset = 0;
		this.lineInfo = {text:"", width:0};

		return;
	}
	
	this.canBreakBefore = function(chr) {
		if(chr === ' '
			|| chr === '\t'
			|| chr === '.'
			|| chr === ']'
			|| chr === ')'
			|| chr === '}'
			|| chr === ','
			|| chr === '?'
			|| chr === ';'
			|| chr === ':'
			|| chr === '!'
			|| chr === '\"'
			|| chr === '\''
			|| chr === '。'
			|| chr === '？'
			|| chr === '、'
			|| chr === '”'
			|| chr === '’'
			|| chr === '】'
			|| chr === '》'
			|| chr === '〉'
			|| chr === '〕'
			|| chr === '）'
			|| chr === '：'
			|| chr === '；'
			|| chr === '，') {
				return false;
		}

		return true;
	}

	this.hasNext = function() {
		return this.startOffset < this.str.length;
	}

	this.nextLine = function(width, fontSize) {
		var done = false;
		var lineText = "";
		var str = this.str;
		var i = this.startOffset;
		var length = str.length;
		var n = Math.floor((width/fontSize)*0.75);
		var availableLength = length - this.startOffset;

		if(availableLength < 1) {
			this.lineInfo.text = "";
			this.lineInfo.width = 0;

			return null;
		}
		
		if(availableLength < n) {
			lineText = str.substr(this.startOffset, availableLength);
			this.lineInfo.text = lineText;
			this.lineInfo.width = canvas.measureText(lineText).width;

			this.startOffset = this.startOffset + lineText.length;

			return this.lineInfo;
		}

		if(n > 3) {
			n = n - 3;
		}
	
		lineText = str.substr(this.startOffset, n);
	
		var code = 0;
		var chr = null;
		var chrWidth = 0;
		var nextChar = null;
		var lineWidth = canvas.measureText(lineText).width;

		var flexibleWidth = Math.floor(width * 0.3);

		var fontSize2 = 2 * fontSize;
		var maxWidth = width + flexibleWidth;
		var minWidth = width - fontSize2;

		for(i = this.startOffset + n; i < length; i++) {
			chr = str.charAt(i);
			code = str.charCodeAt(i);
			
			lineText += chr;
			chrWidth  = canvas.measureText(chr).width;
			lineWidth = lineWidth + 1 + chrWidth;
		
			if(chr == "'") {
				continue;
			}

			if(lineWidth > maxWidth) {
				break;
			}
			
			if(lineWidth < minWidth) {
				continue;
			}

			if(codeIsLetter(code)) {
				continue;
			}
			
			if(code == 0x20) {
				if(lineWidth >= width) {
					break;
				}

				var nOfLetter = 0;
				for(var k = i+1; k < length; k++) {
					code = str.charCodeAt(k);

					if(codeIsLetter(code)) {
						nOfLetter++;
					}
					else {
						break;
					}
				}

				if(nOfLetter > 7) {
					break;
				}
				else {
					continue;
				}
			}

			if((i + 1) < length) {
				nextChar = str.charAt(i+1);
				if(lineWidth >= width && this.canBreakBefore(nextChar)) {
					break;
				}
			}
		}

		this.lineInfo.text = lineText;
		this.lineInfo.width = canvas.measureText(lineText).width;
		this.startOffset = this.startOffset + lineText.length;

		return this.lineInfo;
	}

	return this;
}

function httpDoRequest(info) {
	var xhr = null;
	xhr = createXMLHTTTPRequest();
	if(!info || !info.url) {
		return false;
	}

	var url = info.url;
	var data = info.data;
	var method = info.method ? info.method : "GET";

	//cross domain via proxy.
	if(!info.noProxy && url.indexOf("http") === 0 && url.indexOf(window.location.hostname) < 0) {
		url = '/proxy.php?url=' + window.btoa(url) + '&mode=native&full_headers=1&send_cookies=1&send_session=0';

		if(info.headers && info.headers["User-Agent"]) {
			var ua = info.headers["User-Agent"];
			url = url + "&ua="+ encodeURI(ua);
			delete info.headers["User-Agent"];
		}
	}
	
	xhr.open(method, url, true);

	if(info.noCache) {
		xhr.setRequestHeader('If-Modified-Since', '0');
	}

	if(info.headers) {
		for(var key in info.headers) {
			var value = info.headers[key];
			xhr.setRequestHeader(key, value);
		}
	}

	if(xhr) {
		xhr.send(info.data ? info.data : null);
		
		if(!xhr.onprogress) {
			xhr.onreadystatechange = function() {
				if(info.onProgress) {
					info.onProgress(xhr);
				}
				if(xhr.readyState === 4) {
					if(info.onDone) {
						info.onDone(true, xhr, xhr.responseText);
					}
				}
				//console.log("onreadystatechange:" + xhr.readyState);
				return;
			}
		}
		else {
			xhr.onprogress = function(e)  {
				var total = e.total;
				if(info.onProgress) {
					info.onProgress(xhr);
				}
				console.log("get:" + total);
			 }
			
			xhr.onload = function(e)  {
				if(info.onDone) {
					info.onDone(true, xhr, e.target.responseText);
				}
			}
			
			xhr.onerror = function(e)  {
				if(info.onDone) {
					info.onDone(false, xhr, xhr.responseText);
				}
			}
		}
	}

	return true;
}

function cantkRestoreViewPort() {
	cantkInitViewPort(1);

	return;
}

function cantkInitViewPort(scale) {
	var value = "";
	var meta = document.createElement('meta');
	var head = document.getElementsByTagName('head')[0];
	
	var defaultRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

	scale = scale ? scale : (1/defaultRatio);
	var scaleValues = "initial-scale="+scale+", minimum-scale="+scale+", maximum-scale="+scale+", user-scalable=0";

	if(browser.versions.iPhone) {
	  value = 'width=device-width, ' + scaleValues;
	}
	else if(isAndroid()) {
	  var ver = browserVersion();
	  if(ver < 535.00 || isWeiXin()) {
	  	value = 'target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
	  }
	  else {
	  	//target-densitydpi is not supported any longer in new version.
	  	value =  'width=device-width, ' + scaleValues; 
	  }
	}
	else if(isFirefoxMobile()) {
      var vp = getViewPort();
	  value =  'width='+vp.width+', ' + scaleValues; 
	}
	else {
	  value =  'width=device-width, ' + scaleValues; 
	}

	meta.name = 'viewport';
	meta.content = value;

	console.log("viewport: " + value);
	head.appendChild(meta);

//	if(window.orgViewPort) {
//		var vp = getViewPort();
//		var ratio = vp.width/window.orgViewPort.width;
//		
//		console.log("ratio: " + ratio);
//		if(!window.devicePixelRatio) {
//			window.devicePixelRatio = ratio;
//		}
//	}

	return;
}

function cantkLog(str) {
	console.log(str);

	return;
}

////////////////////////////////////////////////


var gDelayScripts = new Array();

function cantkDelayLoadScript(url) {
	gDelayScripts.push(url);

	return;
}

function loadDelayScriptsNow() {
	var i = 0;
	var tag = null;
	var filename = null;
	var node = document.head ? document.head : document.body;

	for(i = 0; i < gDelayScripts.length; i++) {
		filename = gDelayScripts[i];
		tag = document.createElement("script"); 
		tag.src = filename; 
		node.appendChild(tag);
		console.log("Load: " + filename);
	}
	
	gDelayScripts.clear();

	return;
}

function loadScriptOnce(src) {
	var scripts = document.scripts;

	if(scripts) {
		for(var i = 0; i < scripts.length; i++) {
			var iter = scripts[i];
			if(iter.src && iter.src.indexOf(src) >= 0) {
				console.log("script is loaded: " + src);
				return;
			}
		}
	}
	
	var node = document.head ? document.head : document.body;
	var tag = document.createElement("script");
	tag.src = src; 
	node.appendChild(tag);
	
	console.log("load script: " + src);
	
	return;
	
}

setTimeout(function() {
	loadDelayScriptsNow();
	return;
}, 800);

function delayLoadScripts(hostName) {
	if(hostName) {
		dappSetResHostName(hostName);
	}
	
	return;
}

function getScriptByUrl(url) {
	var scripts = document.getElementsByTagName("script");

	if(scripts) {
		for(var i = 0; i < scripts.length; i++) {
			var iter = scripts[i];
			var src = iter.src;

			if(src.indexOf(url) >= 0) {
				return iter;
			}
		}
	}

	return null;
}

function isScriptLoaded(url) {
	return getScriptByUrl(url) != null;
}


/////////////////////////////////////////////////////////

var gUserAppScripts = [];

function clearUserAppScript() {
	for(var i = 0; i < gUserAppScripts.length; i++) {
		var iter = gUserAppScripts[i];

		if(iter.script) {
			console.log("Remove Script:" + iter.url);
			if(iter.script.parentNode) {
				try {
					iter.script.parentNode.removeChild(iter.script);
				}catch(e) {
					console.log("Remove Script Failed:" + e.message);
				}
			}
		}
	}

	gUserAppScripts.clear();

	return;
}

function addUserAppScript(url) {
	var item = {};
	item.url = url;
	item.script = null;
	item.loaded = false;

	gUserAppScripts.push(item);

	return;
}
	
function notifyUserAppScriptsLoadDone(onDone) {
	for(var i = 0; i < gUserAppScripts.length; i++) {
		var iter = gUserAppScripts[i];
		if(!iter.script || !iter.script.loaded) {
			return;
		}
	}

	onDone();

	return;
}

function loadUserAppScripts(onDone) {
	var node = document.head ? document.head : document.body;

	for(var i = 0; i < gUserAppScripts.length; i++) {
		var iter = gUserAppScripts[i];
		iter.script = getScriptByUrl(iter.url);

		if(iter.script) {
			iter.script.loaded = true;
			notifyUserAppScriptsLoadDone(onDone);
			console.log("User App Script Already Loaded: " + iter.url);
			continue;
		}

		iter.script = document.createElement("script");
		iter.script.onload = function() {
			this.loaded = true;
			notifyUserAppScriptsLoadDone(onDone);
		}
		
		iter.script.onerror = function() {
			this.loaded = true;
			this.error = true;
			notifyUserAppScriptsLoadDone(onDone);
		}

		iter.script.src = iter.url;
		node.appendChild(iter.script);
		console.log("Load User App Script: " + iter.url)
	}

	return;
}

/////////////////////////////////////////////////////////

function getLanguageName() {
	var lang = "";
	if(navigator.language) {
		lang = navigator.language;
	}
	else if(navigator.userLanguage) {
		lang = navigator.userLanguage;
	}

	lang = lang.toLowerCase();

	return lang;
}

function cantkGetLocale() {
	return getLanguageName();
}
	
var requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 5);
		};
})();

function getQueryParameter(key) {
  var key = key + "=";
  var queryString = window.top.location.search.substring(1);

  if ( queryString.length > 0 ) {
    begin = queryString.indexOf ( key );
    if ( begin != -1 ) {
      begin += key.length;
      end = queryString.indexOf ( "&" , begin );
        if ( end == -1 ) {
        end = queryString.length
      }
      return unescape ( queryString.substring ( begin, end ) );
    }
  }

  return null; 
}

function cantkGetQueryParam(key) {
	return getQueryParameter(key);
}

function getFontSizeInFont(str) {
	var a = str.split(" ");
	for(var i = 0; i < a.length; i++) {
		var iter = a[i];
		if(iter.indexOf("pt") > 0 || iter.indexOf("px") > 0) {
			var str = iter.replace(/pt/, "");
			str = str.replace(/px/, "");

			return parseInt(str);
		}
	}

	return 0;
}

console.log("Build At " + gBuildDate);


/*
 * File: canvas.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: functions to wrap html5 canvas.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

if (typeof KeyEvent === "undefined") {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_SEMICOLON: 59,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_BACK_BUTTON: 115, /*F4*/
        DOM_VK_MENU_BUTTON: 118, /*F7*/
        DOM_VK_SEARCH_BUTTON: 120, /*F9*/
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_COMMA: 188,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}
KeyEvent.DOM_VK_BACK = 225;

var C_EVT_POINTER_DOWN = 1;
var C_EVT_POINTER_MOVE = 0;
var C_EVT_POINTER_UP = -1;

var C_EVT_KEY_DOWN = 2;
var C_EVT_KEY_UP = 3;
var C_EVT_DOUBLE_CLICK = 4;
var C_EVT_CONTEXT_MENU = 5;
var C_EVT_LONG_PRESS = 6;
var C_EVT_SCALE = 7;

var gCancelDefaultAction = false;

function canvasMaxizeIt(canvas, inlineEdit) {
	var view = getViewPort();
	
	canvas.style.position = "absolute";
	canvas.style.top = 0;
	canvas.style.left = 0;

	if(inlineEdit || isMobile()) {
		canvas.width  = view.width;
		canvas.height = view.height;
	}
	else {
		canvas.width  = view.width - 20;
		canvas.height = view.height * 1.8;
	}

	console.log("canvas size:" + canvas.width + "x" + canvas.height);

	if(canvas.height < 200) {
		canvas.height = 600;
	}

	if(canvas.width < 300) {
		canvas.width = 600;
	}
	
	return;
}

function canvasCreate(type) {
	var canvas = null;
	
	if("string" === typeof type) {
		canvas = document.getElementById(type);
	}
	else {
		canvas = type;
	}

	if(!canvas) {
		canvas = document.createElement("canvas"); 
		canvas.type = "idraw_canvas";
		document.body.appendChild(canvas); 
	}
	
	return canvas;
}

function canvasAttachManager(canvas, manager, app) {
	window.pointer.emitPointers(canvas);

	function getEvent(e) {
		return e ? e: window.event;
	}
	
	function onKeyDown(e) {
		e = getEvent(e);
		var code = e.keyCode;
		
		if(code === KeyEvent.DOM_VK_F5 || code === KeyEvent.DOM_VK_F12 || code === KeyEvent.DOM_VK_F11) {
			return true;
		}
		
		if(targetIsEditor(e)) {
			return true;
		}

		if(!manager.preprocessEvent(C_EVT_KEY_DOWN, e, code)) {
			return true;
		}
		
		manager.onKeyDown(code);
	
		if(code === KeyEvent.DOM_VK_F8) {
			//test code
			var gesture = {scale:1, rotation:0};
			
			gesture.isStart = true;
			manager.onGesture(gesture);

			gesture.isStart = false;
			gesture.isChange = true;
			manager.onGesture(gesture);
			
			gesture.isChange = false;
			gesture.isEnd = true;
			manager.onGesture(gesture);
		}

		return returnDefaultAction(e);
	}

	function onKeyUp(e) {
		e = getEvent(e);
		var code = e.keyCode;
		if(code === KeyEvent.DOM_VK_F5 || code === KeyEvent.DOM_VK_F12 || code === KeyEvent.DOM_VK_F11) {
			return true;
		}
		
		if(targetIsEditor(e)) {
			return true;
		}

		if(!manager.preprocessEvent(C_EVT_KEY_UP, e, code)) {
			return true;
		}

		manager.onKeyUp(code);

		return returnDefaultAction(e);
	}

	if(isTizen()) {
		document.addEventListener('tizenhwkey', function(e) {
			if (e.keyName == "back") {
				manager.onKeyDown(KeyEvent.DOM_VK_BACK_BUTTON);
				manager.onKeyUp(KeyEvent.DOM_VK_BACK_BUTTON);
				console.log("tizenhwkey back button.");
			}
			else if (e.keyName == "menu") {
				manager.onKeyDown(KeyEvent.DOM_VK_MENU_BUTTON);
				manager.onKeyUp(KeyEvent.DOM_VK_MENU_BUTTON);
				console.log("tizenhwkey menu button.");
			}
		});
	}
	else if(isPhoneGap()) {
		function onBackKeyDown() {
			manager.onKeyDown(KeyEvent.DOM_VK_BACK_BUTTON);
			manager.onKeyUp(KeyEvent.DOM_VK_BACK_BUTTON);

			return true;
     	}

		function onMenuKeyDown() {
			manager.onKeyDown(KeyEvent.DOM_VK_MENU_BUTTON);
			manager.onKeyUp(KeyEvent.DOM_VK_MENU_BUTTON);

			return true;
		}

  		function onSearchKeyDown() {
			manager.onKeyDown(KeyEvent.DOM_VK_SEARCH_BUTTON);
			manager.onKeyUp(KeyEvent.DOM_VK_SEARCH_BUTTON);

			return true;
		}

		document.addEventListener("backbutton", onBackKeyDown, false);
		document.addEventListener("menubutton", onMenuKeyDown, false);
  		document.addEventListener("searchbutton", onSearchKeyDown, false);
    }
	else if(!isMobile()) {
		cantkAddEventListener('keyup', onKeyUp);
		cantkAddEventListener('keydown', onKeyDown);
	}

///////////////////////////////////////////////////////////////

	function getAbsPoint (pointer) {
		var x = Math.max(pointer.pageX, pointer.x);
		var y = Math.max(pointer.pageY, pointer.y);

		return {x:x, y:y};
	}

	function isMultiTouchEvent(e) {
		return e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length > 1;
	}
		
	function getLastPointerPoint() {
		var point = {};
		point.x = manager.lastPointerPoint.x;
		point.y = manager.lastPointerPoint.y;

		return point;
	}

	function onPointerDown(e) {
		var pointers = e.getPointerList();
		
		if(isMultiTouchEvent(e)) {
			console.log("onPointerDown Multi touch.");
			return cancelDefaultAction(e);
		}

		if(isRightMouseEvent(e.originalEvent)) {
			console.log("Right button.");
			return cancelDefaultAction(e);
		}

		var pointer = pointers[0];
		var point = getAbsPoint(pointer);
		var id      = pointer.identifier || 0;
		if(manager.preprocessEvent(C_EVT_POINTER_DOWN, e, point)) {
			manager.onPointerDown(point);
		}
	
		//console.log("onPointerDown.");
		return cancelDefaultAction(e);
	}

	function onPointerMove(e) {
		var pointers = e.getPointerList();
		
		if(isMultiTouchEvent(e)) {
			console.log("onPointerMove Multi touch.");
			return cancelDefaultAction(e);
		}

		if(isRightMouseEvent(e.originalEvent)) {
			console.log("Right button.");
			return cancelDefaultAction(e);
		}

		var pointer = pointers[0];
		var point = getAbsPoint(pointer);
		if(manager.preprocessEvent(C_EVT_POINTER_MOVE, e, point)) {
			manager.onPointerMove(point);
		}

		return cancelDefaultAction(e);
	}

	function onPointerUp(e) {
		if(isMultiTouchEvent(e)) {
			console.log("onPointerUp Multi touch.");
			return cancelDefaultAction(e);
		}

		var point = getLastPointerPoint();
		if(isRightMouseEvent(e.originalEvent)) {
			console.log("Right mouse up");
			if(manager.preprocessEvent(C_EVT_CONTEXT_MENU, e, point)) {
				manager.onContextMenu(point);
			}
			return true;
		}
		else {
			if(manager.preprocessEvent(C_EVT_POINTER_UP, e, point)) {
				manager.onPointerUp(point);
			}
		}
		
		//console.log("onPointerUp.");
		return cancelDefaultAction(e);
	}

	canvas.addEventListener('pointerdown', onPointerDown, false);
	canvas.addEventListener('pointermove', onPointerMove, false);
	canvas.addEventListener('pointerup',   onPointerUp, false);
///////////////////////////////////////////////////////////////	
	function onGestureScale(e) {
		var scale = e.scale;
		var gesture = {scale:scale, rotation:0};
		
		gesture.isChange = false;
		gesture.isStart = e.scaleStart;
		gesture.isEnd = e.scaleEnd;

		if(gesture.isStart) {
			console.log("scaleStart");
		}
		
		if(gesture.isEnd) {
			console.log("scaleEnd");
		}

		manager.onGesture(gesture);
		console.log("onGestureScale:" + scale);

		return;
	}
	
	function onGestureLongPress(e) {
		var point = {};
		point.x = manager.lastPointerPoint.x;
		point.y = manager.lastPointerPoint.y;

		manager.onLongPress(point);

		//test
		//e.scale = 0.5;
		//onGestureScale(e);
		console.log("onGestureLongPress");
		return cancelDefaultAction(e);
	}
	
	function onGestureDoubleTap(e) {
		var point = getLastPointerPoint();

		manager.onDoubleClick(point);
		console.log("onGestureDoubleTap");
		return cancelDefaultAction(e);
	}

	if(app.type == C_APP_TYPE_WEBAPP || app.type == C_APP_TYPE_PREVIEW ) {
		document.oncontextmenu = function(e) {
			var point = {};
			point.x = e.x + getScrollLeft();
			point.y = e.y + getScrollTop();

			manager.onPointerDown(point);
			manager.onLongPress(point);
			manager.onPointerUp(point);

			console.log("onGestureLongPress");
			return cancelDefaultAction(e);
		}
	}

	canvas.addEventListener('gesturedoubletap', onGestureDoubleTap);
	canvas.addEventListener('gesturelongpress', onGestureLongPress);
	canvas.addEventListener('gesturescale', onGestureScale);
///////////////////////////////////////////////////////////////	
	var gViewPort = getViewPort();
	var gScreenHeight = screen.height;
	function handleScreenSizeChanged() {
		var vp = getViewPort();
	   if(gViewPort.width != vp.width || gViewPort.height != vp.height) {
			app.onSizeChanged();
			gViewPort = vp;
	   }
	}

	window.onresize = function(e) {
		setTimeout(handleScreenSizeChanged, 50);	
		return;
	}

	var gWindowOrientation = window.orientation;
	function handleOrientationChanged() {
	   if(gWindowOrientation !== window.orientation) {
			app.onSizeChanged();
			gWindowOrientation = window.orientation;
	   }
	}

	window.onorientationchange = function(e) {
		setTimeout(handleOrientationChanged, 50);	
		return;
	}
	
	document.ontouchend = function(e){
		return true;
	}

	return;
}

function cancelDefaultAction(e) {
	var evt = e ? e: window.event;
	if (evt.preventDefault) {
		evt.preventDefault();
	}
	else {
		evt.returnValue = false;
	}

	return false;
}

function filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

function getScrollLeft() {
	return filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}

function getScrollTop() {
	return filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}

function isRightMouseEvent(event) {
	var ret = false;
    if (event.which === null) {
       /* IE case */
       ret = (event.button > 2 && event.button !== 4);
	}
    else {
       /* All others */
       ret = (event.which > 2 && event.which !== 2);
	}

	return ret;
}

function setCancelDefaultAction(value) {
	gCancelDefaultAction = value;

	return;
}

function returnDefaultAction(e) {
	return (gCancelDefaultAction) ? cancelDefaultAction(e) : true;
}

function targetIsEditor(e) {
	var tag = e.srcElement ? e.srcElement : e.target; 
	var name = tag.localName ? tag.localName : tag.tagName;

	name = name.toLowerCase();
	if(name != "body" && name != "canvas") {
		return true;
	}
	
	return false;
}

function targetIsCanvas(e) {
	var tag = e.srcElement ? e.srcElement : e.target; 
	var name = tag.localName ? tag.localName : tag.tagName;

	name = name.toLowerCase();
	if(name === "canvas") {
		return true;
	}
	
	return false;
}




/*
 * File: struct.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: common used structs
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function Rect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	return this;
}

Rect.prototype.dup = function() {
	return new Rect(this.x, this.y, this.w, this.h);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    
    return this;
}

Point.prototype.dup = function() {
	return new Point(this.x, this.y);
}

Point.prototype.copy = function(point) {
	this.x = point.x;
	this.y = point.y;

	return;
}

function pointEqual(p1, p2) {
	return p1.x === p2.x && p1.y === p2.y;
}

function distanceBetween(p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;

	var d = Math.sqrt(dx * dx + dy * dy);

	return d;
}


/*
 * File: edit.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: wrap input/textarea
 * 
 * Copyright (c) 2011 - 2014	Li XianJing <xianjimli@hotmail.com>
 * 
 */

function EditorElement() {
	this.element = null;
}

EditorElement.prototype.setElement = function(element) {
	this.element = element;

	return;
}

EditorElement.prototype.removeBorder = function() {
	if(!isMobile()) {
		this.element.style.background = 'transparent';
		this.element.style.border ='0px solid';
		this.element.style.outline = 'none';
	}

	return;
}

EditorElement.prototype.setFontSize = function(fontSize) {
	this.element.style['font-size'] = fontSize + "pt";

	return;
}

EditorElement.prototype.show = function() {
	this.isVisibile = true;
	//this.element.style.display = 'none';
	this.element.style.visibility = 'visible';
	this.element.focus();

	return;
}

EditorElement.prototype.setInputType = function(type) {
	this.element.type = type;

	return;
}

EditorElement.prototype.hide = function() {
	this.isVisibile = false;
	//this.element.style.display = '';
	this.element.style.visibility = 'hidden';  
	this.element.blur();
	this.element.onchange = null;

	if(this.onHide) {
		this.onHide();
	}

	if(this.shape) {
		this.shape.editing = false;
	}

	return;
}

EditorElement.prototype.move = function(x, y) {
	this.element.style.position = "absolute";
	this.element.style.left = x + "px";
	this.element.style.top = y + "px";

	return;
}

EditorElement.prototype.setFontSize = function(fontSize) {
	this.element.style.fontSize = fontSize + "px";

	return;
}

EditorElement.prototype.resize = function(w, h) {
	this.element.style.width = w + "px";
	this.element.style.height = (h-6) + "px";

	return;
}

EditorElement.prototype.getText = function() {
	return this.element.value;
}

EditorElement.prototype.setText = function(text) {
	this.element.value = text;

	return;
}

EditorElement.prototype.setShape = function(shape) {
	if(this.shape) {
		this.hide();
	}

	this.shape = shape;
	
	if(this.shape) {
		this.shape.editing = true;
		this.show();
	}

	return;
}

function createElement(element, id, x, y, w, h) {
	var edit = new EditorElement();

	element.id = id;
	edit.setElement(element);
	edit.move(x, y);
	edit.resize(w, h);
	edit.setFontSize(14);
	edit.show();

	return edit;
}

var gCanTkInput = null;
function cantkShowInput(x, y, w, h) {
	var id = "cantk_input";

	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);

	if(!gCanTkInput) {
		gCanTkInput = createSingleLineEdit(id, x, y, w, h);
	}
	else {
		gCanTkInput.move(x, y);
		gCanTkInput.resize(w, h);
		gCanTkInput.show();
	}

	return gCanTkInput;
}

var gCanTkTextArea = null;
function cantkShowTextArea(x, y, w, h) {
	var id = "cantk_textarea";
	
	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);

	if(!gCanTkTextArea) {
		gCanTkTextArea = createMultiLineEdit(id, x, y, w, h);
	}
	else {
		gCanTkTextArea.move(x, y);
		gCanTkTextArea.resize(w, h);
		gCanTkTextArea.show();
	}

	return gCanTkTextArea;
}

function cantkMoveEditorWhenResize() {
	if(gCanTkInput && gCanTkInput.isVisibile && gCanTkInput.shape && gCanTkInput.shape.isUIElement) {
		var shape = gCanTkInput.shape;
		var rect = shape.getEditorRect();
		var x = rect.x;
		var y = rect.y;
		var w = rect.w;
		var h = rect.h;

		gCanTkInput.move(x, y);
		gCanTkInput.resize(w, h);

		console.log("Move Input To: (" + x + ", " + y + ")");
	}
	
	if(gCanTkTextArea && gCanTkTextArea.isVisibile && gCanTkTextArea.shape && gCanTkTextArea.shape.isUIElement) {
		var shape = gCanTkTextArea.shape;
		var rect = shape.getEditorRect();
		var x = rect.x;
		var y = rect.y;
		var w = rect.w;
		var h = rect.h;

		gCanTkTextArea.move(x, y);
		gCanTkTextArea.resize(w, h);
		
		console.log("Move TextArea To: (" + x + ", " + y + ")");
	}

	return;
}

function cantkIsEditorActive() {
	if(gCanTkInput && gCanTkInput.isVisibile) {
		return true;
	}

	if(gCanTkTextArea && gCanTkTextArea.isVisibile) {
		return true;
	}

	return false;
}

function cantkHideAllInput() {
	if(gCanTkInput && gCanTkInput.isVisibile) {
		if(gCanTkInput.element.onchange) {
			gCanTkInput.element.onchange();
		}
		gCanTkInput.hide();
	}

	if(gCanTkTextArea && gCanTkTextArea.isVisibile) {
		if(gCanTkTextArea.element.onchange) {
			gCanTkTextArea.element.onchange();
		}
		gCanTkTextArea.hide();
	}

	return;
}

function createSingleLineEdit(id, x, y, w, h) {
	var element = document.getElementById(id);

	if(!element) {
		element = document.createElement("input");
		document.body.appendChild(element);
	}

	return createElement(element, id, x, y, w, h);
}

function createMultiLineEdit(id, x, y, w, h) {
	var element = document.getElementById(id);

	if(!element) {
		element = document.createElement("textarea");
		document.body.appendChild(element);
	}

	return createElement(element, id, x, y, w, h);
}


/*
 * File: widget.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: widget is base class of all ui element.
 * 
 * Copyright (c) 2011 - 2014	Li XianJing <xianjimli@hotmail.com>
 * 
 */
 
var C_WIDGET_STATE_NORMAL		 = 0;
var C_WIDGET_STATE_ACTIVE		 = 1;
var C_WIDGET_STATE_OVER			 = 2;
var C_WIDGET_STATE_INSENSITIVE   = 3;
var C_WIDGET_STATE_NR			 = 4;
 
var C_WIDGET_TYPE_NONE = 0;
var C_WIDGET_TYPE_WINDOW = 1;
var C_WIDGET_TYPE_DIALOG = 2;
var C_WIDGET_TYPE_MENU_BAR = 3;
var C_WIDGET_TYPE_TOOL_BAR = 4;
var C_WIDGET_TYPE_MENU_ITEM = 5;
var C_WIDGET_TYPE_MENU_BUTTON = 6;
var C_WIDGET_TYPE_CONTEXT_MENU_BAR=7;
var C_WIDGET_TYPE_MENU = 8;
var C_WIDGET_TYPE_POPUP = 9;
var C_WIDGET_TYPE_HBOX = 10;
var C_WIDGET_TYPE_VBOX = 11;
var C_WIDGET_TYPE_GRID = 12;
var C_WIDGET_TYPE_USER = 13;
var C_WIDGET_TYPE_NR = 14;

var C_MENU_ITEM_HEIGHT = 40;

function Widget(parent, x, y, w, h) {
	this.id    = 0;
	this.text  = "";
	this.enable = 1;
	this.visible = false; 
	this.listener = 0;
	this.focusable = 1;
	this.insensitive = 0;
	this.parent = parent;
	this.rect = new Rect(x, y, w, h);
	this.state = C_WIDGET_STATE_NORMAL;
	this.point = new Point(0, 0);	
	this.children = new Array();
	this.theme = CanTkTheme.get(this.type);
	this.lastPointerPoint = new Point(0, 0);
	this.pointerDownPoint = new Point(0, 0);

	if(this.parent !== null) {
		parent.appendChild(this);
	}

	this.useTheme = function(type) {
		var theme = CanTkTheme.get(type, true);

		if(theme) {
			this.theme = theme;
		}
		else {
			console.log("not found: " + type);
		}

		return;
	}

	this.setNeedRelayout = function(value) {
		this.needRelayout = value;

		return;
	}

	this.onAppendChild = function(child) {
	}

	this.appendChild = function(child) {
		child.parent = this;
		this.children.push(child);
		this.onAppendChild(child);

		return;
	}
	
	this.getManager = function() {
		return this.getTopWindow().manager;
	}
	
	this.isPointerDown = function() {
		return this.getManager().isPointerDown();
	}
	
	this.isClicked = function() {
		return this.getManager().isClicked();
	}
	
	this.isAltDown = function() {
		return this.getManager().isAltDown();
	}

	this.isCtrlDown = function() {
		return this.getManager().isCtrlDown();
	}
	
	this.getApp = function() {
		return this.getManager().getApp();
	}
	
	this.getCanvas2D = function() {
		return this.getManager().getCanvas2D();
	}

	this.getLastPointerPoint = function() {
		return this.getManager().getLastPointerPoint();
	}

	this.getTopWindow = function() {
		 if(this.parent) {
			  return this.parent.getTopWindow();
		 }
		 
		 return this;
	}

	this.getX = function() {
		return this.rect.x;
	}
	
	this.getY = function() {
		return this.rect.y;
	}

	this.getWidth = function() {
		return this.rect.w;
	}
	
	this.getHeight = function() {
		return this.rect.h;
	}

	this.getAbsPosition =  function() {
		var x = this.rect.x;
		var y = this.rect.y;

		for(var parent = this.parent; parent; parent = parent.parent) {
			x = x + parent.rect.x;
			y = y + parent.rect.y;
		}
		
		return {x: x, y: y};
	}
	
	this.getRelatePoint =  function(point) {
		var p = this.getAbsPosition();

		return {x:point.x - p.x, y: point.y - p.y};
	}
	
	this.postRedrawAll = function() {
		this.getManager().postRedraw(null);

		return;
	}

	this.postRedraw =	 function(rect) {
		var p = this.getAbsPosition();
		
		if(!rect) {
			rect = {x:0, y:0, w:this.rect.w, h:this.rect.h};
		}

		rect.x = p.x + rect.x;
		rect.y = p.y + rect.y;
		
		this.getManager().postRedraw(rect);
		
		return;
	}
	
	this.redraw =	 function(rect) {
		var p = this.getAbsPosition();
		
		if(!rect) {
			rect = {x:0, y:0, w:this.rect.w, h:this.rect.h};
		}

		rect.x = p.x + rect.x;
		rect.y = p.y + rect.y;
		
		this.getManager().redraw(rect);
		
		return;
	}
	
	this.findTargetWidgetEx = function(point, recursive) {
		 if(!this.visible) {
		 	return null;
		 }

		 if(!isPointInRect(point, this.rect)) {
			  return null;
		 }
		 
		 if(recursive && this.children.length > 0) {
			  var n = this.children.length - 1;
			  var p = this.point;
			  p.x = point.x - this.rect.x;
			  p.y = point.y - this.rect.y;
			  
			  for(var i = n; i >= 0; i--) {
					var child = this.children[i];
					var ret = child.findTargetWidget(p);
					
					if(ret !== null) {
						 return ret;
					}
			  }
		 }
		 
		 return this;
	}
		
	this.findTargetWidget = function(point) {
		 return this.findTargetWidgetEx(point, true);
	}
	
	this.removeChild = function(child) {
		this.children.remove(child);
		child.parent = null;

		return;
	}
	
	this.setText = function(text) {
		 this.text = text;
		 
		 return;
	}
	
	this.setID = function(id) {
		 this.id = id;
		 
		 return;
	}
	
	this.setUserData = function(userData) {
		 this.userData = userData;
		 
		 return;
	}
	
	this.setEnable = function(value) {
		this.enable = value;
		
		if(!value) {
			this.state = C_WIDGET_STATE_INSENSITIVE;
		}
		else {
			if(this.state === C_WIDGET_STATE_INSENSITIVE) {
				this.state = C_WIDGET_STATE_NORMAL;
			}
		}
		
		return;
	}
	
	this.setState = function(state) {
		if(this.enable) {
			this.state = state;
		 }
		
		 return;
	}
	
	this.measure = function(canvas) {
		 return;
	}
	
	this.move = function(x, y) {
		 this.rect.x = x;
		 this.rect.y = y;
		 
		 return;
	}
	
	this.moveDelta = function(dx, dy) {
		 this.rect.x = this.rect.x + dx;
		 this.rect.y = this.rect.y + dy;
		 
		 return;
	}
	
	this.resize = function(w, h) {
		this.rect.w = w;
		this.rect.h = h;
		this.setNeedRelayout(true);

		return;
	}
	
	this.setListener = function(listener) {
		 this.listener = listener;
		 
		 return;
	}
		
	this.lookup = function(id) {
		if(this.id === id) {
			return this;
		}
		
		if(this.children.length === 0) {
			 return null;
		}
		
		for(var i = 0; i < this.children.length; i++) {
			 var child = this.children[i];
			
			var r = child.lookup(id);
			if(r !== null) {
				return r;
			}
		}
		
		return null;
	}
	
	this.relayout = function(canvas, force) {
		 return;
	}
	
	this.paintBackground = function(canvas) {
		 var image = this.theme[this.state].image;

		 if(image) {
		 	image.draw9Patch(canvas, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
		 }
		 else {
			if(this.theme[this.state].bg) {
				canvas.fillStyle = this.theme[this.state].bg;
				canvas.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
			}
		}
		
		return;
	}
	
	this.paintSelf = function(canvas) {
		 return;
	}
	
	this.beforePaint = function(canvas) {
		return;
	}
	
	this.afterPaint = function(canvas) {
		return;
	}

	this.draw = function(canvas) {
		var focusChild = null;
		 if(!this.visible) {
			  return;
		 }
	  
		canvas.lineWidth = 1;
		canvas.fillStyle = "White";
		canvas.strokeStyle = "Black";
		canvas.beginPath();
		this.beforePaint(canvas);
		this.relayout(canvas, 0);
		this.paintBackground(canvas);
		this.paintSelf(canvas);
		
		if(this.children.length === 0) {
			return;
		}
		
		canvas.save();
		canvas.translate(this.rect.x, this.rect.y);
		for(var i = 0; i < this.children.length; i++) {
			child = this.children[i];

			if(child.state === C_WIDGET_STATE_OVER) {
				focusChild = child;
			}
			else {
				child.draw(canvas);
			}
		}

		if(focusChild) {
			focusChild.draw(canvas);
		}

		canvas.restore();
		this.afterPaint(canvas);
		canvas.closePath();

		return;
	}

	this.isVisible = function() {
		return this.visible;
	}

	this.onShow = function(visible) {
		return true;
	}

	this.show = function(visible) {
		var visible = !!visible;
		if(visible != this.visible) {
			this.visible = visible;
			this.onShow(visible);
		}

		return;
	}
	
	this.showAll = function(visible) {
		this.show(visible);

		for(var i = 0; i < this.children.length; i++) {
			this.children[i].showAll(visible);
		}
		
		this.relayout(this.getCanvas2D(), false);
		
		if(!this.parent) {
			this.postRedraw();
		}
		
		return;
	}
	
	this.onDoubleClick = function(point) {
		return;
	}
	
	this.onLongPress = function(point) {
		return;
	}
	
	this.onGesture = function(gesture) {
		return;
	}
	
	this.onGesture = function(gesture) {
		return;
	}

	this.onPointerDown = function(point) {
		 this.getTopWindow().grab(this);

		 if(this.state !== C_WIDGET_STATE_INSENSITIVE) {
		 	this.state = C_WIDGET_STATE_ACTIVE;
		 	this.postRedraw();
		 }

		return;
	}

	this.onPointerMove = function(point) {
		this.lastPointerPoint.x = point.x;
		this.lastPointerPoint.y = point.y;
		return;
	}

	this.onPointerUp = function(point) {
		if(this.state !== C_WIDGET_STATE_INSENSITIVE) {
			this.state = C_WIDGET_STATE_NORMAL;
		}
		this.getTopWindow().ungrab();
		if(this.listener && this.state !== C_WIDGET_STATE_INSENSITIVE) {
			this.listener(this);
		}
		this.postRedraw();

		return;
	}
	
	this.onContextMenu = function(point) {
		return;
	}
	
	this.onKeyDown = function(code) {
		console.log("onKeyUp Widget:" + this.id + " code=" + code)
		return;
	}

	this.onKeyUp = function(code) {
		console.log("onKeyUp Widget:" + this.id + " code=" + code)
		return;
	}	

	return this;
}


/*
 * File: theme.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: cantk theme.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function CanTkImage(src, onLoad) {
	this.url = src;
	this.image = CanTkImage.createImage(src, onLoad);

	this.setImageSrc = function(src) {
		this.image = CanTkImage.createImage(src, onLoad);

		return;
	}

	this.getImageSrc = function() {
		return this.image.src;
	}

	this.getImage = function() {
		var image = this.image;
		return (image && image.width > 0) ? image : null;
	}
	
	return;
}

CanTkImage.resRoot = null;
CanTkImage.setResRoot = function(resRoot) {
	CanTkImage.resRoot = resRoot;

	return;
}

CanTkImage.toAbsURL = function(url) {
	var absURL = url;

	if(!url) {
		return url;
	}

	if(CanTkImage.resRoot && url.indexOf("://") < 0) {
		absURL = CanTkImage.resRoot + url;

		return absURL;
	}

	if(url.indexOf("://") < 0) {
		if(url[0] === '/') {
			absURL = location.protocol + "//" + location.host + url;
		}
		else {
			var href = location.href;
			absURL = href.substr(0, href.lastIndexOf("/")) + "/" + url;
		}
	}

	return absURL;
}

CanTkImage.onload = function() {
}

function setRefreshAfterImageLoaded(redrawUI) {
	if(redrawUI) {
		CanTkImage.onload = redrawUI;
	}

	return;
}

CanTkImage.images = [];
CanTkImage.nullImage = new Image();
CanTkImage.loadingImages = 0;

CanTkImage.getLoadProgress = function() {
	var percent = 100;

	var n = CanTkImage.images.length;
	if(n) {
		percent = 100 * (n - CanTkImage.loadingImages)/n;
	}

	return percent;
}

CanTkImage.createImage = function (src, onLoad) {
	var images = CanTkImage.images;

	if(!src) {
		return CanTkImage.nullImage;
	}
	
	src = CanTkImage.toAbsURL(src);

	if(images) {
		for(var i = 0; i < images.length; i++) {
			var iter = images[i];

			if(iter.src && iter.src.indexOf(src) >= 0) {
				if(onLoad) {
					onLoad(iter);
				}
				//console.log("find image: " + src);

				return iter;
			}
		}
	}

	var image = new Image();

	CanTkImage.images.push(image);
	CanTkImage.loadingImages++;

	image.onload = function (e) {
		CanTkImage.onload();

		if(onLoad) {
			onLoad(image);
		}
	
		CanTkImage.loadingImages--;
	//	console.log("load " + src + " success:");
	};

	image.onerror = function (e) {
		CanTkImage.loadingImages--;
		console.log("load " + src + " failed:" + e.message);
	};

	image.onabort = function (e) {
		CanTkImage.loadingImages--;
		console.log("load " + src + " failed(abort):" + e.message);
	};

	image.src = src;

	return image;
}

//////////////////////////////////////////////////////////////////

var CanTkBg40Image = {
	MENU_GRID_BG : 5,
	TOOLBAR_BG : 6,
	MENU_BG : 7,
	CONTEXT_MENU_BG : 8,
	MESSAGE_BOX_BG : 9,
	TOOLBAR_BOX_BG : 10
};

var CanTkBgImage = {
	MENU_BAR_BG : 0,
	MENU_BAR_ITEM_ACTIVE_BG : 1,
	MENU_BAR_ITEM_OVER_BG : 2,
	MENU_ITEM_H_SEPERATOR : 3,
	MENU_ITEM_NORMAL_BG : 4,
	MENU_ITEM_ACTIVE_BG : 5,
	MENU_ITEM_OVER_BG : 6,
	MENU_GRID_ITEM_NORMAL_BG : 7,
	MENU_GRID_ITEM_ACTIVE_BG : 8,
	MENU_GRID_ITEM_OVER_BG : 9
};

var gCanTkBgIcon = null;
function cantkGetBgIconInfo() {
	if(!gCanTkBgIcon) {
		gCanTkBgIcon = new IconInfo(cantkGetImageURL("cantk.png"), 1, 30, 20, 50);
	}

	return gCanTkBgIcon;
}

var gCanTkBgIcon40 = null;
function cantkGetBgIcon40Info() {
	if(!gCanTkBgIcon40) {
		gCanTkBgIcon40 = new IconInfo(cantkGetImageURL("cantk.png"), 1, 15, 40, 50);
	}

	return gCanTkBgIcon40;
}

//////////////////////////////////////////////////////////////////

function Gc(font, bg, fg, image) {
   this.bg = bg;
   this.fg = fg;
   this.font = font;	
   this.image = image;

   this.dup = function() {
     var nGc = new Gc(this.font, this.bg, this.fg, this.image);

     return nGc;
   }

   return;
}

function themeCreate() {
	var theme = new Array();

	theme.push(new Gc("13pt bold sans-serif ", "#FFFFFF", "#000000", null));
	theme.push(new Gc("13pt bold sans-serif ", "#FFFFFF", "#000000", null));
	theme.push(new Gc("13pt bold sans-serif ", "#FFFFFF", "#000000", null));
	theme.push(new Gc("13pt bold sans-serif ", "#FFFFFF", "Gray", null));

	return theme;
}

function CanTkTheme() {
}

CanTkTheme.themes = {};
CanTkTheme.defaultTheme = themeCreate();

CanTkTheme.get = function(name, noDefault) {
	name = name.toString();

	var theme = CanTkTheme.themes[name];

	if(!theme && !noDefault) {
		theme = CanTkTheme.defaultTheme;
	}

	return theme;
}

CanTkTheme.set = function(name, state, font, textColor, bgColor, bgImage) {
	name = name.toString();

	var theme = CanTkTheme.themes[name];

	if(!theme) {
		theme = themeCreate();
		CanTkTheme.themes[name] = theme;
	}

	if(font) {
		theme[state].font = font;
	}
	
	if(textColor) {
		theme[state].fg = textColor;
	}

	if(bgColor) {
		theme[state].bg = bgColor;
	}

	if(bgImage) {
		theme[state].image = bgImage;
	}

	return;
}

//////////////////////////////////////////////////////////////////

function dappGetWidgetStyle(type) {
	return CanTkTheme.get(type);
}

function dappSetWidgetStyle(type, state, font, textColor) {
	return CanTkTheme.set(type, state, font, textColor);
}

dappSetWidgetStyle("menubar.item", C_WIDGET_STATE_NORMAL, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.item", C_WIDGET_STATE_ACTIVE, "13pt sans-serif", "Black");
dappSetWidgetStyle("menubar.item", C_WIDGET_STATE_OVER, "13pt sans-serif", "Black");
dappSetWidgetStyle("menubar.item", C_WIDGET_STATE_INSENSITIVE, "14pt sans-serif", "Gray");

dappSetWidgetStyle("menubar.button", C_WIDGET_STATE_NORMAL, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", C_WIDGET_STATE_ACTIVE, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", C_WIDGET_STATE_OVER, "10pt bold sans-serif", "Black");
dappSetWidgetStyle("menubar.button", C_WIDGET_STATE_INSENSITIVE, "10pt bold sans-serif", "Gray");

dappSetWidgetStyle("menu.item", C_WIDGET_STATE_NORMAL, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", C_WIDGET_STATE_ACTIVE, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", C_WIDGET_STATE_OVER, "13pt bold sans-serif", "Black");
dappSetWidgetStyle("menu.item", C_WIDGET_STATE_INSENSITIVE, "12pt bold sans-serif", "Gray");

dappSetWidgetStyle("grid.item", C_WIDGET_STATE_NORMAL, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", C_WIDGET_STATE_ACTIVE, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", C_WIDGET_STATE_OVER, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("grid.item", C_WIDGET_STATE_INSENSITIVE, "14pt bold sans-serif", "Gray");

dappSetWidgetStyle("contextmenu.item", C_WIDGET_STATE_NORMAL, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", C_WIDGET_STATE_ACTIVE, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", C_WIDGET_STATE_OVER, "14pt bold sans-serif", "Black");
dappSetWidgetStyle("contextmenu.item", C_WIDGET_STATE_INSENSITIVE, "14pt bold sans-serif", "Gray");

dappSetWidgetStyle("toolbar.button.fill", C_WIDGET_STATE_NORMAL, null, "#C0C0C0");
dappSetWidgetStyle("toolbar.button.fill", C_WIDGET_STATE_ACTIVE, null, "#E0E0E0");
dappSetWidgetStyle("toolbar.button.fill", C_WIDGET_STATE_INSENSITIVE, null, "#D0D0D0");
dappSetWidgetStyle("toolbar.button.border", C_WIDGET_STATE_NORMAL, null, "Gray");
dappSetWidgetStyle("toolbar.button.border", C_WIDGET_STATE_ACTIVE, null, "Gray");
dappSetWidgetStyle("toolbar.button.border", C_WIDGET_STATE_INSENSITIVE, null, "#D0D0D0");

dappSetWidgetStyle("messagebox", C_WIDGET_STATE_NORMAL, "14pt bold sans-serif", "#303030");


/*
 * File: window.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window
 * 
 * Copyright (c) 2011 - 2014	Li XianJing <xianjimli@hotmail.com>
 * 
 */
 
function Window(manager, x, y, w, h) {
	var args = [null, x, y, w, h];
	this.type  = C_WIDGET_TYPE_WINDOW;

	Widget.apply(this, args);
	
	this.center = false;
	this.grabWidget = null;
	this.focusWidget = null;
	this.manager = manager;
	
	this.setManager = function(manager) {
		this.manager = manager;
		
		return;
	}
	
	this.grab = function(widget) {
		 this.grabWidget = widget;
	}
	
	this.ungrab = function() {
		 this.grabWidget = 0;
	}
	
	this.setCenter = function(center) {
		this.center = center;
		
		return;
	}
	
	this.moveToCenter = function() {
		var view = getViewPort();
		var sw = Math.min(this.manager.w, view.width);
		var sh = Math.min(this.manager.h, view.height);
		
		var x = (sw - this.rect.w)/2;
		var y = (sh - this.rect.h)/2 + getScrollTop();

		this.rect.x = x;
		this.rect.y = y;
		
		return;
	}
	
	this.onDoubleClick = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onDoubleClick(point);
			  
			  this.focusWidget = target;
		 }
 
		return;
	}
	
	this.onLongPress = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onLongPress(point);
		 }
 
		return;
	}
	
	this.onGesture = function(gesture) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onGesture(gesture);
		 }
 
		return;
	}
	
	this.onPointerDown = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onPointerDown(point);
			  
			  this.focusWidget = target;
		 }
 
		return;
	}

	this.onPointerMove = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
		 	if(this.lastTarget && target != this.lastTarget) {
				this.lastTarget.onPointerMove(point);
		 	}

			target.onPointerMove(point);

			this.lastTarget = target;
		 }


		return;
	}

	this.onPointerUp = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onPointerUp(point);
		 }
		 
		return;
	}
	
	this.onContextMenu = function(point) {
		 var target = this;

		 if(this.grabWidget) {
			  target = this.grabWidget;
		 }
		 else {
			  target = this.findTargetWidget(point);
		 }
		 
		 if(target && target !== this) {
			  target.onContextMenu(point);
		 }
		 
		return;
	}
	
	this.onKeyDown = function(code) {
		if(this.grabWidget) {
			 this.grabWidget.onKeyDown(code);
		}
		else if(this.focusWidget) {
			 this.focusWidget.onKeyDown(code);
		}
		else if(this.children.length > 0) {
			this.focusWidget = this.children[this.children.length-1];
			this.focusWidget.onKeyDown(code);
		}
		
		return;
	}

	this.onKeyUp = function(code) {
		if(this.grabWidget) {
			 this.grabWidget.onKeyUp(code);
		}
		
		if(this.focusWidget !== 0) {
			 this.focusWidget.onKeyUp(code);
		}		
		return;
	}
	
	this.manager.addWindow(this);
}

/*
 * File: app_base.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: the base application.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var C_APP_TYPE_WEBAPP = 1;
var C_APP_TYPE_PREVIEW = 2;
var C_APP_TYPE_PC_VIEWER = 3;
var C_APP_TYPE_PC_EDITOR = 4;
var C_APP_TYPE_MOBILE_EDITOR = 5;
var C_APP_TYPE_INLINE_EDITOR = 6;

function AppBase(canvasID, type) {
	this.win  = null;
	this.view = null;
	this.type = type;
	this.minHeight = 0;

	this.getView = function() {
		return this.view;
	}

	this.setMinHeight = function(minHeight) {
		this.minHeight = minHeight;

		return;
	}

	this.exec = function(cmd) {
		cmd.doit();
		delete cmd;

		return;
	}

	this.init = function() {
		if(this.type === C_APP_TYPE_INLINE_EDITOR) {
			this.isInlineEdit = true;
		}
		else {
			this.isInlineEdit = false;
		}

		this.canvas	 = canvasCreate(canvasID);
		this.adjustCanvasSize();
		this.manager = new WindowManager(this, this.canvas);
		canvasAttachManager(this.canvas, this.manager, this);
		
		return;
	}

	this.onShapeSelected = function(shape) {

		return;
	}

	this.onSizeChanged = function() {
		return;
	}

	this.adjustCanvasSize = function() {
		var w = 0;
		var h = 0;
		var canvas = this.canvas;
		var view = getViewPort();
	
		
		switch(this.type) {
			case C_APP_TYPE_WEBAPP: 
			case C_APP_TYPE_INLINE_EDITOR: 
			case C_APP_TYPE_MOBILE_EDITOR: {
				w = view.width;
				h = view.height;
				break;
			}
			case C_APP_TYPE_PREVIEW: {
				w = view.width;
				h = view.height;
				this.setMinHeight(1500);
				break;
			}
			default: {
				w  = view.width - 20;
				h = view.height * 1.5;
				break;
			}
		}

		h = Math.max(h, this.minHeight);

		this.resizeCanvasTo(w, h);

		return;
	}
	
	this.resizeCanvasTo = function(w, h) {
		var canvas = this.canvas;

		canvas.width  = w;
		canvas.height = h;
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.position = "absolute";

		return;
	}

	this.loadData = function(data)  {
		return this.view.loadFromJson(data);
	}

	this.exitApp = function() {
		console.log("exitApp");

		return;
	}

	this.init();

	return this;
}


/*
 * File: drawing_view.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: the base class of the drawing view.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var gGridImage = null;


var gBeforeLoadCallBacks = [];
var gAfterLoadCallBacks = [];

function registerViewBeforeLoadListener(func) {
	if(func) {
		gBeforeLoadCallBacks.push(func);
	}

	return;
}

function registerViewAfterLoadListener(func) {
	if(func) {
		gAfterLoadCallBacks.push(func);
	}

	return;
}

function notifyViewBeforeLoad(view, js) {
	for(var i = 0; i < gBeforeLoadCallBacks.length; i++) {
		gBeforeLoadCallBacks[i](view, js);
	}

	return;
}

function notifyViewAfterLoad(view, js) {
	for(var i = 0; i < gAfterLoadCallBacks.length; i++) {
		gAfterLoadCallBacks[i](this, js);
	}

	return;
}

function ViewBase(parent, x, y, w, h) {
	this.type = C_WIDGET_TYPE_USER;
	Widget.apply(this, arguments);
	
	this.grid = 10;
	this.showGrid = true;
	this.snapGrid = false;
	this.fillColor = "white";
	this.autoResize = false;	
	this.allShapes = new Array();
	this.theme = new Array();
	this.xscale	= 1.0;
	this.yscale = 1.0;
	
	this.pointerDownPosition = new Point(0, 0);
	this.lastPointerPosition = new Point(0, 0);

	this.theme.push(new Gc("18px sans-serif", "#FFFFFF", "#000000", null));
	this.theme.push(new Gc("18px sans-serif", "#FFFFFF", "#000000", null));
	this.theme.push(new Gc("18px sans-serif", "#FFFFFF", "#000000", null));
	this.theme.push(new Gc("18px sans-serif", "#FFFFFF", "#D0D0D0", null));
       
    this.getScale = function() {
    	return this.xscale;
    }
    
    this.getViewScale = function() {
    	return this.getScale();
    }

	this.onShapeSelected = function(shape) {
		this.getApp().onShapeSelected(shape);

		return;
	}

	this.setFillColor = function(bg) {
		this.fillColor = bg;
		for(var i = 0; i < this.theme.length; i++) {
			this.theme[i].bg = bg;
		}
		
		return;
	}
	
	this.setGrid = function(showGrid, snapGrid) {
		this.showGrid = showGrid;
		this.snapGrid = snapGrid;
		
		return;
	}
	
	this.setShowGrid = function(showGrid) {
		this.showGrid = showGrid;
		
		return;
	}
	
	this.setSnapGrid = function(snapGrid) {
		this.snapGrid = snapGrid;
		
		return;
	}


	this.snapToGrid = function(x, y) {
		var xx = x;
		var yy = y;

		if(this.snapGrid) {
			xx = Math.floor((x + this.grid/2) / this.grid) * this.grid;
			yy = Math.floor((y + this.grid/2) / this.grid) * this.grid;
		}

		return {x: xx, y: yy};
	}

	this.setAutoResize = function() {
		this.autoResize = true;

		return;
	}

	this.initPage = function(index, shapes) {
		var page = new Object();

		page.index = index ? index : 0;
		page.shapes = shapes ? shapes : (new Array());

		return page;
	}

	this.getPages = function() {
		return this.pages;
	}

	this.newPage = function() {
		var n = this.getPageNr();
		var newIndex = this.currentPage + 1;
		var page = this.initPage(newIndex, null);
		
		this.pages.push(page);
	
		this.saveCurrentPage();
		if(n > 1) {
			for(var i = n; i > newIndex; i--) {
				this.pages[i] = this.pages[i-1];
			}
			this.pages[newIndex] = page;
		}
	
		this.currentPage = newIndex;
		this.showCurrentPage();

		this.getApp().updateContextMenu();

		return;
	}
	
	this.removeCurrentPage = function() {
		var n = this.getPageNr();

		if(n > 1) {
			this.removePage(this.currentPage);
		}
		else {
			this.allShapes.clear();
		}

		this.getApp().updateContextMenu();
		return;
	}

	this.removePage = function(index) {
		var n = this.getPageNr();
		
		if(index < 0 || index >= n) {
			index = this.currentPage;
		}

		var page = this.pages[index];
		if(this.pages.length > 1) {
			this.pages.remove(page);
		}

		if(index <= this.currentPage && this.currentPage >= 0) {
			this.currentPage--;
		}

		this.showCurrentPage();
		this.getApp().updateContextMenu();

		return;
	}

	this.saveCurrentPage = function() {
		var shapes = new Array();

		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			shapes.push(shape.toJson());
		}

		this.pages[this.currentPage] = this.initPage(this.currentPage, shapes);

		return;
	}

	this.setMetaInfo = function(meta) {
		this.meta = meta;

		return;
	}

	this.getMetaInfo = function() {
		return this.meta;
	}

	this.saveAsJson = function() {
		var o = new Object();
		var page = null;
		var types = ShapeFactoryGet().getDiagramTypes();

		this.saveCurrentPage();

		o.w = this.rect.w;
		o.h = this.rect.h;
		o.fillColor = this.fillColor;
		o.version = 1.0;
		o.magic = "5idraw";
		o.scale = this.xscale;
		o.type = this.type ? this.type : types[0].name;
		o.meta = this.meta;
		o.pages = this.pages;

		var js = JSON.stringify(o, null, "\t");
	
		return js;
	}
	
	this.parseJson = function(json_str) {
		var js = null;
		var shape = null;
		
		try {
			if(json_str) {
				js = JSON.parse(json_str);
				this.reset();
			}
		}
		catch(e) {
			ret = false;
			console.log("JSON.parse failed:" + e.message);
			console.log("JSON.parse failed:" + json_str);
		}

		if(!js) return null;

		if(!js.magic || js.magic !== "5idraw") {
			console.log("Not supported type");

			return null;
		}

		return js;
	}
	
	this.beforeLoad = function(js) {
		notifyViewBeforeLoad(this, js);

		return;
	}

	this.afterLoad = function(js) {
		notifyViewAfterLoad(this, js);

		var view = this;
		setRefreshAfterImageLoaded(function() {
			view.postRedraw();
		});
		return;
	}

	this.loadJson = function(js) {
		var shape = null;

		if(!js || !js.pages) {
			this.pages = new Array();
			this.pages.push(this.initPage(0, null));
			this.currentPage = 0;
			this.showCurrentPage();

			return;
		}

		this.beforeLoad(js);
		if(this.autoResize) {
			this.xscale	= this.rect.w / js.w;
			this.yscale = this.rect.h / js.h;
			this.xscale	= this.xscale < this.yscale ? this.xscale: this.yscale;
			this.yscale	= this.xscale;
		}
		else {
			this.xscale	= 1;
			this.yscale = 1;
		}
		
		this.meta = js.meta;
		this.pages = js.pages;
		this.currentPage = 0;
		this.fillColor = js.fillColor;
		this.loading = true;
		this.showCurrentPage();
		
		if(js.scale) {
			this.xscale = js.scale;
			this.yscale = js.scale;
		}

		this.afterLoad(js);
		this.loading = false;

		return;
	}

	this.loadFromJson = function(json_str) {
		var js = this.parseJson(json_str);

		var view = this;
		if(js && js.type === "EDA") {
			setTimeout(function() {
				view.loadJson(js);
			}, 1500);
		}
		else {
			this.loadJson(js);
			setTimeout(function() {
				view.postRedraw();
			}, 500);
		}

		return;
	}

	this.onPageShow = function() {
	}

	this.showCurrentPage = function() {
		var shape = null;
		var shapes = this.pages[this.currentPage].shapes;
		
		if(!shapes) {
			shapes = this.pages[this.currentPage].glyphs;
		}
		this.allShapes.clear();

		if(shapes) {
			var maxhOfShape = 0;
			for(var i = 0; i < shapes.length; i++) {
				var jsShape = shapes[i];
				var type = jsShape.type ? jsShape.type : jsShape.id;
				shape = ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);
				if(shape) {
					shape.fromJson(jsShape);
					this.addShape(shape);
					if(shape.h > maxhOfShape) {
						maxhOfShape = shape.h;
					}
				}
				else {
					console.log("createShape " + jsShape.type + " fail.");
				}
			}
		}

		this.onPageShow();
		this.postRedraw();

		return;
	}

	this.autoScale = function() {
		var maxShape = null;

		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			if(!maxShape) {
				maxShape = shape;
			}
			else if((shape.h + shape.w) > (maxShape.h + maxShape.w)) {
				maxShape = shape;
			}
		}

		if(maxShape) {
			var xscale = maxShape.w / this.rect.w;
			var yscale = maxShape.h / this.rect.h;
			if(xscale > 0.8 || yscale > 1.4) {
				if(xscale > 1.2 || yscale > 2) {
					this.zoomTo(0.5);
				}
				else {
					this.zoomTo(0.7);
				}
			}
			else {
				this.zoomTo(1.0);
			}
		}

		return;
	}

	this.getPageNr = function() {
		
		return this.pages ? this.pages.length : 0;
	}
	
	this.gotoPrevPage = function() {
		var total = this.pages.length;
		var n = this.currentPage - 1;

		if(n < 0) {
			n = n + total;
		}

		this.gotoPage(n);

		return;
	}
	
	this.getPagesNr = function() {
		return this.pages.length;
	}

	this.gotoNextPage = function() {
		var total = this.pages.length;
		var n = this.currentPage + 1;

		if(n >= total) {
			n = n - total;
		}

		this.gotoPage(n);

		return;
	}

	this.gotoPage = function(n) {
		if(n < 0 || n >= this.getPageNr()) {
			return;
		}
		
		if(n === this.currentPage) {
			return;
		}

		this.saveCurrentPage();
		this.currentPage = n;
		this.showCurrentPage();

		return;
	}
	
	this.reset = function() {
		this.allShapes.clear();
		this.postRedraw();
		this.pages = new Array();
		this.pages.push(this.initPage(0, null));
		this.meta = null;
		this.currentPage = 0;

		return;
	}

	this.translatePoint = function(p) {
		var point = {x:(p.x-this.rect.x), y:(p.y-this.rect.y)};

		point.x = Math.round(point.x/this.xscale);
		point.y = Math.round(point.y/this.yscale);

		return point; 
	}

	this.canZoomIn = function() {
		return this.xscale < 2 && this.yscale < 2;
	}

	this.canZoomOut = function() {
		return this.xscale > 0.5 && this.yscale > 0.5;
	}

	this.onZoomed = function() {
		return;
	}

	this.zoomTo = function(scale) {
		var maxShape = null;
		
		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			if(!maxShape) {
				maxShape = shape;
			}
			else if((shape.h + shape.w) > (maxShape.h + maxShape.w)) {
				maxShape = shape;
			}
		}
	
		if(!this.loading && maxShape && maxShape.isUIDevice) {
			var delta = this.xscale - scale;
			maxShape.x = Math.floor(maxShape.x + maxShape.x * delta);
			maxShape.y = Math.floor(maxShape.y + maxShape.y * delta);
		}

		this.xscale = scale;
		this.yscale = scale;
		this.onZoomed();
		this.postRedraw();

		return;
	}

	this.zoomIn = function() {
		if(this.canZoomIn()) {
			this.zoomTo(this.xscale * 1.25);
		}

		return;
	}
	
	this.zoomOut = function() {
		if(this.canZoomOut()) {
			this.zoomTo(this.xscale * 0.75);
		}
		
		return;
	}
	
	this.getCreatingShape = function() {
		return this.creatingShape;
	}

	this.addShape = function(shape) {
		this.allShapes.push(shape);
		shape.setView(this);
		shape.setApp(this.getApp());

		if(this.creatingShape) {
			this.removeShape(this.creatingShape);
			this.creatingShape = null;
		}

		if(shape.state !== C_STAT_NORMAL) {
			this.creatingShape = shape;
		}

		if(shape.mode != C_MODE_RUNNING && shape.isUIDevice) {
			this.autoScale();
		}

		return;
	}
	
	this.removeShape = function(shape) {
		this.allShapes.remove(shape);
		shape.setView(null);
		shape.onRemoved();

		return;
	}

	this.getSelectedShapes = function(recursive) {
		var selectedShapes = [];

		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			
			if(shape.selected) {
				selectedShapes.push(shape);
				continue;
			}

			if(recursive && shape.isContainer) {
				shape.findSelectedShapes(selectedShapes);
			}
		}

		return selectedShapes;
	}

	this.countShape = function(selected_only) {	
		if(!this.allShapes) {
			return 0;
		}

		var count = this.allShapes.length;

		if(selected_only) {
			var selectedShapes = this.getSelectedShapes(true);
			count = selectedShapes.length;
		}
		
		return count;
	}
	
	this.getSelectedShape = function() {	
		var selectedShapes = this.getSelectedShapes(true);

		if(selectedShapes.length) {
			return selectedShapes[0];
		}

		return null;
	}

	this.selectAll = function(selected) {
		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			
			shape.setSelected(selected);
		}	
		
		this.postRedraw();
		
		return;
	}
	
	this.beforePaint = function(canvas) {
		return;
	}
	
	this.afterPaint = function(canvas) {
		return;
	}

	this.drawSelf = function(rect) {
		this.postRedraw();

		return;
	}

	this.paintBackground = function(canvas) {
		this.canvas = canvas;

		if(!this.showGrid) {
			canvas.fillStyle = "White";
			canvas.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
			canvas.beginPath();
		}

		return;
	}

	this.drawGrid = function(canvas) {
		if(this.showGrid && this.grid) {
			var i = 0;
			var j = 0;
			var x = 0;
			var y = 0;
			var t = 0;
			var n = 0;
			var w = this.rect.w;
			var h = this.rect.h;
			var ox = this.rect.x;
			var oy = this.rect.y;
			var grid = this.grid;
			var s = grid - 1;
			var r = h / grid;
			var c = w / grid;
			var gridPerBigGrid = 5;
			var gridImage = gGridImage.getImage();

			if(gridImage) {
				var iw = gridImage.width;
				var ih = gridImage.height;
				var sw = 0;
				var sh = 0;
				preDrawGrids = iw / this.grid;

				var cn = c / preDrawGrids;
				var rn = r / preDrawGrids;
				for(i = 0; i < cn; i++) {
					x = i * preDrawGrids * grid;
					sw = Math.min(iw, ox + w - x);
					for(j = 0; j < rn; j++) {
						y = j * preDrawGrids * grid;

						sh = Math.min(ih, oy + h - y);
						canvas.drawImage(gridImage, x, y);
					}
				}
			}
		}
		return;
	}

	this.getLogoImage = function() {
		if(!this.logoImage) {
			this.logoImage = new Image();
			this.logoImage.src = dappGetLogoURL();
		}
			
		return this.logoImage;
	}

	this.shouldShowLogo = function() {
		return false;
	}

	this.drawLogo = function(canvas) {
		if(this.shouldShowLogo()) {
			var vp = getViewPort();
			var w = Math.min(this.rect.w, vp.width);
			var h = Math.min(this.rect.h, vp.height);

			var image = this.getLogoImage();
			if(image && image.width) {
				var iw = image.width;
				var ih = image.height;
				var x = w - iw - 60;
				var y = h - ih - 60 + getScrollTop();
				canvas.drawImage(image, x, y);
			}
		}

		return;
	}

	this.showPageIndicator = function(canvas) {
		var x = 0;
		var y = 0;
		var w = this.rect.w;
		var h = this.rect.h;
		var page = dappGetText("Page") + " " + (this.currentPage  + 1) + "/" + this.getPageNr();
		canvas.beginPath()
		canvas.textAlign = "right";
		canvas.textBaseline = "top";
		canvas.font = "18pt sans";
		canvas.fillStyle = "Gray";	
		x = this.parent.rect.w - 10;
		y = 30;
		canvas.fillText(page, x, y);

		return;
	}

	this.paintSelf = function(canvas) {
		var w = this.rect.w;
		var h = this.rect.h;
		var selectedShape = null;
		var p = this.getAbsPosition();

		canvas.save();		
		canvas.beginPath();
		canvas.rect(p.x, p.y, w, h);
		canvas.clip();

		canvas.beginPath();		
		
		canvas.save();
		this.beforePaint(canvas);
		canvas.translate(this.rect.x, this.rect.y);
		
		canvas.shadowBlur = 0;
		this.drawGrid(canvas);
		this.drawLogo(canvas);

		canvas.scale(this.xscale, this.yscale);
		for(var i = 0; i < this.allShapes.length; i++) {
			var shape = this.allShapes[i];
			if(shape.selected && !selectedShape && shape.isLine) {
				selectedShape = shape;
			}
			else {
				shape.paint(canvas);
			}
		}
		if(selectedShape) {
			selectedShape.paint(canvas);
		}
		this.afterPaint(canvas);
		canvas.restore();

		canvas.restore();
		
		var fontSize = h/30;
		if(fontSize > 10) {
			fontSize = 10;
		}

		if(this.getPageNr() > 1) {
			this.showPageIndicator(canvas);
		}

		return;
	}

	this.selectShapeByPoint = function(point, recursive) {
		for(var i = this.allShapes.length - 1; i >= 0; i--) {
			var shape = this.allShapes[i];
			if(shape.hitTest(point)) {

				if(shape.isContainer) {
					shape = shape.findShapeByPoint(point, recursive);
				}
				
				this.postRedraw();
				this.targetShape = null;

				if(shape.parentShape) {
					shape.parentShape.selected = false;
				}
				if(!shape.selected) {
					shape.setSelected(false);
				}
				shape.setSelected(!shape.selected);
				
				return shape;
			}
		}

		return null;
	}

	this.getMoveDeltaX = function() {
		return this.moveDeltaX;
	}

	this.getMoveDeltaY = function() {
		return this.moveDeltaY;
	}
	
	this.getMoveAbsDeltaX = function() {
		return this.moveAbsDeltaX;
	}

	this.getMoveAbsDeltaY = function() {
		return this.moveAbsDeltaY;
	}

	this.updateLastPointerPoint = function(point) {
		
		this.moveDeltaX = point.x - this.lastPointerPosition.x;
		this.moveDeltaY = point.y - this.lastPointerPosition.y;
		this.moveAbsDeltaX = point.x - this.pointerDownPosition.x;
		this.moveAbsDeltaY = point.y - this.pointerDownPosition.y;
		this.lastPointerPosition.x = point.x;
		this.lastPointerPosition.y = point.y;
		
		return;
	}
	
	this.onDoubleClick = function(p) {
		var point = this.translatePoint(p);
		var shape = this.targetShape;

		if(shape) {
			shape.onDoubleClick(point);
		}

		return;
	}
	
	this.onLongPress = function(p) {
		var point = this.translatePoint(p);
		var shape = this.targetShape;

		if(shape) {
			shape.onLongPress(point);
		}

		return;
	}
	
	this.onGesture = function(gesture) {
		var shape = this.targetShape;

		if(shape) {
			shape.onGesture(gesture);
		}

		return;
	}


	return;
}


/*
 * File: window_manager.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: window manager
 * 
 * Copyright (c) 2011 - 2014	Li XianJing <xianjimli@hotmail.com>
 * 
 */
  
function WindowManager(app, canvas) {
	this.app = app;
	this.canvas = canvas;
	
	this.w = canvas.width;
	this.h = canvas.height;
	
	this.last_point = 0;
	this.pointerDown = 0;
	this.target = null;
	this.windows = new Array();
	this.grabWindows = new Array();
	this.dirtyRegion = new Array();
	this.eventLogging = false;
	this.pointerDownPoint = {x:0, y:0};
	this.lastPointerPoint = {x:0, y:0};

	return;
}

WindowManager.prototype.getApp = function() {
	return this.app;
}

WindowManager.prototype.logEvent = function(type, e, arg) {
	var evt = {t:type};
	var date = new Date();
	var thisEventTime = date.getTime();
	var lastEvent = this.events.length > 0 ? this.events[this.events.length-1] : null;

	if(!this.pointerDown && lastEvent && type === C_EVT_POINTER_MOVE && lastEvent.t === C_EVT_POINTER_MOVE) {
		var dx = lastEvent.p.x - arg.x;
		var dy = lastEvent.p.y - arg.y;

		if(Math.abs(dx) < 5 && Math.abs(dy) < 5) {
			console.log("Skip move event");
			return;
		}
	}

	evt.tm = date.getTime() - thisEventTime;
	this.lastEventTime = thisEventTime;

	switch(type) {
		case C_EVT_POINTER_DOWN:	{
				console.log("Record: Mouse down:" + arg.x + " x " + arg.y);
		}
		case C_EVT_POINTER_UP: {
				console.log("Record: Mouse up:" + arg.x + " x " + arg.y);
		}
		case C_EVT_CONTEXT_MENU: 
		case C_EVT_POINTER_MOVE:
		case C_EVT_DOUBLE_CLICK: {
			evt.p = arg;
			break;
		}
		case C_EVT_KEY_DOWN: 
		case C_EVT_KEY_UP: {
			evt.c = arg;
			break;
		}
		default:break;
	}

	if(targetIsEditor(e)) {
		evt.other = true;
	}

	this.events.push(evt);
	
	return;
}

WindowManager.prototype.replayEvents = function(eventsJson) {
	if(eventsJson) {
		try {
			this.events = JSON.parse(eventsJson);
		}
		catch(e) {
			return;
		}
	}

	if(!this.events || this.events.length < 1) {
		return;
	}

	var self = this;
	this.replayIndex = 0;
	self.eventReplaying = true;

	console.log("replay events start.");

	function playNextEvent() {
		var evt = self.events[self.replayIndex];
		var type = evt.t;
		
		if(evt.other) {
			/*TODO*/
			if(type === C_EVT_KEY_DOWN) {
			}
			else if(type === C_EVT_KEY_UP) {
			}
		}
		else {
			switch(type) {
				case C_EVT_CONTEXT_MENU: {
					self.onContextMenu(evt.p);
					console.log("Inject: Mouse down:" + evt.p.x + " x " + evt.p.y);
					break;
				}
				case C_EVT_POINTER_DOWN: {
					self.onPointerDown(evt.p);
					console.log("Inject: Mouse down:" + evt.p.x + " x " + evt.p.y);
					break;
				}
				case C_EVT_POINTER_MOVE: {
					self.onPointerMove(evt.p);
					break;
				}
				case C_EVT_POINTER_UP: {
					self.onPointerUp(evt.p);
					console.log("Inject: Mouse up:" + evt.p.x + " x " + evt.p.y);
					break;
				}
				case C_EVT_DOUBLE_CLICK: {
					self.onDoubleClick(evt.p);
					break;
				}
				case C_EVT_KEY_DOWN: { 
					self.onKeyDown(evt.c);
					break;
				}
				case C_EVT_KEY_UP: {
					self.onKeyUp(evt.c);
					break;
				}
				default:break;
			}
		}

		self.replayIndex++;
		if(self.replayIndex < self.events.length) {
			evt = self.events[self.replayIndex];
			setTimeout(playNextEvent, evt.t);
		}
		else {
			self.eventReplaying = false;
			console.log("replay events end.");
		}
	}
	
	setTimeout(playNextEvent, 0);

	return;
}

WindowManager.prototype.preprocessEvent = function(type, e, arg) {
	this.currentEvent = e.originalEvent ? e.originalEvent : e;
	return true;
}

WindowManager.prototype.getCanvas2D = function() {
	return this.canvas.getContext("2d");
}

WindowManager.prototype.findTargetWin = function(point) {
	 var target = null;
	 var nr = this.grabWindows.length;
	 
	 if(nr > 0) {
		  target = this.grabWindows[nr-1];
	 }
	 else {
		  nr = this.windows.length;
		  for(var i = nr-1; i >= 0; i--) {
				var win = this.windows[i];
				if(!win.visible || win.insensitive || !win.focusable) {
					 continue;
				}
				
				if(isPointInRect(point, win.rect)) {
					 target = win;
					 break;
				 }
		  }
	 }
		  
	 return target;
}
		
WindowManager.prototype.resize = function(w, h) {
	this.w = w;
	this.h = h;
	this.postRedraw();

	return;
}

WindowManager.prototype.grab = function(win) {
	 this.grabWindows.push(win);
	 
	 return;
}

WindowManager.prototype.ungrab = function(win) {
	 this.grabWindows.remove(win);
	 
	 return;
}

WindowManager.prototype.onDoubleClick = function(point) {	
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onDoubleClick(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WindowManager.prototype.onLongPress = function(point) {	
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onLongPress(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WindowManager.prototype.onGesture = function(gesture) {	
	cantkHideAllInput();

	var point = {x:this.w/2, y:this.h/2};
	this.target = this.findTargetWin(point);

	if(this.target) {
		this.target.onGesture(gesture);
		console.log("WindowManager.prototype.onGesture: scale=" + gesture.scale + " rotation=" + gesture.rotation);
	}
	else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	}
	 
	return;
}

WindowManager.prototype.onPointerDown = function(point) {	
	cantkHideAllInput();

	this.target = this.findTargetWin(point);

	this.pointerDown = true;
	this.pointerDownPoint.x = point.x;
	this.pointerDownPoint.y = point.y;
	this.lastPointerPoint.x = point.x;
	this.lastPointerPoint.y = point.y;

	if(this.target) {
		 this.target.onPointerDown(point);
	 }
	 else {
		 console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	 
	return;
}

WindowManager.prototype.onPointerMove = function(point) {
	this.target = this.findTargetWin(point);
	  
	this.lastPointerPoint.x = point.x;
	this.lastPointerPoint.y = point.y;
	if(this.target) {
		 this.target.onPointerMove(point);
	 }
	
	return;
}

WindowManager.prototype.onPointerUp = function(point) {
	this.target = this.findTargetWin(point);
	 
	this.lastPointerPoint.x = point.x;
	this.lastPointerPoint.y = point.y;
	if(this.target) {
		 this.target.onPointerUp(point);
	 }
	 else {
		  console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	this.pointerDown = false;
	
	return;
}

WindowManager.prototype.getLastPointerPoint = function() {
	return this.lastPointerPoint;
}

WindowManager.prototype.isPointerDown= function() {
	return this.pointerDown;
}

WindowManager.prototype.isClicked = function() {
	var dx = Math.abs(this.lastPointerPoint.x - this.pointerDownPoint.x);
	var dy = Math.abs(this.lastPointerPoint.y - this.pointerDownPoint.y);

	return (dx < 10 && dy < 10);
}

WindowManager.prototype.isCtrlDown = function() {
	return this.currentEvent && (this.currentEvent.ctrlKey || this.ctrlDown);
}

WindowManager.prototype.isAltDown = function() {
	return this.currentEvent && (this.currentEvent.altKey || this.altDown);
}

WindowManager.prototype.onContextMenu = function(point) {
	 this.target = this.findTargetWin(point);
	 
	if(this.target) {
		 this.target.onContextMenu(point);
	 }
	 else {
		  console.log("Window Manager: no target for x=" + point.x + " y=" + point.y);
	 }
	
	return;
}

WindowManager.prototype.onKeyDown = function(code) {
	if(!this.target) {
		this.target = this.findTargetWin({x:50, y:50});
		console.log("onKeyDown: findTargetWin=" + this.target);
	}

	switch(code) {
		case KeyEvent.DOM_VK_SHIFT: {
			this.shitfDown = true; 
			break;
		}
		case KeyEvent.DOM_VK_CONTROL:  {
			this.ctrlDown = true;
			break;
		}
		case KeyEvent.DOM_VK_ALT: {
			this.altDown = true;
			break;
		}
		default: {
			if(this.target !== null) {
				 this.target.onKeyDown(code);
			}
		}
	}
			
	return;
}

WindowManager.prototype.onKeyUp = function(code) {
	switch(code) {
		case KeyEvent.DOM_VK_SHIFT: {
			this.shitfDown = false; 
			break;
		}
		case KeyEvent.DOM_VK_CONTROL:  {
			this.ctrlDown = false;
			break;
		}
		case KeyEvent.DOM_VK_ALT: {
			this.altDown = false;
			break;
		}
		default: {
			if(this.target !== null) {
		 		this.target.onKeyUp(code);
			}
		}
	}
	
	return;
}

WindowManager.prototype.addWindow = function(win) {
	this.windows.push(win);
	
	return;
}

WindowManager.prototype.removeWindow = function(win) {
	this.windows.remove(win);
	console.log("remove nr=" + this.windows.length);
	this.postRedraw();
	
	return;
}

WindowManager.prototype.postRedraw = function(rect) {
	this.dirtyRegion.push(1);

	var manager = this;
	function redrawAll() {
		manager.draw();
	}

	requestAnimFrame(redrawAll);

	return;
}

WindowManager.prototype.drawWindows = function(canvas) {
	var nr = this.windows.length;
	for(var i = 0; i < nr; i++) {
		var win = this.windows[i];
		win.draw(canvas);
	}

	return;
}

WindowManager.prototype.redraw = function(rect) {
	var canvas = this.getCanvas2D();
	canvas.save();
	if(rect) {
		canvas.beginPath();
		canvas.rect(rect.x, rect.y, rect.w, rect.h);
		canvas.clip();
	}
	this.drawWindows(canvas);
	canvas.restore();

	return;
}
 
WindowManager.prototype.draw = function() {
	if(!this.dirtyRegion.length) {
		return;
	}
	
	var canvas = this.getCanvas2D();
	canvas.save();
	this.drawWindows(canvas);
	canvas.restore();
	
	this.dirtyRegion.clear();

	return;
/*	
	canvas.beginPath();
	for(var i = 0; i < this.dirtyRegion.length; i++) {
		var rect = this.dirtyRegion[i];
		canvas.rect(rect.x, rect.y, rect.w, rect.h);
	}
	canvas.closePath();
	canvas.clip();
*/	
	var nr = this.windows.length;
	for(var i = 0; i < nr; i++) {
		var win = this.windows[i];
		win.draw(canvas);
	}

	canvas.beginPath();
	canvas.strokeStyle = "Black";
	
	if(this.eventLogging) {
		canvas.fillStyle = "Red";
		canvas.arc(30, 30, 10, 0, 2 * Math.PI);
	}
	
	canvas.fill();
	canvas.stroke();

	this.dirtyRegion.clear();
	canvas.restore();

	return;
}

 

/*
 * File: shape.js
 * Brief: Base class of all shapes.
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var C_MODE_EDITING = 0;
var C_MODE_RUNNING = 1;
var C_MODE_PREVIEW = 2;

var C_HIT_TEST_NONE = 0;
var C_HIT_TEST_TL = 1;
var C_HIT_TEST_TM = 2;
var C_HIT_TEST_TR = 3;
var C_HIT_TEST_ML = 4;
var C_HIT_TEST_MR = 5;
var C_HIT_TEST_BL = 6;
var C_HIT_TEST_BM = 7;
var C_HIT_TEST_BR = 8;
var C_HIT_TEST_HANDLE = 9;
var C_HIT_TEST_WORKAREA = 10;
var C_HIT_TEST_MAX = 11
var C_HIT_TEST_MM = -1;

var C_ALIGN_LEFT = 1;
var C_ALIGN_RIGHT = 2;
var C_ALIGN_TOP = 3;
var C_ALIGN_BOTTOM = 4;
var C_ALIGN_CENTER = 5;
var C_ALIGN_MIDDLE = 6;
var C_ALIGN_TO_SAME_WIDTH = 7;
var C_ALIGN_TO_SAME_HEIGHT = 8;
var C_ALIGN_DIST_VER = 9;
var C_ALIGN_DIST_HOR = 10;

var C_STAT_CREATING_0 = 0;
var C_STAT_CREATING_1 = 1;
var C_STAT_CREATING_2 = 2;
var C_STAT_NORMAL = 3;

var C_SHAPE_TEXT_NONE=0;
var C_SHAPE_TEXT_INPUT=1;
var C_SHAPE_TEXT_TEXTAREA=2;


function Shape() {
	this.textTitle = "Text";
	return;
}

Shape.prototype.canBindingData = function() {
	return false;
}

Shape.prototype.afterCreated = function(point) {
	return true;
}

Shape.prototype.setNearRange = function(nearRange) {
	this.nearRange = nearRange;

	return;
}

Shape.prototype.getNearRange = function() {
	return this.nearRange ? this.nearRange : 20;	
}

Shape.prototype.findNear = function(point) {
	return null;
}

Shape.prototype.getCreatingShape = function() {
	return this.view ? this.view.getCreatingShape() : null;
}

Shape.prototype.getTextCookie = function(point) {
	return 0;
}

Shape.prototype.isFillColorTransparent = function() {
	return !this.style.fillColor || this.style.fillColor === "rgba(0,0,0,0)";
}

Shape.prototype.isStrokeColorTransparent = function() {
	return !this.style.lineColor || this.style.lineColor === "rgba(0,0,0,0)";
}

Shape.prototype.isTextColorTransparent = function() {
	return !this.style.lineColor || this.style.lineColor === "rgba(0,0,0,0)";
}


Shape.prototype.setParent = function(parentShape) {
	this.parentShape = parentShape;
	return;
}

Shape.prototype.getParent = function(name) {
	if(name) {
		for(var iter = this.parentShape; iter != null; iter = iter.parentShape) {
			if(iter.name === name) {
				return iter;
			}
		}
	}

	return name ? null : this.parentShape;
}

Shape.prototype.textEditable = function(point) {
	return true;
}

Shape.prototype.setInputType = function(inputType) {
	this.inputType = inputType;

	return;
}

Shape.prototype.editText = function(point) {
	if(this.textType && this.textEditable(point)) {
		var p = this.getPositionInView();
		var scale = this.getRealScale();
		var ox = this.view.rect.x;
		var oy = this.view.rect.y;
		var x = p.x * scale + ox;
		var w = this.getWidth() * scale;
		var h = this.getHeight() * scale;
		var cookie = this.getTextCookie(point);
		var shape = this;
		var editor = null;
		var inputType = this.inputType ? this.inputType : "text";

		if(this.textType === C_SHAPE_TEXT_INPUT) {
			var y = p.y * scale + h/3 + oy;

			if(w < 60) {
				w = 60;
			}

			editor = cantkShowInput(x, y, w, 18);
			editor.setInputType(inputType);
		}
		else {
			var y = p.y * scale + oy;
			if(h < 60) {
				h = 60;
			}
			editor = cantkShowTextArea(x, y, w, h);
		}

		shape.editing = true;
		editor.setText(this.getText(cookie));
		editor.element.onchange= function() {
			if(shape.text !== this.value) {
				shape.exec(new SetTextCommand(shape, this.value, cookie));
				shape.postRedraw();
			}
			editor.hide();
			shape.editing = false;

			return;
		}
	}

	return;
}

Shape.prototype.exec = function(cmd) {
	if(this.app) {
		this.app.exec(cmd);
	}
	else {
		cmd.doit();
		delete cmd;
	}

	return;
}

Shape.prototype.setTextTitle = function(textTitle) {
	this.textTitle = textTitle;

	return;
}
	
Shape.prototype.initShape = function(x, y, w, h, type) {
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.type = type;
	this.text = "";
	this.app = null;
	this.view = null;
	this.rotation = 0;
	this.saveDx = 0;
	this.saveDy = 0;
	this.scale = 1;
	this.parentShape = null;
	this.pointerDown = false;	
	this.selected = false;
	this.userMovable = true;
	this.userResizable = true;
	this.hignlighted = false;
	this.state = C_STAT_NORMAL;
	this.hitTestResult = C_HIT_TEST_NONE;
	this.lastPosition = new Point(0, 0);
	this.selectMarkPoint = new Point(0, 0);
	this.textType = C_SHAPE_TEXT_INPUT;
	this.setDefaultStyle();
	this.setTextAlignV("middle");
	this.setTextAlignH("center");

	return;
}

Shape.prototype.setDefaultStyle = function() {
	this.style = new ShapeStyle();
	this.setStyle(DefaultShapeStyleGet());

	return;
}

Shape.prototype.setState = function(state) {
	this.state = state;
	
	return;
}

Shape.prototype.setTextType= function(textType) {
	this.textType = textType;
	
	return;
}

Shape.prototype.isSelected = function() {
	return this.selected;
}

Shape.prototype.userRemovable = function() {
	return true;
}

Shape.prototype.intersectWithRect = function(rect) {
	var ret = false;
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();

	var p1 = {x:x, y:y};
	var p2 = {x:x+w, y:y+h};
	var p3 = {x:x+w, y:y};
	var p4 = {x:x, y:y+h};

	return isPointInRect(p1, rect) || isPointInRect(p2, rect) 
		|| isPointInRect(p3, rect) || isPointInRect(p4, rect);
}


Shape.prototype.isThisInRect = function(rect) {
	var ret = false;
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();
	
	if((x >= rect.x && x < (rect.x + rect.w))
		&& (y >= rect.y && y < (rect.y + rect.h))) {
		ret = true;
	}
	
	return ret;
}

Shape.prototype.snapToGrid = function(x, y) {
	var xx = x;
	var yy = y;

	if(this.view) {
		return this.view.snapToGrid(x, y);
	}
	else {
		return {x : xx, y: yy};
	}
}

Shape.prototype.isClicked = function() {
	if(this.view) {
		return this.view.isClicked();
	}

	return false;
}

Shape.prototype.isAltDown = function() {
	if(this.view) {
		return this.view.isAltDown();
	}

	return false;
}

Shape.prototype.isCtrlDown = function() {
	if(this.view) {
		return this.view.isCtrlDown();
	}

	return false;
}

Shape.prototype.showIconPreview = function(canvas) {

	return true;
}

Shape.prototype.onMoving = function() {
}

Shape.prototype.onMoved = function() {

}

Shape.prototype.onSized = function() {

}

Shape.prototype.onUserResized = function() {

}

Shape.prototype.fixChildPosition = function(child) {
	var maxW = this.w;
	var maxH = this.h;
	var dx = child.x >= 0 ? child.x : 0;
	var dy = child.y >= 0 ? child.y : 0;

	if((dx + child.w) > maxW) {
		dx = maxW - child.w; 
	}

	if((dy + child.h) > maxH) {
		dy = maxH - child.h;
	}

	child.x = dx;
	child.y = dy;

	return;
}

Shape.prototype.fixPosition = function() {
	if(!this.parentShape) {
		return;
	}

	this.parentShape.fixChildPosition(this);

	return;
}

Shape.prototype.move = function(dx, dy) {
	dx = Math.floor(dx);
	dy = Math.floor(dy);

	if(this.x != dx || this.y != dy) {
		this.x = dx;
		this.y = dy;

		if(!this.isIcon) {
			this.fixPosition();
			this.onMoved();
		}
		
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
	}

	return;
}

Shape.prototype.moveDelta=function(dx, dy) {
	this.move(this.x + dx, this.y + dy);
	
	return;
}

Shape.prototype.getWidth = function() {
	return this.w;
}

Shape.prototype.getHeight = function() {
	return this.h;
}

Shape.prototype.getPositionInScreen = function() {
	var pv = {x:0, y:0};
	var scale = this.getRealScale();
	var p = this.getPositionInView();
	
	if(this.view) {
		pv = this.view.getAbsPosition();
	}

	p.x = pv.x + p.x * scale;
	p.y = pv.y + p.y * scale;

	return p;
}

Shape.prototype.getRealScale = function() {
	return this.view ? this.view.getScale() : 1;
}

Shape.prototype.getAbsPosition = function() {
	var p = this.getPositionInView();

	if(this.view) {
		var pv = this.view.getAbsPosition();
		p.x = p.x + pv.x;
		p.y = p.y + pv.y;
	}

	return p;
}

Shape.prototype.getPositionInView = function() {
	var x = this.getX();
	var y = this.getY();
	var point = {x:0, y:0};
	var iter = this.parentShape;

	while(iter != null) {
		x += iter.getX();
		y += iter.getY();
		iter = iter.parentShape;
	}

	point.x = x;
	point.y = y;

	return point;
}


Shape.prototype.getXinView = function() {
	var x = this.getPositionInView().x; 

	return x;
}

Shape.prototype.getYinView = function() {
	var y = this.getPositionInView().y; 

	return y;
}

Shape.prototype.getX = function() {
	return this.x;
}

Shape.prototype.getY = function() {
	return this.y;
}

Shape.prototype.align = function(type, value) {
	return;
}

Shape.prototype.setRotatable = function(rotatable) {
	this.rotatable = rotatable;
	
	return;
}

Shape.prototype.setScale = function(scale) {
	this.scale = scale;
	
	if(scale < 0.1) {
		this.scale = 0.1;
	}

	if(scale > 4) {
		this.scale = 4;
	}

	return;
}

Shape.prototype.setRotation = function(degree) {
	this.rotation = degree%360;
	
	return;
}

Shape.prototype.setStyle = function(style) {
	this.style.copy(style);
	this.textNeedRelayout = true;
	
	return;
}

Shape.prototype.getStyle = function() {
	return this.style;
}

Shape.prototype.setName = function(name) {
	this.name = name;

	return;
}

Shape.prototype.getName = function() {
	return this.name;
}

Shape.prototype.getLocaleText = function(text) {
	return text;
}

Shape.prototype.getLocaleInputTips = function(text) {
	return dappGetText(text);
}
	
Shape.prototype.setNeedRelayoutText = function() {
	this.textNeedRelayout = true;

	return;
}	

Shape.prototype.setTextAlignH = function(hTextAlign) {
	this.hTextAlign = hTextAlign;

	return;
}

Shape.prototype.setTextAlignV = function(vTextAlign) {
	this.vTextAlign = vTextAlign;

	return;
}

Shape.prototype.getTextAlignH = function() {
	var hTextAlign = this.hTextAlign ? this.hTextAlign : "left";

	return hTextAlign;
}

Shape.prototype.getTextAlignV = function() {
	var vTextAlign = this.vTextAlign ? this.vTextAlign : "top";

	return vTextAlign;
}

Shape.prototype.toText = function(value) {
	if(value !== null && value != undefined) {
		return value + "";
	}
	else {
		return "";
	}
}

Shape.prototype.setText = function(text, cookie) {
	cookie = cookie ? cookie : 0;
	text = (text != null && text != undefined) ? text+"" : "";

	switch(cookie)	 {
		case 2: {
			this.text2 = text;
			break;
		}
		case 3:  {
			this.text3 = text;
			break;
		}
		default: {
			this.text = text;
		}
	}
	this.textNeedRelayout = true;
	
	return;
}

Shape.prototype.setText2 = function(text) {
	this.text2 = text;
	
	return;
}

Shape.prototype.setText3 = function(text) {
	this.text3 = text;
	
	return;
}

Shape.prototype.getText = function(cookie) {
	cookie = cookie ? cookie : 0;

	switch(cookie)	 {
		case 2: {
			return this.text2;
		}
		case 3:  {
			return this.text3;
		}
		default:break;
	}

	return this.text;
}

Shape.prototype.getApp = function() {
	return this.app;
}

Shape.prototype.getView = function() {
	return this.view;
}

Shape.prototype.setApp = function(app) {
	this.app = app;
	
	return;
}

Shape.prototype.setView = function(view) {
	this.view = view;
	
	return;
}

Shape.prototype.redrawSelf = function() {
	if(this.view) {
		var scale = this.getRealScale();
		var p = this.getPositionInView();
		var rect = {x: p.x*scale, y:p.y*scale, w:this.w*scale, h:this.h*scale};

		this.view.redraw(rect);
	}
	
	return;
}

Shape.prototype.postRedraw = function(rect) {
	if(this.view) {
		this.view.postRedraw(rect);
	}
	
	return;
}

Shape.prototype.beforePropertyChanged = function() {
	return;
}

Shape.prototype.afterPropertyChanged = function() {
	return;
}

Shape.prototype.showProperty = function() {
	return;
}

Shape.prototype.setSelectedMarkSize = function(selectedMarkSize) {
	this.selectedMarkSize = selectedMarkSize;

	return;
}

Shape.prototype.createSelectedMark = function(canvas, x, y, isHited) {
	var size = this.selectedMarkSize ? this.selectedMarkSize : 10;

	if(isHited) {
		size = size + size;
	}

	canvas.rect(x-size, y-size, size*2, size*2);

	return;
}

Shape.prototype.isInSelectedMark = function(canvas, x, y, point) {
	canvas.beginPath();
	this.createSelectedMark(canvas, x, y);	
	return canvas.isPointInPath(point.x, point.y);
}	

Shape.prototype.paint = function(canvas) {
	this.paintSelf(canvas);

	if(this.near) {
		var p = this.near.point;
		var r = this.getNearRange();

		canvas.beginPath();
		canvas.arc(p.x, p.y, 4, 0, Math.PI * 2);
		canvas.fillStyle = "Red";
		canvas.fill();

		canvas.beginPath();
		canvas.lineWidth = 2;
		canvas.arc(p.x, p.y, r, 0, Math.PI * 2);
		canvas.strokeStyle = "Black";
		canvas.stroke();
	}

	return;
}

Shape.prototype.paintSelf=function(canvas) {
	return;
}

Shape.prototype.setSelected=function(selected) {
	if(this.selected === selected) {
		return;
	}

	this.selected = selected;

	if(this.view && this.view.onShapeSelected) {
		this.view.onShapeSelected(this);
	}

	return;
}

Shape.prototype.isVisible = function() {
	return true;
}

Shape.prototype.findNearPoint = function(rect) {
	var p = null;

	for(var i = 0; i < 100; i++) {
		p = this.getNearPoint(i);

		if(!p) {
			break;
		}
		
		if(isPointInRect(p, rect)) {
			var near = {shape:this};
			near.nearPointIndex = i;
			near.point = {x:p.x, y:p.y};

			return near;
		}
	}

	return null;
}

Shape.prototype.dup = function() {
	var g = ShapeFactoryGet().createShape(this.type, C_CREATE_FOR_PROGRAM);

	g.fromJson(this.toJson());
	g.state = C_STAT_NORMAL;

	return g;
}


Shape.prototype.hitTest = function(point) {
	return C_HIT_TEST_NONE;
}

Shape.prototype.showProperty = function() {
	return;
}

Shape.prototype.onLongPress = function(point) {
	return;
}

Shape.prototype.onGesture = function(gesture) {
}

Shape.prototype.onDoubleClick = function(point) {
	if(this.textType != C_SHAPE_TEXT_NONE) {
		this.editText(point);
	}
	else {
		this.showProperty();
	}

	return true;
}

Shape.prototype.onPointerDown = function(point) {
	this.pointerDown = true;
	this.hitTestResult = this.hitTest(point);

	if(!this.hitTestResult) {
		return false;
	}
	
	this.setSelected(true);
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;
	this.handlePointerEvent(point, C_EVT_POINTER_DOWN);
	
	return true;
}

Shape.prototype.handlePointerEvent = function(point, evt) {
	return false;
}

Shape.prototype.onPointerMove = function(point) {
	if(this.hitTestResult) {
		this.handlePointerEvent(point, C_EVT_POINTER_MOVE);
		return true;
	}
	
	return false;
}

Shape.prototype.onPointerUp = function(point) {
	if(this.hitTestResult) {
		this.handlePointerEvent(point, C_EVT_POINTER_UP);
		this.hitTestResult = C_HIT_TEST_NONE;
		
		return true;
	}
	this.pointerDown = false;
	
	return false;
}

Shape.prototype.onKeyDown = function(code) {
	console.log("onKeyUp Widget: code=" + code)
	return;
}

Shape.prototype.onKeyUp = function(code) {
	console.log("onKeyUp Widget: code=" + code)
	return;
}

Shape.prototype.canBeComponent = function() {
	return false;
}

Shape.prototype.shouldShowContextMenu = function() {
	return true;
}

Shape.prototype.toJson = function() {
	return "";
}

Shape.prototype.fromJson = function(text) {
	return this;
}

Shape.prototype.extractFormat = function() {
	var o = new Object();
	
	o.type = "";
	o.name = "";

	for(var key in this) {
		var value = this[key];
		var type = typeof value;
		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			o[key] = value;
		}
	}

	if(this.images) {
		o.images = this.images;
	}

	delete o.x;
	delete o.y;
	delete o.name;
	delete o.text;
	delete o.state;
	delete o.mode;
	delete o.selected;
	delete o.pointerDown;
	delete o.xAttr;
	delete o.yAttr;
	delete o.xParam;
	delete o.yParam;

	o.style = this.style.toJson();

	return o;
}

Shape.prototype.afterApplyFormat = function() {
	return;
}

Shape.prototype.applyFormat = function(js) {
	if(!js) {
		return;
	}

	var isSameType = js.type === this.type;

	for(var key in js) {
		var value = js[key];
		var type = typeof value;
		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(key == "type") {
			continue;
		}

		if(!isSameType && (key === "w" || key === "h")) {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			if(isSameType || this[key] != undefined) {
				this[key] = value;
			}
		}
	}

	if(isSameType) {
		if(js.images) {
			for(var key in js.images) {
				var value = js.images[key];
				
				if(key === "display") {
					this.images[key] = value;
				}
				else {
					var src = value.getImageSrc();
					this.setImage(key, src);
				}
			}
		}
	}

	if(js.style) {
		this.style.fromJson(js.style);
	}

	this.afterApplyFormat();
	this.textNeedRelayout = true;

	return;
}

Shape.prototype.setUserMovable = function(value) {
	this.userMovable = value;

	return;
}

Shape.prototype.setUserResizable = function(value) {
	this.userResizable = value;

	return;
}

Shape.prototype.isUserMovable = function() {
	return this.userMovable;
}

Shape.prototype.isUserResizable = function() {
	return this.userResizable;
}

function splitText(text) {
	text = text.replaceAll("\r\n", "\n");
	text = text.replaceAll("\r", "\n");

	return text.split("\n--\n");
}

function restackShapeInArray(shapes, offset) {
	var n = 0;
	var pos = 0;
	var s = null;
	var new_pos = 0;
	var selectedShape = null;

	for(var i = 0; i < shapes.length; i++) {
		s = shapes[i];
		if(s.selected) {
			n++;
			if(!selectedShape) {
				selectedShape = s;
				pos = i;
			}
		}
	}

	if(n > 1 || !selectedShape) {
		return;
	}

	new_pos = pos + offset;
	if(new_pos < 0 || new_pos >= shapes.length) {
		return;
	}

	shapes[pos] = shapes[new_pos];
	shapes[new_pos] = selectedShape;

	return;
}

function getParentShapeOfShape(shape, view) {
	var p = shape.parentShape ? shape.parentShape : shape.container;

	if(!p) {
		p = view;
	}

	return p;
}

function getParentShapeOfShapes(shapes) {
	if(!shapes || shapes.length === 0) {
		return null;
	}

	var firstShape = shapes[0];
	var parentShape = firstShape.parentShape;

	for(var i = 0; i < shapes.length; i++) {
		var shape = shapes[i];

		if(shape.parentShape != parentShape) {
			return null;
		}
	}

	return parentShape ? parentShape : firstShape.view;
}

Shape.prototype.getTextColor = function(canvas) {
	return this.style.textColor;
}

Shape.prototype.getBgColor = function(canvas) {
	return this.style.fillColor;
}

Shape.prototype.getLineColor = function(canvas) {
	return this.style.lineColor;
}

Shape.prototype.defaultDrawText = function(canvas) {
	var width = this.getWidth(true);
	var text = this.getLocaleText(this.text);

	if(!text || this.editing) {
		return;
	}
	
	canvas.save();
	canvas.beginPath();
	canvas.lineWidth = 1;
	canvas.font = this.style.getFont();
	canvas.fillStyle = this.getTextColor();
	canvas.strokeStyle = this.getLineColor();

	var lines = text.split(/\n/);
	if(lines.length < 2) {
		if(canvas.measureText(text).width < 1.2 * width) {
			this.draw1LText(canvas);
		}
		else {
			this.drawMLText(canvas);
		}
	}
	else {
		this.drawMLText(canvas);
	}
	canvas.restore();

	return;
}

Shape.prototype.draw1LText = function(canvas, drawAll) {
	var text = this.getLocaleText(this.text);

	if(!text || this.editing) {
		return;
	}

	var x = 0;
	var y = 0;
	var hMargin = this.hMargin;
	var width = this.getWidth(true);
	var hTextAlign = this.getTextAlignH();
	var vTextAlign = this.getTextAlignV();
	var textU = this.style.textU;
	var fontSize = this.style.fontSize;
	var textWidth = canvas.measureText(text).width;

	var lx = 0;
	var ly = 0;
	var lw = Math.min(textWidth, width);

	switch(vTextAlign) {
		case "middle": {
			y = this.h >> 1;
			canvas.textBaseline = "middle";
			if(textU) {
				ly = Math.floor(y + fontSize * 0.8);
			}
			break;
		}
		case "bottom": {
			y = this.h - this.vMargin;
			canvas.textBaseline = "bottom";
			if(textU) {
				ly = y;
			}
			break;
		}
		default: {
			y = this.vMargin;
			canvas.textBaseline = "top";
			if(textU) {
				ly = Math.floor(y + fontSize * 1.5);
			}
			break;
		}
	}

	switch(hTextAlign) {
		case "center": {
			x = this.w >> 1;
			canvas.textAlign = "center";
			if(textU) {
				lx = Math.max((this.w - textWidth) >> 1, 0);
			}
			break;
		}
		case "right": {
			x = this.w - this.hMargin;
			canvas.textAlign = "right";
			if(textU) {
				lx = Math.max((this.w - textWidth - hMargin), 0);
			}
			break;
		}
		default: {
			x = this.hMargin;
			canvas.textAlign = "left";
			if(textU) {
				lx = x;
			}
			break;
		}
	}
	
	if(textU) {
		canvas.moveTo(lx, ly);
		canvas.lineTo(lx + lw, ly);
		canvas.stroke();
	}

	canvas.fillText(text, x, y, width);
	
	return textWidth;
}

Shape.prototype.drawMLText = function(canvas, drawAll) {
	this.layoutText(canvas);

	if(!this.lines) {
		return;
	}

	var x = 0;
	var y = 0;
	var lx = 0;
	var ly = 0;
	var lw = 0;
	var vMargin = this.vMargin;
	var hMargin = this.hMargin;
	var width = this.getWidth(true);
	var hTextAlign = this.getTextAlignH();
	var vTextAlign = this.getTextAlignV();

	var textU = this.style.textU;
	var fontSize = this.style.fontSize;
	var textLineHeight = this.getTextLineHeight();
	var textHeight = this.getTextHeight();

	canvas.textBaseline = "top";
	switch(vTextAlign) {
		case "middle": {
			y = (this.h - textHeight) >> 1;
			break;
		}
		case "bottom": {
			y = this.h - textHeight - vMargin;
			break;
		}
		default: {
			y = vMargin;
			break;
		}
	}

	y = y < 0 ? 0: y;

	for(var i = 0; i < this.lines.length; i++) {
		var str = this.lines[i];
		if(!str || str == " ") {
			y += fontSize;
			continue;
		}
		
		if((y + textLineHeight) >= this.h && !drawAll) {
			break;
		}

		var textWidth = canvas.measureText(str).width;

		lw = Math.min(textWidth, width);
		ly = Math.floor(y + (fontSize + textLineHeight)/2);

		switch(hTextAlign) {
			case "center": {
				x = this.w >> 1;
				canvas.textAlign = "center";
				if(textU) {
					lx = Math.max((this.w - textWidth) >> 1, 0);
				}
				break;
			}
			case "right": {
				x = this.w - hMargin;
				canvas.textAlign = "right";
				if(textU) {
					lx = Math.max((this.w - textWidth - hMargin), 0);
				}
				break;
			}
			default: {
				x = hMargin;
				canvas.textAlign = "left";
				if(textU) {
					lx = x;
				}
				break;
			}
		}

		if(textU) {
			canvas.moveTo(lx, ly);
			canvas.lineTo(lx + lw, ly);
			canvas.stroke();
		}
		canvas.fillText(str, x, y, width);

		y += textLineHeight;
	}

	return;
}

Shape.prototype.getTextHeight = function() {
	var h = 0;
	var fontSize = this.style.fontSize;
	var lineHeight = this.getTextLineHeight();

	if(!this.text || !this.lines) {
		return lineHeight;
	}

	for(var i = 0; i < this.lines.length; i++) {
		var str = this.lines[i];
		if(!str || str == " ") {
			h += fontSize;
		}
		else {
			h += lineHeight;
		}
	}

	return h;
}

Shape.prototype.getTextLineHeight = function() {
	return Math.floor(this.style.fontSize * 1.5);
}

Shape.prototype.setTextShadow = function(textShadow) {
	this.textShadow = textShadow;

	return;
}

Shape.prototype.isValid = function() {
	return !this.isInvalid;
}

Shape.prototype.canCopy = function() {
	return true;
}

Shape.prototype.onDestroy = function() {
}

Shape.prototype.onRemoved = function() {
}

Shape.prototype.destroy = function() {
	this.app = null;
	this.view = null;
	this.parentShape = null;	
	this.isInvalid = true;

	if(this.children) {
		this.children.clear();
	}

	this.onDestroy();

	return;
}



/*
 * File: r_shape.js
 * Brief: Base class of all rectangle shapes.
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function RShape() {
	return;
}

RShape.selectMarkColor = "Orange";
RShape.setSelectMarkColor = function(color) {
	RShape.selectMarkColor = color;

	return;
}

RShape.prototype = new Shape();

RShape.prototype.MIN_SIZE = 10;
RShape.prototype.isRect = true;

RShape.prototype.initRShape = function(x, y, w, h, type) {
	this.initShape(x, y, w, h, type);

	this.scale = 1;
	this.opacity = 1;
	this.hMargin = 0;
	this.vMargin = 0;
	this.rotation = 0;
	this.saveWidth = 0;
	this.saveHeight = 0;
	this.image = null;
	this.imageUrl = "";
	this.rect = new Rect(0, 0, w, h);
	this.lastPosition = new Point(0, 0);
	this.pointerDownPosition = new Point(0, 0);
	this.defWidth = 200;
	this.defHeight = 60;
	this.pointerDown = false;
	this.enable = true;
	this.visible = true;
	this.events = {};

	if(w === 0 || h === 0) {
		this.w = this.MIN_SIZE;
		this.h = this.MIN_SIZE;	
		this.setState(C_STAT_CREATING_0);

		this.onPointerDown = function(point) {
			this.pointerDownPosition.x = point.x;
			this.pointerDownPosition.y = point.y;
			this.postRedraw();

			if(this.onPointerDownCreating(point)) {
				return true;
			}

			return this.onPointerDownNormal(point);
		}
	
		this.onPointerMove = function(point) {
			if(this.onPointerMoveCreating(point)) {
				return true;
			}

			return this.onPointerMoveNormal(point);
		}

		this.onPointerUp = function(point) {
			var ret = false;	

			if(this.onPointerUpCreating(point)) {
				ret = true;
			}
			else {
				ret = this.onPointerUpNormal(point);
			}
			this.pointerDown = false;
			this.postRedraw();

			return ret;
		}
	}

	return;
}

RShape.prototype.onPointerDownCreating = function(point) {
	if(this.state === C_STAT_CREATING_0) {
		this.state = C_STAT_CREATING_1;
		this.move(point.x, point.y);
		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;
		this.postRedraw();
		this.pointerDown = true;

		return true;
	}

	return false;
}

RShape.prototype.onPointerUpCreating = function(point) {
	if(this.state !== C_STAT_NORMAL) {
		var dx = point.x - this.lastPosition.x;
		var dy = point.y - this.lastPosition.y;
		
		if(this.isClicked() || !this.pointerDown) {
			this.resize(this.defWidth, this.defHeight);
		}
		else {
			this.resizeDelta(dx, dy);
		}

		this.state = C_STAT_NORMAL;
		this.setSelected(true);
		this.afterCreated();		
		this.postRedraw();
	}

	return false;
}

RShape.prototype.onPointerMoveCreating = function(point) {
	if(this.state === C_STAT_CREATING_0) {
		this.move(point.x, point.y);
		
		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;
		this.postRedraw();
		
		return true;
	}		
	else if(this.state === C_STAT_CREATING_1) {
		var w = point.x - this.view.pointerDownPosition.x;
		var h = point.y - this.view.pointerDownPosition.y;

		this.resize(w, h);
		
		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;
		this.postRedraw();
		
		return true;
	}

	return false;
}


RShape.prototype.onPointerDownNormal = function(point) {
	this.hitTestResult = this.hitTest(point);

	if(!this.hitTestResult) {
		return false;
	}
	
	this.pointerDown = true;
	this.setSelected(true);
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;
	this.handlePointerEvent(point, 1);

	return true;
}

RShape.prototype.onPointerMoveNormal = function(point) {
	if(this.hitTestResult) {
		this.handlePointerEvent(point, 0);
		return true;
	}

	return false;
}

RShape.prototype.onPointerUpNormal = function(point) {
	if(this.hitTestResult) {
		this.handlePointerEvent(point, -1);
		this.hitTestResult = C_HIT_TEST_NONE;

		return true;
	}

	return false;
}

RShape.prototype.fixSize = function() {
	if(this.w < this.MIN_SIZE) {
		this.w = this.MIN_SIZE;
	}

	if(this.h < this.MIN_SIZE) {
		this.h = this.MIN_SIZE;
	}

	if(this.wMin && this.w < this.wMin) {
		this.w = this.wMin;
	}
	
	if(this.wMax && this.w > this.wMax) {
		this.w = this.wMax;
	}
	
	if(this.hMax && this.h > this.hMax) {
		this.h = this.hMax;
	}
	
	if(this.hMin && this.h < this.hMin) {
		this.h = this.hMin;
	}

	if(this.whRadio) {
		if(this.whRadio > 1) {
			this.h = Math.floor(this.w / this.whRadio);
		}
		else {
			this.w = Math.floor(this.h * this.whRadio);
		}
	}
	
	if(this.parentShape) {	
		this.parentShape.fixChildSize(this);
	}

	return;
}

RShape.prototype.fixChildSize = function(child) {
	var maxW = this.w;
	var maxH = this.h;
	if((child.x + child.w) > maxW) {
		child.w = maxW - child.x;
	}

	if((child.y + child.h) > maxH) {
		child.h = maxH - child.y;
	}

	return;
}

RShape.prototype.setDefSize= function(w, h) {
	this.defWidth = w;
	this.defHeight = h;

	this.w = w;
	this.h = h;

	return;
}

RShape.prototype.setSizeLimit = function(wMin, hMin, wMax, hMax, whRadio) {
	this.wMin = wMin;
	this.wMax = wMax;
	this.hMin = hMin;
	this.hMax = hMax;
	this.whRadio = whRadio;

	return;
}

RShape.prototype.resizeDelta =function(dw, dh) {
	this.resize(this.w + dw, this.h + dh);

	return;
}

RShape.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;

	return;
}

RShape.prototype.setSize = function(w, h) {
	this.w = Math.floor(w);
	this.h = Math.floor(h);

	return;
}

RShape.prototype.resize = function(w, h) {
	if(this.w !== w || this.h !== h) {
		this.realResize(w, h);
	}

	return;
}

RShape.prototype.realResize=function(w, h) {
	w = Math.floor(w);
	h = Math.floor(h);

	if(this.w != w || this.h != h) {
		this.w = w;
		this.h = h;
		this.textNeedRelayout = true;

		if(!this.isIcon) {
			this.onSized();
			this.fixSize();
		}
	}

	return;
}

RShape.prototype.translate = function(canvas) {
	canvas.translate(this.x + this.w/2, this.y + this.h/2);
	if(this.rotate) {
		var rotate = Math.PI * (this.rotate/180);
		canvas.rotate(rotate);
	}

	if(this.scale && this.scale != 1) {
		canvas.scale(this.scale, this.scale);
	}

	canvas.translate(-this.w/2, -this.h/2);

	return;
}

RShape.prototype.isPointIn = function(canvas, point) {
	if(canvas) {
		canvas.beginPath();
		canvas.rect(0, 0, this.w, this.h);

		return canvas.isPointInPath(point.x, point.y);
	}
	else {
		return isPointInRect(point, this);
	}
}

RShape.prototype.getMoreSelectMark = function(type, point) {
	return false;
}

RShape.prototype.getNearPoint = function(i) {
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();
	var p = {x:0, y:0};

	switch(i) {
		case 0: {
			p.x = x;
			p.y = y;
			break;
		}
		case 1: {
			p.x = x + w/2;
			p.y = y;
			break;
		}
		case 2: {
			p.x = x + w;
			p.y = y;
			break;
		}
		case 3: {
			p.x = x + w;
			p.y = y + h/2;
			break;
		}
		case 4: {
			p.x = x + w;
			p.y = y + h;
			break;
		}
		case 5: {
			p.x = x + w/2;
			p.y = y + h;
			break;
		}
		case 6: {
			p.x = x;
			p.y = y + h;
			break;
		}
		case 7: {
			p.x = x;
			p.y = y + h/2;
			break;
		}
		case 8: {
			p.x = x + w/2;
			p.y = y + h/2;
			break;
		}
		default: {
			if(w > h) {
				switch(i) {
					case 9: {
						p.x = x + w/4;
						p.y = y;
						break;
					}
					case 10: {
						p.x = x + 3*w/4;
						p.y = y;
						break;
					}
					case 11: {
						p.x = x + w/4;
						p.y = y + h;
						break;
					}
					case 12: {
						p.x = x + 3*w/4;
						p.y = y + h;
						break;
					}
					default: {
						return null;
					}
				}
			}
			else {
				return null;
			}
		}
	}

	return p;
}

RShape.prototype.getSelectMarkMobile = function(type, point) {
	var ret = true;
	switch(type) {
		case C_HIT_TEST_TL: {
			point.x = 0;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BR: {
			point.x = this.w;
			point.y = this.h;
			break;
		}
		default: {
			ret = this.getMoreSelectMark(type, point);
		}
	}

	return ret;
}

RShape.prototype.getSelectMarkPC = function(type, point) {
	var ret = true;
	switch(type) {
		case C_HIT_TEST_TL: {
			point.x = 0;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TM: {
			point.x = this.w/2;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_ML: {
			point.x = 0;
			point.y = this.h/2;
			break;
		}
		case C_HIT_TEST_MR: {
			point.x = this.w;
			point.y = this.h/2;
			break;
		}
		case C_HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BM: {
			point.x = this.w/2;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BR: {
			point.x = this.w;
			point.y = this.h;
			break;
		}
		default: {
			ret = this.getMoreSelectMark(type, point);
		}
	}
	
	return ret;
}

RShape.prototype.getSelectMark = function(type, point) {
	if(isMobile()) {
		return this.getSelectMarkMobile(type, point);
	}
	else {
		return this.getSelectMarkPC(type, point);
	}
}


RShape.prototype.drawImage = function(canvas) {
	return;
}

RShape.prototype.paintShape = function(canvas) {
	canvas.rect(0, 0, this.w, this.h);		

	return;
}

RShape.prototype.setTextNeedRelayout = function(value) {
	this.textNeedRelayout = value;

	return;
}

RShape.prototype.layoutText = function(canvas) {
	if(!this.textNeedRelayout || this.textType === C_SHAPE_TEXT_NONE) {
		return;
	}

	canvas.font = this.style.getFont();
	var vMargin = this.vMargin ? this.vMargin : 10;
	
	var w = this.w - 2 * vMargin;
	if(w > 0) {
		this.lines = layoutText(canvas, this.style.fontSize, this.getLocaleText(this.text), w);
	}
	else {
		this.lines = [];
	}

	this.textNeedRelayout = false;

	return;
}

RShape.prototype.drawTextUnderLine = function(canvas, textX, textY, text) {
	var x = 0;
	var y = 0;
	var h = 0;
	var w = 0;
	if(!this.style.textU) {
		return;
	}
	
	w = canvas.measureText(text).width;
	if(this.textBaseline === "middle") {
		h = this.style.fontSize/2;
		if(this.textAlign === "center") {
			x = textX - w/2;
		}
		else if(this.textAlign === "left") {
			x = textX ;
		}
		else {
			x = textX - w;
		}
	}
	else if(this.textBaseline === "top") {
		h = this.style.fontSize;
		if(this.textAlign === "center") {
			x = textX - w/2;
		}
		else if(this.textAlign === "left") {
			x = textX ;
		}
		else {
			x = textX - w;
		}
	}
	else {
		if(this.textAlign === "center") {
			x = textX - w/2;
		}
		else if(this.textAlign === "left") {
			x = textX ;
		}
		else {
			x = textX - w;
		}
	}

	y = textY + h;

	canvas.moveTo(x, y);
	canvas.lineTo(x+ w, y);
	canvas.lineWidth = 1;
	canvas.stroke();

	return;
}

RShape.prototype.needDrawTextTips = function() {
	return true;
}

RShape.prototype.setInputTips = function(inputTips) {
	this.inputTips = inputTips;

	return;
}

RShape.prototype.getTextTipsPosition = function() {
	var pos = {};

	pos.x = this.getWidth() >> 1;
	pos.y = this.getHeight() >> 1;
	pos.textAlign = "center";
	pos.textBaseline = "middle";

	return pos;
}

RShape.prototype.drawTextTips = function(canvas) {
	if(this.text || this.isIcon || this.w < 120 || this.h < 20 || this.editing) {
		return;
	}

	var pos = this.getTextTipsPosition();

	var x = pos.x;
	var y = pos.y;

	canvas.textAlign = pos.textAlign;
	canvas.textBaseline = pos.textBaseline;

	canvas.font = this.style.getFont();
	canvas.fillStyle = "#E0E0E0";	
	if(this.inputTips) {
		canvas.fillText(this.getLocaleInputTips(this.inputTips), x, y, this.getWidth());
	}
	else {
		if(this.needDrawTextTips() && this.selected && !isMobile()) {
			canvas.fillText(dappGetText("double click to edit text."), x, y, this.getWidth());
		}
	}

	return;
}

RShape.prototype.getOneLineText = function(canvas, text) {
	var line = "";
	var w = this.getWidth(true);

	if(canvas.measureText(text).width <= w) {
		return text;
	}

	for(var i = 0; i < text.length; i++) {
		var str = text[i];
		w = w - canvas.measureText(str).width;
		if(w < 0) {
			break;
		}
	
		line = line + str;
	}

	return line;
}

RShape.prototype.setMargin = function(vMargin, hMargin) {
	this.vMargin = Math.floor(Math.min(vMargin, 0.5 * this.w));
	this.hMargin = Math.floor(Math.min(hMargin, 0.5 * this.h));

	return;
}

RShape.prototype.getVMargin = function() {
	return this.vMargin ? this.vMargin : 0;
}

RShape.prototype.getHMargin = function() {
	return this.hMargin ? this.hMargin : 0;
}

RShape.prototype.getWidth = function(withoutMargin) {
	if(withoutMargin) {
		return this.w - 2 * this.getHMargin();
	}
	else {
		return this.w;
	}
}

RShape.prototype.getHeight = function(withoutMargin) {
	if(withoutMargin) {
		return this.h - 2 * this.getVMargin();
	}
	else {
		return this.h;
	}
}

RShape.prototype.drawText = function(canvas) {
	this.defaultDrawText(canvas);

	return;
}

RShape.prototype.prepareStyle = function(canvas) {
	var style = this.style;
	canvas.lineWidth = style.lineWidth;			
	canvas.strokeStyle = style.lineColor;
	if(style.enableGradient) {
		canvas.fillStyle = style.getGradFillStyle(canvas, 0, 0, this.w, this.h);
	}
	else {
		canvas.fillStyle = style.fillColor;
	}

	if(style.enableShadow) {
		canvas.shadowColor   = style.shadow.color;
		canvas.shadowOffsetX = style.shadow.x;
		canvas.shadowOffsetY = style.shadow.y
		canvas.shadowBlur    = style.shadow.blur;
	}
	else {
		canvas.shadowOffsetX = 0;
		canvas.shadowOffsetY = 0;
		canvas.shadowBlur    = 0;
	}

	return;
}

RShape.prototype.resetStyle = function(canvas) {
	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur    = 0;
	canvas.fillStyle = "White";
	canvas.beginPath();

	return;
}

RShape.prototype.strokeFill = function(canvas) {
	if(this.style.enableShadow || isOldIE()) {
		if(canvas.lineWidth >= 1) {
			if(!this.isStrokeColorTransparent()) {
				canvas.stroke();	
			}
		}

		if(!this.isFillColorTransparent()) {
			canvas.fill();
		}
	}
	else {
		if(!this.isFillColorTransparent()) {
			canvas.fill();	
		}

		if(canvas.lineWidth >= 1) {
			if(!this.isStrokeColorTransparent()) {
				canvas.stroke();	
			}
		}
	}

	return;
}

RShape.prototype.drawSizeTips = function(canvas) {
	var text = Math.abs(this.w) + " x " + Math.abs(this.h);
	canvas.font = "14px serif";
	canvas.textAlign = "center";
	canvas.textBaseline = "bottom";
	canvas.fillStyle = this.style.textColor;
	
	canvas.beginPath();
	canvas.fillText(text, this.w/2, 0, this.w);
	canvas.fill();

	return;
}

RShape.prototype.drawSelectMarks = function(canvas) {
	canvas.save();
	canvas.beginPath();
	
	if(this.selected && !this.hideSelectMark) {
		var lineWidth = Math.floor(2/this.getRealScale());

		canvas.beginPath();
		canvas.rect(0, 0, this.w, this.h);		
		canvas.closePath();		
		
		canvas.lineWidth = lineWidth;			
		canvas.fillStyle = this.style.fillColor;
		canvas.strokeStyle = RShape.selectMarkColor;
		canvas.stroke();	
		
		canvas.beginPath();
		canvas.lineWidth = lineWidth;
		
		for(var type = C_HIT_TEST_NONE + 1; 
			type < C_HIT_TEST_MAX; type++) {
			if(this.getSelectMark(type, this.selectMarkPoint)) {
				this.createSelectedMark(canvas, this.selectMarkPoint.x, this.selectMarkPoint.y, type == this.hitTestResult);
			}
		}
		canvas.closePath();
		canvas.stroke();
	}

	canvas.restore();
	
	return;
}

RShape.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);
	
	canvas.save();
	canvas.beginPath();

	this.prepareStyle(canvas);
	this.paintShape(canvas);
	canvas.closePath();			
	this.strokeFill(canvas);

	canvas.restore();
	this.resetStyle(canvas);

	this.drawImage(canvas);

	if(this.drawText && this.textType !== C_SHAPE_TEXT_NONE) {
		this.drawText(canvas);
		this.drawTextTips(canvas);
	}

	if(this.hitTestResult !== C_HIT_TEST_NONE || this.state !== C_STAT_NORMAL) {
		this.drawSizeTips(canvas);
	}
		
	this.drawSelectMarks(canvas);
	canvas.restore();
	
	return;
}

RShape.prototype.hitTest = function(point) {
	var ret = C_HIT_TEST_NONE;
	var canvas = this.view.getCanvas2D();
	
	canvas.save();
	this.translate(canvas);	
	
	if(this.selected) {
		for(var type = C_HIT_TEST_NONE + 1; 
			type < C_HIT_TEST_MAX; type++) {
			var smp = this.selectMarkPoint;
			if(this.getSelectMark(type, smp)) {
				if(this.isInSelectedMark(canvas, 
					smp.x, smp.y, point)) {
					canvas.restore();
					return type;
				}				
			}
		}
		
		if(this.isPointIn(canvas, point)) {
			ret = C_HIT_TEST_MM;
		}
	}
	else if(this.isPointIn(canvas, point)) {
		ret = C_HIT_TEST_MM;
	}
	
	canvas.restore();

	return ret;
}

RShape.prototype.lockPosition = function(isPositionLocked) {
	this.userMovable = !isPositionLocked;
	this.isPositionLocked = isPositionLocked;

	return;
}

RShape.prototype.execMoveResize = function(x, y, w, h) {
	this.exec(new MoveResizeCommand(this, x, y, w, h));	

	return;
}

RShape.prototype.handlePointerEvent = function(point, type) {
	if(type === C_EVT_POINTER_DOWN) {
		this.saveDx = this.x;
		this.saveDy = this.y;
		this.saveWidth = this.w;
		this.saveHeight = this.h;
		
		return;
	}
	
	var dx = point.x - this.lastPosition.x;
	var dy = point.y - this.lastPosition.y;
	var tdx = dx;
	var tdy = dy;
	
	var new_dx = 0;
	var new_dy = 0;
	var new_w = this.w;
	var new_h = this.h;
	
	switch(this.hitTestResult) {
		case C_HIT_TEST_TL: {
			new_dx = tdx;
			new_dy = tdy;
			new_w = this.w - tdx;
			new_h = this.h - tdy;
			
			break;
		}
		case C_HIT_TEST_TM: {
			new_dy = tdy;
			new_h = this.h - tdy;			
			break;
		}			
		case C_HIT_TEST_TR: {
			new_dx = 0;
			new_dy = tdy;
			new_w = this.w + tdx;
			new_h = this.h - tdy;			
			break;
		}
		case C_HIT_TEST_ML: {
			new_dx = tdx;
			new_w = this.w - tdx;		
			break;
		}			
		case C_HIT_TEST_MR: {
			new_w = this.w  + tdx;				
			break;
		}				
		case C_HIT_TEST_BL: {
			new_dx = tdx;
			new_w = this.w - tdx;
			new_h = this.h + tdy;			
			break;
		}
		case C_HIT_TEST_BM: {
			new_h = this.h + tdy;			
			break;
		}			
		case C_HIT_TEST_BR: {
			new_w = this.w + tdx;
			new_h = this.h + tdy;			
			break;
		}			
		case C_HIT_TEST_MM: {		
			new_dx = tdx;
			new_dy = tdy;
			break;
		}
		default:break;
	}	
	
	if(type === C_EVT_POINTER_UP) {

		if(this.x !== this.saveDx || this.y !== this.saveDy) {
			var dx = this.x;
			var dy = this.y;
			this.x = this.saveDx;
			this.y = this.saveDy;
			
			if(this.isUserMovable()) {
				this.execMoveResize(dx, dy);
			}
		}
		
		if(this.w !== this.saveWidth || this.h !== this.saveHeight) {
			var w = this.w;
			var h = this.h;
			this.w = this.saveWidth;
			this.h = this.saveHeight;
	
			if(this.isUserResizable()) {
				this.execMoveResize(null, null, w, h);			
				this.onUserResized();
			}
		}
		this.hitTestResult = C_HIT_TEST_NONE;
	}
	else {
		if(new_dx || new_dy) {
			if(this.isUserMovable()) {
				this.setPosition(this.x + new_dx, this.y + new_dy);
			}

			this.onMoving();
		}
		
		if(this.w !== new_w || this.h !== new_h) {
			if(this.isUserResizable()) {
				this.setSize(new_w, new_h);
			}
		}
	}
	
	if(this.hitTestResult === C_HIT_TEST_HANDLE) {
		this.moveHandle(dx, dy);
	}
	
	this.postRedraw();
	
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;

	return true;
}

RShape.prototype.onKeyDown = function(code) {
	return;
}

RShape.prototype.onKeyUp = function(code) {
	return;
}		

RShape.prototype.toJsonMore = function(o) {
	return;
}

RShape.prototype.toJson = function() {
	var o = new Object();
	o.type = "";
	o.name = "";

	for(var key in this) {
		var value = this[key];
		var type = typeof value;

		if(key === "isRect" || key === "isContainer") {
			continue;
		}

		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			o[key] = value;
		}
	}
	
	delete o.mode;
	delete o.state;
	delete o.saveDx;
	delete o.saveDy;
	delete o.MIN_SIZE;
	delete o.selected;
	delete o.animating;
	delete o.pointerDown;
	delete o.saveWidth;
	delete o.saveHeight;
	delete o.hignlighted;
	delete o.textNeedRelayout;
	delete o.openPending;
	delete o.pointerDownTime;
	delete o.hitTestResult;
	delete o.pointerDownPosition;
	delete o.defWidth;
	delete o.defHeight;
	delete o.userMovable;
	delete o.userResizable;
	delete o.textX;
	delete o.textY;
	delete o.textAlign;
	delete o.textTitle;
	delete o.vAlign;
	delete o.hAlign;
	delete o.editing;
	delete o.textBaseline;

	if(o.enable) {
		delete o.enable;
	}
	
	if(o.visible) {
		delete o.visible;
	}

	if(!o.textType) {
		delete o.vTextAlign;
		delete o.hTextAlign;
	}
	delete o.textType;

	if(!o.vMargin) {
		delete o.vMargin;
	}
	
	if(!o.hMargin) {
		delete o.hMargin;
	}

	if(!o.rotation) {
		delete o.rotation;
	}

	if(o.opacity === 1) {
		delete o.opacity;
	}

	if(o.scale === 1) {
		delete o.scale;
	}

	delete o.needRelayout;
	delete o.rectSelectable;

	if(o.rotate == 0) {
		delete o.rotate;
	}

	if(!o.imageUrl) {
		delete o.imageUrl;
	}
	
	if(o.offset) {
		o.offset = 0;
	}

	o.x = Math.floor(this.x);
	o.y = Math.floor(this.y);
	o.w = Math.floor(this.w);
	o.h = Math.floor(this.h);
	
	o.style = this.style.toJson();
	delete o.style.arrowSize;
	delete o.style.lineStyle;
	delete o.style.firstArrowType;
	delete o.style.secondArrowType;

	if(this.handle) {
		o.handle = this.handle;
	}
	this.toJsonMore(o)

	return o;
}

RShape.prototype.fromJsonMore = function(js) {
	return;
}

RShape.prototype.onFromJsonDone = function() {
}

RShape.prototype.fromJson = function(js) {
	this.isUnpacking = true;

	for(var key in js) {
		var value = js[key];
		var type = typeof value;
		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			this[key] = value;
		}
	}

	if(this.vAlign) {
		this.vTextAlign = this.vAlign;
		delete this.vAlign;
	}

	if(this.hAlign) {
		this.hTextAlign = this.hAlign;
		delete this.hAlign;
	}

	if(js.vMargin === undefined) {
		this.vMargin = 0;
	}
	
	if(js.hMargin === undefined) {
		this.hMargin = 0;
	}
	
	if(js.rotation === undefined) {
		this.rotation = 0;
	}
	
	if(js.opacity === undefined) {
		this.opacity = 1;
	}
	
	if(js.scale === undefined) {
		this.scale = 1;
	}

	this.fromJsonMore(js);
	
	if(js.style) {
		this.style.fromJson(js.style);
	}

	if(js.handle) {
		this.handle = js.handle;
	}

	/*for comptable purpose*/
	if(js.dx != undefined) {
		this.x = js.dx;
	}
	if(js.dy != undefined) {
		this.y = js.dy;
	}

	this.setText(this.text);
	this.textNeedRelayout = true;
	this.state = C_STAT_NORMAL;
	delete this.isUnpacking;

	this.onFromJsonDone();

	return;
}

RShape.prototype.setImage = function(value) {
	if(value === this.imageUrl) {
		return;
	}

	this.imageUrl = value;
	this.image = new CanTkImage(value);
	
	return;
}


RShape.prototype.asIcon = function() {
	this.resize(36, 36);

	if(!this.isIcon) {
		this.setStyle(getIconShapeStyle());
	}

	this.isIcon = true;

	return;
}	

RShape.prototype.showProperty = function() {
	showGeneralPropertyDialog(this, this.textType, true, false);

	return;
}
	
RShape.prototype.getMoveDeltaX = function() {
	return this.view ? this.view.getMoveDeltaX() : 0; 
}

RShape.prototype.getMoveDeltaY = function() {
	return this.view ? this.view.getMoveDeltaY() : 0;
}

RShape.prototype.getMoveAbsDeltaX = function() {
	return this.view ? this.view.getMoveAbsDeltaX() : 0;
}

RShape.prototype.getMoveAbsDeltaY = function() {
	return this.view ? this.view.getMoveAbsDeltaY() : 0;
}

RShape.prototype.setRoundRadius = function(roundRadius) {
	this.roundRadius = roundRadius;

	return;
}


function RShapeInit(g, type) {
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;

	g.initRShape(x, y, w, h, type);
	g.setSize(40, 40);
	g.setText("");

	return g;
}


/*
 * File:  l_shape.js
 * Brief: Base class of all line shapes.
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function LShape() {
	return;
}

LShape.prototype = new Shape();

/*overwritable*/
/*******************************************************************/
LShape.prototype.initDefault = function() {
	return;
}

LShape.prototype.isLine = true;

LShape.prototype.resizeDelta =function(dw, dh) {
	return;
}

LShape.prototype.setOptions = function(firstArrowUnchangable, secondArrowUnchangable, lineStyleUnchangable, arrowSizeUnchangable) {
	this.firstArrowUnchangable = firstArrowUnchangable;
	this.secondArrowUnchangable = secondArrowUnchangable;
	this.lineStyleUnchangable = lineStyleUnchangable;
	this.arrowSizeUnchangable = arrowSizeUnchangable;

	return;
}

LShape.prototype.setStyle = function(style) {
	var firstArrowType = this.style.firstArrowType;
	var secondArrowType = this.style.secondArrowType;
	var lineStyle = this.style.lineStyle;
	var arrowSize = this.style.arrowSize;

	this.style.copy(style);
	this.needRelayout = true;

	if(this.firstArrowUnchangable) {
		this.style.setFirstArrowType(firstArrowType);
	}

	if(this.secondArrowUnchangable) {
		this.style.setSecondArrowType(secondArrowType);
	}

	if(this.lineStyleUnchangable) {
		this.style.setLineStyle(lineStyle);
	}

	if(this.arrowSizeUnchangable) {
		this.style.setArrowSize(arrowSize);
	}

	return;
}

LShape.prototype.getWidth = function() {
	var min = this.points[0].x;
	var max = this.points[0].x;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(min > p.x) {
			min = p.x;
		}

		if(max < p.x) {
			max = p.x;
		}
	}

	return max - min;
}

LShape.prototype.getHeight = function() {
	var min = this.points[0].y;
	var max = this.points[0].y;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(min > p.y) {
			min = p.y;
		}

		if(max < p.y) {
			max = p.y;
		}
	}

	return max - min;
}

LShape.prototype.getX = function() {
	var x = this.points[0].x;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(x > p.x) {
			x = p.x;
		}
	}

	return x;
}

LShape.prototype.getY = function() {
	var y = this.points[0].y;

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(y > p.y) {
			y = p.y;
		}
	}

	return y;
}

LShape.prototype.updatePoint = function(index, point) {
	return false;
}

LShape.prototype.isPointIn = function(canvas, point) {
	return false;
}

LShape.prototype.getPoint = function(index) {
	return index < this.points.length ? this.points[index] : null;
}

/*******************************************************************/

LShape.prototype.saveState = function() {
	if(!this.savePoints) {
		this.savePoints = new Array();
	}

	this.savePoints.copy(this.points);

	return;
}

LShape.prototype.findNear = function(point) {
	this.near = null;
	if(this.view) {
		var range = this.getNearRange();
		var range2 = range + range;
		var rect = {x:point.x-range, y:point.y-range, w:range2, h:range2};
		this.near = this.view.findNear(this, rect);
	}

	return this.near;
}

LShape.prototype.getNearPoint = function(i) {
	if(i < this.points.length) {
		return this.points[i];
	}

	return null;
}

LShape.prototype.initLShape = function(points, type) {
	this.points = new Array();
	this.savePoints = new Array();
	this.initDefault();
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();

	this.initShape(x, y, w, h, type);

	if(points) {
		this.points.copy(points);
		this.state = C_STAT_NORMAL;
	}
	else {
		this.state = C_STAT_CREATING_0;
	}

	this.style.setLineWidth(2);

	return;
}
		
LShape.prototype.onPointerDown = function(point) {
	this.pointerDown = true;
	this.lastPosition.copy(point);

	if(this.state === C_STAT_NORMAL) {
		this.hitTestResult = this.hitTest(point);
	}
		
	this.setSelected(this.hitTestResult);
	this.handlePointerEvent(point, C_EVT_POINTER_DOWN);	
	this.postRedraw();
	this.saveState();
	
	return this.hitTestResult;
}

LShape.prototype.move = function(x, y) {
	var dx = x - this.getX();
	var dy = y - this.getY();
	this.moveDelta(dx, dy);

	return;
}

LShape.prototype.moveDelta=function(dx, dy) {
	for(var i in this.points) {
		this.points[i].x += dx;
		this.points[i].y += dy;
	}
	
	return;
}

LShape.prototype.isPointInSegment = function(canvas, first, second, point) {
	if(!first || !second) {
		return;
	}

	var ret = false;
	var margin = 10;
	var dx = second.x - first.x;
	var dy = second.y - first.y;
	var length = Math.sqrt(dx*dx + dy*dy);	
	var angle = Math.atan(dy/dx);
	
	canvas.save();
	canvas.translate((first.x + second.x)/2, (first.y + second.y)/2);
	canvas.rotate(angle);
	canvas.beginPath();
	canvas.rect(-length/2, -margin, length, 2 * margin);
	canvas.restore();

	ret = canvas.isPointInPath(point.x, point.y);
	canvas.beginPath();

	return ret;
}

LShape.prototype.onPointerMove = function(point) {
	var ret = true;

	if(this.state === C_STAT_NORMAL) {
		if(this.hitTestResult) {
			if(this.hitTestResult === C_HIT_TEST_MM) {
				var dx = point.x - this.lastPosition.x;
				var dy = point.y - this.lastPosition.y;

				this.moveDelta(dx, dy);
			}
			else {
				this.findNear(point);
				this.updatePoint(this.hitTestResult - 1, point);
			}
			this.postRedraw();
		}
	}
	else {
		this.findNear(point);
	}
	this.handlePointerEvent(point, C_EVT_POINTER_MOVE);
	this.lastPosition.copy(point);
	
	this.onMoved();

	return this.hitTestResult;
}

LShape.prototype.clearAttachedNearPoints = function() {
	this.observers = [];

	return;
}

LShape.prototype.updateNearPoints = function() {

	for(var i = 0; i < this.points.length; i++) {
		var near = this.findNear(this.points[i]);
		this.attachToNearPoint(near, i);
		this.near = null;
	}

	return;
}

LShape.prototype.attachToNearPoint = function(near, pointIndex) {
	if(!this.observers) {
		this.observers = [];
	}

	for(var i = this.observers.length; i < (pointIndex+1); i++) {
		this.observers.push(null);
	}

	if(!near) {
		this.observers[pointIndex] = null;

		return;
	}

	var line = this;
	var observer = {};
	var nearShape = near.shape;

	observer.line = this;
	observer.object = near.shape;
	observer.pointIndex = pointIndex;
	observer.observerPointIndex = near.nearPointIndex;

	this.points[pointIndex].copy(near.point);

	observer.update = function(shape) {
		if(this.object != shape) {
			return false;
		}
		
		if(!this.line.view) {
			return false;
		}

		if(this.line.selected && this.line.view.isPointerDown()) {
			return true;
		}

		var observers = this.line.observers;
		for(var i = 0; i < observers.length; i++) {
			var iter = observers[i];
			if(!iter) {
				continue;
			}

			if(iter.object === shape) {
				var point = shape.getNearPoint(this.observerPointIndex);
				this.line.updatePoint(this.pointIndex, point); 
			
				return true;
			}
		}

		return false;
	}

	this.observers[pointIndex] = null;

	this.observers[pointIndex] = observer;
	nearShape.registerChangedListener(observer);

	return;
}

LShape.prototype.onPointerUp = function(point) {
	var state = this.state;

	this.handlePointerEvent(point, C_EVT_POINTER_UP);
	this.lastPosition.copy(point);
	this.postRedraw();
	this.pointerDown = false;

	if(this.hitTestResult > 0) {
		var pointIndex = this.hitTestResult - 1;	
		this.attachToNearPoint(this.near, pointIndex);
		
		if(this.near) {
			this.updatePoint(pointIndex, this.near.point);
		}
	}
	else if(!this.isClicked() && state === C_STAT_NORMAL) {
		this.clearAttachedNearPoints();
	}

	this.hitTestResult = C_HIT_TEST_NONE;
	this.exec(new LineMoveCommand(this, this.savePoints, !this.near));
	this.near = null;

	if(!this.isClicked()) {
		this.onMoved();
	}

	return this.hitTestResult;
}

LShape.prototype.resize = function(w, h) {
	return;
}

LShape.prototype.translate = function(canvas) {
	canvas.translate(this.x, this.y);

	return;
}

LShape.prototype.drawSelectMarks = function(canvas) {
	if(this.selected) {
		canvas.beginPath();
		canvas.lineWidth = 1;
		canvas.shadowBlur = 0;
		canvas.strokeStyle = this.style.lineColor;

		for(var i = 0; i < this.points.length; i++) {
			var p = this.points[i];
			var hited = (i === (this.hitTestResult -1));
			this.createSelectedMark(canvas, p.x, p.y, hited);
		}
		canvas.stroke();
		canvas.beginPath();
	}

	return;
}

LShape.prototype.drawTips = function(canvas) {
	if((this.selected && this.pointerDown)) {
		canvas.fillStyle = this.style.lineColor;
		for(var i = 0; i < this.points.length; i++) {
			var p =  this.points[i];
			var text = Math.floor(p.x) + "x" + Math.floor(p.y);
			canvas.font = "14px serif";
			canvas.textAlign = "center";
			canvas.textBaseline = "bottom";
			canvas.fillText(text, p.x, p.y, 100);
		}
	}

	return;
}

LShape.prototype.hitTest = function(point) {
	var ret = C_HIT_TEST_NONE;
	var canvas = this.view.getCanvas2D();
	
	canvas.save();
	this.translate(canvas);	
	
	for(var i = 0; i < this.points.length; i++) {
		var smp = this.points[i];
		if(this.isInSelectedMark(canvas, smp.x, smp.y, point)) {
			canvas.restore();

			return this.selected ? (i + 1) : C_HIT_TEST_MM;
		}				
	}
	
	if(this.isPointIn(canvas, point)) {
		ret = C_HIT_TEST_MM;
	}
	
	canvas.restore();

	return ret;
}

LShape.prototype.onKeyDown = function(code) {
	return;
}

LShape.prototype.onKeyUp = function(code) {
	return;
}		

LShape.prototype.pointsToJson = function() {
	var points = "";

	for(var i = 0; i < this.points.length; i++) {
		var p = this.points[i];
		if(i > 0) {
			points += ",";
		}
		points += "{x:" + p.x + ",y:" + p.y + "}";
	}

	return points;
}

LShape.prototype.toJson = function() {
	
	var o = new Object();

	o.type = this.type;
	o.points = this.points;
	o.text = this.text;
	o.style = this.style.toJson();

	return o;
}

LShape.prototype.pointsFromJson = function(js) {
	for(var i = 0; i < js.points.length; i++) {
		var p = js.points[i];
		this.points.push(new Point(p.x, p.y));
	}

	return;
}

LShape.prototype.fromJson = function(js) {

	this.points.clear();
	this.text = js.text;
	this.style.fromJson(js.style);
	this.pointsFromJson(js);	
	
	this.state = C_STAT_NORMAL;
	
	return;
}
	
LShape.prototype.drawText = function(canvas) {
	var text = this.getLocaleText(this.text);
	if(text) {
		var x = (this.points[0].x + this.points[1].x)/2;
		var y = (this.points[0].y + this.points[1].y)/2;
		canvas.beginPath();
		canvas.textAlign = "center";
		canvas.textBaseline = "bottom";
		var font = this.style.getFont();
		canvas.font = font;
		canvas.fillStyle = this.style.textColor;	
		canvas.fillText(text, x, y);
			
		canvas.fill();			
	}

	return;
}

LShape.prototype.prepareStyle = function(canvas) {
	var style = this.style;
	canvas.lineWidth = style.lineWidth;			
	canvas.strokeStyle = style.lineColor;
	canvas.fillStyle = style.fillColor;
	
	if(style.enableGradient) {
		canvas.strokeStyle = style.getStrokeStyle(canvas);
	}
	else {
		canvas.strokeStyle = style.lineColor;
	}

	if(style.enableShadow) {
		canvas.shadowColor   = style.shadow.color;
		canvas.shadowOffsetX = style.shadow.x;
		canvas.shadowOffsetY = style.shadow.y
		canvas.shadowBlur    = style.shadow.blur;
	}

	return;
}

LShape.prototype.resetStyle = function(canvas) {
	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur    = 0;
	canvas.strokeStyle = this.style.lineColor;
	canvas.beginPath();

	return;
}

LShape.prototype.showProperty = function() {
	showLinePropertyDialog(this, this.textType);

	return;
}

LShape.prototype.asIcon = function() {
	this.isIcon = true;
	this.setStyle(getIconShapeStyle());

	return;
}	

/*
 * File: basics.js
 * Brief: Basic diagram shapes.
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

/////////////////////////////}Shape Extension{/////////////////////////////////////////

Shape.prototype.setDefaultStyle = function() {
	this.style = new ShapeStyle();
	this.setStyle(DefaultShapeStyleGet());

	if(this.isLine) {
		this.style.setShadow(true, {x: 0, y: 0, blur: 8, color:"#D0D0D0"});
	}

	return;
}

RShape.prototype.onSized = function() {
	var shape = this;
	setTimeout(function() {
		shape.notifyChanged();
	}, 10);

	return;
}

Shape.prototype.onMoving = function() {
	var shape = this;
	setTimeout(function() {
		shape.notifyChanged();
	}, 10);

	return;
}

Shape.prototype.notifyChanged = function() {
	if(!this.changedListeners) {
		return;
	}

	for(var i = 0; i < this.changedListeners.length; i++) {
		var lisener = this.changedListeners[i];
		if(lisener) {
			if(!lisener.update(this)) {
				this.changedListeners[i] = null;
			}
		}
	}

	this.postRedraw();

	return;
}

Shape.prototype.removeChangedListener = function(listener) {
	if(this.changedListeners) {
		this.changedListeners.remove(listener);
	}

	return;
}

Shape.prototype.registerChangedListener = function(listener) {
	if(!listener) {
		return;
	}

	if(!this.changedListeners) {
		this.changedListeners = [];
	}

	this.changedListeners.remove(null);
	this.changedListeners.remove(listener);
	this.changedListeners.push(listener);

	return;
}

/////////////////////////////}RectShape{/////////////////////////////////////////

function RectShape() {
	return;
}

RectShape.prototype = new RShape();

RectShape.prototype.initRectShape = function(type, w, h) {
	RShapeInit(this, type);
	
	this.setDefSize(w, h);
	this.setMargin(10, 10);

	return this;
}

function RectShapeCreator() {
	var args = ["rect", "", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		
		g.initRectShape(this.type, 200, 60);
		g.setTextType(C_SHAPE_TEXT_TEXTAREA);

		return g;
	}
	
	return;
}

/////////////////////////////}CircleShape{/////////////////////////////////////////

function CircleShapeCreator(type, w, h) {
	type = type ? type : "circle";
	var args = [type, "Circle", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new CircleShape();

		return g.initRectShape(this.type, w ? w : 100, h ? h : 100);
	}
	
	return;
}

function CircleShape() {
	return;
}
	
CircleShape.prototype = new RectShape();

CircleShape.prototype.getNearPoint = function(i) {
	var x = this.getX();
	var y = this.getY();
	var w = this.getWidth();
	var h = this.getHeight();
	var p = {x:0, y:0};

	switch(i) {
		case 0: {
			p.x = x + w/2;
			p.y = y;
			break;
		}
		case 1: {
			p.x = x + w;
			p.y = y + h/2;
			break;
		}
		case 2: {
			p.x = x + w/2;
			p.y = y + h;
			break;
		}
		case 3: {
			p.x = x;
			p.y = y + h/2;
			break;
		}
		case 4: {
			p.x = x + w/2;
			p.y = y + h/2;
			break;
		}
		default: {
			return null;
		}
	}

	return p;
}

CircleShape.prototype.paintShape= function(canvas) {
	var x = this.w/2;
	var y = this.h/2;
	var scale = this.h/this.w;
	
	canvas.translate(x, y);
	canvas.scale(1, scale);
	canvas.arc(0, 0, this.w/2, 0, 2*Math.PI);		
	
	return;
}

/////////////////////////////}ImageRectShape{/////////////////////////////////////////

function ImageRectShapeCreator() {
	var args = ["image", "Image", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new ImageRectShape();

		return g.initRectShape(this.type, 200, 200);
	}
	
	return;
}

function ImageRectShape() {
	return;
}

ImageRectShape.prototype = new RectShape();

ImageRectShape.prototype.showProperty = function() {
	showGeneralPropertyDialog(this, this.textType, true, true);

	return;
}

ImageRectShape.prototype.drawImage = function(canvas) {
	if(!this.image) {
		this.setImage(dappGetImageURL("earth.jpg"));
		return;
	}

	var image = this.image.getImage();
	
	if(!image) {
		return;
	}
	
	var imageW = image.width;
	var imageH = image.height;

	if(imageW <= 0 || imageH <= 0) {
		return;
	}
	

	var dx = (this.w - imageW)/2;
	var dy = (this.h - imageH)/2;
	canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);

	return;
}

ImageRectShape.prototype.paintShape = function(canvas) {
	canvas.rect(0, 0, this.w, this.h);		

	return;
}	

ImageRectShape.prototype.asIcon = function(canvas) {
	this.isIcon = true;
	this.resize(36, 36);
	this.setStyle(getIconShapeStyle());

	this.setImage("editor/images/image.png");

	return;
}

/////////////////////////////}CubeShapeCreator{/////////////////////////////////////////

function CubeShapeCreator() {
	var args = ["cube", "Cube", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new CubeShape();
		return g.initRectShape(this.type, 200, 200);
	}
	
	return;
}

function CubeShape() {
	return;
}

CubeShape.prototype = new RectShape();

CubeShape.prototype.paintShape = function(canvas) {
	var r = this.R;

	var vv = 0.25 * this.h;
	var hv = 0.25 * this.w;

	canvas.beginPath();
	canvas.rect(0, vv, this.w - hv, this.h - vv);
	canvas.stroke();
	canvas.fill();

	canvas.beginPath();
	canvas.moveTo(0, vv);
	canvas.lineTo(hv, 0);
	canvas.lineTo(this.w, 0);
	canvas.lineTo(this.w - hv, vv);
	canvas.lineTo(0, vv);
	canvas.stroke();
	canvas.fill();

	canvas.beginPath();
	canvas.moveTo(this.w - hv, vv);
	canvas.lineTo(this.w - hv, this.h);
	canvas.lineTo(this.w, this.h - vv);
	canvas.lineTo(this.w, 0);

	return;
}	

/////////////////////////////}CylinderShape{/////////////////////////////////////////

function CylinderShapeCreator() {
	var args = ["cylinder", "Cylinder", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new CylinderShape();

		return g.initRectShape(this.type, 200, 200);
	}
	
	return;
}

function CylinderShape() {
	return;
}

CylinderShape.prototype = new RectShape();
CylinderShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;

CylinderShape.prototype.paintShape = function(canvas) {
	var r = this.R;

	var h = 0.5 * this.h;
	
	var x = this.w/2;
	var y = h/2;
	var scale = h/this.w;
	
	canvas.save();
	canvas.translate(x, y);
	canvas.scale(1, scale);
	canvas.arc(0, 0, this.w/2, 0, 2 * Math.PI);		
	canvas.restore();
	canvas.stroke();
	canvas.fill();
	canvas.beginPath();

	canvas.save();
	canvas.translate(x, y);
	canvas.scale(1, scale);
	canvas.arc(0, 0, this.w/2, 0, Math.PI);		
	canvas.restore();

	canvas.moveTo(0, h/2);
	canvas.lineTo(0, this.h - h/2);
	canvas.save();
	y = this.h - h/2;
	canvas.translate(x, y);
	canvas.scale(1, scale);
	canvas.arc(0, 0, this.w/2, 0, Math.PI);		
	canvas.restore();
	canvas.moveTo(this.w, h/2);
	canvas.lineTo(this.w, this.h - h/2);
	canvas.stroke();
	canvas.fill();
	canvas.beginPath();

	return;
}	

/////////////////////////////}FourArrowShape{/////////////////////////////////////////

function FourArrowShapeCreator(type, feature) {
	var icon_x = 100;
	var icon_y = 80;

	switch(feature) {
		case C_SHAPE_THREE_LEFT_ARROW: {
			icon_x = 0;
			icon_y = 120;
			break;
		}
		case C_SHAPE_THREE_RIGHT_ARROW: {
			icon_x = 80;
			icon_y = 80;
			break;
		}
		case C_SHAPE_THREE_DOWN_ARROW: {
			icon_x = 20;
			icon_y = 120;
			break;
		}
		case C_SHAPE_THREE_UP_ARROW: {
			icon_x = 40;
			icon_y = 120;
			break;
		}
		default:break;
	}

	this.feature= feature;
	var args = [type, "Four arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var has_up = 1;
		var has_right = 1;
		var has_down = 1;
		var has_left = 1;
	
		switch(this.feature) {
			case C_SHAPE_THREE_LEFT_ARROW: {
				has_right = 0;
				break;
			}
			case C_SHAPE_THREE_RIGHT_ARROW: {
				has_left = 0;
				break;
			}
			case C_SHAPE_THREE_DOWN_ARROW: {
				has_up = 0;
				break;
			}
			case C_SHAPE_THREE_UP_ARROW: {
				has_down = 0;
				break;
			}
			default:break;
		}

		var g = new FourArrowShape();
		
		g.initRectShape(this.type, 200, 200);
		g.setAttr(has_up, has_right, has_down, has_left);

		return g;
	}
	
	return;
}

var C_SHAPE_FOUR_ARROW = 50;
var C_SHAPE_THREE_LEFT_ARROW = 60;
var C_SHAPE_THREE_RIGHT_ARROW = 70;
var C_SHAPE_THREE_DOWN_ARROW = 80;
var C_SHAPE_THREE_UP_ARROW = 90;

function FourArrowShape() {
	return;
}

FourArrowShape.prototype = new RectShape();

FourArrowShape.prototype.setAttr= function(has_up, has_right, has_down, has_left) {
	this.has_left = has_left;
	this.has_right = has_right;
	this.has_up = has_up;
	this.has_down = has_down;

	return;
}

FourArrowShape.prototype.paintShape = function(canvas) {
	var s = Math.min(this.w/4, this.h/4);
	
	if(s > 30) s = 30;

	if(this.has_up) {
		canvas.moveTo(this.w/2 - 0.5 * s, (this.h/2) - 0.5 * s);
		canvas.lineTo(this.w/2 - 0.5 * s, s);
		canvas.lineTo(this.w/2 - 1.5 * s, s);
		canvas.lineTo(this.w/2, 0);
		canvas.lineTo(this.w/2 + 1.5 * s, s);
		canvas.lineTo(this.w/2 + 0.5 * s, s);
	}

	if(this.has_right) {
		canvas.lineTo(this.w/2 + 0.5 * s, (this.h - s)/2);
		canvas.lineTo(this.w - s, (this.h - s)/2);
		canvas.lineTo(this.w - s, (this.h - s)/2 - s);
		canvas.lineTo(this.w, (this.h/2));
		canvas.lineTo(this.w - s, (this.h/2) + 1.5 * s);
		canvas.lineTo(this.w - s, (this.h/2) + 0.5 * s);
		canvas.lineTo(this.w/2 + 0.5 * s, (this.h/2) + 0.5 * s);
	}

	if(this.has_down) {
		canvas.lineTo(this.w/2 + 0.5 * s, this.h - s);
		canvas.lineTo(this.w/2 + 1.5 * s, this.h - s);
		canvas.lineTo(this.w/2, this.h);
		canvas.lineTo(this.w/2 - 1.5 * s, this.h - s);
		canvas.lineTo(this.w/2 - 0.5 * s, this.h - s);
		canvas.lineTo(this.w/2 - 0.5 * s, (this.h/2) + 0.5 * s);
	}

	if(this.has_left) {
		canvas.lineTo(s, (this.h/2) + 0.5 * s);
		canvas.lineTo(s, (this.h/2) + 1.5 * s);
		canvas.lineTo(0, (this.h/2));
		canvas.lineTo(s, (this.h/2) - 1.5 * s);
		canvas.lineTo(s, (this.h/2) - 0.5 * s);
	}

	return;
}	

FourArrowShape.prototype.asIcon = function(canvas) {
	this.isIcon = true;
	this.resize(36, 36);
	this.setStyle(getIconShapeStyle());
	
	if(!this.has_up || !this.has_down) {
		this.resize(20, 36);
	}

	if(!this.has_left || !this.has_right) {
		this.resize(20, 36);
	}

	return;
}	

/////////////////////////////}LeftArrowShape{/////////////////////////////////////////

function LeftArrowShapeCreator() {
	var args = ["left-arrow", "Left Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		g.initRectShape(this.type, 200, 60);
		g.paintShape= function(canvas) {
			var sw = this.w / 4;
			var sh = this.h / 2;

			canvas.beginPath();
			canvas.moveTo(sw, 0.5*sh);
			canvas.lineTo(sw, 0);
			canvas.lineTo(0, sh);
			canvas.lineTo(sw, 2 * sh);
			canvas.lineTo(sw, 1.5 * sh);
			canvas.lineTo(this.w, 1.5 * sh);
			canvas.lineTo(this.w, 0.5 * sh);
			canvas.lineTo(sw, 0.5 * sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}RightArrowShape{/////////////////////////////////////////

function RightArrowShapeCreator() {
	var args = ["right-arrow", "Right Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape()
		g.initRectShape(this.type, 200, 60);
		g.paintShape= function(canvas) {
			var sw = this.w / 4;
			var sh = this.h / 2;
			
			canvas.beginPath();
			canvas.moveTo(0, 0.5*sh);
			canvas.lineTo(this.w-sw, 0.5*sh);
			canvas.lineTo(this.w-sw, 0);
			canvas.lineTo(this.w, this.h/2);
			canvas.lineTo(this.w-sw, this.h);
			canvas.lineTo(this.w-sw, this.h - 0.5 *sh);
			canvas.lineTo(0, 1.5 * sh);
			canvas.lineTo(0, 0.5*sh);
			canvas.lineTo(this.w-sw, 0.5*sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}UpArrowShape{/////////////////////////////////////////

function UpArrowShapeCreator() {
	var args = ["up-arrow", "Up Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		g.initRectShape(this.type, 60, 200);
		g.oldDrawText = g.drawText;
		g.drawText = function(canvas) {
			canvas.save();
			canvas.translate(this.w/2, this.h/2);
			canvas.rotate(Math.PI * 1.5);
			canvas.translate(-this.w/2, -this.h/2);

			this.oldDrawText(canvas);
			canvas.restore();

			return;
		}
		g.paintShape= function(canvas) {
			var sh = this.h / 4;
			var sw = this.w / 2;
			
			canvas.beginPath();
			canvas.moveTo(0.5 * sw, sh);
			canvas.lineTo(0, sh);
			canvas.lineTo(sw, 0);
			canvas.lineTo(this.w, sh);
			canvas.lineTo(this.w-0.5 * sw, sh);
			canvas.lineTo(this.w-0.5 * sw, this.h);
			canvas.lineTo(0.5 * sw, this.h);
			canvas.lineTo(0.5 * sw, sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}DownArrowShape{/////////////////////////////////////////

function DownArrowShapeCreator() {
	var args = ["down-arrow", "Down Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		g.initRectShape(this.type, 60, 200);
		g.oldDrawText = g.drawText;
		g.drawText = function(canvas) {
			canvas.save();
			canvas.translate(this.w/2, this.h/2);
			canvas.rotate(Math.PI * 0.5);
			canvas.translate(-this.w/2, -this.h/2);

			this.oldDrawText(canvas);
			canvas.restore();

			return;
		}
		g.paintShape= function(canvas) {
			var sh = this.h / 4;
			var sw = this.w / 2;
			
			canvas.beginPath();
			canvas.moveTo(this.w - 0.5 * sw, this.h - sh);
			canvas.lineTo(this.w, this.h - sh);
			canvas.lineTo(sw, this.h);
			canvas.lineTo(0, this.h - sh);
			canvas.lineTo(0.5 * sw, this.h - sh);
			canvas.lineTo(0.5 * sw, 0);
			canvas.lineTo(this.w - 0.5 * sw, 0);
			canvas.lineTo(this.w - 0.5 * sw, this.h - sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}HorArrowShape{/////////////////////////////////////////

function HorArrowShapeCreator() {
	var args = ["hor-arrow", "Hor Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		
		g.initRectShape(this.type, 200, 60);
		g.paintShape= function(canvas) {
			var sw = this.w / 4;
			var sh = this.h / 2;

			canvas.beginPath();
			canvas.moveTo(sw, 0.5*sh);
			canvas.lineTo(sw, 0);
			canvas.lineTo(0, sh);
			canvas.lineTo(sw, 2 * sh);
			canvas.lineTo(sw, 1.5 * sh);

			canvas.lineTo(this.w-sw, 1.5 * sh);
			canvas.lineTo(this.w-sw, 2 * sh);
			canvas.lineTo(this.w, sh);
			canvas.lineTo(this.w-sw, 0);
			canvas.lineTo(this.w-sw, 0.5 * sh);
			canvas.lineTo(sw, 0.5 * sh);
			
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}VerArrowShape{/////////////////////////////////////////

function VerArrowShapeCreator() {
	var args = ["ver-arrow", "Ver Arrow", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RectShape();
		g.initRectShape(this.type, 60, 200);

		g.oldDrawText = g.drawText;
		g.drawText = function(canvas) {
			canvas.save();
			canvas.translate(this.w/2, this.h/2);
			canvas.rotate(Math.PI * 1.5);
			canvas.translate(-this.w/2, -this.h/2);

			this.oldDrawText(canvas);
			canvas.restore();

			return;
		}

		g.paintShape= function(canvas) {
			var sh = this.h / 4;
			var sw = this.w / 2;
			
			canvas.beginPath();
			canvas.moveTo(0.5 * sw, sh);
			canvas.lineTo(0, sh);
			canvas.lineTo(sw, 0);
			canvas.lineTo(this.w, sh);
			canvas.lineTo(this.w-0.5 * sw, sh);
			canvas.lineTo(this.w-0.5 * sw, this.h-sh);

			canvas.lineTo(this.w, this.h-sh);
			canvas.lineTo(sw, this.h);
			canvas.lineTo(0, this.h-sh);
			canvas.lineTo(0.5 * sw, this.h-sh);
			canvas.lineTo(0.5 * sw, sh);
			this.strokeFill(canvas);
			canvas.beginPath();
		}
		
		return g;
	}
	
	return;
}

/////////////////////////////}TriRectShape{/////////////////////////////////////////

function TriRectShapeCreator() {
	var args = ["tri-rect", "Tri Rect", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new TriRectShape();

		return g.initRectShape(this.type, 200, 60);
	}
	
	return;
}

function TriRectShape() {
	return;
}

	
TriRectShape.prototype = new RectShape();

TriRectShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;
TriRectShape.prototype.paintShape = function(canvas) {
	var hf = this.h/2;
	var wf = this.w/2;
	
	if(wf > hf) wf = hf;

	canvas.moveTo(0, hf);
	canvas.lineTo(wf, 0);
	canvas.lineTo(this.w - wf, 0);
	canvas.lineTo(this.w, hf);
	canvas.lineTo(this.w - wf, this.h);
	canvas.lineTo(wf, this.h);
	canvas.lineTo(0, hf);
	
	return;
}	

TriRectShape.prototype.asIcon = function() {
	this.isIcon = true;
	this.resize(44, 30);
	this.setStyle(getIconShapeStyle());
	
	return;
}

/////////////////////////////}RoundRectShape{/////////////////////////////////////////

function RoundRectShapeCreator(type) {
	type = type ? type : "rounded-rect";
	var args = [type, "Rounded Rect", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new RoundRectShape();

		g.initRectShape(this.type, 200, 60);
		g.setTextType(C_SHAPE_TEXT_TEXTAREA);

		return g;
	}
	
	return;
}

function RoundRectShape() {
	this.R = 10;

	return;
}

RoundRectShape.prototype = new RectShape();
RoundRectShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;

RoundRectShape.prototype.paintShape= function(canvas) {
	var r = this.R;
	
	if(r > this.w/2) r = Math.round(this.w/2);
	if(r > this.h/2) r = Math.round(this.h/2);
	
	if(this.isIcon) {
		r = 5;
	}

	canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
	canvas.lineTo(this.w - r, 0);
	
	canvas.arc(this.w-r, r, r, 1.5*Math.PI, 2*Math.PI,  false);
	canvas.lineTo(this.w, this.h-r);
	
	canvas.arc(this.w-r, this.h-r, r, 0, 0.5*Math.PI, false);
	canvas.lineTo(r, this.h);
	
	canvas.arc(r, this.h-r, r, 0.5 * Math.PI, Math.PI, false);
	canvas.lineTo(0, r);
	
	return;
}	

RoundRectShape.prototype.asIcon = function() {
	this.isIcon = true;
	this.resize(36, 30);
	this.setStyle(getIconShapeStyle());
	
	return;
}

/////////////////////////////}ParallRectShape{/////////////////////////////////////////

function ParallRectShapeCreator(type, w, h) {
	type = type ? type : "parall-rect";
	var args = [type, "Parall Rect", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new ParallRectShape();
		return g.initRectShape(this.type, w ? w : 200, h ? h : 60);
	}
	
	return;
}

function ParallRectShape() {
	return;
}

ParallRectShape.prototype = new RectShape();

ParallRectShape.prototype.getSelectMark = function(type, point) {
	var ret = true;
	switch(type) {
		case C_HIT_TEST_TL: {
			point.x = this.h;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TM: {
			point.x = (this.w)/2;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_ML: {
			point.x = this.h/2;
			point.y = this.h/2;
			break;
		}
		case C_HIT_TEST_MR: {
			point.x = this.w-this.h/2;
			point.y = this.h/2;
			break;
		}
		case C_HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BM: {
			point.x = (this.w)/2;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BR: {
			point.x = this.w-this.h;
			point.y = this.h;
			break;
		}
		default: ret = false;
	}

	point.x = Math.round(point.x);
	point.y = Math.round(point.y);

	return ret;
}

ParallRectShape.prototype.paintShape = function(canvas) {
	if(this.isIcon)
	{
		var d = 10;
		canvas.moveTo(0, this.h);		
		canvas.lineTo(d, 0);
		canvas.lineTo(this.w, 0);
		canvas.lineTo(this.w-d, this.h);
		canvas.lineTo(0, this.h);
	}
	else
	{
		canvas.moveTo(0, this.h);		
		canvas.lineTo(this.h, 0);
		canvas.lineTo(this.w, 0);
		canvas.lineTo(this.w-this.h, this.h);
		canvas.lineTo(0, this.h);
	}

	return;
}	

ParallRectShape.prototype.asIcon = function() {
	this.resize(40, 32);
	if(!this.isIcon) {
		this.setStyle(getIconShapeStyle());
	}
	this.isIcon = true;

	return;
}

/////////////////////////////}DiamondShape{/////////////////////////////////////////

function DiamondShapeCreator(type, w, h) {
	type = type ? type : "diamond";	
	var args = [type, "Diamond", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new DiamondShape();

		return g.initRectShape(this.type, w ? w : 200, h ? h : 60);
	}
	
	return;
}

function DiamondShape() {
	return;
}

DiamondShape.prototype = new RectShape();
DiamondShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;

DiamondShape.prototype.paintShape = function(canvas) {
	var halfH = Math.round(this.h/2);
	var halfW = Math.round(this.w/2);

	canvas.moveTo(0, halfH);		
	canvas.lineTo(halfW, 0);
	canvas.lineTo(this.w, halfH);
	canvas.lineTo(halfW, this.h);
	canvas.lineTo(0, halfH);	

	return;
}	
	
function ArcRectShapeCreator(type) {
	type = type ? type : "arc-rect";
	var args = [type, "Arc Rect", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new ArcRectShape();
		g.initRectShape(this.type, 200, 60);
		g.setTextType(C_SHAPE_TEXT_TEXTAREA);

		return g;
	}
	
	return;
}

function ArcRectShape() {
	return;
}

ArcRectShape.prototype = new RectShape();
ArcRectShape.prototype.getNearPoint = CircleShape.prototype.getNearPoint;

ArcRectShape.prototype.paintShape = function(canvas) {
	var r = Math.floor(this.h/2);
	
	if(r > this.w/2) r = Math.floor(this.w/2);
	if(r > this.h/2) r = Math.floor(this.h/2);
			
	canvas.arc(r, r, r, Math.PI, 1.5*Math.PI, false);
	canvas.lineTo(this.w - r, 0);
	
	canvas.arc(this.w-r, r, r, 1.5*Math.PI, 2*Math.PI,  false);
	canvas.lineTo(this.w, this.h-r);
	
	canvas.arc(this.w-r, this.h-r, r, 0, 0.5*Math.PI, false);
	canvas.lineTo(r, this.h);
	
	canvas.arc(r, this.h-r, r, 0.5 * Math.PI, Math.PI, false);
	canvas.lineTo(0, r);

	return;
}	

ArcRectShape.prototype.asIcon = function() {
	this.isIcon = true;
	this.resize(40, 30);
	this.setStyle(getIconShapeStyle());
	
	return;
}

/////////////////////////////}LineShape{/////////////////////////////////////////

function LineShapeCreator() {
	var args = ["line", "Line", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new LineShape();
		g.initLShape(null, this.type);

		return g;
	}
	
	return;
}

function LineShape() {
	return;
}

LineShape.prototype = new LShape();

LineShape.prototype.initDefault = function() {
	this.type = "line";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(50, 50));
	this.state = C_STAT_CREATING_0;

	return;
}

LineShape.prototype.updatePoint = function(index, point) {
	if(index < this.points.length) {
		this.points[index].copy(point);
		
		var other = index===1 ? 0:1;
		var dx = Math.abs(point.x - this.points[other].x);
		var dy = Math.abs(point.y - this.points[other].y);
		if(this.isCtrlDown()) {
			if(dx < dy)	{
				this.points[index].x = this.points[other].x;
			}
			else {
				this.points[index].y = this.points[other].y;
			}
		}
		else if(dx <= 5 && dy > 20) {
			this.points[index].x = this.points[other].x;
		}
		else if(dy <= 5 && dx > 20) {
			this.points[index].y = this.points[other].y;
		}
	}

	return true;
}

LineShape.prototype.getNearPoint = function(i) {
	var p = null;

	switch(i) {
		case 0: {
			p = this.points[0];
			break;
		}
		case 1: {
			p = this.points[1];
			break;
		}
		case 2: {
			p = {x:0, y:0};
			p.x = (this.points[0].x + this.points[1].x)/2;
			p.y = (this.points[0].y + this.points[1].y)/2;
			break;
		}
	}

	return p;
}

LineShape.prototype.isPointIn = function(canvas, point) {
	return this.isPointInSegment(canvas, this.points[0], this.points[1], point);	
}

LineShape.prototype.handlePointerEvent = function(point, evt) {
	if(this.state === C_STAT_NORMAL) {
		return true;
	}

	if(evt === C_EVT_POINTER_DOWN) {
		this.points[0].copy(point);
		this.attachToNearPoint(this.near, 0);

		this.points[1].x = point.x + 10;
		this.points[1].y = point.y + 10;
	}
	else if(evt === C_EVT_POINTER_MOVE) {
		var dx = point.x - this.lastPosition.x;
		var dy = point.y - this.lastPosition.y;

		if(this.pointerDown) {
			this.updatePoint(1, point);
		}
		else {
			this.moveDelta(dx, dy);
		}
	
		this.postRedraw();
	}
	else if(evt === C_EVT_POINTER_UP) {
		this.setSelected(true);
		this.state = C_STAT_NORMAL;
		if(this.isClicked()) {
			var p = new Point(this.points[0].x + 100, this.points[0].y + 100);
			this.updatePoint(1, p);
		}
		else {
			this.attachToNearPoint(this.near, 1);
		}
	}

	return true;
}

LineShape.prototype.drawArrows = function(canvas) {
	var arrowSize = this.style.arrowSize;
	var arrowType = this.style.firstArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[1], this.points[0], arrowSize);
	}

	var arrowType = this.style.secondArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[0], this.points[1], arrowSize);
	}
	canvas.beginPath();

	return;
}

LineShape.prototype.drawLine = function(canvas) {
	var f = (this.style.lineStyle >> 8) & 0xFF;
	var e = (this.style.lineStyle) & 0xFF;
	drawDashedLine(canvas, this.points[0], this.points[1], f, e);
	
	canvas.stroke();

	return;
}

LineShape.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);
	canvas.beginPath();
	
	this.prepareStyle(canvas);
	this.drawLine(canvas);
	this.drawArrows(canvas);
	this.resetStyle(canvas);

	this.drawText(canvas);
	this.drawSelectMarks(canvas);
	this.drawTips(canvas);

	canvas.restore();
	
	return;
}

LineShape.prototype.asIcon = function() {
	this.points[0].x = 0;
	this.points[0].y = 0;
	this.points[1].x = 20;
	this.points[1].y = 20;
	this.isIcon = true;
	this.setStyle(getIconShapeStyle());
	
	return;
}

/////////////////////////////}VLineShape{/////////////////////////////////////////

function VLineShapeCreator(type) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new VLineShape();

		g.initLShape(null, this.type);

		return g;
	}
	
	return;
}

function VLineShape() {
}

VLineShape.prototype = new LineShape();

VLineShape.prototype.updatePoint = function(index, point) {
	if(index === 0) {
		this.points[0].x = this.points[1].x;
		this.points[0].y = point.y;
	}
	else {
		this.points[1].x = this.points[0].x;
		this.points[1].y = point.y;
	}

	return true;
}

VLineShape.prototype.asIcon = function() {
	this.points[0].x = 0;
	this.points[0].y = 0;
	this.points[1].x = 0;
	this.points[1].y = 30;

	this.isIcon = true;
	this.setStyle(getIconShapeStyle());
	
	return;
}

VLineShape.prototype.initDefault = function() {
	this.type = "line";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(0, 50));
	this.state = C_STAT_CREATING_0;

	return;
}

/////////////////////////////}HLineShape{/////////////////////////////////////////

function HLineShapeCreator(type) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new HLineShape();

		g.initLShape(null, this.type);

		return g;
	}
	
	return;
}

function HLineShape() {
}

HLineShape.prototype = new LineShape();

HLineShape.prototype.updatePoint = function(index, point) {
	if(index === 0) {
		this.points[0].y = this.points[1].y;
		this.points[0].x = point.x;
	}
	else {
		this.points[1].y = this.points[0].y;
		this.points[1].x = point.x;
	}

	return true;
}

HLineShape.prototype.asIcon = function() {
	this.points[0].x = 0;
	this.points[0].y = 0;
	this.points[1].x = 30;
	this.points[1].y = 0;

	this.isIcon = true;
	this.setStyle(getIconShapeStyle());
	
	return;
}

HLineShape.prototype.initDefault = function() {
	this.type = "line";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(50, 0));
	this.state = C_STAT_CREATING_0;

	return;
}

/////////////////////////////}ArrowShapeCreator{/////////////////////////////////////////

function ArrowShapeCreator(type, arrowType, lineStyle) {
	var args = [type, "Arrow", null, 1];
	
	this.arrowType = arrowType;
	this.lineStyle = lineStyle;

	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		
		var g = new LineShape();
			
		g.initLShape(null, this.type);

		g.style.setFirstArrowType(C_ARROW_NONE);
		g.style.setSecondArrowType(this.arrowType);
		g.style.setLineStyle(this.lineStyle);
		g.setOptions(true, true, true, (this.arrowType == C_ARROW_NONE));

		return g;
	}
	
	return;
}

/////////////////////////////}SegmentsShape{/////////////////////////////////////////

function SegmentsShapeCreator(type) {
	type = type ? type : "segments";
	var args = [type, "Segments", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new SegmentsShape();
		g.initLShape(null, this.type);
		g.style.setSecondArrowType(C_ARROW_NORMAL);

		return g;
	}
	
	return;
}

function SegmentsShape() {
	return;
}

SegmentsShape.prototype = new LShape();

SegmentsShape.prototype.initDefault = function() {
	this.type = "segments";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(60, 0));
	this.points.push(new Point(60, 60));
	this.points.push(new Point(0, 60));
	this.state = C_STAT_CREATING_0;

	return;
}

SegmentsShape.prototype.updatePoint = function(index, point) {
	var dx = 0;
	var dy = 0;
	if(index < this.points.length) {
		this.points[index].copy(point);
	}

	if(this.state === C_STAT_NORMAL) {
		var prev = (index === 0) ? 1 : (index - 1);

		dx = Math.abs(this.points[index].x - this.points[prev].x);
		dy = Math.abs(this.points[index].y - this.points[prev].y);

		if(dx < 5 && dy > 10) {
			this.points[index].x = this.points[prev].x;
		}
		
		if(dy < 5 && dx > 10) {
			this.points[index].y = this.points[prev].y;
		}
		
		if(index == 1 || index == 2) {
			dx = Math.abs(this.points[3].x - this.points[0].x);
			dy = Math.abs(this.points[3].y - this.points[0].y);
			if(dx < dy) {
				if(index == 1) {
					this.points[2].x = this.points[1].x;
				}
				else {
					this.points[1].x = this.points[2].x;
				}
			}
			else {
				if(index == 1) {
					this.points[2].y = this.points[1].y;
				}
				else {
					this.points[1].y = this.points[2].y;
				}
			}
		}
	}
	else {
		if(index === 3) {
			this.points[1].x = this.points[0].x + 100;
			this.points[1].y = this.points[0].y;
			
			this.points[2].x = this.points[1].x;
			this.points[2].y = this.points[3].y;
		}
	}

	return true;
}

SegmentsShape.prototype.isPointIn = function(canvas, point) {
	
	if(this.isPointInSegment(canvas, this.points[0], this.points[1], point)) {
		return true;
	}
	
	if(this.isPointInSegment(canvas, this.points[1], this.points[2], point)) {
		return true;
	}
	
	if(this.isPointInSegment(canvas, this.points[2], this.points[3], point)) {
		return true;
	}


	return false;
}

SegmentsShape.prototype.handlePointerEvent = function(point, evt) {
	if(this.state === C_STAT_NORMAL) {
		return true;
	}

	if(evt === C_EVT_POINTER_DOWN) {
		if(!this.near) {
			this.points[0].copy(point);
		}
		this.attachToNearPoint(this.near, 0);
		
		this.points[1].x = point.x + 60;
		this.points[1].y = point.y;
		
		this.points[2].x = point.x + 60;
		this.points[2].y = point.y + 60;
		
		this.points[3].x = point.x ;
		this.points[3].y = point.y + 60;
	}
	else if(evt === C_EVT_POINTER_MOVE) {
		var dx = point.x - this.lastPosition.x;
		var dy = point.y - this.lastPosition.y;

		if(this.pointerDown) {
			this.updatePoint(3, point);
		}
		else {
			this.moveDelta(dx, dy);
		}
	
		this.postRedraw();
	}
	else if(evt === C_EVT_POINTER_UP) {
		this.setSelected(true);
		this.state = C_STAT_NORMAL;
		this.attachToNearPoint(this.near, 3);
	}

	return true;
}

SegmentsShape.prototype.drawArrows = function(canvas) {
	var arrowSize = this.style.arrowSize;
	var arrowType = this.style.firstArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[1], this.points[0], arrowSize);
	}

	var arrowType = this.style.secondArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[2], this.points[3], arrowSize);
	}
	canvas.beginPath();

	return;
}

SegmentsShape.prototype.drawSegments = function(canvas) {
	var f = (this.style.lineStyle >> 8) & 0xFF;
	var e = (this.style.lineStyle) & 0xFF;
	
	drawDashedLine(canvas, this.points[0], this.points[1], f, e);
	drawDashedLine(canvas, this.points[1], this.points[2], f, e);
	drawDashedLine(canvas, this.points[2], this.points[3], f, e);
	
	canvas.stroke();

	return;
}

SegmentsShape.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);
	canvas.beginPath();
	
	this.prepareStyle(canvas);
	this.drawSegments(canvas);
	this.drawArrows(canvas);
	this.resetStyle(canvas);

	this.drawText(canvas);
	this.drawSelectMarks(canvas);
	this.drawTips(canvas);

	canvas.restore();
	
	return;
}

SegmentsShape.prototype.asIcon = function() {
	this.points[0].x = 0;
	this.points[0].y = 0;
	this.points[1].x = 20;
	this.points[1].y = 0;
	
	this.points[2].x = 20;
	this.points[2].y = 20;
	this.points[3].x = 0;
	this.points[3].y = 20;
	this.isIcon = true;
	this.setStyle(getIconShapeStyle());
	this.style.setSecondArrowType(C_ARROW_NORMAL);

	return;
}

/////////////////////////////}CurveShape{/////////////////////////////////////////

function CurveShapeCreator() {
	var args = ["curve", "Curve", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new CurveShape();
		g.initLShape(null, this.type);
		g.style.setSecondArrowType(C_ARROW_NORMAL);

		return g;
	}
	
	return;
}

function CurveShape() {
	return;
}

CurveShape.prototype = new LShape();

CurveShape.prototype.isCurve = true;

CurveShape.prototype.initDefault = function() {
	this.type = "curve";
	this.points_nr = 0;
	this.points.push(new Point(0, 0));
	this.points.push(new Point(0, 60));
	this.points.push(new Point(60, 30));
	this.state = C_STAT_CREATING_0;

	return;
}

CurveShape.prototype.isPointsEnough = function() {
	return this.points_nr >= 3;
}

CurveShape.prototype.updatePoint = function(index, point) {
	if(index < this.points.length) {
		this.points[index].copy(point);
	}

	return true;
}

CurveShape.prototype.isPointIn = function(canvas, point) {
	var points = this.points;

	canvas.beginPath();
	canvas.moveTo(points[0].x, points[0].y);
	for(var i = 0; i < points.length; i++) {
		canvas.lineTo(points[i].x, points[i].y);
	}
	canvas.lineTo(points[0].x, points[0].y);

	return canvas.isPointInPath(point.x, point.y);
}

CurveShape.prototype.handlePointerEvent = function(point, evt) {
	if(this.state === C_STAT_NORMAL) {
		return true;
	}

	if(evt === C_EVT_POINTER_DOWN) {
		if(!this.near) {
			this.points[0].copy(point);
		}
		this.attachToNearPoint(this.near, 0);

		this.points[1].x = point.x;
		this.points[1].y = point.y + 30;
		this.points[2].x = point.x + 30;
		this.points[2].y = point.y + 15;
	}
	else if(evt === C_EVT_POINTER_MOVE) {
		if(this.pointerDown) {
			this.points[1].copy(point);

			var dx = this.points[0].x - this.points[1].x;
			var dy = this.points[0].y - this.points[1].y;
			
			var angle = Math.atan(dy/dx);
			var length = Math.sqrt(dx * dx + dy * dy);
			var center_x = (this.points[0].x + this.points[1].x)/2;
			var center_y = (this.points[0].y + this.points[1].y)/2;

			if(angle > Math.PI) {
				angle = angle - Math.PI;
			}

			this.points[2].x = center_x + Math.sin(Math.PI - angle) * length/2;
			this.points[2].y = center_y + Math.cos(Math.PI - angle) * length/2;
		}
		else {
			var dx = point.x - this.lastPosition.x;
			var dy = point.y - this.lastPosition.y;

			this.moveDelta(dx, dy);
		}
	
		this.postRedraw();
	}
	else if(evt === C_EVT_POINTER_UP) {
		this.setSelected(true);
		this.state = C_STAT_NORMAL;
		
		this.attachToNearPoint(this.near, 1);
	}

	return true;
}

CurveShape.prototype.drawArrows = function(canvas) {
	var arrowSize = this.style.arrowSize;
	var arrowType = this.style.firstArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[2], this.points[0], arrowSize);
	}

	var arrowType = this.style.secondArrowType;
	if(arrowType) {
		drawArrow(canvas, arrowType, this.points[2], this.points[1], arrowSize);
	}

	return;
}

CurveShape.prototype.drawCurve = function(canvas) {
	canvas.lineWidth = this.style.lineWidth;			
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;

	var points = this.points;
	canvas.moveTo(points[0].x, points[0].y);
	canvas.quadraticCurveTo(points[2].x, points[2].y, points[1].x, points[1].y);	
	canvas.stroke();

	return;
}

CurveShape.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);

	this.prepareStyle(canvas);
	this.drawCurve(canvas);
	this.drawArrows(canvas);
	this.resetStyle(canvas);

	this.drawText(canvas);
	this.drawSelectMarks(canvas);
	this.drawTips(canvas);
	canvas.restore();
	
	return;
}


/*
 * File: shape_factory.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: register all built-in shapes.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

var C_CREATE_FOR_USER = 0;
var C_CREATE_FOR_ICON = 1;
var C_CREATE_FOR_PROGRAM = 2;
var C_CATE_RECENT_USED = "Recent Used";

function ShapeCreator(type, name, icon, visible) {
	this.type = type;
	this.icon = icon;
	this.name = name;
	this.visible = visible;
	this.useCount = 0;// cantkLocalStorageGetInt(type);

	this.incUseCount = function() {
		this.useCount++;

		//cantkLocalStorageSet(this.type, this.useCount);

		return;
	}

	this.isVisibleToUser = function() {
		return this.visible;
	}
	
	this.getID = function() {
		return this.type;
	}
	
	this.getIcon = function() {
		return this.icon;
	}
	
	this.getName = function() {
		return this.name;
	}

	this.createIconShape = function() {
		if(!this.iconShape) {
			this.iconShape = this.createShape(C_CREATE_FOR_ICON);
		}
		
		return this.iconShape;
	}
	
	this.createShape = function(createReason) {
		return null;
	}
	
	return;
}

function ShapeFactory() {
	this.defaultCategory = null;
	this.recentUsed = new Array();
	this.creators = new Array();
	this.categories = new Object();
	this.categoryNames = new Array();
	this.diagramTypes = new Array();
	this.OnCategoryChangeListeners = {};

	this.setOnCategoryChangeListener = function(category, listener) {
		this.OnCategoryChangeListeners[category] = listener;

		return;
	}

	this.setDefaultCategory = function(defaultCategory) {
		this.defaultCategory = defaultCategory;
		var listener = this.OnCategoryChangeListeners[defaultCategory];

		if(listener) {
			listener(defaultCategory);
		}

		return;
	}

	this.getDiagramTypes = function() {
		return this.diagramTypes;
	}

	this.addDiagramType = function(type, defaultCategory) {
		var obj = {name:type, defaultCategory:defaultCategory};

		this.diagramTypes.push(obj);

		return;
	}

	this.removeCategoryName = function(name) {
		this.categoryNames.remove(name);

		return;
	}

	this.removeShapeCreator = function(type, category) {
		var c = this.find(type);
		var creators = this.categories[category];
		if(c) {
			this.creators.remove(c);

			if(creators) {
				creators.remove(c);
				if(creators.length === 0) {
				//	this.categoryNames.remove(category);
				}
			}
		}

		return;
	}

	this.isPlacehodler = function(category) {
		return category === "---";
	}

	this.addPlaceholder = function() {
		this.categoryNames.push("---");

		return;
	}

	this.loadRecentUsedShapeCreators = function() {
		var types = localStorage.recentUsed ? JSON.parse(localStorage.recentUsed) : [];

		for(var i = 0; i < types.length; i++) {
			var type = types[i];
			var creator = this.find(type);
			if(creator) {
				this.addShapeCreator(creator, C_CATE_RECENT_USED);
				this.recentUsed.push(type);
			}
		}

		return;
	}

	this.addRecentUsedShapeCreator = function(type) {
		var creator = this.find(type);
		if(creator) {
			this.recentUsed.remove(type);
			this.recentUsed.push(type);

			if(this.recentUsed.length > 10) {
				this.recentUsed.shift();
			}
			localStorage.recentUsed = JSON.stringify(this.recentUsed);

			this.addShapeCreator(creator, C_CATE_RECENT_USED);
		}
	}

	this.addShapeCreator = function(creator, category) {
		if(category != C_CATE_RECENT_USED) {
			this.creators.push(creator);
		}

		if(category) {
			if(!this.defaultCategory) {
				this.setDefaultCategory(category);
			}

			if(!this.categories[category]) {
				this.categories[category] = new Array();

				if(category == C_CATE_RECENT_USED) {
					this.categoryNames.unshift(category);
				}
				else {
					this.categoryNames.push(category);
				}
			}
			
			this.categories[category].remove(creator);
			if(category == C_CATE_RECENT_USED) {
				this.categories[category].unshift(creator);
			}
			else {
				this.categories[category].push(creator);
			}
		}
//		console.log("Register: category=" + category + " id=" + creator.getID());

		return;
	}

	this.getCategoryNames = function() {
		return this.categoryNames;
	}
	
	this.sortDefaultCategoryByUseCount = function() {
		return;
		var arr = this.categories[this.defaultCategory];
	
		if(arr && arr.length > 30) {
			arr.sort(function(a, b) { 
				return b.useCount - a.useCount;
			});
		}

		return;
	}

	this.getDefaultCategory = function() {
		return this.categories[this.defaultCategory];
	}

	this.getByCategory = function(category) {
		return this.categories[category];
	}
	
	this.find = function(type) {
		for(var i = 0; i < this.creators.length; i++) {
			var c = this.creators[i];
			if(c.getID() === type) {
				return c;
			}
		}
		
		return null;
	}

	this.createShape = function(type, createReason) {
		var c = this.find(type);
		if(c) {
			c.incUseCount();
			return c.createShape(createReason);
		}
		else {
			return null;
		}
	}
	
	return;
}

var gShapeFactory = null;

function ShapeFactoryGet() {
	if(!gShapeFactory) {
		gShapeFactory = new ShapeFactory();

		setTimeout(function() {
			gShapeFactory.loadRecentUsedShapeCreators();
		}, 2000);
	}

	return gShapeFactory;
}

function dappSetDefaultCategory(name) {
	return ShapeFactoryGet().setDefaultCategory(name);
}


var C_LINE_STYLE_0 = (255 << 8) | 0;
var C_LINE_STYLE_1 = (2 << 8) | 4;
var C_LINE_STYLE_2 = (4 << 8) | 4;
var C_LINE_STYLE_3 = (8 << 8) | 8;
var C_LINE_STYLE_4 = (10 << 8) | 10;

function resetShapeStyle(style) {
	style.lineStyle = 0xFF00;
	style.lineWidth = 2;
	style.lineColor = "Orange";
	style.fillColor = "White";
	style.textColor = "Blue";
	style.fontSize = 24;
	style.fontFamily = "sans";
	style.arrowSize = 12;
	style.firstArrowType = 0;
	style.secondArrowType = 0;
	style.textB = 0;
	style.textI = 0;
	style.textU = 0;
	style.enableShadow = false;
	style.shadow = {x: 0, y: 0, blur: 8, color:"Black"};
	style.enableGradient = false;
	style.listener = null;
	
	return style;
}

function createShapeStyle() {
	var style = new ShapeStyle();

	return resetShapeStyle(style);
}

function ShapeStyle() {
}
	
ShapeStyle.prototype.getFont = function() {
	var font = "";
	
	if(this.textI) {
		font = "italic  "
	}
	
	if(this.textB) {
		font = font + "bold "
	}
	
	font = font + this.fontSize + "pt " + this.fontFamily;

	return font;
}

ShapeStyle.prototype.setListener = function(obj) {
	this.listener = obj;
	
	return;
}

ShapeStyle.prototype.notify = function() {
	if(this.listener) {
		this.listener.setNewStyle(this);
	}
	
	return;
}
ShapeStyle.prototype.setLineStyle=function(value) {
	this.lineStyle = value;

	return;
}

ShapeStyle.prototype.setLineWidth=function(value) {
	this.lineWidth = value > 0 ? value : 1;

	return;
}

ShapeStyle.prototype.setLineColor=function(value) {
	this.lineColor = value;

	return;
}

ShapeStyle.prototype.setFillColor=function(value) {
	if("string" != typeof value) {
		this.fillColor = value;
		this.enableGradient = true;
	}
	else {
		if(value.length > 12 && value.indexOf("rgb") < 0) {
			this.fillColor = JSON.parse(value);
			this.enableGradient = true;
		}
		else {
			this.fillColor = value;
		}
	}

	return;
}

ShapeStyle.prototype.setTextColor=function(value) {
	this.textColor = value;

	return;
}

ShapeStyle.prototype.setFontSize=function(value) {
	var fontSize = Math.max(value, 6);

	this.fontSize = fontSize;

	return;
}

ShapeStyle.prototype.setFontFamily =function(fontFamily) {
	this.fontFamily = fontFamily ? fontFamily : "serif";

	return;
}

ShapeStyle.prototype.setFirstArrowType=function(value) {
	this.firstArrowType = value;

	return;
}

ShapeStyle.prototype.setSecondArrowType=function(value) {
	this.secondArrowType = value;

	return;
}

ShapeStyle.prototype.setArrowSize=function(value) {
	this.arrowSize = value;

	return;
}

ShapeStyle.prototype.setTextB=function(value) {
	this.textB = value;

	return;
}

ShapeStyle.prototype.setTextU=function(value) {
	this.textU = value;

	return;
}

ShapeStyle.prototype.setTextI=function(value) {
	this.textI = value;

	return;
}

ShapeStyle.prototype.setShadow = function(enable, shadow) {
	this.enableShadow = enable;
	this.shadow = shadow;

	return;
}

ShapeStyle.prototype.getStrokeStyle = function(canvas) {
	var strokeStyle = this.strokeColor;

	return strokeStyle;
}

ShapeStyle.prototype.getGradFillStyle = function(canvas, x, y, w, h) {
	var color = this.fillColor;

	if(!color) {
		return "White";
	}

	var x0 = x;
	var y0 = y;
	var x1 = x + (color.x1 < 0 ? w : color.x1);
	var y1 = y + (color.y1 < 0 ? h : color.y1);

	if(isNaN(x1) || isNaN(y1) || isNaN(x0) || isNaN(y0)) {
		return this.fillColor;
	}

	var gradientStyle = canvas.createLinearGradient(x0, y0, x1, y1);

	for(var i = 0; i < color.data.length; i++) {
		var data = color.data[i];
		gradientStyle.addColorStop(data.o, data.c);
	}
	
	return gradientStyle;
}

ShapeStyle.prototype.copy = function(other) {
	var js = other.toJson();

	this.fromJson(js);

	return ;
}

ShapeStyle.prototype.toJson = function() {
	var o = new Object();

	for(var key in this) {
		var value = this[key];
		var type = typeof value;
		if(type === "function" || type === "object" || type === "undefined") {
			continue;
		}

		if(type === "number" || type === "string" || type === "boolean") {
			o[key] = value;
		}
	}
	
	if(this.enableShadow) {
		o.shadow = this.shadow;
	}
	else {
		delete o.enableShadow;
	}

	if(this.enableGradient) {
		o.fillColor = this.fillColor;
	}
	else {
		delete o.enableGradient;
	}

	if(!this.textI) {
		delete o.textI;
	}
	
	if(!this.textU) {
		delete o.textU;
	}
	
	if(!this.textB) {
		delete o.textB;
	}

	delete o.textAlignment;

	return o;
}

ShapeStyle.prototype.fromJson = function(js) {
	resetShapeStyle(this);

	if(js.ls) {
		//old version compatable
		this.lineStyle = js.ls;
		this.lineWidth = js.lw;
		this.lineColor = js.lc;
		this.fillColor = js.fc;
		this.textColor = js.tc;
		this.fontSize = js.fs;
		this.fontFamily = (js.fm != undefined) ? js.fm : "serif";
		this.arrowSize = js.as;
		this.firstArrowType = js.fat;
		this.secondArrowType = js.sat;
		this.textB = js.b;
		this.textI = js.i;
		this.textU = js.u;	
		this.enableShadow = js.es;
	}
	else {
		for(var key in js) {
			var value = js[key];
			var type = typeof value;
			if(type === "function" || type === "undefined") {
				continue;
			}

			this[key] = value;
		}
	}

	if(this.enableShadow) {
		this.shadow = js.shadow;

		if(!this.shadow) {
			this.enableShadow = false;
		}
	}
	
	if(this.enableGradient) {
		this.setFillColor(this.fillColor);
	}
	
	return;
}

ShapeStyle.prototype.dup = function() {
	var other = new ShapeStyle();
	
	other.copy(this);
	
	return other;
}

ShapeStyle.prototype.equalTo = function(style) {
	var thisJson = JSON.stringify(this.toJson());
	var otherJson = JSON.stringify(style.toJson());

	return thisJson === otherJson;
}

var gShapeStyle = null;

function DefaultShapeStyleGet() {
	if(gShapeStyle) {
		return gShapeStyle;
	}
	
	gShapeStyle = createShapeStyle();
	
	return gShapeStyle;
}

function saveDefaultShapeStyle() {
	var style = DefaultShapeStyleGet();
	var js = style.toJson();
	
	localStorage.style = JSON.stringify(js);

	return;
}

function loadDefaultShapeStyle() {
	var ret = false;
	var style = DefaultShapeStyleGet();
	
	if(localStorage.style) {
		var js = JSON.parse(localStorage.style);
		style.fromJson(js);
		ret = true;
	}
	
	return ret;
}

var gIconShapeStyle = null;
function getIconShapeStyle() {
	if(!gIconShapeStyle) {
		gIconShapeStyle = createShapeStyle();
		gIconShapeStyle.setLineWidth(1);
		gIconShapeStyle.setFontSize(8);
		gIconShapeStyle.setLineColor("Black");
		gIconShapeStyle.setFillColor("White");
		gIconShapeStyle.setTextColor("Black");
	}

	return gIconShapeStyle;
}


/*
 * File: core.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: UIElement
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIElement() {
	return;
}

UIElement.prototype = new RShape();

UIElement.Style = function() {
	this.lineWidth = 2;
	this.lineColor = "Orange";
	this.fillColor = "White";
	this.textColor = "Blue";
	this.fontSize = 24;

	return;
}

UIElement.Style.prototype = new ShapeStyle();

UIElement.prototype.isUIElement = true;
UIElement.prototype.hasChildren = true;
UIElement.prototype.isContainer = true;

UIElement.disableGetRelativePathOfURL = false;

UIElement.prototype.setDefaultStyle = function() {
	this.style = new UIElement.Style();

	return;
}

UIElement.prototype.clone = function() {
	var obj = null;
	
	UIElement.disableGetRelativePathOfURL = true;
	obj = this.dup();
	UIElement.disableGetRelativePathOfURL = false;

	return obj;
}

UIElement.prototype.getRelativePathOfURL = function(url) {
	if(UIElement.disableGetRelativePathOfURL) {
		return url;
	}

	if(!url) {
		return null;
	}

	var str = window.location.protocol + "//" + window.location.host + "/";
	if(url.indexOf("/web/backend/") >= 0 && url.indexOf(str) >= 0) {
		return url;
	}


	url = url.replace(str, "");

	return url;
}

UIElement.prototype.setFreePosition = function(value) {
	this.freePosition = value;

	return;
}

UIElement.prototype.fixChildPosition = function(child) {
	var x = child.x;
	var y = child.y;
	var h = child.h;
	var minX = this.getHMargin();
	var minY = this.getVMargin();

	if(child.freePosition) {
		return;
	}

	if(child.widthAttr === C_WIDTH_FILL_PARENT || x < minX) {
		x = minX;
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT || y < minY) {
		y = minY;
	}
	
	child.x = x;
	child.y = y;

	return;
}

UIElement.prototype.setFreeSize = function(value) {
	this.freeSize = value;
	
	return;
}

UIElement.prototype.fixChildSize = function(child) {
	if(child.freeSize) {
		return;
	}

	if(this.autoAdjustHeight) {
		if((child.y + child.h) > this.h) {
			this.h = child.y + child.h + this.vMargin;
		}
	}

	var x = child.x;
	var w = child.w;
	var y = child.y;
	var h = child.h;
	var wParent = this.getWidth(true);
	var hParent = this.getHeight(true);
	var right = wParent + this.hMargin;
	var bottom = hParent + this.vMargin;

	if((x + w) > right && child.widthAttr != C_WIDTH_FILL_PARENT 
		&& child.xAttr != C_X_AFTER_PREV && child.widthAttr != C_WIDTH_FILL_AVAILABLE 
		&& this.mode === C_MODE_EDITING) {
		x = right - w;
		if(x < 0) {
			x = 0;
		}

		w = right - x;
	}

	if((y + h) > bottom && child.heightAttr != C_HEIGHT_FILL_PARENT 
		&& child.yAttr != C_Y_AFTER_PREV && child.heightAttr != C_HEIGHT_FILL_AVAILABLE 
		&& this.mode === C_MODE_EDITING) {
		y = bottom - h;
		if(y < 0) {
			y = 0;
		}

		h = bottom - y;
	}

	if(x < 0) {
		x = 0;
	}
	if(y < 0) {
		y = 0;
	}
	
	child.x = x;
	child.y = y;
	child.w  = w <= wParent ? w : wParent;
	child.h  = h <= hParent ? h : hParent;

	return;
}

UIElement.prototype.onInit = function() {
	if(this.offset) {
		this.offset = 0;
	}

	if(this.mode !== C_MODE_EDITING) {
		if(this.dataSourceUrl && this.dataSourceUrl.length > 5) {
			this.bindDataUrl(this.dataSourceUrl);
		}
	
		this.callOnInit();
	}

	return;
}

UIElement.prototype.onDeinit = function() {
	return;
}

UIElement.prototype.init = function() {
	var i = 0;
	var iter = null;
	var children = this.children;
	var n = this.children.length;

	this.onInit();

	for(i = 0; i < n; i++) {
		iter = children[i];
		iter.init();
	}

	return;
}

UIElement.prototype.deinit = function() {
	var i = 0;
	var iter = null;
	var children = this.children;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		iter = children[i];
		iter.deinit();
	}
	
	this.onDeinit();

	return;
}

UIElement.prototype.onModeChanged = function() {
	return;
}

UIElement.prototype.userRemovable = function() {
	return this.mode === C_MODE_EDITING;
}

UIElement.prototype.postRedraw = function() {
	if(this.view) {
		if(this.mode === C_MODE_RUNNING) {
			var rect = {};
			var p = this.getPositionInView();
			rect.x = p.x;
			rect.y = p.y;
			rect.w = this.w;
			rect.h = this.h;

			this.view.postRedraw(rect);
		}
		else {
			this.view.postRedrawAll();
		}
	}

	return;
}

UIElement.prototype.setMode = function(mode, recursive) {
	this.mode = mode;

	if(this.type !== "ui-menu-bar") {
		if(mode === C_MODE_EDITING) {
			this.setVisible(true);
		}
	}

	if(recursive) {
		for(var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if(child.isContainer) {
				child.setMode(mode, true);
			}
		}
	}
	this.onModeChanged();

	return;
}

UIElement.prototype.calcChildrenRange = function() {
	return this.calcShapesRange(this.children);
}

UIElement.prototype.calcShapesRange = function(shapes) {
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;

	var r = 0;
	var b = 0;
	var t = 10000;
	var l = 10000;
	var range = {};

	if(shapes.length > 0) {
		for(var i = 0; i < shapes.length; i++) {
			var iter = shapes[i];
			
			x = iter.getX();
			y = iter.getY();
			w = iter.getWidth();
			h = iter.getHeight();

			if(x < l) l = x;
			if(y < t) t = y;
			if((x + w) > r) r = x + w;
			if((y + h) > b) b = y + h;
		}

		range.l = l;
		range.r = r;
		range.t = t;
		range.b = b;
	}
	else {
		range.l = 0;
		range.r = 0;
		range.t = 0;
		range.b = 0;
	}

	return range;
}

UIElement.prototype.relayoutChildren = function() {
}

UIElement.prototype.onSized = function() {
	this.updateLayoutParams();

	return;
}

UIElement.prototype.findSelectedShapes = function(shapes) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child.selected) {
			shapes.push(child);
			continue;
		}
	
		if(child.isContainer) {
			child.findSelectedShapes(shapes);
		}
	}

	return;
}

UIElement.prototype.setSelected = function(selected) {
	if(!selected) {
		for(var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			child.setSelected(false);
		}
	}
	
	if(this.selected === selected) {
		return;
	}

	this.targetShape = null;
	this.selected = selected;

	if(this.view && this.view.onShapeSelected) {
		this.view.onShapeSelected(this);
	}
	
	return;
}

UIElement.prototype.setPointerEventTarget = function(shape) {
	this.pointerEventTarget = shape;

	return;
}

UIElement.prototype.getPointerEventTarget = function() {
	return this.pointerEventTarget ? this.pointerEventTarget : this.targetShape;
}

UIElement.prototype.foreachImage = function(onVisit) {
	for(var key in this.images) {
		if(key !== "display") {
			var src = this.getImageSrcByType(key);
			onVisit(key, src);
		}
	}

	return;
}

UIElement.prototype.forEach = function(onVisit) {
	onVisit(this);

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.forEach(onVisit);
	}

	return;
}

UIElement.prototype.getAllTabStopElements = function() {
	var arr = [];
	var win = this.getWindow();

	if(win) {
		win.forEach(function(el) {
			if(el.isUIButton || el.isUIEdit) {
				arr.push(el);
			}
		});
	}

	return arr;
}

UIElement.prototype.findNextTabStop = function() {
	var arr = this.getAllTabStopElements();
	if(!arr.length) {
		return;
	}

	var index = arr.indexOf(this);
	if(index >= 0 && (index + 1) < arr.length) {
		return arr[index+1];
	}
	else {
		return arr[0];
	}
}

UIElement.prototype.moveToNextStop = function() {
	var el = this.findNextTabStop();


	return;
}

UIElement.prototype.isPointerOverShape = function() {
	return this.parentShape && this.parentShape.pointerOverShape === this;
}

UIElement.prototype.setPointerOverShape = function(shape) {
	if(this.pointerOverShape !== shape) {
		if(this.pointerOverShape) {
			this.pointerOverShape.setPointerOverShape(null);
		}

		this.pointerOverShape = shape;
		this.postRedraw();
	}

	return;
}

UIElement.prototype.setTarget = function(shape) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child != shape) {
			child.setSelected(false);
		}
	}

	this.targetShape = shape;
	this.selected = !shape;

	return;
}

UIElement.prototype.initContainerShape = function(type) {
	this.children = new Array();
	this.toJsoners = new Array();
	this.fromJsoners = new Array();

	RShapeInit(this, type);
	
	this.mode = C_MODE_EDITING;
	this.rectSelectable = true;

	return this;
}

UIElement.prototype.defaultDispatchPointerDownToChildren = function(p) {
	var targetShape = this.targetShape;
	if(targetShape && targetShape.selected && targetShape.mode === C_MODE_EDITING) {
		var hitTestResult = this.hitTest(p);

		if(hitTestResult != C_HIT_TEST_MM && hitTestResult != C_HIT_TEST_NONE) {
			if(this.targetShape.onPointerDown(p)) {
				return true;
			}
		}
	}

	for(var i = this.children.length; i > 0; i--) {
		var child = this.children[i-1];

		if(child.visible && child.onPointerDown(p)) {
			this.setTarget(child);

			return true;
		}
	}

	return false;
}

UIElement.prototype.dispatchPointerDownToChildren = function(p) {
	return this.defaultDispatchPointerDownToChildren(p);
}

UIElement.prototype.callPointerDownHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerDown || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onPointerDown"];
		if(sourceCode) {
			sourceCode = "this.handlePointerDown = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerDown) {
		try {
			this.handlePointerDown(point);
		}catch(e) {
			console.log("this.handlePointerDown:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.onPointerDownEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(!beforeChild) {
		return;
	}

	return this.callPointerDownHandler(point);
}

UIElement.prototype.callPointerMoveHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerMove || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onPointerMove"];
		if(sourceCode) {
			sourceCode = "this.handlePointerMove = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerMove) {
		try {
			this.handlePointerMove(point);
		}catch(e) {
			console.log("this.handlePointerMove:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.onPointerMoveEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(!beforeChild) {
		return;
	}

	return this.callPointerMoveHandler(point);
}

UIElement.prototype.callPointerUpHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handlePointerUp || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onPointerUp"];
		if(sourceCode) {
			sourceCode = "this.handlePointerUp = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePointerUp) {
		try{
			this.handlePointerUp(point);
		}catch(e) {
			console.log("this.handlePointerUp:" + e.message);
		}
	}
	
	return true;
}

UIElement.prototype.onPointerUpEditing = function(point, beforeChild) {
	return;
}

UIElement.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!beforeChild) {
		return;
	}
	return this.callPointerUpHandler(point);
}

UIElement.prototype.callLongPressHandler = function(point) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleLongPress || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onLongPress"];
		if(sourceCode) {
			sourceCode = "this.handleLongPress = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleLongPress) {
		try {
			this.handleLongPress(point);
		}catch(e) {
			console.log("this.handleLongPress:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callDoubleClickHandler = function(point) {
	if(this.mode === C_MODE_EDITING) {
		if(this.textType != C_SHAPE_TEXT_NONE) {
			this.editText(point);
		}
		else {
			this.showProperty();
		}

		return true;
	}
	
	if(!this.enable) {
		return false;
	}

	if(!this.handleDoubleClick || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onDoubleClick"];
		if(sourceCode) {
			sourceCode = "this.handleDoubleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDoubleClick) {
		try {
			this.handleDoubleClick(point);
		}catch(e) {
			console.log("this.handleDoubleClick:" + e.message);
		}
	}

	this.hitTestResult = 0;

	return true;
}

UIElement.prototype.callTimerHandler = function() {
	var win = this.getWindow();
	if(win && !win.visible) {
		return true;
	}

	if(this.mode === C_MODE_EDITING) {
		return true;
	}
	
	if(!this.enable) {
		return false;
	}

	if(!this.handleTimer || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onTimer"];
		if(sourceCode) {
			sourceCode = "this.handleTimer = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleTimer) {
		try {
			this.handleTimer();
		}catch(e) {
			console.log("this.handleTimer:" + e.message);
		}
	}

	return true;
}


UIElement.prototype.callPaintHandler = function(canvas2dCtx) {
	if(this.mode === C_MODE_EDITING) {
		return true;
	}
	
	if(!this.enable) {
		return false;
	}

	if(!this.handlePaint || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onPaint"];
		if(sourceCode) {
			sourceCode = "this.handlePaint = function(canvas2dCtx) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handlePaint) {
		try {
			this.handlePaint(canvas2dCtx);
		}catch(e) {
			console.log("this.handlePaint:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.onDoubleClick = function(point) {
	if(this.targetShape) {
		var p = this.translatePoint(point);
		return this.targetShape.onDoubleClick(p);
	}
	else {
		return this.callDoubleClickHandler(point);
	}
}

UIElement.prototype.onGesture = function(gesture) {
	if(this.targetShape) {
		return this.targetShape.onGesture(gesture);
	}

	return;
}

UIElement.prototype.onLongPress = function(point) {
	this.longPressed = true;

	this.callLongPressHandler(point);
	if(this.targetShape) {
		var p = this.translatePoint(point);
		return this.targetShape.onLongPress(p);
	}

	return;
}

UIElement.prototype.callClickHandler = function(point, onChild) {
	if(!this.enable) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	if(!this.handleClick || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onClick"];
		if(sourceCode) {
			sourceCode = "this.handleClick = function(point) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(!this.children.length) {
		console.log("clicked: " + this.type + "(" + this.name + ")");
	}
	if(this.handleClick) {
		try {
			this.handleClick(point);
		}catch(e) {
			console.log("this.handleClick:" + e.message);
		}
	}

	return;
}

UIElement.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	return this.callClickHandler(point, beforeChild);
}

UIElement.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.x), y : (point.y - this.y)};

	return p;
}

UIElement.prototype.setCanRectSelectable = function(rectSelectable, recursive) {
	this.rectSelectable = rectSelectable;

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.setCanRectSelectable(rectSelectable, recursive);
	}

	return;
}

UIElement.prototype.canRectSelectable = function() {
	return this.rectSelectable && this.parentShape;
}

UIElement.prototype.setDraggable = function(value) {
	if(this.draggable === value) {
		return;
	}

	this.draggable = value;

	if(value) {
		this.addEventNames(["onDragStart", "onDragging", "onDragEnd"]);
	}
	else {
		this.removeEventNames(["onDragStart", "onDragging", "onDragEnd"]);
	}

	return;
}

UIElement.prototype.callOnDragStartHandler = function() {
	if(!this.enable) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	if(!this.handleDragStart || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onDragStart"];
		if(sourceCode) {
			sourceCode = "this.handleDragStart = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDragStart) {
		try {
			this.handleDragStart();
		}catch(e) {
			console.log("this.handleDragStart:" + e.message);
		}
	}

	return;
}

UIElement.prototype.callOnDragEndHandler = function() {
	if(!this.enable) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	if(!this.handleDragEnd || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onDragEnd"];
		if(sourceCode) {
			sourceCode = "this.handleDragEnd = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDragEnd) {
		try {
			this.handleDragEnd();
		}catch(e) {
			console.log("this.handleDragEnd:" + e.message);
		}
	}

	return;
}

UIElement.prototype.callOnDragingHandler = function() {
	if(!this.enable) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	if(!this.handleDraging || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onDragging"];
		if(sourceCode) {
			sourceCode = "this.handleDraging = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleDraging) {
		try {
			this.handleDraging();
		}catch(e) {
			console.log("this.handleDraging:" + e.message);
		}
	}

	return;
}

UIElement.prototype.onDragStart = function() {
	console.log("Drag Start");
	this.callOnDragStartHandler();
	return;
}

UIElement.prototype.onDragging = function() {
	console.log("Dragging");
	this.callOnDragingHandler();

	return;
}

UIElement.prototype.onDragEnd = function() {
	console.log("Drag End");
	this.callOnDragEndHandler();

	return;
}

UIElement.prototype.dragMove = function(dx, dy, point) {
	this.x = this.x + dx;
	this.y = this.y + dy;
	
	this.onDragging(point);

	return;
}

UIElement.prototype.handleDragMove = function(point) {
	var dx = this.getMoveDeltaX();
	var dy = this.getMoveDeltaY();

	if(!this.dragging) {
		var absdx = this.getMoveAbsDeltaX();
		var absdy = this.getMoveAbsDeltaY();
		if(Math.abs(absdx) > 5 || Math.abs(absdy) > 5) {
			this.dragging = true;
			this.onDragStart();
			dx = absdx;
			dy = absdy;
		}
	}

	if(this.dragging) {
		this.dragMove(dx, dy, point);
		if(this.parentShape) {
			this.parentShape.onChildDragging(this, point);
		}
	}

	return;
}

UIElement.prototype.onChildDragging = function(child, point) {

	return;
}

UIElement.prototype.onChildDragged = function(child, point) {
	this.sortChildren();
	this.relayoutChildren("default");

	return;
}

UIElement.prototype.handleDragUp = function(point) {
	this.onDragEnd();
	delete this.dragging;

	if(this.parentShape) {
		this.parentShape.onChildDragged(this, point);
	}

	return;
}

UIElement.prototype.animMove = function(x, y, hint) {
	if((this.x === x && this.y === y) || this.dragging) {
		return;
	}

	var el = this;
	var duration = 1000;
	var xStart = this.x;
	var yStart = this.y;
	var xRange = x - this.x;
	var yRange = y - this.y;
	var startTime = (new Date()).getTime();
	var interpolator =  new DecelerateInterpolator();

	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(el.dragging) {
			return;
		}

		if(timePercent < 1 && !el.pointerDown) {
			el.x = Math.floor(xStart + percent * xRange);
			el.y = Math.floor(yStart + percent * yRange);
			setTimeout(animStep, 10);
		}
		else {
			el.move(x, y);
			delete startTime;
			delete interpolator;
		}

		delete now;
		el.postRedraw();
	}

	setTimeout(function() {
		animStep();
	}, 5);

	return;
}

UIElement.prototype.animate = function(config) {
	if(this.animating || this.dragging || !config) {
		return;
	}

	var el = this;
	var duration = isNaN(config.duration) ? 1000 : config.duration;
	var xStart = isNaN(config.xStart) ? this.x : config.xStart;
	var yStart = isNaN(config.yStart) ? this.y : config.yStart;
	var wStart = isNaN(config.wStart) ? this.w : config.wStart;
	var hStart = isNaN(config.hStart) ? this.h : config.hStart;
	var xEnd = isNaN(config.xEnd) ? this.x : config.xEnd;
	var yEnd = isNaN(config.yEnd) ? this.y : config.yEnd;
	var wEnd = isNaN(config.wEnd) ? this.w : config.wEnd;
	var hEnd = isNaN(config.hEnd) ? this.h : config.hEnd;
	var opacityStart = isNaN(config.opacityStart) ? this.opacity : config.opacityStart;
	var opacityEnd = isNaN(config.opacityEnd) ? this.opacity : config.opacityEnd;
	var rotationStart = isNaN(config.rotationStart) ? 0 : config.rotationStart;
	var rotationEnd = isNaN(config.rotationEnd) ? 0 : config.rotationEnd;
	var scaleStart = isNaN(config.scaleStart) ? this.scale : config.scaleStart;
	var scaleEnd = isNaN(config.scaleEnd) ? this.scale : config.scaleEnd;

	var onDone = config.onDone;
	var xRange = xEnd - xStart;
	var yRange = yEnd - yStart;
	var wRange = wEnd - wStart;
	var hRange = hEnd - hStart;
	var scaleRange = scaleEnd - scaleStart;
	var opacityRange = opacityEnd - opacityStart;
	var rotationRange = rotationEnd - rotationStart;

	var startTime = (new Date()).getTime();
	var interpolator =  config.interpolator ? config.interpolator : new DecelerateInterpolator();

	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(el.dragging) {
			return;
		}

		if(timePercent < 1 && !el.pointerDown) {
			if(xRange) {
				el.x = Math.floor(xStart + percent * xRange);
			}

			if(yRange) {
				el.y = Math.floor(yStart + percent * yRange);
			}
			
			if(wRange) {
				el.w = Math.floor(wStart + percent * wRange);
			}
			
			if(hRange) {
				el.h = Math.floor(hStart + percent * hRange);
			}

			if(opacityRange) {
				el.opacity = opacityStart + percent * opacityRange;	
			}

			if(rotationRange) {
				el.rotation = rotationStart + percent * rotationRange;
			}
	
			if(scaleRange) {
				el.scale = scaleStart + percent * scaleRange;
			}

			setTimeout(animStep, 10);
		}
		else {
			if(xRange || yRange) {
				el.move(xEnd, yEnd);
			}
			
			if(wRange || hRange) {
				el.w = wEnd;
				el.h = hEnd;
			}

			if(opacityRange) {
				el.opacity = opacityEnd;
			}

			if(rotationRange) {
				el.rotation = rotationEnd;
			}
			
			if(onDone) {
				onDone(el);
			}

			delete startTime;
			delete interpolator;
		}

		delete now;
		el.postRedraw();
	}

	var delay = config.delay;
	if(delay) {
		setTimeout(function() {
			animStep();
		}, delay);
	}
	else {
		animStep();
	}

	return;
}

UIElement.prototype.onPointerDownNormal = function(point) {
	if(!this.getParent()) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_NONE);
	}

	var date = new Date();
	var p = this.translatePoint(point);
	
	this.hitTestResult = this.hitTest(point);
	if(!this.hitTestResult) {
		return false;
	}

	this.pointerDown = true;
	this.pointerDownTime = date.getTime();
	this.childrenRange = this.calcChildrenRange();

	if(this.mode === C_MODE_EDITING) {
		this.onPointerDownEditing(point, true);
	}
	else if(this.enable) {
		this.onPointerDownRunning(p, true);
	}

	this.setPointerEventTarget(null);
	if(this.hitTestResult === C_HIT_TEST_MM || !this.selected) {
		if(this.dispatchPointerDownToChildren(p)) {
			if(this.mode === C_MODE_EDITING) {
				this.onPointerDownEditing(point, false);
			}
			else if(this.enable) {
				this.onPointerDownRunning(p, false);
			}
			
			this.lastPosition.x = point.x;
			this.lastPosition.y = point.y;
			this.setPointerEventTarget(this.targetShape);

			return true;
		}
	}

	if(this.hitTestResult === C_HIT_TEST_MM && this.children.length > 1 && this.canRectSelectable()) {
		this.hitTestResult = C_HIT_TEST_WORKAREA;
	}

	this.setTarget(null);
	this.setSelected(true);
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;
	if(this.mode === C_MODE_EDITING) {
		this.handlePointerEvent(point, 1);
	}
	
	if(this.mode === C_MODE_EDITING) {
		this.onPointerDownEditing(point, false);
	}
	else if(this.enable) {
		this.onPointerDownRunning(p, false);
	}

	var view = this.view;

	if(this.isUIScrollView) {
		setTimeout(function() {
			view.postRedraw();
		}, 100);
	}
	else {
		view.postRedraw();
	}

	return true;
}

UIElement.prototype.onPointerMoveNormal = function(point) {
	var p = this.translatePoint(point);

	if(!this.getParent()) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_NONE);
	}

	if(this.draggable && this.pointerDown) {
		if(this.mode !== C_MODE_EDITING) {
			this.handleDragMove(point);
			return;
		}
		else {
			delete this.dragging;
		}
	}

	if(this.hitTestResult) {
		if(this.mode === C_MODE_EDITING) {
			this.onPointerMoveEditing(point, true);
		}
		else if(this.enable) {
			this.onPointerMoveRunning(p, true);
		}

		var target = this.getPointerEventTarget();
		if(target) {
			target.onPointerMove(p);
			if(this.mode === C_MODE_EDITING) {
				this.onPointerMoveEditing(point, false);
			}
			else if(this.enable) {
				this.onPointerMoveRunning(p, false);
			}
		}
		else {
			if(this.mode === C_MODE_EDITING) {
				this.onPointerMoveEditing(point, false);
				if(this.hitTestResult === C_HIT_TEST_WORKAREA) {
					var p = {x:0, y:0};
					var range = this.childrenRange;
					var w = point.x - this.pointerDownPosition.x;
					var h = point.y - this.pointerDownPosition.y;
					var x = this.pointerDownPosition.x - this.x;
					var y = this.pointerDownPosition.y - this.y;
					var r = {x:x, y:y, w:w, h:h};

					if(((x > range.r) && w > 0) 
						|| ((y > range.b) && h > 0)
						|| ((x < range.l) && w < 0) 
						|| ((y < range.t) && h < 0)
						|| ((x > (this.w - 30)) && w > 0) 
						|| ((y > (this.h - 30)) && h > 0)
						|| ((x < 30) && w < 0) 
						|| ((y < 30) && h < 0)
						)
					{
						this.hitTestResult = C_HIT_TEST_MM;
						this.handlePointerEvent(point, 0);
					}
					else if(Math.abs(w) > 5 && Math.abs(h) > 5) {
						r = fixRect(r);
						this.setSelected(false);
						for(var i = this.children.length - 1; i >= 0; i--) {
							var iter = this.children[i];
							p.x = iter.x + iter.w/2;
							p.y = iter.y + iter.h/2;
							iter.setSelected(isPointInRect(p, r));
						}
					}
				}
				else {	
					this.handlePointerEvent(point, 0);
				}
			}
			else if(this.enable) {
				this.onPointerMoveRunning(p, false);
			}
		}

		this.lastPosition.x = point.x;
		this.lastPosition.y = point.y;

		return true;
	}
	else {
		//PC Mouse Over
		var pointerOverShape = null;

		if(this.isPointIn(null, point)) {
			if(this.isUIFrames) {
				var iter = this.getCurrentFrame();
				if(iter.isPointIn(null, p)) {
					pointerOverShape = iter;
					iter.onPointerMoveNormal(p);
				}
			}
			else {
				for(var i = this.children.length; i > 0; i--) {
					var iter = this.children[i-1];

					if(iter.isPointIn(null, p)) {
						pointerOverShape = iter;
						iter.onPointerMoveNormal(p);
						break;
					}
				}
			}
		}
	
		this.setPointerOverShape(pointerOverShape);
	}
		
	this.lastPosition.x = point.x;
	this.lastPosition.y = point.y;

	return false;
}

UIElement.prototype.needDrawTextTips = function(point) {
	return this.mode === C_MODE_EDITING && !this.children.length;	
}

UIElement.prototype.textEditable = function(point) {
	return this.mode === C_MODE_EDITING;	
}

UIElement.prototype.isClicked = function() {
	if(!this.view) {
		return false;
	}

	if(this.longPressed && this.events["onLongPress"]) {
		console.log("Long Pressed, Ignore Click Event.");
		return false;
	}

	return this.view.isClicked();
}

UIElement.prototype.onPointerUpNormal = function(point) {
	if(!this.getParent()) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_NONE);
	}

	if(this.hitTestResult) {
		var p = this.translatePoint(point);
		var isClick = this.isClicked();
		
		if(this.mode === C_MODE_EDITING) {
			this.onPointerUpEditing(point, true);
		}
		else if(this.enable) {
			this.onPointerUpRunning(p, true);
		}

		if(isClick && this.enable) {
			this.onClick(p, true);
		}

		var target = this.getPointerEventTarget();
		if(target) {
			target.onPointerUp(p);
		}
		else {
			if(this.mode === C_MODE_EDITING) {
				this.handlePointerEvent(point, -1);
			}
		}

		if(this.mode === C_MODE_EDITING) {
			this.onPointerUpEditing(point, false);
		}
		else {
			if(this.dragging) {
				this.handleDragUp(point);
			}
			else if(this.enable) {
				this.onPointerUpRunning(p, false);
			}
		}

		if(isClick && this.enable) {
			this.onClick(p, false);
		}
		
		this.hitTestResult = C_HIT_TEST_NONE;

		if(this.longPressed) {
			delete this.longPressed;
		}

		return true;
	}
	else {
		this.targetShape = null;

		if(this.mode !== C_MODE_EDITING && this.enable) {
			this.onPointerUpRunning(p, false);
			if(isClick) {
				this.onClick(p, false);
			}
		}

		if(this.longPressed) {
			delete this.longPressed;
		}
	}

	return false;
}

UIElement.prototype.onKeyDownRunning = function(code) {
	if(!this.handleKeyDown || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onKeyDown"];
		if(sourceCode) {
			sourceCode = "this.handleKeyDown = function(code) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleKeyDown) {
		try {
			this.handleKeyDown(code);
		}catch(e) {
			console.log("this.handleKeyDown:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.onKeyDownEditing = function(code) {
}

UIElement.prototype.onKeyDown = function(code) {
	if(this.targetShape) {
		this.targetShape.onKeyDown(code);
	}

	if(this.mode === C_MODE_EDITING) {
		this.onKeyDownEditing(code);
	}
	else {
		this.onKeyDownRunning(code);
	}

	return;
}

UIElement.prototype.onKeyUpRunning = function(code) {
	if(!this.handleKeyUp || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onKeyUp"];
		if(sourceCode) {
			sourceCode = "this.handleKeyUp = function(code) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleKeyUp) {
		try {
			this.handleKeyUp(code);
		}catch(e) {
			console.log("this.handleKeyUp:" + e.message);
		}
	}else if(this.isUIWindow && code == KeyEvent.DOM_VK_BACK_BUTTON && !cantkIsEditorActive()) {
		console.log("Back Key Pressed On: " + this.name);
		if(this.isMainWindow()) {
			var app = this.getApp();
			var wm = this.getWindowManager();

			if(this.mode === C_MODE_RUNNING) {
				wm.systemExit();
				app.exitApp();
				console.log("Back Key Pressed, Exit App.");
			}
		}
		else {
			this.closeWindow(0);
			console.log("Back Key Pressed, Close Current Window.");
		}
	}

	return true;
}

UIElement.prototype.onKeyUpEditing = function(code) {
}

UIElement.prototype.onKeyUp = function(code) {
	if(code === KeyEvent.DOM_VK_BACK && this.isUIWindow) {
		this.closeWindow(0);

		return;
	}

	if(this.targetShape) {
		this.targetShape.onKeyUp(code);
	}

	if(this.mode === C_MODE_EDITING) {
		this.onKeyUpEditing(code);
	}
	else {
		this.onKeyUpRunning(code);
	}

	return;
}

UIElement.prototype.afterSetView = function() {

	return true;
}

UIElement.prototype.setView = function(view) {
	this.view = view;

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.setView(view);
	}

	this.afterSetView(view);

	return;
}

UIElement.prototype.setApp = function(app) {
	this.app = app;
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.setApp(app);
	}

	return;
}

UIElement.prototype.shapeCanBeChild = function(shape) {
	return true;
}

UIElement.prototype.onAppendedInParent = function() {
}

UIElement.prototype.afterChildAppended = function(shape) {
	return true;
}

UIElement.prototype.beforeAddShapeIntoChildren = function(shape) {
	return true;
}

UIElement.prototype.addShapeIntoChildren = function(shape, p) {
	var r = {x:0, y:0, w:0, h:0};
	for(var i = this.children.length - 1; i >= 0; i--) {
		var iter = this.children[i];

		if(iter === shape) continue;

		if(iter.isContainer && iter.visible) {
			r.x = iter.getX();
			r.y = iter.getY();
			r.w = iter.w;
			r.h = iter.h;

			if(isPointInRect(p, r)) {
				return iter.addShape(shape, true, p);
			}
		}
	}

	return false;
}

UIElement.prototype.addChildWithJson = function(jsShape, index) {
	var type = jsShape.type ? jsShape.type : jsShape.id;
	var shape = ShapeFactoryGet().createShape(type, C_CREATE_FOR_USER);

	if(shape) {
		shape.fromJson(jsShape);
		this.addShape(shape, false, null, index);
	}

	return;
}

UIElement.prototype.setAlwaysOnTop = function(value) {
	this.alwaysOnTop = value;

	return;
}

UIElement.prototype.addShape = function(shape, offsetIt, point, index) {
	if(!shape.isUIElement) {
		return false;
	}

	if(offsetIt) {
		shape.moveDelta(-this.x, -this.y);
	}

	if(this.beforeAddShapeIntoChildren(shape) && point) {
		var p = this.translatePoint(point);
		if(this.addShapeIntoChildren(shape, p)) {
			return true;
		}
		shape.move(p.x, p.y);	
	}

	if(!this.shapeCanBeChild(shape)) {
		return false;
	}

	if(offsetIt) {
		var oldConfig = {};
	
		if(shape.deviceConfig) {
			oldConfig = JSON.parse(shape.deviceConfig);
			shape.deviceConfig = null;
		}
		else {
			oldConfig.version = "5";
			oldConfig.platform = "iphone";
			oldConfig.lcdDensity = "xhdpi";
		}

		var sizeScale = 1;
		var win = this.getWindow();
		var config = dupDeviceConfig(this.getDeviceConfig());
		var lcdDensity = (win && win.lcddensity) ? win.lcddensity : config.lcdDensity;

		if(lcdDensity !== oldConfig.lcdDensity || oldConfig.platform !== config.platform) {
			if(lcdDensity != "all") {
				config.lcdDensity = lcdDensity;
			}

			sizeScale = this.getSizeScale(oldConfig.lcdDensity, config.lcdDensity);
			shape.notifyDeviceConfigChanged(oldConfig, config);

			if(lcdDensity !== oldConfig.lcdDensity) {
				shape.scaleForDensity(sizeScale, config.lcdDensity, true);
			}
		}
	}

	shape.setParent(this);
	shape.setView(this.view);
	shape.setApp(this.app);

	if(isNaN(index) || index < 0) {
		this.children.push(shape);
	}
	else {
		this.children.insert(index, shape);
	}

	if(shape.isUIElement) {
		shape.setMode(this.mode, true);
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		if(iter.alwaysOnTop) {
			this.children.remove(iter);
			this.children.push(iter);
			break;
		}
	}

	this.afterChildAppended(shape);
	shape.onAppendedInParent();
	
	if(shape.isCreatingElement()) {
		this.relayout();
	}

	return true;
}

UIElement.prototype.addShapeDirectly = function(shape) {
	if(!this.shapeCanBeChild(shape)) {
		return false;
	}

	this.disableRelayout = true;
	shape.disableRelayout = true;

	shape.setParent(this);
	shape.setView(this.view);
	shape.setApp(this.app);
	this.children.push(shape);
	if(shape.isUIElement) {
		shape.mode = this.mode;
	}
	this.afterChildAppended(shape);

	delete shape.disableRelayout;
	delete this.disableRelayout;

	return true;
}

UIElement.prototype.addChild = function(child, position) {
	return this.addShape(child, false, null, position);
}
	
UIElement.prototype.shapeCanBeRemove = function(shape) {
	return true;
}

UIElement.prototype.afterChildRemoved = function(shape) {
	return true;
}

UIElement.prototype.removeAll = function() {
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var iter = this.children[0];
		this.removeShape(iter);
	}

	return;
}

UIElement.prototype.removeChild = function(child) {
	return this.removeShape(child);
}

UIElement.prototype.removeShape = function(shape) {
	if(!this.shapeCanBeRemove(shape)) {
		return false;
	}
	
	if(this.targetShape === shape) {
		this.targetShape = null;
	}

	this.children.remove(shape);
	
	shape.callOnRemoved();
	this.afterChildRemoved(shape);

	if(shape.getParent() === this) {
		shape.setParent(null);
		shape.setView(null);
		shape.setApp(null);
	}

	if(this.mode === C_MODE_EDITING) {
		this.relayout();
	}

	shape.onRemoved();

	return;
}

UIElement.prototype.afterPropertyChanged = function() {
	if(this.parentShape) {
		this.parentShape.relayoutChildren();
	}
	else {
		this.relayout();
	}

	return;
}

UIElement.prototype.getIndexOfChild = function(child) {
	return this.children.indexOf(child);
}

UIElement.prototype.findChildByType = function(type, recursive) {
	var i = 0;
	var s = null;
	var shape = null;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		shape = this.children[i];
		if(shape.type === type) {
			return shape;
		}
	}

	if(recursive) {
		for(i = 0; i < n; i++) {
			shape = this.children[i];
			s = shape.findChildByType(type, recursive);
			if(s) {
				return s;
			}
		}
	}

	return null;
}

UIElement.prototype.findChildByName = function(name, recursive) {
	var i = 0;
	var s = null;
	var shape = null;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		shape = this.children[i];
		if(shape.name === name) {
			return shape;
		}
	}

	if(recursive) {
		for(i = 0; i < n; i++) {
			shape = this.children[i];
			s = shape.findChildByName(name, recursive);
			if(s) {
				return s;
			}
		}
	}

	return null;
}

UIElement.prototype.setValueOf = function(name, value) {
	var child = this.findChildByName(name, true);
	
	return child ? child.setValue(value) : null;
}

UIElement.prototype.getValueOf = function(name) {
	var child = this.findChildByName(name, true);
	
	return child ? child.getValue() : null;
}

UIElement.prototype.getSelectMark = function(type, point) {
	if(this.mode != C_MODE_EDITING) {
		return false;
	}

	var ret = true;
	switch(type) {
		case C_HIT_TEST_TL: {
			point.x = 0;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_TR: {
			point.x = this.w;
			point.y = 0;
			break;
		}
		case C_HIT_TEST_BL: {
			point.x = 0;
			point.y = this.h;
			break;
		}
		case C_HIT_TEST_BR: {
			point.x = this.w;
			point.y = this.h;
			break;
		}
		default: {
			ret = this.getMoreSelectMark(type, point);
		}
	}
	
	return ret;
}

UIElement.prototype.paintSelectingBox = function(canvas) {
	if(this.hitTestResult === C_HIT_TEST_WORKAREA) {
		var w = this.lastPosition.x - this.pointerDownPosition.x;
		var h = this.lastPosition.y - this.pointerDownPosition.y;
		
		if(Math.abs(w) > 10 && Math.abs(h) > 10) {
			var x = this.pointerDownPosition.x - this.x;
			var y = this.pointerDownPosition.y - this.y;
			canvas.rect(x, y, w, h);
			canvas.strokeStyle = "Gray";
			canvas.stroke();
		}
	}

	return true;
}

UIElement.prototype.beforePaintChild = function(child, canvas) {
	return;
}

UIElement.prototype.afterPaintChild = function(child, canvas) {
	return;
}

UIElement.prototype.paintTargetShape = function(canvas) {
	var targetShape = this.targetShape;
	if(targetShape && targetShape.selected && (targetShape.mode === C_MODE_EDITING || targetShape.dragging)) {
		shape = targetShape;
		this.beforePaintChild(shape, canvas);
		shape.paintSelf(canvas);
		this.afterPaintChild(shape, canvas);
	}

	return;
}

UIElement.prototype.defaultPaintChildren = function(canvas) {
	canvas.save();
	canvas.beginPath();
	var shape = null;
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		shape = this.children[i];
		if(shape.visible) {
			this.beforePaintChild(shape, canvas);
			shape.paintSelf(canvas);
			this.afterPaintChild(shape, canvas);
		}
	}
	
	this.paintTargetShape(canvas);

	canvas.restore();
	
	return;
}

UIElement.prototype.beforePaintChildren = function(canvas) {
	return;
}

UIElement.prototype.afterPaintChildren = function(canvas) {
	return;
}

UIElement.prototype.paintChildren = function(canvas) {
	this.defaultPaintChildren(canvas);

	return;
}

UIElement.prototype.paintSelfOnly =function(canvas) {
	return;
}

UIElement.prototype.drawImageAtCenter = function(ctx, image, x, y, w, h, keepRatio) {

	if(image && image.width > 0) {
		var imageW = image.width;
		var imageH = image.height;

		if(keepRatio) {
			var scale = Math.min(1, Math.min(h/imageH, w/imageW));
			var dw = imageW * scale;
			var dh = imageH * scale;
			var dx = ((w - dw)>>1) + x;
			var dy = ((h - dh)>>1) + y;
			
			dx = Math.max(dx, x);
			dy = Math.max(dy, y);
		}
		else {
			dx = x;
			dy = y;
			dw = w;
			dh = h;
		}

		ctx.drawImage(image, 0, 0, imageW, imageH, dx, dy, dw, dh);
	}

	return;
}


UIElement.prototype.drawImage =function(canvas) {
	this.drawBgImage(canvas);
	this.drawFgImage(canvas);

	return;
}

UIElement.prototype.drawFgImage =function(canvas) {
	return;
}

UIElement.prototype.getBgImage =function() {
	var image = null;
	
	if(this.enable) {
		if(this.pointerDown && !this.isClicked()) {
			image = this.images.normal_bg;
		}
		else {
			if(this.pointerDown) {
				image = this.images.active_bg;
			}
			else {
				if(this.isPointerOverShape() && this.getHtmlImageByType(CANTK_IMAGE_POINTER_OVER)) {
					image = this.images.pointer_over_bg;
				}
				else if(this.isFocused()) {
					image = this.images.focused_bg;
				}
				else {
					image = this.images.normal_bg;
				}
			}
		}
	}
	else {
		image = this.images.disable_bg;
	}

	if(!image || !image.getImage()) {
		image = this.images.default_bg;
	}

	if(!image || !image.getImage()) {
		return;
	}

	image = image.getImage();

	return image;
}

UIElement.prototype.drawImageAt = function(canvas, image, display, x, y, dw, dh, srcRect) {
	if(!image) {
		return;
	}

	var imageWidth = srcRect ?  srcRect.w : image.width;
	var imageHeight = srcRect ? srcRect.h : image.height;

	if(imageWidth <= 0 || imageHeight <= 0) {
		return;
	}

	var sx = srcRect ? srcRect.x : 0;
	var sy = srcRect ? srcRect.y : 0;
	var dx = 0;
	var dy = 0;
	var w = imageWidth;
	var h = imageHeight;

	if((display === CANTK_IMAGE_DISPLAY_CENTER) && (imageWidth > dw || imageHeight > dh)) {
		display = CANTK_IMAGE_DISPLAY_AUTO;
	}

	switch(display) {
		case CANTK_IMAGE_DISPLAY_CENTER: {
			dx = Math.floor(x + (dw - imageWidth)/2);
			dy = Math.floor(y + (dh - imageHeight)/2);

			canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
			break;
		}
		case CANTK_IMAGE_DISPLAY_SCALE: {
			dx = x;
			dy = y;
			canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			break;
		}
		case CANTK_IMAGE_DISPLAY_TILE: {
			dx = x;
			dy = y;

			while(dy < this.h) {
				dx = x;
				h = Math.min(this.h-dy, imageHeight);
				while(dx < this.w) {
					w = Math.min(this.w-dx, imageWidth);
					canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
					dx = dx + w;
					if(w === imageWidth) {
						dx = dx - 2;
					}
				}
				dy = dy + h;
				if(h === imageHeight) {
					dy = dy - 2;
				}
			}
			break;
		}
		case CANTK_IMAGE_DISPLAY_9PATCH: {
			dx = x;
			dy = y;
			if(imageWidth >= dw && imageHeight >= dh) {
				canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			}
			else {
				drawNinePatchEx(canvas, image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			}
			break;
		}
		case CANTK_IMAGE_DISPLAY_AUTO: {
			var scale = Math.min(dw/imageWidth, dh/imageHeight);
			w = imageWidth * scale;
			h = imageHeight * scale;
			dx = Math.floor(x + (dw - w) * 0.5);
			dy = Math.floor(y + (dh - h) * 0.5);
			
			canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, w, h);
			break;
		}
		case CANTK_IMAGE_DISPLAY_SCALE_KEEP_RATIO: {
			var sw = imageWidth/dw;
			var sh = imageHeight/dh;

			if(sw < sh) {
				var s = dh/dw;
				w = imageWidth;
				h = w * s;
			}
			else {
				var s = dw/dh;
				h = imageHeight;
				w = h * s;
			}

			dx = x;
			dy = y;
			
			canvas.drawImage(image, sx, sy, w, h, dx, dy, dw, dh);
			break;
		}
		default: {
			dx = x;
			dy = y;
			w = Math.min(imageWidth, this.w);
			h = Math.min(imageHeight, this.h);
			canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
			break;
		}
	}

	return;
}

UIElement.prototype.drawBgImage =function(canvas) {
	var image = this.getBgImage();

	this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h);

	return;
}

UIElement.prototype.beforeDrawIcon = function(canvas) {
	return false;
}

UIElement.prototype.afterDrawIcon = function(canvas) {
	return false;
}

UIElement.prototype.getLockImage = function() {
	if(!this.aLockImage) {
		this.aLockImage = new CanTkImage("/drawapp8/images/lock.png");
	}

	if(this.aLockImage) {
		return this.aLockImage.getImage();
	}

	return null;
}

UIElement.prototype.prepareStyle = function(canvas) {
	var style = this.style;
	
	canvas.lineWidth = style.lineWidth;			
	canvas.strokeStyle = style.lineColor;
	if(style.enableGradient) {
		canvas.fillStyle = style.getGradFillStyle(canvas, 0, 0, this.w, this.h);
	}
	else {
		if(!this.isFillColorTransparent()) {
			canvas.fillStyle = style.fillColor;
		}
	}
	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur    = 0;

	return;
}

UIElement.prototype.resetStyle = function(canvas) {
	canvas.shadowOffsetX = 0;
	canvas.shadowOffsetY = 0;
	canvas.shadowBlur    = 0;
	canvas.fillStyle = "White";
	canvas.beginPath();

	return;
}

UIElement.prototype.callOnUpdateTransformHandler = function() {
	if(!this.handleOnUpdateTransform || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onOnUpdateTransform"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateTransform = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnUpdateTransform) {
		try {
			this.handleOnUpdateTransform();
		}catch(e) {
			console.log("this.handleOnUpdateTransform:" + e.message);
		}
	}

	return;
}

UIElement.prototype.updateTransform = function() {
	this.callOnUpdateTransformHandler();

	return;
}

//
//Example:
//==========================================
//var config = {};
//config.rotationFrom = -0.2;
//config.rotationTo = 0.2;
//
//config.scaleFrom =  0.9;
//config.scaleTo = 1.1;
//
//config.opacityFrom =  0.1;
//config.opacityTo = 1.0;
//config.frequency = 0.5;
//
//var image = this.getWindow().findChildByName("ui-image", true);
//image.setHighlightConfig(config);
//

UIElement.prototype.saveTransform = function() {
	this.savedTransform = {};
	this.savedTransform.opacity = this.opacity;
	this.savedTransform.scale = this.scale;
	this.savedTransform.rotation = this.rotation;
	this.savedTransform.offsetX = this.offsetX;
	this.savedTransform.offsetY = this.offsetY;

	return;
}

UIElement.prototype.restoreTransform = function() {
	if(this.savedTransform) {
		this.opacity = this.savedTransform.opacity;
		this.scale = this.savedTransform.scale;
		this.rotation = this.savedTransform.rotation;
		this.offsetX = this.savedTransform.offsetX;
		this.offsetY = this.savedTransform.offsetY;
	}

	return;
}

UIElement.prototype.setHighlightConfig = function(highlightConfig) {
	if(highlightConfig) {
		//this.restoreTransform();
		this.saveTransform();
		this.removeHighlightConfig = false;
		this.highlightConfig = highlightConfig;
	}
	else {
		this.removeHighlightConfig = true;
	}

	return;
}

UIElement.prototype.updateHighlightTransform = function() {
	if(this.highlightConfig) {
		var me = this;
		var c = this.highlightConfig;
		var t = (new Date()).getTime()/1000;
		
		var frequency = c.frequency ? c.frequency : 4;
		var factor = Math.cos(frequency*t);

		if(this.removeHighlightConfig && Math.abs(factor) < 0.1) {
			this.removeHighlightConfig = false;
			this.highlightConfig = null;
			this.restoreTransform();

			return;
		}

		if(!isNaN(c.rotationFrom) && !isNaN(c.rotationTo)) {
			var delta = c.rotationTo - c.rotationFrom;
			var half = (c.rotationTo + c.rotationFrom)/2;

			this.rotation = half + 0.5 * delta * factor;
		}

		if(!isNaN(c.opacityFrom) && !isNaN(c.opacityTo)) {
			var delta = c.opacityTo - c.opacityFrom;
			var half = (c.opacityTo + c.opacityFrom)/2;

			this.opacity = half + 0.5 * delta * factor;
		}
		
		if(!isNaN(c.scaleFrom) && !isNaN(c.scaleTo)) {
			var delta = c.scaleTo - c.scaleFrom;
			var half = (c.scaleTo + c.scaleFrom)/2;

			this.scale = half + 0.5 * delta * factor;
		}
		
		if(!isNaN(c.offsetXFrom) && !isNaN(c.offsetXTo)) {
			var delta = c.offsetXTo - c.offsetXFrom;
			var half = (c.offsetXTo + c.offsetXFrom)/2;

			this.offsetX = half + 0.5 * delta * factor;
		}

		if(!isNaN(c.offsetYFrom) && !isNaN(c.offsetYTo)) {
			var delta = c.offsetYTo - c.offsetYFrom;
			var half = (c.offsetYTo + c.offsetYFrom)/2;

			this.offsetY = half + 0.5 * delta * factor;
		}

		setTimeout(function() {
			me.postRedraw();
		}, 10);
	}

	return;
}

UIElement.prototype.applyTransform = function(canvas) {
	var hw = this.w >> 1;
	var hh = this.h >> 1;

	canvas.translate(hw, hh);
	if(this.scale) {
		canvas.scale(this.scale, this.scale);
	}
	
	if(this.rotation) {
		canvas.rotate(this.rotation);
	}
	canvas.translate(-hw, -hh);

	if(this.offsetX) {
		canvas.translate(this.offsetX, 0);
	}

	if(this.offsetY) {
		canvas.translate(0, this.offsetY);
	}

	return;
}

UIElement.prototype.paintSelf = function(canvas) {
	canvas.save();
	this.translate(canvas);

	canvas.globalAlpha =  this.opacity;
	if(this.isIcon) {
		this.beforeDrawIcon(canvas);
	}

	canvas.save();
	this.prepareStyle(canvas);
	this.updateTransform();
	this.updateHighlightTransform();
	this.applyTransform(canvas);

	this.paintSelfOnly(canvas);
	this.drawImage(canvas);

	if(this.drawText && this.textType !== C_SHAPE_TEXT_NONE) {
		this.drawText(canvas);
		this.drawTextTips(canvas);
	}

	if((this.hitTestResult !== C_HIT_TEST_NONE 
		&& this.hitTestResult !== C_HIT_TEST_WORKAREA
		&& this.hitTestResult !== C_HIT_TEST_MM) 
		|| this.state !== C_STAT_NORMAL) {
		this.drawSizeTips(canvas);
	}
		
	this.resetStyle(canvas);
	canvas.restore();

	canvas.save();
	this.beforePaintChildren(canvas);
	this.paintChildren(canvas);
	this.afterPaintChildren(canvas);
	canvas.restore();

	if(this.mode === C_MODE_EDITING) {
		this.paintSelectingBox(canvas);
		this.drawSelectMarks(canvas);
	}
	
	if(this.isIcon) {
		this.afterDrawIcon(canvas);
	}

	if(this.selected && this.mode === C_MODE_EDITING) {
		if(this.isPositionLocked) {
			var image = this.getLockImage();
			if(image) {
				canvas.drawImage(image, 0, 0);
			}
		}

		canvas.font = "16pt Sans";
		canvas.textBaseline = "bottom";
		canvas.textAlign = "left";
		canvas.fillStyle = "#202020";
		var y = 10;
		if((this.parentShape && this.parentShape.isUIWindow && this.y < 10) || this.h > 400) {
			y = 24;
		}

		var str = dappGetText(this.type);
		if(this.isUIScrollView) {
			str = str + "(offset=" +Math.floor(this.offset)+ ")";
		}
		canvas.fillText(str, 0, y);
	}
	canvas.restore();
	
	return;
}

UIElement.prototype.regSerializer = function(to, from) {
	this.toJsoners.push(to);
	this.fromJsoners.push(from);

	return;
}

UIElement.prototype.toJsonMore = function(o) {
	if(this.isUIDevice) {
		this.exitPreview();
	}

	for(var i = 0; i < this.toJsoners.length; i++) {
		var to = this.toJsoners[i];
		if(to) {
			to.call(this, o);
		}
	}

	var n = this.children.length;
	var children = this.children;
	if(n) {
		o.children = new Array();

		for(var i = 0; i < n; i++) {
			var shape = children[i];
			o.children.push(shape.toJson());
		}
	}

	return o;
}

UIElement.prototype.childrenFromJson = function(js) {
	if(js.children) {
		var n = js.children.length;

		this.children.clear();
		for(var i = 0; i < n; i++) {
			var jsShape = js.children[i];
			var type = jsShape.type ? jsShape.type : jsShape.id;
			var shape = ShapeFactoryGet().createShape(type, C_CREATE_FOR_USER);
			if(shape) {
				this.addShapeDirectly(shape);
				shape.fromJson(jsShape);
			}
		}
	}

	return;
}

UIElement.prototype.fromJsonMore = function(js) {
	for(var i = 0; i < this.fromJsoners.length; i++) {
		var from = this.fromJsoners[i];
		if(from) {
			from.call(this, js);
		}
	}

	this.childrenFromJson(js);

	this.targetShape = null;
	this.selected = false;

	return this;
}
	
UIElement.prototype.afterApplyFormat = function() {
	if(this.parentShape) {
		this.parentShape.relayoutChildren();
	}
	else {
		this.relayout();
	}

	return;
}

UIElement.prototype.findShapeByPoint = function(point, recursive) {
	var p = this.translatePoint(point);
	
	for(var i = this.children.length; i > 0; i--) {
		var child = this.children[i-1];
		if(child.visible && child.hitTest(p)) {
			return child.findShapeByPoint(p, recursive);
		}
	}

	return this;
}

UIElement.prototype.getChildren = function() {
	return this.children;
}

UIElement.prototype.getChild = function(index) {
	return (index < this.children.length && index >= 0) ? this.children[index] : null;
}

UIElement.prototype.canBindingData = function() {
	return (!this.isUIDevice && !this.isUIScreen && !this.isUIWindowManager && this.children.length > 0);
}

UIElement.prototype.onDataBindingTemplate = function(template) {
	//template.name = this.name;
	if(this.isUIImage) {
		var image = this.getImageByType(CANTK_IMAGE_DEFAULT);
		var src = image ? image.getImageSrc(): "";

		src = this.getRelativePathOfURL(src);

		template.image = src;
	}
	else {
		if(this.value !== undefined) {
			template.value = this.value;
		}
	}

	if(this.text || this.isUILabel) {
		template.text = this.text;
	}

	return template;
}

UIElement.prototype.getDataBindingTemplate = function() {
	var i = 0;
	var iter = null;
	var template = {};
	var children = this.children;
	var n = this.children.length;

	this.onDataBindingTemplate(template);

	if(n > 0) {
		template.children = [];

		for(i = 0; i < n; i++) {
			iter = children[i];
			if(!this.childIsBuiltin(iter)) {
				template.children.push(iter.getDataBindingTemplate());
			}
		}
	}

	return template;
}

UIElement.prototype.setUserData = function(userData) {
	this.userData = userData;

	return;
}

UIElement.prototype.getUserData = function() {
	return this.userData;
}

UIElement.prototype.onBindData = function(data) {
	var text = data.text;
	var image = data.image;
	var value = data.value;

	if(text !== undefined) {
		this.setText(text);
	}
	if(image !== undefined) {
		this.setImage(CANTK_IMAGE_DEFAULT, image);
	}
	if(value !== undefined) {
		this.setValue(value);
	}

	if(data.textColor) {
		this.style.setTextColor(data.textColor);
	}
	
	if(data.fillColor) {
		this.style.setFillColor(data.fillColor);
	}
	
	if(data.lineColor) {
		this.style.setLineColor(data.lineColor);
	}

	if(data.fontSize) {
		this.style.setFontSize(data.fontSize);
	}
	
	this.setUserData(data.userData);

	if(data.height) {
		this.h = data.height;
	}

	if(this.offset) {
		this.offset = 0;
	}

	return;
}

UIElement.prototype.moveMustBeLastItemToLast = function() {
	var last = null;
	var children = this.children;
	var n = this.children.length;
	
	for(var i = 0; i < n; i++) {
		var iter = children[i];
		if(iter.name === "ui-last") {
			last = iter;
			children[i] = children[n-1];
			children[n-1] = last;
			break;
		}
	}

	return;
}

UIElement.prototype.childIsBuiltin = function(child) {
	return false;
}

UIElement.makeImageURLToAbsOfJson = function(json) {
	if(!json) {
		return;
	}

	var images = json.images;
	var host = window.location.protocol + "//" + window.location.host + "/";

	for(var key in images) {
		var value = images[key];
		if(key !== "display") {
			if(value.indexOf("http://") < 0 && value.indexOf("https://") < 0) {
				value = host + value;
				images[key] = value;
			}
		}
	}

	if(!json.children) {
		return;
	}

	for(var i = 0; i < json.children.length; i++) {
		var iter = json.children[i];

		UIElement.makeImageURLToAbsOfJson(iter);
	}

	return;
}

UIElement.prototype.getTemplateChildJson = function() {
	if(!this.templateChildJson) {
		var child = this.getTemplateChild();
		this.templateChildJson = child ? child.toJson() : null;
		UIElement.makeImageURLToAbsOfJson(this.templateChildJson);

		if(this.templateChildJson) {
			delete this.templateChildJson.isTemplate;
		}
		else {
			console.log("No Template Child.");
		}
	}

	return this.templateChildJson;
}

UIElement.prototype.getTemplateChild = function() {
	if(!this.templateChild) {
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			if(iter.isTemplate) {
				this.children.remove(iter);
				this.templateChild = iter;
				break;
			}
		}
		
		if(!this.templateChild) {
			this.templateChild = this.getLastUserChild();
		}
	}
	
	return this.templateChild;
}

UIElement.prototype.dupTemplateChild = function() {
	var child = this.getTemplateChild().clone();
	
	delete child.isTemplate;

	return child;
}

UIElement.prototype.getLastUserChild = function() {
	var children = this.children;
	var n = this.children.length;

	if(n > 0) {
		for(var i = n-1; i >= 0; i--) {
			var iter = children[i];
			if(!this.childIsBuiltin(iter)) {
				return iter;
			}
		}
	}

	return null;
}

UIElement.prototype.countUserChildren = function() {
	var nr = 0;
	var children = this.children;
	var n = this.children.length;

	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		if(!this.childIsBuiltin(iter)) {
			nr = nr + 1;
		}
	}

	return nr;
}

UIElement.prototype.bindData = function(data, animHint, clearOldData) {
	var shape = this;
	
	shape.disableRelayout = true;
	shape.doBindData(data, clearOldData);	
	delete shape.disableRelayout;
	shape.relayoutChildren(animHint);
	console.log("bindData: done");

	setTimeout(function() {
		shape.postRedraw();
	}, 500);

	return;
}

UIElement.prototype.doBindData = function(data, clearOldData) {
	var i = 0;
	var k = 0;
	var iter = null;
	var templateJson = (this.isUIList || this.isUIGrid) ? this.getTemplateChildJson() : null;
	
	this.onBindData(data);

	var children = this.children;
	var n = this.countUserChildren();
	if((n < 1 && !templateJson) || !data.children) {
		return;
	}

	var m = data.children.length;
	if((this.isUIList || this.isUIGrid)) {
		if(m > n) {
			templateJson.y = 0;
			for(i = n; i < m; i++) {
				this.addChildWithJson(templateJson);
			}
		}
		else if(m < n && clearOldData) {
			var arr = [];

			k = n - m;
			for(i = (this.children.length-1); i>= 0; i--) {
				var iter = this.children[i];
				if(!this.childIsBuiltin(iter) && !iter.isTemplate) {
					arr.push(iter);
				}
			}

			for(var i = 0; i < arr.length; i++) {
				var iter = arr[i];
				
				if(i === k) {
					break;
				}
				this.children.remove(iter);
				iter.setParent(null);
				iter.setApp(null);
				iter.setView(null);
			}
		}

		n = this.children.length;
	}
	else {
		n = this.children.length;
	}

	for(i = 0, k = 0; k < n & i < m; k++) {
		iter = children[k];
		if(!this.childIsBuiltin(iter)) {
			iter.doBindData(data.children[i]);
			i = i + 1;
		}
	}

	return;
}

UIElement.prototype.bindDataUrl = function(dataUrl, preprocess, onBindDone) {
	var rInfo = {};
	var shape = this;

	rInfo.method = "GET";
	rInfo.url = dataUrl;
	rInfo.noCache = true;

	rInfo.onDone = function(result, xhr, respContent) {
		var success = (xhr.status === 200);
		if(xhr.status === 200) {
			var data = respContent;
			if(preprocess) {
				data = preprocess(respContent);
			}
			
			try {
				var js = JSON.parse(data);

				shape.bindData(js, "default", true);	

				console.log("bindDataUrl: done");
			}
			catch(e) {
				success = false;
				console.log("bindDataUrl: failed" + e.message);
			}
		}
		
		if(onBindDone) {
			onBindDone(success);
		}

		return;
	}

	httpDoRequest(rInfo);

	return;
}

///////////////////////////////////////////////////////////////////////////////////////

var CANTK_IMAGE_DISPLAY_CENTER = 0;
var CANTK_IMAGE_DISPLAY_TILE   = 1;
var CANTK_IMAGE_DISPLAY_9PATCH = 2;
var CANTK_IMAGE_DISPLAY_SCALE  = 3;
var CANTK_IMAGE_DISPLAY_AUTO = 4;
var CANTK_IMAGE_DISPLAY_DEFAULT = 5;
var CANTK_IMAGE_DISPLAY_SCALE_KEEP_RATIO  = 6;

var CANTK_IMAGE_DISPLAY_NAMES = ["incenter", "tile", "9patch", "scale", "auto", "default", "scale(keep ratio)"];

var C_X_FIX_LEFT = 0;
var C_X_FIX_RIGHT = 1;
var C_X_SCALE = 2;
var C_X_CENTER_IN_PARENT = 3;
var C_X_LEFT_IN_PARENT	 = 4;
var C_X_RIGHT_IN_PARENT  = 5;
var C_X_AFTER_PREV       = 6;
var C_X_LAYOUT_NAMES = ["fix_left", "fix_right", "scale", "center_in_parent", "left_in_parent", "right_in_parent", "after_prev"];

var C_Y_FIX_TOP = 0;
var C_Y_FIX_BOTTOM = 1;
var C_Y_SCALE = 2;
var C_Y_MIDDLE_IN_PARENT = 3;
var C_Y_TOP_IN_PARENT	 = 4;
var C_Y_BOTTOM_IN_PARENT = 5;
var C_Y_AFTER_PREV       = 6;
var C_Y_LAYOUT_NAMES = ["fix_top", "fix_bottom", "scale", "middle_in_parent", "top_in_parent", "bottom_in_parent", "after_prev"];

var C_WIDTH_FIX = 0;
var C_WIDTH_SCALE = 1;
var C_WIDTH_FILL_PARENT = 2;
var C_WIDTH_FILL_AVAILABLE = 3;

var C_HEIGHT_FIX = 0;
var C_HEIGHT_SCALE = 1;
var C_HEIGHT_FILL_PARENT = 2;
var C_HEIGHT_FILL_AVAILABLE = 3;
var C_HEIGHT_KEEP_RATIO_WITH_WIDTH = 4;

var C_WIDTH_LAYOUT_NAMES = ["fix", "scale", "fill_parent", "fill_avaible"];
var C_HEIGHT_LAYOUT_NAMES = ["fix", "scale", "fill_parent", "fill_avaible", "keep_ratio_with_width"];

var CANTK_IMAGE_DEFAULT		   = "default_bg";
var CANTK_IMAGE_MASK		   = "mask_fg";
var CANTK_IMAGE_NORMAL	   = "normal_bg";
var CANTK_IMAGE_FOCUSED	   = "focused_bg";
var CANTK_IMAGE_ACTIVE	   = "active_bg";
var CANTK_IMAGE_POINTER_OVER = "pointer_over_bg";
var CANTK_IMAGE_DISABLE	   = "disable_bg";
var CANTK_IMAGE_DISABLE_FG    = "disable_fg";
var CANTK_IMAGE_NORMAL_FG    = "normal_fg";
var CANTK_IMAGE_ACTIVE_FG    = "active_fg";
var CANTK_IMAGE_ON_FG		   = "on_fg";
var CANTK_IMAGE_OFF_FG	   = "off_fg";
var CANTK_IMAGE_CHECKED_FG		= "checked_fg";
var CANTK_IMAGE_UNCHECK_FG	   = "uncheck_fg";
var CANTK_IMAGE_ON_FOCUSED	   = "focused_on_bg";
var CANTK_IMAGE_ON_ACTIVE		   = "active_on_bg";
var CANTK_IMAGE_OFF_FOCUSED	   = "focused_off_bg";
var CANTK_IMAGE_OFF_ACTIVE	   = "active_off_bg";
var CANTK_IMAGE_IMAGE		   = "image";
var CANTK_IMAGE_NORMAL_DRAG  = "normal_drag";
var CANTK_IMAGE_DELETE_ITEM  = "delete_item";

var CANTK_ITEM_BG_NORMAL  = "item_bg_normal";
var CANTK_ITEM_BG_ACTIVE  = "item_bg_active";
var CANTK_ITEM_BG_CURRENT_NORMAL = "item_bg_current_normal";
var CANTK_ITEM_BG_CURRENT_ACTIVE = "item_bg_current_active";

var C_TEXT_ALIGN_CENTER = 0;
var C_TEXT_ALIGN_LEFT	= 0;
var C_TEXT_ALIGN_RIGHT = 0;
var C_TEXT_ALIGN_NAMES = ["center", "left", "right"];

///////////////////////////////////////////////////////////////////////////////////////

function UIElementCreator(type) {
	type = type ? type : "ui-element";

	var args = [type, "UI-Element", null, 1];
	
	ShapeCreator.apply(this, args);
	
	this.createShape = function(createReason) {
		var g = new UIElement();

		return g.initUIElement(this.type);
	}
	
	return;
}

UIElement.prototype.sortChildren = function() {
	return;
}

UIElement.prototype.shouldShowContextMenu = function() {
	return this.mode === C_MODE_EDITING;
}

UIElement.prototype.getValue = function() {
	return this.getText();
}

UIElement.prototype.setValue = function(value) {
	this.setText(value);

	return;
}

UIElement.prototype.getPositionInView = function() {
	var x = this.getX();
	var y = this.getY();
	var point = {x:0, y:0};
	var iter = this.parentShape;

	while(iter != null) {
		x += iter.getX();
		y += iter.getY();
		if(iter.isUIVScrollView) {
			y = y - iter.offset;
		}
		else if(iter.isUIHScrollView) {
			x = x - iter.offset;
		}
		iter = iter.parentShape;
	}

	point.x = x;
	point.y = y;

	return point;
}

UIElement.prototype.getLocaleText = function(text) {
	var str = webappGetText(text);

	if(!str) {
		return text;
	}

	if(!this.locale) {
		this.locale = {text:str};
		this.needRelayout = true;
	}

	return str;
}

UIElement.prototype.getLocaleInputTips = function(text) {
	var str = webappGetText(text);

	return str ? str : text;
}

UIElement.prototype.setImage = function(type, src) {
	var me = this;
	var image = this.images[type];
	if(image) {
		image.setImageSrc(src);
	}
	else {
		image = new CanTkImage(src, function(img) {
			me.postRedraw();
		});
	}

	this.images[type] = image;

	return;
}

UIElement.prototype.getHtmlImageByType = function(type) {
	var image = this.images[type];
	
	return image ? image.getImage() : null;
}

UIElement.prototype.getImageByType = function(type) {
	
	return this.images[type];
}

UIElement.prototype.getImageSrcByType = function(type) {
	var image = this.images[type];

	return image ? image.getImageSrc() : "";
}

UIElement.prototype.getImageTypes = function() {
	var names = [];
	
	for(var key in this.images) {
		var value = this.images[key];
		if(key != "display") {
			names.push(key);
		}
	}

	return names;
}

UIElement.prototype.addEventNames = function(eventNames) {
	if(eventNames) {
		for(var i = 0; i < eventNames.length; i++) {
			var eName = eventNames[i];
			this.events[eName] = null;
		}
	}

	return;
}

UIElement.prototype.removeEventNames = function(eventNames) {
	if(eventNames) {
		for(var i = 0; i < eventNames.length; i++) {
			var eName = eventNames[i];
			delete this.events[eName];
		}
	}

	return;
}

UIElement.prototype.getEventNames = function() {
	var eventNames = [];

	for(var key in this.events) {
		eventNames.push(key);
	}

	return eventNames;
}

UIElement.prototype.initUIElement= function(type) {
	this.initContainerShape(type);

	this.enable = true;
	this.visible = true;
	this.opacity = 1;
	this.vMargin = 0;
	this.hMargin = 0;
	this.xAttr		= C_X_FIX_LEFT;
	this.yAttr		= C_Y_FIX_TOP;
	this.widthAttr	= C_WIDTH_FIX;
	this.heightAttr = C_HEIGHT_FIX;
	this.name = type;
	this.events = {};

	this.images  = {};
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;

	this.addEventNames(["onClick"]);
	this.regSerializer(this.elementToJson, this.elementFromJson);

	return this;
}

UIElement.prototype.updateLayoutParams = function() {
	this.xParam = 1;
	this.yParam = 1;
	this.widthParam = 1;
	this.heightParam = 1;

	var p = this.parentShape;
	if(!p) {
		return;
	}

	var wParent = p.getWidth(true);
	var hParent = p.getHeight(true);
	
	if(this.xAttr === C_X_SCALE) {
		this.xParam = this.x/wParent;
	}
	else if(this.xAttr === C_X_FIX_RIGHT) {
		this.xParam = wParent - (this.x + this.w);
	}
	
	if(this.yAttr === C_Y_SCALE) {
		this.yParam = this.y/hParent;
	}
	else if(this.yAttr === C_Y_FIX_BOTTOM) {
		this.yParam = hParent - (this.y + this.h);
	}

	if(this.widthAttr === C_WIDTH_SCALE) {
		this.widthParam = this.w/wParent;
	}

	if(this.heightAttr === C_HEIGHT_SCALE) {
		this.heightParam = this.h/hParent;
	}

	if(this.heightAttr === C_HEIGHT_KEEP_RATIO_WITH_WIDTH) {
		this.heightParam = this.h/this.w;
	}

	return;
}

UIElement.prototype.elementToJson = function(o) {
	this.updateLayoutParams();

	o.events = this.events;
	o.images = {};

	if(this.value != undefined) {
		o.value = this.value;
	}

	for(var key in this.images) {
		var value = this.images[key];
		if(key === "display") {
			o.images[key] = value;
		}
		else {
			var src = value.getImageSrc();
			src = this.getRelativePathOfURL(src);

			if(src) {
				o.images[key] = src;
			}
		}
	}

	return o;
}

UIElement.prototype.elementFromJson = function(js) {
	if(js.events) {
		for(var key in js.events) {
			var value = js.events[key];
			this.events[key] = value;
		}
	}

	for(var key in this.images) {
		var value = this.images[key];
		if(key !== "display") {
			this.setImage(key, null);
		}
	}

	if(js.images) {
		for(var key in js.images) {
			var value = js.images[key];
			if(key === "display") {
				this.images[key] = value;
			}
			else {
				this.setImage(key, value);
			}
		}
	}

	if(js.enable != undefined) {
		this.setEnable(js.enable);
	}

	if(js.opacity != undefined) {
		this.setOpacity(js.opacity);
	}

	return this;
}

UIElement.prototype.setEnable = function(enable) {
	this.enable = enable;

	return;
}

UIElement.prototype.setOpacity = function(opacity) {
	this.opacity = Math.max(0, opacity);
	this.opacity = Math.min(1, this.opacity);

	return;
}

UIElement.prototype.setVisible = function(visible) {
	this.visible = visible;

	return;
}

UIElement.prototype.isFocused = function() {
	return this.parentShape && this.parentShape.targetShape == this;
}

UIElement.prototype.isVisible = function() {
	var iter = this;

	if(!this.isValid()) {
		return false;
	}

	while(iter != null) {
		if(!iter.visible) {
			return false;
		}

		iter = iter.parentShape;
	}

	return true;
}

UIElement.prototype.hide = function() {
	this.visible = false;

	return;
}

UIElement.prototype.onShowHTML = function() {

	return;
}

UIElement.prototype.onHideHTML = function() {

	return;
}


UIElement.prototype.showHTML = function() {
	var i = 0;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		var child = this.children[i];
		child.showHTML();
	}

	this.onShowHTML();

	return;
}

UIElement.prototype.hideHTML = function() {
	var i = 0;
	var n = this.children.length;

	for(i = 0; i < n; i++) {
		var child = this.children[i];
		child.hideHTML();
	}

	this.onHideHTML();

	return;
}

UIElement.prototype.show = function() {
	this.setVisible(true);

	return;
}

UIElement.prototype.hide = function() {
	this.setVisible(false);

	return;
}

UIElement.prototype.showEventDialog = function() {
	showUIPropertyDialog(this, this.textType, null, 3);

	return;
}

UIElement.prototype.showProperty = function() {
	showUIPropertyDialog(this, this.textType);

	return;
}

UIElement.prototype.beforeRelayout = function() {
}

UIElement.prototype.afterRelayout = function() {
}

UIElement.prototype.getPrevSibling = function() {
	if(!this.parentShape || this.parentShape.children.length < 2) {
		return null;
	}

	var i = 0;
	for(i = 0; i < this.parentShape.children.length; i++) {
		if(this.parentShape.children[i] === this) {
			break;
		}
	}

	return i > 0 ? this.parentShape.children[i-1] : null;
}

UIElement.prototype.setAutoScaleFontSize = function(value) {
	this.enableAutoScaleFontSize = value;

	return;
}

UIElement.prototype.autoScaleFontSize = function(scale) {
	if(this.enableAutoScaleFontSize) {
		var fontSize = Math.round(this.style.fontSize * scale);
		
		fontSize = Math.min(fontSize, 36);
		fontSize = Math.max(fontSize, 12);
		this.style.setFontSize(fontSize);
	}

	return;
}


UIElement.prototype.relayout = function() {
	if(this.disableRelayout) {
		return;
	}

	var p = getParentShapeOfShape(this);
	if(!p || !p.isUIElement) {
		if(this.mode === C_MODE_EDITING) {
			this.setUserMovable(true);
			this.setUserResizable(true);
		}
	}

	if(this.isUIDevice) {
		this.setUserResizable(false);
	}

	if(!p) {
		this.relayoutChildren();
		return;
	}

	var w = 0;
	var h = 0;
	var x = 0;
	var y = 0;
	var wParent = p.getWidth(true);
	var hParent = p.getHeight(true);
	var hMargin = p.getHMargin();
	var vMargin = p.getVMargin();

	var bottom = this.y + this.h;
	var right = this.x + this.w

	this.beforeRelayout();

	switch(this.widthAttr) {
		case C_WIDTH_SCALE: {
			w = wParent * this.widthParam;
			if(this.widthScaleMin && w < this.widthScaleMin) {
				if(this.pointerDown) {
					this.widthScaleMin = w;
				}
				else {
					w = this.widthScaleMin;
				}
			}
			if(this.widthScaleMax && w > this.widthScaleMax) {
				if(this.pointerDown) {
					this.widthScaleMax = w;
				}
				else {
					w = this.widthScaleMax;
				}
			}

			break;
		}
		case C_WIDTH_FILL_PARENT: {
			w = wParent;
			break;
		}
		case C_WIDTH_FILL_AVAILABLE: {
			break;
		}
		default: {
			w = this.w;
			break;
		}
	}

	switch(this.heightAttr) {
		case C_HEIGHT_SCALE: {
			h = hParent * this.heightParam;
			if(this.heightScaleMin && h < this.heightScaleMin) {
				if(this.pointerDown) {
					this.heightScaleMin = h;
				}
				else {
					h = this.heightScaleMin;
				}
			}
			if(this.heightScaleMax && h > this.heightScaleMax) {
				if(this.pointerDown) {
					this.heightScaleMax = h;
				}
				else {
					h = this.heightScaleMax;
				}
			}

			break;
		}
		case C_HEIGHT_FILL_PARENT: {
			h = hParent;
			break;
		}
		case C_HEIGHT_FILL_AVAILABLE: {
			break;
		}
		default: {
			h = this.h;
			break;
		}
	}

	switch(this.xAttr) {
		case C_X_SCALE: {
			x = wParent * this.xParam;
			break;
		}
		case C_X_FIX_RIGHT: {
			x = wParent - this.xParam - this.w;
			break;
		}
		case C_X_CENTER_IN_PARENT: {
			x = (wParent - w)/2 + hMargin;
			break;
		}
		case C_X_LEFT_IN_PARENT: {
			x = hMargin;
			break;
		}
		case C_X_RIGHT_IN_PARENT: {
			x = wParent - w + hMargin;
			break;
		}
		case C_X_AFTER_PREV: {
			var prev = this.getPrevSibling();
			x = prev ? (prev.x + prev.w) : 0;
			break;
		}
		default: {
			x = this.x;
			break;
		}
	}
		
	switch(this.yAttr) {
		case C_Y_SCALE: {
			y = hParent * this.yParam;
			break;
		}
		case C_Y_FIX_BOTTOM: {
			y = hParent - this.yParam - this.h;
			break;
		}
		case C_Y_MIDDLE_IN_PARENT: {
			y = (hParent - h)/2 + vMargin;
			break;
		}
		case C_Y_TOP_IN_PARENT: {
			y = vMargin;
			break;
		}
		case C_Y_BOTTOM_IN_PARENT: {
			y = hParent - h + vMargin;
			break;
		}
		case C_Y_AFTER_PREV: {
			var prev = this.getPrevSibling();
			y = prev ? (prev.y + prev.h) : 0;
			break;
		}
		default: {
			y = this.y;
			break;
		}
	}
	
	if(this.widthAttr === C_WIDTH_FILL_AVAILABLE || this.heightAttr === C_HEIGHT_FILL_AVAILABLE) {
		var vNext = null;
		var hNext = null;

		this.x = x;
		this.y = y;

		for(var i = 0; i < p.children.length; i++) {
			var iter = p.children[i];
			if(iter.isUIMenu) {
				continue;
			}
			
			if(iter.y > (this.y + 30) && this.x < (iter.x + iter.w) && iter.x < right) {
				if(!vNext || iter.y < vNext.y) {
					vNext = iter;
				}
			}

			if(iter.x > (this.x + 30) && this.y < (iter.y + iter.h) && iter.y < bottom) {
				if(!hNext || iter.x < hNext.x) {
					hNext = iter;
				}
			}
		}

		if(this.widthAttr === C_WIDTH_FILL_AVAILABLE) {
			if(hNext) {
				w = hNext.x - x;
			}
			else {
				w = wParent - x + p.hMargin;
			}

			if(w <= 0) {
				w = this.w;
			}
		}

			
		if(this.heightAttr === C_HEIGHT_FILL_AVAILABLE) {
			if(vNext) {
				h = vNext.y - y;
			}
			else {
				h = hParent - y + p.vMargin;
			}
			if(h <= 0) {
				h = this.h;
			}
		}
	}
	
	if(this.heightAttr === C_HEIGHT_KEEP_RATIO_WITH_WIDTH) {
		h = w * this.heightParam;	
	}

	var oldW = this.w;

	this.x = Math.round(x);
	this.y = Math.round(y);
	this.w	= Math.round(w);
	this.h	= Math.round(h);

	if(p.isUIElement) {
		p.fixChildSize(this);
		p.fixChildPosition(this);
	}
	this.autoScaleFontSize(w/oldW);
	this.relayoutChildren();
	this.afterRelayout();
	this.setTextNeedRelayout(true);

	return;
}

UIElement.prototype.getCustomProp = function() {
	return "";
}

UIElement.prototype.loadCustomProp = function(form) {

	return;
}

UIElement.prototype.onMoved = function() {
	if(!this.parentShape || this.mode != C_MODE_EDITING) {
		return;
	}

	if(this.fixedX != null && !isNaN(this.fixedX)) {
		this.x = this.fixedX;
	}
	
	if(this.fixedY != null && !isNaN(this.fixedY)) {
		this.y = this.fixedY;
	}
	
	this.updateLayoutParams();

	return;
}

UIElement.prototype.setFixPosition = function(x, y) {
	this.fixedX = x;
	this.fixedY = y;

	return;
}

UIElement.prototype.beforeRelayoutChild = function(shape) {
	return true;
}

UIElement.prototype.afterRelayoutChild = function(shape) {
	return true;
}


UIElement.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child.widthAttr === C_WIDTH_FILL_AVAILABLE || child.heightAttr === C_HEIGHT_FILL_AVAILABLE) {
			continue;
		}

		if(this.beforeRelayoutChild(child)) {
			child.relayout();
		}
		this.afterRelayoutChild(child);
	}
	
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(!(child.widthAttr === C_WIDTH_FILL_AVAILABLE || child.heightAttr === C_HEIGHT_FILL_AVAILABLE)) {
			continue;
		}

		if(this.beforeRelayoutChild(child)) {
			child.relayout();
		}
		this.afterRelayoutChild(child);
	}

	return;
}

UIElement.prototype.getWindowManager = function() {
	var iter = this;

	while(iter != null && !iter.isUIWindowManager) {
		iter = iter.parentShape;
	}

	return iter;
}

UIElement.EVENT_STATUS_NONE = 0;
UIElement.EVENT_STATUS_HANDLED = 1;
UIElement.lastEventStatus = UIElement.EVENT_STATUS_NONE;

UIElement.prototype.setLastEventStatus = function(status) {
	UIElement.lastEventStatus = status;

	return;
}

UIElement.prototype.getLastEventStatus = function() {
	return UIElement.lastEventStatus;
}

UIElement.prototype.getDevice = function() {
	var iter = this;

	while(iter != null && !iter.isUIDevice) {
		iter = iter.parentShape;
	}

	return iter;
}

UIElement.prototype.getDeviceConfig = function() {
	var windowManager = this.getWindowManager();
	if(windowManager) {
		return windowManager.getDeviceConfig();
	}

	return null;
}

UIElement.prototype.isOnTopWindow = function() {
	var win = this.getWindow();
	var windowManager = this.getWindowManager();
	var curWin = windowManager.getCurrentFrame();

	if(win === curWin || win === curWin.popupWindow) {
		return true;
	}

	return false;
}

UIElement.prototype.getWindow = function() {
	var iter = this;

	while(iter != null && !iter.isUIWindow) {
		iter = iter.parentShape;
	}

	return iter;
}

UIElement.prototype.getPositionInWindow = function() {
	var iter = this;
	var x = iter.x;
	var y = iter.y;

	while(iter != null && !iter.isUIWindow) {
		iter = iter.parentShape;
		if(iter.isUIWindow) {
			break;
		}

		x = x + iter.x;
		y = y + iter.y;
	}

	return {x:x, y:y};
}

UIElement.prototype.getWindowNames = function() {
	var manager = this.getWindowManager();
	if(manager) {
		return manager.getWindowNames();
	}

	return [];
}

UIElement.prototype.openWindow = function(name, onClose, closeCurrent, initData) {
	var manager = this.getWindowManager();
	if(manager) {
		return manager.openWindow(name, onClose, closeCurrent, initData);
	}

	return false;
}

UIElement.prototype.backToHomeWin = function() {
	var manager = this.getWindowManager();
	if(manager) {
		manager.backToHomeWin();
	}

	return;
}

UIElement.prototype.closeWindow = function(retInfo) {
	var win = this.getWindow();
	var manager = this.getWindowManager();

	if(manager && win) {
		if(manager.isWindowOpen(win)) {
			return manager.closeCurrentWindow(retInfo);
		}
		else {
			console.log("Current Window Is Not Open.");
		}
	}

	return false;
}

UIElement.prototype.canBeComponent = function() {
	return true;
}

UIElement.prototype.makeItComponent = function() {
	showMakeItComponentDialog(this);

	return;
}

UIElement.prototype.showBindingDataDialog = function() {
	showBindingDataDialog(this);

	return;
}

UIElement.prototype.isCreatingElement = function() {
	if(this.view && this.view.creatingShape === this) {
		return true;
	}

	return false;
}

UIElement.prototype.onScaleForDensityDone = function(sizeScale, lcdDensity) {
}

UIElement.prototype.setNotScaleForDensity = function(notScaleForDensity) {
	this.notScaleForDensity = notScaleForDensity;

	return;
}

UIElement.prototype.scaleForDensity = function(sizeScale, lcdDensity, recuresive) {
	if(!sizeScale || sizeScale === 1 || this.notScaleForDensity) {
		return;
	}

	if(this.widthAttr === C_WIDTH_FIX || this.widthAttr === C_WIDTH_SCALE) {
		this.w = Math.floor(this.w * sizeScale);
	}

	if(this.heightAttr === C_HEIGHT_FIX || this.heightAttr === C_HEIGHT_SCALE) {
		this.h = this.h * sizeScale;
		if(this.h < 36 && (this.isUIButton || this.isUIProgressBar || this.isUIColorTile || this.isUIColorButton
			|| this.isUIEdit || this.isUIRadioBox || this.isUICheckBox || this.isUIWaitBar || this.isUISwitch)) {
			this.h = 40;
		}

		if(this.h < 50 && (this.isUIToolBar || this.isUIButtonGroup)) {
			this.h = 50;
		}

		if(this.hMin > this.h) {
			this.hMin = this.h;
		}
	}

	var isCreating = this.isCreatingElement();
	if(this.yAttr === C_Y_SCALE || this.yAttr === C_Y_FIX_TOP) {
		if(!isCreating) {
			this.y = Math.floor(this.y * sizeScale);
		}
	}

	if(this.xAttr === C_X_SCALE || this.xAttr === C_X_FIX_LEFT) {
		if(!isCreating) {
			this.x = Math.floor(this.x * sizeScale);
		}
	}

	this.style.setFontSize(Math.floor(this.style.fontSize * sizeScale));

	if(this.itemHeight > 20) {
		this.itemHeight = Math.floor(this.itemHeight * sizeScale);
	}

	if(this.roundRadius) {
		this.roundRadius = Math.floor(this.roundRadius * sizeScale);
	}

	this.vMargin = Math.floor(this.vMargin * sizeScale);
	this.hMargin = Math.floor(this.hMargin * sizeScale);

	if(this.buttonHeight > 40) {
		this.buttonHeight = Math.floor(this.buttonHeight * sizeScale);
	}
	
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	this.w = Math.floor(this.w);
	this.h = Math.floor(this.h);

	if(recuresive) {
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.scaleForDensity(sizeScale, lcdDensity, true);
		}
	}

	if(this.isUIProgressBar) {
		var value = this.getValue();
		this.setValue(0);
		this.setValue(value);
	}

	this.onScaleForDensityDone(sizeScale, lcdDensity);

	return;
}

UIElement.prototype.onDeviceConfigChanged = function(oldConfig, newConfig) {
	return;
}

UIElement.prototype.fixImagePath = function(oldConfig, newConfig) {
	var oldVersion	= oldConfig.version;
	var oldPlatform = oldConfig.platform;
	var oldDensity	= oldConfig.lcdDensity;
	var newVersion	= newConfig.version;
	var newPlatform = newConfig.platform;
	var newDensity	= newConfig.lcdDensity;

	for(var key in this.images) {
		var value = this.images[key];
		if(key === "display") {
			continue;
		}
		
		var src = value.getImageSrc();
		if(src) {
			src = src.replaceAll("/" + oldVersion + "/", "/" + newVersion + "/");
			src = src.replaceAll("/" + oldPlatform + "/", "/" + newPlatform + "/");
			src = src.replaceAll("/" + oldDensity + "/", "/" + newDensity + "/");
			value.setImageSrc(src);
		}
	}

	return;
}

UIElement.prototype.scaleForCurrentDensity = function(value) {
	var config = this.getDeviceConfig();
	var lcdDensity = this.getDensitySizeByName(config ? config.lcdDensity : "hdpi");
	
	return value * (lcdDensity/160);
}

UIElement.prototype.getDensitySizeByName = function(density) {
	switch(density) {
		case "ldpi": {
			return 80;
		}
		case "mdpi": {
			return 160;
		}
		case "hdpi": {
			return 240;
		}
		case "xhdpi": {
			return 350;
		}
		case "xxhdpi": {
			return 450;
		}
		default: {
			console.log("not supported density: " + density);
		}
	}

	return 160;
}

UIElement.prototype.getSizeScale = function(oldDensity, newDensity) {
	var oldSize = this.getDensitySizeByName(oldDensity);
	var newSize = this.getDensitySizeByName(newDensity);

	var sizeScale = newSize/oldSize;

	return sizeScale;
}

UIElement.prototype.notifyDeviceConfigChanged = function(oldConfig, newConfig) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.notifyDeviceConfigChanged(oldConfig, newConfig);
	}

	this.fixImagePath(oldConfig, newConfig);
	this.onDeviceConfigChanged(oldConfig, newConfig);
	
	return;
}

UIElement.prototype.callOnScrollDone = function() {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnScrollDone || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onScrollDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnScrollDone = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnScrollDone) {
		try {
			this.handleOnScrollDone();
		}catch(e) {
			console.log("this.handleOnScrollDone:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnRemoved = function() {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnRemoved || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onRemoved"];
		if(sourceCode) {
			sourceCode = "this.handleOnRemoved = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnRemoved) {
		try {
			this.handleOnRemoved();
		}catch(e) {
			console.log("this.handleOnRemoved:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChildDragging = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChildDragging || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChildDragging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragging = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChildDragging) {
		try {
			this.handleOnChildDragging(sourceChildIndex, targetChildIndex);
		}catch(e) {
			console.log("this.handleOnChildDragging:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChildDragged = function(sourceChildIndex, targetChildIndex) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChildDragged || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChildDragged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChildDragged = function(sourceChildIndex, targetChildIndex) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChildDragged) {
		try {
			this.handleOnChildDragged(sourceChildIndex, targetChildIndex);
		}catch(e) {
			console.log("this.handleOnChildDragged:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChanging = function(value) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChanging || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChanging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanging = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChanging) {
		try {
			this.handleOnChanging(value);
		}catch(e) {
			console.log("this.handleOnChanging:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChanged = function(value) {
	if(!this.enable) {
		return false;
	}

	if(this.onChanged) {
		this.onChanged(value);

		return;
	}

	if(!this.handleOnChanged || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChanged"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanged = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChanged) {
		try {
			this.handleOnChanged(value);
		}catch(e) {
			console.log("this.handleOnChanged:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnInit = function() {
	if(!this.handleOnInit || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onInit"];
		if(sourceCode) {
			sourceCode = "this.handleOnInit = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnInit) {
		try {
			this.handleOnInit();
		}catch(e) {
			console.log("this.handleOnInit:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnChanging = function(value) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnChanging || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onChanging"];
		if(sourceCode) {
			sourceCode = "this.handleOnChanging = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnChanging) {
		try {
			this.handleOnChanging(value);
		}catch(e) {
			console.log("this.handleOnChanging:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnFocusIn = function() {
	if(this.onFocusIn) {
		try {
			this.onFocusIn();
		}
		catch(e) {
			console.log("onFocusIn:" + e.message);
		}
	}

	if(!this.handleOnFocusIn || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onFocusIn"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusIn = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnFocusIn) {
		try {
			this.handleOnFocusIn();
		}catch(e) {
			console.log("this.handleOnFocusIn:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.callOnFocusOut = function() {
	if(this.onFocusOut) {
		try {
			this.onFocusOut();
		}
		catch(e) {
			console.log("onFocusOut: " + e.message);
		}
	}

	if(!this.handleOnFocusOut || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onFocusOut"];
		if(sourceCode) {
			sourceCode = "this.handleOnFocusOut = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnFocusOut) {
		try {
			this.handleOnFocusOut();
		}catch(e) {
			console.log("this.handleOnFocusOut:" + e.message);
		}
	}

	return true;
}

UIElement.prototype.addMovementForVelocityTracker = function() {
	if(this.velocityTracker) {
		var p = {};
		p.x = this.getMoveAbsDeltaX();
		p.y = this.getMoveAbsDeltaY();

		var date = new Date();
		var timeNs = date.getTime() * 1000000;
		this.velocityTracker.addMovement(timeNs, p);
		delete date;
	}

	return;
}

UIElement.prototype.animShow = function(animHint) {
	if(!this.visible) {
		animateUIElement(this, animHint);
	}

	return;
}

UIElement.prototype.animHide = function(animHint) {
	if(this.isVisible()) {
		animateUIElement(this, animHint);
	}
	else {
		this.setVisible(false);
	}

	return;
}

UIElement.prototype.atLeft = function() {
	this.exec(new PositionSizeAttrCommand(this, C_X_LEFT_IN_PARENT, null, null, null));

	return;
}

UIElement.prototype.atRight = function() {
	this.exec(new PositionSizeAttrCommand(this, C_X_RIGHT_IN_PARENT, null, null, null));

	return;
}

UIElement.prototype.atTop = function() {
	this.exec(new PositionSizeAttrCommand(this, null, C_Y_TOP_IN_PARENT, null, null));
	
	return;
}

UIElement.prototype.atBottom = function() {
	this.exec(new PositionSizeAttrCommand(this, null, C_Y_BOTTOM_IN_PARENT, null, null));
	
	return;
}

UIElement.prototype.atCenter = function() {
	this.exec(new PositionSizeAttrCommand(this, C_X_CENTER_IN_PARENT, null, null, null));
	
	return;
}

UIElement.prototype.atMiddle = function() {
	this.exec(new PositionSizeAttrCommand(this, null, C_Y_MIDDLE_IN_PARENT, null, null));
	
	return;
}


UIElement.prototype.saveState = function() {
	this.savedState = {};
	this.savedState.json = this.toJson();
	
	return;
}

UIElement.prototype.restoreState = function() {
	if(this.savedState && this.savedState.json) {
		this.fromJson(this.savedState.json);
		delete this.savedState.json;
	}

	return;
}

UIElement.prototype.isUserMovable = function() {
	if(this.widthAttr == C_WIDTH_FILL_PARENT 
			&& (this.yAttr === C_Y_TOP_IN_PARENT || this.yAttr === C_Y_MIDDLE_IN_PARENT || this.yAttr === C_Y_BOTTOM_IN_PARENT)) {
		return false;
	}
	
	if(this.heightAttr === C_HEIGHT_FILL_PARENT 
			&& (this.xAttr === C_X_LEFT_IN_PARENT || this.x === C_X_CENTER_IN_PARENT || this.xAttr === C_X_RIGHT_IN_PARENT)) {
		return false;
	}
	
	if(this.widthAttr === C_WIDTH_FILL_PARENT && this.heightAttr === C_HEIGHT_FILL_PARENT) {
		return false;
	}

	return this.userMovable;
}

UIElement.prototype.isUserResizable = function() {
	if(this.widthAttr === C_WIDTH_FILL_PARENT && this.heightAttr === C_HEIGHT_FILL_PARENT) {
		return false;
	}

	return this.userResizable;
}

UIElement.prototype.getEditorRect = function() {
	var rect = {};
	rect.x = this.x;
	rect.y = this.y;
	rect.w = this.w;
	rect.h = this.h;

	return rect;
}

//////////////////////////////////////////////////////////////////////
function UIGroup() {
	return;
}

UIGroup.prototype = new UIElement();
UIGroup.prototype.isUIGroup = true;

UIGroup.prototype.initUIGroup = function(type, w, h, img) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, img);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;
	this.setCanRectSelectable(false, false);
	this.addEventNames(["onInit"]);

	return this;
}

UIGroup.prototype.getCustomProp = function() {
	var content = ' \
		<label class="description" for="border">' + dappGetText("Border") + ':</label>\
		<input id="border"  class="element text small" type="number" maxlength="2" value="0"/> \
		<label class="description" for="linewidth1">' + dappGetText("Line Width") + ':</label>\
		<input id="linewidth1"  class="element text small" type="number" maxlength="2" value="0"/> \
		<label class="description" for="roundradius">' + dappGetText("Round Radius") + ':</label>\
		<input id="roundradius"  class="element text small" type="number" maxlength="2" value="0"/>'

	return content;
}

UIGroup.prototype.loadCustomProp = function(form) {
	var group = this;

	form.roundradius.value = this.roundRadius;
	form.roundradius.onchange = function(e) {
		group.setRoundRadius(parseInt(this.value));

		return;
	}
	
	form.border.value = this.getHMargin();
	form.border.onchange = function(e) {
		var border = parseInt(this.value);
		group.setMargin(border, border);

		return;
	}
	
	form.linewidth1.value = this.style.lineWidth;
	form.linewidth1.onchange = function(e) {
		var linewidth = parseInt(this.value);
		group.style.setLineWidth(linewidth);

		return;
	}
	
	return;
}

UIGroup.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPageManager || shape.isUIPage) {
		return false;
	}

	return true;
}

UIGroup.prototype.onPointerUpEditing = function(point, beforeChild) {
	if(!beforeChild) {
		this.relayoutChildren();
	}

	return;
}

UIGroup.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		canvas.lineWidth = this.style.lineWidth;

		canvas.fillStyle = this.style.fillColor;
		canvas.strokeStyle = this.style.lineColor;
		drawRoundRect(canvas, this.w, this.h, this.roundRadius);
		
		if(!this.isFillColorTransparent()) {
			canvas.fillStyle = this.style.fillColor;
			canvas.fill();
		}

		if(!this.isStrokeColorTransparent()) {
			canvas.stroke();	
		}
	}

	return;
}

function UIGroupCreator(w, h, img) {
	var args = ["ui-group", "ui-group", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGroup();

		return g.initUIGroup(this.type, w, h, img);
	}
	
	return;
}

function createUIGroupShape() {
	var g = new UIGroup();
	
	g.initUIGroup("ui-group", 200, 200, null);
	g.state = C_STAT_NORMAL;

	return g;
}


/*
 * File:   ui-layout.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Layout
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILayout() {
	return;
}

UILayout.prototype = new UIElement();
UILayout.prototype.isUILayout = true;

UILayout.prototype.initUILayout = function(type, w, h, img) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, img);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;
	this.setCanRectSelectable(false, false);
	this.vLayout = (this.type === "ui-v-layout");
	this.addEventNames(["onInit"]);

	return this;
}

UILayout.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UILayout.prototype.paintSelfOnly = function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image && this.mode === C_MODE_EDITING) {
		var x = this.vMargin;
		var y = this.hMargin;
		var w = this.getWidth(true);
		var h = this.getHeight(true);
		var vLayout = this.vLayout;

		drawDashedRect(canvas, x, y, w, h);
		if(this.children.length === 0) {
			if(vLayout) {
				drawDashedLine(canvas, {x:x, y:0.2*h+y}, {x:w+x, y:0.2*h+y}, 8, 4);
				drawDashedLine(canvas, {x:x, y:0.5*h+y}, {x:w+x, y:0.5*h+y}, 8, 4);
			}
			else {
				drawDashedLine(canvas, {x:0.2*w+x, y:y}, {x:0.2*w+x, y:h+y}, 8, 4);
				drawDashedLine(canvas, {x:0.5*w+x, y:y}, {x:0.5*w+x, y:h+y}, 8, 4);
			}
		}
		else {
			for(var i = 0; i < this.children.length; i++) {
				var iter = this.children[i];
				if(vLayout) {
					var y = iter.y + iter.h;
					drawDashedLine(canvas, {x:x, y:y}, {x:w+x, y:y}, 8, 4);
				}
				else {
					var x = iter.x + iter.w;
					drawDashedLine(canvas, {x:x, y:y}, {x:x, y:h+y}, 8, 4);
				}
			}
		}

		canvas.stroke();
	}

	return;
}

UILayout.prototype.sortChildren = function() {
	var vLayout = this.vLayout;
	if(vLayout) {
		this.children.sort(function(a, b) {
			var aa = a.y;
			var bb = b.y;

			return aa - bb;
		});
	}
	else {
		this.children.sort(function(a, b) {
			var aa = a.x;
			var bb = b.x;

			return aa - bb;
		});
	}

	return;
}

UILayout.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var x = this.hMargin;
	var y = this.vMargin;
	var spacer = this.spacer ? this.spacer : 0;
	var vLayout = this.vLayout;

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		if(!iter.isVisible()) {
			continue;
		}

		if(vLayout) {
			if(iter.heightAttr !== C_HEIGHT_FIX && iter.heightAttr !== C_HEIGHT_SCALE) {
				iter.heightAttr = C_HEIGHT_SCALE;
				iter.updateLayoutParams();
			}
			
			iter.y = y;
			iter.relayout();
			iter.y = y;

			y = y + iter.h + spacer;
		}
		else {
			if(iter.widthAttr !== C_WIDTH_FIX && iter.widthAttr !== C_WIDTH_SCALE) {
				iter.widthAttr = C_WIDTH_SCALE;
				iter.updateLayoutParams();
			}

			iter.x = x;
			iter.relayout();
			iter.x = x;
			
			x = x + iter.w + spacer;
		}
	}
	
	return;
}

UILayout.prototype.afterChildAppended = function(shape) {
	var vLayout = this.vLayout;
	if(vLayout) {
		shape.yAttr = C_Y_FIX_TOP;
		if(shape.heightAttr === C_HEIGHT_FILL_PARENT) {
			shape.heightAttr = C_HEIGHT_SCALE; 
		}
	}
	else {
		shape.xAttr = C_X_FIX_LEFT;
		if(shape.widthAttr === C_WIDTH_FILL_PARENT) {
			shape.widthAttr = C_WIDTH_SCALE;
		}
	}

	if(this.mode === C_MODE_EDITING && shape.isCreatingElement()) {
		this.sortChildren();
	}

	shape.setUserMovable(true);
	shape.setUserResizable(true);
	shape.setCanRectSelectable(false, true);

	return true;
}

function UIVLayoutCreator(w, h, img) {
	var args = ["ui-v-layout", "ui-layout", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILayout();

		return g.initUILayout(this.type, w, h, img);
	}
	
	return;
}

function UIHLayoutCreator(w, h, img) {
	var args = ["ui-h-layout", "ui-layout", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILayout();

		return g.initUILayout(this.type, w, h, img);
	}
	
	return;
}

/*
 * File:   ui-window.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIWindow() {
	return;
}

UIWindow.serialNo = 0;
UIWindow.prototype = new UIElement();
UIWindow.prototype.isUIWindow = true;

UIWindow.prototype.callOnGesture = function(gesture) {
	if(!this.enable) {
		return false;
	}

	if(!this.handleOnGesture || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onGesture"];
		if(sourceCode) {
			sourceCode = "this.handleOnGesture = function(gesture) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnGesture) {
		try {
			this.handleOnGesture(gesture);
		}catch(e) {
			console.log("this.callOnGesture:" + e.message);
		}
	}
	
	console.log("callOnGesture: scale=" + gesture.scale + " rotation=" + gesture.rotation);

	return true;
}

UIWindow.prototype.onGesture = function(gesture) {
	if(this.mode != C_MODE_EDITING) {
		this.callOnGesture(gesture);
	}

	return;
}

UIWindow.prototype.isMainWindow = function() {
	var wm = this.getWindowManager();
	var index = wm.history[0];
	var firstWin = wm.children[index];

	return firstWin === this;
}

UIWindow.prototype.resize = function(w, h) {
	if(this.state === C_STAT_NORMAL) {
		this.realResize(w, h);
	}

	return;
}

UIWindow.prototype.initUIWindow = function(type, x, y, w, h, bg) {
	this.initUIElement(type);	

	this.move(x, y);
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setName("window-" + UIWindow.serialNo++);
	
	if(!bg) {
		this.style.setFillColor("White");
	}
	this.addEventNames(["onLoad"]);
	this.addEventNames(["onUnload"]);
	this.addEventNames(["onOpen"]);
	this.addEventNames(["onBeforeOpen"]);
	this.addEventNames(["onClose"]);
	this.addEventNames(["onSwitchToBack"]);
	this.addEventNames(["onSwitchToFront"]);
	this.addEventNames(["onGesture"]);
	this.addEventNames(["onKeyDown"]);
	this.addEventNames(["onKeyUp"]);

	this.setAnimHint("htranslate");
	this.oldHitTest = this.hitTest;

	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	return this;
}

UIWindow.prototype.setAnimHint = function(animHint) {
	this.animHint = animHint;

	return true;
}

UIWindow.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar || shape.isUIWindow) {
		return false;
	}

	return true;
}

UIWindow.prototype.onModeChanged = function() {
	if(this.mode === C_MODE_EDITING) {
		this.popupWindow = null;
	}

	return;
}

UIWindow.prototype.removePopupWindow = function(popup) {
	if(this.popupWindow) {
		if(this.popupWindow === popup) {
			this.popupWindow = null;
			this.targetShape = null;

			return true;
		}

		return this.popupWindow.removePopupWindow(popup);
	}

	return false;
}

UIWindow.prototype.setPopupWindow = function(popup) {
	if(this.popupWindow) {
		return this.popupWindow.setPopupWindow(popup);
	}
	else {
		this.popupWindow = popup;
	}

	return true;
}

UIWindow.prototype.getPopupWindow =function() {
	if(this.popupWindow) {
		return this.popupWindow.getPopupWindow();
	}

	return this.isUIPopupWindow ? this : null;
}

UIWindow.prototype.isGrabElement = function(el) {
	return this.grabElement === el;
}

UIWindow.prototype.grab = function(el) {
	this.grabElement = el;

	return;
}

UIWindow.prototype.ungrab = function(el) {
	this.grabElement = null;

	return;
}

UIWindow.prototype.dispatchPointerDownToChildren = function(p) {
	if(this.grabElement) {
		this.grabElement.onPointerDown(p)
		this.setTarget(this.grabElement);
		return true;
	}

	if(this.popupWindow) {
		this.popupWindow.onPointerDown(p)
		this.setTarget(this.popupWindow);

		return true;
	}

	return this.defaultDispatchPointerDownToChildren(p);
}

UIWindow.prototype.paintChildren = function(canvas) {
	canvas.save();	
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	this.defaultPaintChildren(canvas);

	if(this.popupWindow) {
		this.popupWindow.paintSelf(canvas);
	}
	
	canvas.restore();

	return;
}

UIWindow.prototype.show = function() {
	this.setVisible(true);
	this.showHTML();

	return;
}

UIWindow.prototype.hide = function() {
	this.setVisible(false);
	this.hideHTML();
	cantkHideAllInput();

	return;
}

UIWindow.prototype.callOnBeforeOpen = function(initData) {
	if(!this.handleOnBeforeOpen || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onBeforeOpen"];
		if(sourceCode) {
			sourceCode = "this.handleOnBeforeOpen = function(initData) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	this.show();
	this.init();

	if(this.handleOnBeforeOpen) {
		this.handleOnBeforeOpen(initData);
	}

	return true;
}

UIWindow.prototype.callOnOpen = function(initData) {
	delete this.openPending;

	if(this.onOpen) {
		try {
			this.onOpen(initData);
		}catch(e) {
			console.log("onOpen" + e.message);
		}
	}

	if(!this.handleOnOpen || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onOpen"];
		if(sourceCode) {
			sourceCode = "this.handleOnOpen = function(initData) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnOpen) {
		try {
			this.handleOnOpen(initData);	
		}catch(e) {
			console.log("onOpen" + e.message);
		}
	}

	if(this.isSplashWindow()) {
		var win = this;
		var duration = win.duration ? win.duration : 3000;

		if(window.splashWinTimeID) {
			clearTimeout(window.splashWinTimeID);
			delete window.splashWinTimeID;
		}

		window.splashWinTimeID = setTimeout(function() {
			if(win.visible) {
				win.openWindow(null, null, true);
			}
		}, duration);
	}

	return true;
}

UIWindow.prototype.callOnClose = function(retInfo) {
	if(this.onClose) {
		try {
			this.onClose(retInfo);
		}
		catch(e) {
			console.log("onClose: " + e.message);
		}
	}
			
	if(!this.handleOnClose || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onClose"];
		if(sourceCode) {
			sourceCode = "this.handleOnClose = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnClose) {
		this.handleOnClose();
	}

	this.deinit();
	this.hide();

	return true;
}

UIWindow.prototype.callOnSwitchToBack =function() {
	if(!this.handleOnSwitchToBack || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onSwitchToBack"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwitchToBack = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSwitchToBack) {
		this.handleOnSwitchToBack();
	}

	this.hide();

	return true;
}

UIWindow.prototype.callOnSwitchToFront =function() {
	if(this.isUINormalWindow && (this.w != this.parentShape.w || this.h != this.parentShape.h)) {
		this.relayout();
		console.log("WindowManager Size Changed, Relayout Current Window.");
	}

	this.show();

	if(!this.handleOnSwitchToFront || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onSwitchToFront"];
		if(sourceCode) {
			sourceCode = "this.handleOnSwitchToFront = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnSwitchToFront) {
		this.handleOnSwitchToFront();
	}

	return true;
}

UIWindow.prototype.callOnLoad =function() {
	if(!this.handleOnLoad || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onLoad"];
		if(sourceCode) {
			sourceCode = "this.handleOnLoad = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnLoad) {
		this.handleOnLoad();
	}

	return true;
}

UIWindow.prototype.callOnUnload =function() {
	if(!this.handleOnUnload || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onUnload"];
		if(sourceCode) {
			sourceCode = "this.handleOnUnload = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnUnload) {
		this.handleOnUnload();
	}

	return true;
}

UIWindow.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	if(this.isSplashWindow()) {
		if(this.visible) {
			this.openWindow(null, null, true);
		}
	}

	return;
}

UIWindow.prototype.setCloseWhenPointerUpOutside = function(closeWhenPointerUpOutside) {
	if(closeWhenPointerUpOutside) {
		this.hitTest = function(point) {
			var ret = this.oldHitTest(point);
			if(!ret) {
				if(this.mode != C_MODE_EDITING) {
					ret = C_HIT_TEST_MM;
				}
			}

			return ret;
		}
	}
	else {
		this.hitTest = this.oldHitTest;
	}
	this.closeWhenPointerUpOutside = closeWhenPointerUpOutside;

	return;
}

UIWindow.prototype.isAnimationEnabled = function() {
	return this.animHint !== "none";
}

UIWindow.prototype.getAnimationName = function(toShow) {
	var anim = "";
	switch(this.animHint) {
		case "fade": {
			anim = toShow ? "anim-fade-in" : "anim-fade-out";
			break;
		}
		case "scale": {
			if(this.isUIDialog) {
				anim = toShow ? "anim-scale-show-dialog" : "anim-scale-hide-dialog";
			}
			else {
				anim = toShow ? "anim-scale-show-win" : "anim-scale-hide-win";
			}
			break;
		}
		case "popup": {
			anim = toShow ? "anim-move-up" : "anim-move-down";
			break;
		}
		case "htranslate": {
			anim = toShow ? "anim-forward" : "anim-backward";
			break;
		}
		default: {
			if(this.isUIDialog) {
				anim = toShow ? "anim-scale-show-dialog" : "anim-scale-hide-dialog";
			}
			else {
				if(isAndroid() || isFirefoxMobile()) {
					anim = toShow ? "anim-scale-show-win" : "anim-scale-hide-win";
				}
				else {
					anim = toShow ? "anim-forward" : "anim-backward";
				}
			}
			break;
		}
	}

	return anim;
}

UIWindow.prototype.isSplashWindow = function() {
	return this.isUINormalWindow && this.windowType === "splash";
}

UIWindow.prototype.getSupportedAnimations = function() {
	var animations = ["none", "default", "scale", "fade", "htranslate", "popup"];

	return animations;
}

UIWindow.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image && this.style.fillColor != "rgba(0,0,0,0)") {
		canvas.beginPath();
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIWindow.prototype.defaultChildrenFromJson = UIElement.prototype.childrenFromJson;

UIWindow.prototype.loadChildren = function() {
	if(this.childrenJson) {
		this.defaultChildrenFromJson(this.childrenJson);
		delete this.childrenJson;
		delete this.pendingLoadChildren;
		console.log("Now To Load Children Of " + this.name);

		if(this.scaleInfo) {
			this.scaleForDensity(this.scaleInfo.sizeScale, this.scaleInfo.lcdDensity, true);
		}

		var wm = this.getWindowManager();
		var oldConfig = wm.oldConfig;
		var deviceConfig = wm.deviceConfig;

		if(oldConfig && deviceConfig) {
			this.notifyDeviceConfigChanged(oldConfig, deviceConfig);
		}

	}

	return;
}

UIWindow.prototype.childrenFromJson = function(js) {
	if(js.lazyLoad && !dappIsEditorApp()) {
		this.childrenJson = js;
		this.pendingLoadChildren = true;
		console.log("Delay To Load Children Of " + this.name);
	}
	else {
		delete this.pendingLoadChildren;
		this.defaultChildrenFromJson(js);	
	}

	return;
}

//////////////////////////////////////////////////////////////////////}-{

function UINormalWindow() {
	return;
}

UINormalWindow.prototype = new UIWindow();
UINormalWindow.prototype.isUINormalWindow = true;

function UINormalWindowCreator(bg) {
	var args = ["ui-window", "ui-window", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UINormalWindow();
		
		g.initUIWindow(this.type, 0, 0, 100, 100, bg);
		g.widthAttr = C_WIDTH_FILL_PARENT;
		g.heightAttr = C_HEIGHT_FILL_PARENT;

		return g;
	}
	
	return;
}


/*
 * File:   ui-dialog.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Dialog
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIDialog() {
	return;
}

UIDialog.prototype = new UIWindow();
UIDialog.prototype.isUIDialog = true;
UIDialog.prototype.isUIPopupWindow = true;

function UIDialogCreator(w, h, bg) {
	var args = ["ui-dialog", "ui-dialog", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDialog();
		g.initUIWindow(this.type, 0, 0, w, h, bg);
		
		g.setMargin(8, 8);
		g.xAttr = C_X_CENTER_IN_PARENT;
		g.yAttr = C_Y_MIDDLE_IN_PARENT;
		g.images.display = CANTK_IMAGE_DISPLAY_SCALE;
		g.setAnimHint("scale");

		return g;
	}
	
	return;
}


/*
 * File:   ui-window-loading.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Loading Window
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILoadingWindow() {
	return;
}

UILoadingWindow.prototype = new UINormalWindow();
UILoadingWindow.prototype.isUILoadingWindow = true;

UILoadingWindow.prototype.getImageResources = function() {
	return this.imageResources ? this.imageResources : "";
}

UILoadingWindow.prototype.getAudioResources = function() {
	return this.audioResources ? this.audioResources : "";
}

UILoadingWindow.prototype.setImageResources = function(imageResources) {
	this.imageResources = imageResources;

	return;
}

UILoadingWindow.prototype.setAudioResources = function(audioResources) {
	this.audioResources = audioResources;

	return;
}

UILoadingWindow.prototype.loadAudioResources = function(onProgress) {
	var win = this;
	var arr = this.audioResources.split("\n");

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(!iter) {
			continue;
		}

		console.log("Loading " + iter);
		this.resources.totalResouces++;
		this.resources.loadingResouces++;

		var audio = new Audio();
		audio.preload = "auto";
		
		function onAudioLoad(e) {
			win.resources.loadingResouces--;
			onProgress(win.resources.totalResouces, win.resources.loadingResouces, true, this.src);
		}
		
		audio.addEventListener('canplaythrough', onAudioLoad, true);
		audio.onerror = function(e) {
			win.resources.loadingResouces--;
			win.resources.failedResouces++;
			onProgress(win.resources.totalResouces, win.resources.loadingResouces, false, this.src);
		}
		audio.src = iter;
		audio.load();

		win.resources.audios.push(audio);
	}

	return;
}

UILoadingWindow.prototype.loadImageResources = function(onProgress) {
	var win = this;
	var arr = this.imageResources.split("\n");

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(!iter) {
			continue;
		}

		console.log("Loading " + iter);
		this.resources.totalResouces++;
		this.resources.loadingResouces++;

		var image = new Image();
		image.onload = function(e) {
			win.resources.loadingResouces--;
			onProgress(win.resources.totalResouces, win.resources.loadingResouces, true, this.src);
		}
		
		image.onerror = function(e) {
			win.resources.loadingResouces--;
			win.resources.failedResouces++;
			onProgress(win.resources.totalResouces, win.resources.loadingResouces, false, this.src);
		}
		image.src = iter;

		win.resources.images.push(image);
	}

	return;
	
}

UILoadingWindow.prototype.loadResources = function(onProgress) {
	this.resources = {};
	this.resources.audios = [];
	this.resources.images = [];
	this.resources.totalResouces = 0;
	this.resources.failedResouces = 0;
	this.resources.loadingResouces = 0;

	if(this.imageResources) {
		this.loadImageResources(onProgress);
	}

	if(this.audioResources) {
		this.loadAudioResources(onProgress);
	}

	if(!this.resources.totalResouces) {
		onProgress(1, 0, false, "");
	}

	return;
}

function UILoadingWindowCreator(bg) {
	var args = ["ui-window-loading", "ui-window-loading", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILoadingWindow();
		
		g.initUIWindow(this.type, 0, 0, 100, 100, bg);
		g.widthAttr = C_WIDTH_FILL_PARENT;
		g.heightAttr = C_HEIGHT_FILL_PARENT;
		g.windowType = "splash";
		g.animHint = "none";
		g.duration = 30000;

		return g;
	}
	
	return;
}

/*
 * File:   ui-list.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIList() {
	return;
}

UIList.prototype = new UIElement();
UIList.prototype.isUIList = true;
UIList.prototype.isUILayout = true;

UIList.prototype.initUIList = function(type, border, itemHeight, bg) {
	this.initUIElement(type);	

	this.setMargin(border, border);
	this.setSizeLimit(100, 100, 1000, 1000);
	this.setDefSize(400, itemHeight * 3 + 2 * border);

	this.itemHeight = itemHeight;
	this.widthAttr = C_WIDTH_FILL_PARENT; 
	this.setTextType(C_SHAPE_TEXT_INPUT);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.rectSelectable = false;
	this.itemHeightVariable = false;
	this.addEventNames(["onInit"]);

	if(!bg) {
		this.style.setFillColor("White");
	}

	return this;
}

UIList.prototype.getItemHeight = function() {
	return this.itemHeight;
}

UIList.prototype.setItemHeight = function(itemHeight) {
	this.itemHeight = itemHeight;

	return;
}

UIList.prototype.shapeCanBeChild = function(shape) {
	if(!shape.isUIListItem) {
		return false;
	}

	return true;
}

UIList.prototype.paintSelfOnly =function(canvas) {
	return;
}

UIList.prototype.childIsBuiltin = function(child) {
	return child.name === "ui-list-item-update-status" 
		|| child.name === "ui-list-item-update-tips"
		|| child.name === "ui-last";
}

UIList.FIRST_ITEM = -1;
UIList.LAST_ITEM =   1;
UIList.MIDDLE_ITEM = 0;
UIList.SINGLE_ITEM = 2;

UIList.prototype.fixListItemImage = function(item, position) {
	var images = item.images;
	for(var key in images) {
		var value = images[key];
		if(key != "display") {
			var src = value.getImageSrc();
			switch(position) {
				case UIList.FIRST_ITEM: {
					src = src.replace(/\.single\./, ".first.");
					src = src.replace(/\.middle\./, ".first.");
					src = src.replace(/\.last\./, ".first.");
					break;
				}
				case UIList.MIDDLE_ITEM: {
					src = src.replace(/\.single\./, ".middle.");
					src = src.replace(/\.first\./, ".middle.");
					src = src.replace(/\.last\./, ".middle.");
					break;
				}
				case UIList.LAST_ITEM: {
					src = src.replace(/\.single\./, ".last.");
					src = src.replace(/\.first\./, ".last.");
					src = src.replace(/\.middle\./, ".last.");
					break;
				}
				case UIList.SINGLE_ITEM: {
					src = src.replace(/\.first\./, ".single.");
					src = src.replace(/\.middle\./, ".single.");
					src = src.replace(/\.last\./, ".single.");
					break;
				}
			}

			value.setImageSrc(src);
		}
	}

	return;
}

UIList.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var border = this.getHMargin();

	var x = border;
	var y = border;
	var w = this.w - 2 * border;
	var itemHeight = this.getItemHeight();
	var h = itemHeight;
	var n = this.children.length;
	var itemHeightVariable = this.itemHeightVariable;

	for(var i = 0; i < n; i++) {
		var config = {};
		var animatable = false;
		var child = this.children[i];

		if(itemHeightVariable || child.isHeightVariable()) {
			h = child.measureHeight(itemHeight);
		}
		else {
			h = itemHeight;
		}

		if(n === 1) {
			this.fixListItemImage(child, UIList.SINGLE_ITEM);
		}
		else if(i === 0) {
			this.fixListItemImage(child, UIList.FIRST_ITEM);	
		}
		else if(i === (n - 1)) {
			this.fixListItemImage(child, UIList.LAST_ITEM);	
		}
		else {
			this.fixListItemImage(child, UIList.MIDDLE_ITEM);	
		}

		if(this.h <= (y + border + h)) {
			this.h = y + border + h;
		}

		
		animatable =  (y < this.h) && (animHint || this.mode === C_MODE_EDITING);
		if(animatable) {
			config.xStart = child.x;
			config.yStart = child.y;
			config.wStart = child.w;
			config.hStart = child.h;
			config.xEnd = x;
			config.yEnd = y;
			config.wEnd = w;
			config.hEnd = h;

			config.delay = 10;
			config.duration = 1000;
			config.element = child;
			config.onDone = function (el) {
				el.relayoutChildren();
			}
			
			child.animate(config);
		}
		else {
			child.move(x, y);
			child.setSize(w, h);
			child.relayoutChildren();
		}

		child.setUserMovable(true);
	
		child.widthAttr = C_WIDTH_FILL_PARENT;
		if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
			child.heightAttr = C_HEIGHT_FIX;
		}
		child.setUserResizable(itemHeightVariable || child.isHeightVariable());
		if(!this.isUIScrollView) {
			child.setDraggable(this.itemDraggable);
		}

		y += h;
	}

	return;
}

UIList.prototype.beforePaintChildren = function(canvas) {
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	return;
}

UIList.prototype.afterPaintChildren = function(canvas) {
	return;
}

UIList.prototype.afterChildAppended = function(shape) {
	if(shape.view && this.mode === C_MODE_EDITING && shape.isCreatingElement()) {
		this.sortChildren();
	}
	this.moveMustBeLastItemToLast();
	shape.setUserMovable(true);
	shape.setUserResizable(false);
	shape.setCanRectSelectable(false, true);
	shape.autoAdjustHeight = this.itemHeightVariable;
	shape.setDraggable(this.itemDraggable);

	return true;
}

UIList.prototype.sortChildren = function() {
	this.children.sort(function(a, b) {
		var bb = b.y;
		var aa = (b.pointerDown && b.hitTestResult === C_HIT_TEST_MM) ? (a.y + a.h*0.8) : a.y;

		return aa - bb;
	});

	return;
}

UIList.prototype.onKeyUpRunning = function(code) {
	var targetShapeIndex = 0;

	if(!this.children.length) {
		return;
	}

	switch(code) {
		case KeyEvent.DOM_VK_UP: {
			targetShapeIndex = this.children.indexOf(this.targetShape) - 1;
			break;
		}
		case KeyEvent.DOM_VK_DOWN: {
			targetShapeIndex = this.children.indexOf(this.targetShape) + 1;
			break;
		}
		default: {
			return;
		}
	}

	var n = this.children.length;
	targetShapeIndex = (targetShapeIndex + this.children.length)%n;
	var targetShape = this.children[targetShapeIndex];

	this.setTarget(targetShape);
	this.postRedraw();

	if(this.isUIListView) {
		if(this.offset > targetShape.y) {
			this.offset = targetShape.y;
		}

		if((this.offset + this.h) < (targetShape.y + targetShape.h)) {
			this.offset = targetShape.y - (this.h - targetShape.h);
		}
	}

	return;
}

UIList.prototype.onKeyDownRunning = function(code) {
}

function UIListCreator(border, itemHeight, bg) {
	var args = ["ui-list", "ui-list", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIList();
		return g.initUIList(this.type, border, itemHeight, bg);
	}
	
	return;
}


/*
 * File:   ui-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Menu
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIMenu() {
	return;
}

UIMenu.ARROW_AT_TL = 1;
UIMenu.ARROW_AT_TM = 2;
UIMenu.ARROW_AT_TR = 3;
UIMenu.ARROW_AT_BL = 4;
UIMenu.ARROW_AT_BM = 5;
UIMenu.ARROW_AT_BR = 6;

UIMenu.prototype = new UIList();
UIMenu.prototype.isUIMenu = true;

UIMenu.prototype.initUIMenu = function(type) {
	this.initUIList(type, 5, 114, null);
	this.setAlwaysOnTop(true);

	return this;
}

UIMenu.prototype.onModeChanged = function() {
	if(this.mode === C_MODE_EDITING) {
		this.setVisible(true);
	}
	else {
		this.setVisible(false);
	}

	return;
}

UIMenu.prototype.show = function(callerElement) {
	this.showDown = true;
	this.fromLeft =  true;

	this.callerElement = callerElement;
	if(callerElement) {
		var y = this.y;
		var x = callerElement.x;
		var winH = this.getWindow().h;
		var winW = this.getWindow().w;
		var pos = callerElement.getPositionInWindow();

		if((pos.y + callerElement.h + this.h) < winH || pos.y < winH * 0.3) {
			y = pos.y + callerElement.h;
		}
		else {
			y = pos.y - this.h;
			this.showDown = false;
		}

		if(pos.x > 0.6 * winW) {
			this.fromLeft = false;
			x = (pos.x + callerElement.w - this.w);
		}

		if((x + this.w) > winW) {
			x = winW - this.w;
			this.fromLeft = false;
		}

		this.x = x;
		this.y = y;
	}

	var animHint = "";
	if(this.showDown) {
		animHint = this.fromLeft ? "anim-scale1-show-origin-topleft" : "anim-scale1-show-origin-topright";
	}
	else {
		animHint = this.fromLeft ? "anim-scale1-show-origin-bottomleft" : "anim-scale1-show-origin-bottomright";
	}
	
	this.animShow(animHint);
	this.getWindow().grab(this);

	return;
}

UIMenu.prototype.hide = function(animHint) {
	if(!this.visible) {
		return;
	}

	if(animHint) {
		if(this.showDown) {
			animHint = this.fromLeft ? "anim-scale1-hide-origin-topleft" : "anim-scale1-hide-origin-topright";
		}
		else {
			animHint = this.fromLeft ? "anim-scale1-hide-origin-bottomleft" : "anim-scale1-hide-origin-bottomright";
		}

		this.animHide(animHint);
	}
	else {
		this.setVisible(false);
	}

	this.getWindow().ungrab(this);
	delete this.showDown;
	delete this.fromLeft;
	delete this.callerElement;

	return;
}

UIMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!beforeChild) {
		this.hide("default");
	}

	return;
}

UIMenu.prototype.fixListItemImage = function(item, position) {
	return;
}

UIMenu.prototype.getItemHeight = function() {
	var n = this.children.length;
	if(n) {
		var itemHeight = this.getHeight(true) / n;

		return Math.min(itemHeight, 160);
	}

	return this.itemHeight;
}

UIMenu.prototype.setArrowPosition = function(arrowPosition) {
	this.arrowPosition = arrowPosition;

	return;
}

UIMenu.prototype.paintSelfOnly = function(canvas) {
	var image = this.getBgImage();
	var roundRadius = this.roundRadius ? this.roundRadius : 0;

	if(image) {
		return;
	}
	
	canvas.beginPath();
	canvas.lineWidth = 2;
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;
	drawRoundRect(canvas, this.w, this.h, roundRadius);
	canvas.fill();
	canvas.stroke();

	var size = Math.floor(this.scaleForCurrentDensity(10));
	var arrowPosition = this.arrowPosition ? this.arrowPosition : 0;

	var h = this.h;
	var halfSize = size >> 1;
	function drawUpArrow(offset) {
		var y = 0;
		canvas.beginPath();
		canvas.moveTo(offset, y+2);
		canvas.lineTo(offset + halfSize, y-halfSize);
		canvas.lineTo(offset + size, y+2);
		canvas.lineTo(offset, y+2);
		canvas.fill();

		canvas.beginPath();
		canvas.moveTo(offset, y);
		canvas.lineTo(offset + halfSize, y-halfSize);
		canvas.lineTo(offset + size, y);
		canvas.stroke();

		return;
	}
	
	function drawDownArrow(offset) {
		var y = h;
		canvas.beginPath();
		canvas.moveTo(offset, y-2);
		canvas.lineTo(offset + halfSize, y+halfSize);
		canvas.lineTo(offset + size, y-2);
		canvas.lineTo(offset, y-2);
		canvas.fill();

		canvas.beginPath();
		canvas.moveTo(offset, y);
		canvas.lineTo(offset + halfSize, y+halfSize);
		canvas.lineTo(offset + size, y);
		canvas.stroke();

		return;
	}

	switch(arrowPosition) {
		case UIMenu.ARROW_AT_TL: {
			var offset = Math.max(roundRadius, this.w >> 3);
			drawUpArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_TM: {
			var offset = Math.max(roundRadius, (this.w - size)>> 1);
			drawUpArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_TR: {
			var offset = this.w - Math.max(roundRadius, this.w >> 3) - size;
			drawUpArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_BL: {
			var offset = Math.max(roundRadius, this.w >> 3);
			drawDownArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_BM: {
			var offset = Math.max(roundRadius, (this.w - size)>> 1);
			drawDownArrow(offset);
			break;
		}
		case UIMenu.ARROW_AT_BR: {
			var offset = this.w - Math.max(roundRadius, this.w >> 3) - size;
			drawDownArrow(offset);
			break;
		}
		default:break;
	}

	return;
}

function UIMenuCreator() {
	var args = ["ui-menu", "ui-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMenu();
		return g.initUIMenu(this.type);
	}
	
	return;
}

/*
 * File:   ui-scrollview.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  ScrollView
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScrollView() {
	return this;
}

UIScrollView.prototype = new UIElement();
UIScrollView.prototype.isUIScrollView = true;

UIScrollView.prototype.afterChildAppended = function(shape) {
	shape.setCanRectSelectable(false, true);

	return true;
}

UIScrollView.prototype.initUIScrollView = function(type, border, bg) {
	this.initUIElement(type);	

	this.offset = 0;
	this.scrollBarOpacity = 0;
	this.setMargin(border, border);
	this.setSizeLimit(100, 100, 2000, 2000);
	this.setDefSize(300 + 2 * border, 300 + 2 * border);

	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator(2);

	this.widthAttr = C_WIDTH_FILL_PARENT; 
	this.heightAttr = C_HEIGHT_FILL_PARENT;
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setScrollable("always");

	if(!bg) {
		this.style.setFillColor("#f0f0f0");
	}
	this.setCanRectSelectable(false, true);

	return this;
}

UIScrollView.prototype.setScrollable = function(scrollable) {
	this.scrollable = scrollable;

	return;
}

UIScrollView.prototype.fixChildSize = function(child) {
	if(child.widthAttr === C_WIDTH_FILL_PARENT) {
		child.w = this.getWidth(true);
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
		child.h = this.getHeight(true);
	}

	if(child.widthAttr === C_WIDTH_FILL_PARENT && child.heightAttr === C_HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
		child.setUserResizable(false);
	}

	return;
}

UIScrollView.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage 
		|| shape.isUIList || shape.isUIGrid || shape.isUIProgressBar 
		|| shape.isUICheckBox || shape.isUIRadioBox || shape.isUIWaitBar 
		|| shape.isUIButtonGroup || shape.isUITips || shape.isUIGroup) {

		return true;
	}

	return false;
}

UIScrollView.prototype.onModeChanged = function() {
	this.offset = 0;

	return;
}

UIScrollView.prototype.scrollTo = function(offset) {
	this.offset = Math.round(offset);
	
	return;
}

UIScrollView.prototype.scrollDelta = function(delta) {
	var offset = this.offset + delta;
	
	this.scrollTo(offset);

	return;
}

UIScrollView.prototype.scrollToPageDelta = function(pageOffset) {
	var pageIndex = Math.floor(this.offset/this.w) + pageOffset;
	
	this.scrollToPage(pageIndex);

	return;
}

UIScrollView.prototype.scrollToPage = function(pageIndex) {
	if(pageIndex < 0) {
		pageIndex = 0;
	}

	var offset = this.w * pageIndex;
	var distance = this.offset - offset;
	
	this.animScrollTo(distance, 300);

	return;
}

UIScrollView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.velocityTracker.clear();

	return;
}

UIScrollView.prototype.onDrag = function(offset) {
	return;
}

UIScrollView.prototype.isScrollable = function() {
	if(this.scrollable === "always") {
		return true;
	}
	else if(this.scrollable === "never") {
		return false;
	}
	else {
		var range = this.getScrollRange();
		var pageSize = this.getPageSize();

		return range > pageSize;
	}
}

UIScrollView.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || !this.isScrollable()) {
		return;
	}

	this.scrollBarOpacity = 0;
	var delta = this.getScrollDelta(point);
	if(this.pointerDown && this.needScroll(point)) {
		this.scrollBarOpacity = 1.0;
		this.scrollDelta(-delta);
	}

	this.addMovementForVelocityTracker();
	this.onDrag(this.offset);

	return ;
}

UIScrollView.prototype.animScrollTo = function(distance, duration) {
	var scrollview = this;
	var date  = new Date();
	var startTime = date.getTime();
	var startOffset = this.offset;
	var endOffset = startOffset - distance;
	var range = this.getScrollRange();
	var pageSize = this.getPageSize();

	duration = duration < 400 ? 400 : duration;

	if(endOffset < 0) {
		duration = 600;
		distance = startOffset;
	}

	if(this.mode != C_MODE_EDITING) {
		if(endOffset > (range - pageSize)) {
			distance = startOffset - (range - pageSize);
		}
	}
	
	if(range <= pageSize) {
		endOffset = 0;
		distance = startOffset;
	}
	
	if(Math.abs(distance) > 100) {
		//this.prepareCache(this.offset, distance);
	}

	function scrollIt() {
		var now = new Date();
		var nowTime = now.getTime();
		var timePercent = (nowTime - startTime)/duration;
		var percent = scrollview.interpolator.get(timePercent);
		var offset = startOffset - distance * Math.min(percent, 1.0);

		if(timePercent < 1 && !scrollview.pointerDown) {
			setTimeout(scrollIt, 5);
			scrollview.scrollTo(offset);
			scrollview.scrollBarOpacity = 1 - percent;
		
		}
		else {
			var offset = startOffset - distance;
			scrollview.scrollBarOpacity = 0;
			scrollview.scrollTo(offset);
			scrollview.removeCache();
		}
		scrollview.postRedraw();

		return;
	}

	setTimeout(scrollIt, 5);

	return;
}

UIScrollView.prototype.onOutOfRange = function(offset) {
	return;
}

UIScrollView.prototype.prepareCache = function(offset, range) {
}

UIScrollView.prototype.removeCache = function() {

	return;
}

UIScrollView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || !this.isScrollable()) {
		return;
	}

	var delta = this.getScrolledSize();

	if(!this.needScroll(point)) {
		this.scrollBarOpacity = 0;

		return;
	}

	var duration = 0;
	var distance = 0;
	var velocity = this.getVelocity();

	var a = this.getPageSize();
	var t = velocity/a;
	var d = 0.5 * a * t * t;

	distance = Math.abs(d);
	duration = 2*distance/velocity;

	distance = delta < 0 ? -distance : distance;
	duration = Math.abs(duration);

	if(duration > 3) {
		duration = 3;
	}

	var startOffset = this.offset;
	var endOffset = startOffset - distance;
	
	if(endOffset < 0) {
		this.onOutOfRange(endOffset);
	}

	this.animScrollTo(distance, duration * 1000);

	return true;
}

UIScrollView.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
//		canvas.beginPath();
//		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

/*
 * File:   ui-h-scroll-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Horizonal ScrollView
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIHScrollView() {
	return;
}

UIHScrollView.prototype = new UIScrollView();
UIHScrollView.prototype.isUIHScrollView = true;

UIHScrollView.prototype.initUIHScrollView = function(type, border, bg) {
	this.initUIScrollView(type, border, bg);	
	this.setSizeLimit(100, 40, 2000, 2000);

	return this;
}

UIHScrollView.prototype.needScroll = function(point) {
	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	return (dx > 20 && dx > dy)  || (dx > 20 && this.mode != C_MODE_EDITING);
}

UIHScrollView.prototype.getScrolledSize = function() {
	return Math.floor(this.getMoveAbsDeltaX()); 
}

UIHScrollView.prototype.getScrollDelta = function(point) {
	return Math.floor(this.getMoveDeltaX()); 
}

UIHScrollView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().x;
}

UIHScrollView.prototype.getPageSize = function() {
	return this.w;
}

UIHScrollView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var pageOffset = 0;
	var velocity = this.getVelocity();
	var delta = this.getScrolledSize();
	var absDelta = Math.abs(delta);

	if(absDelta > this.w/4 || velocity > this.w) {
		if(delta < 0) {
			pageOffset = 1;
		}
		else {
			pageOffset = -1;
		}
	}
	
	this.scrollToPageDelta(pageOffset);

	return true;
}

UIHScrollView.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.x + this.offset), y : (point.y - this.y)};

	return p;
}

UIHScrollView.prototype.getScrollRange = function() {
	var range = 0;
	var r = this.calcChildrenRange();

	range = r.r - r.l;
	if(range < this.w) {
		 range = this.w;
	}
	range = Math.ceil(range/this.w) * this.w;

	return range;
}

UIHScrollView.prototype.fixChildPosition = function(child) {
	if(child.widthAttr === C_WIDTH_FILL_PARENT) {
		child.x = this.offset + this.hMargin;	
		child.widthAttr = C_WIDTH_SCALE;
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
		child.y = this.vMargin;
	}

	if(child.widthAttr === C_WIDTH_FILL_PARENT && child.heightAttr === C_HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
	}

	return;
}

UIHScrollView.prototype.paintChildren = function(canvas) {
	var shape = null;
	var leftClip = this.offset;
	var rightClip = this.offset + this.w;

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.closePath();
	canvas.clip();

	canvas.beginPath();
	canvas.translate(-this.offset, 0);

	for(var i = 0; i < this.children.length; i++) {
		shape = this.children[i];
		if(!shape.visible) {
			continue;
		}
		if((shape.x + shape.w) < leftClip || shape.y > rightClip) {
			continue;
		}
		
		this.beforePaintChild(shape, canvas);
		shape.paintSelf(canvas);
		this.afterPaintChild(shape, canvas);
	}
	
	this.paintTargetShape(canvas);
	
	canvas.restore();
	
	return;
}

function UIHScrollViewCreator(border, bg) {
	var args = ["ui-h-scroll-view", "ui-h-scroll-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHScrollView();
		return g.initUIHScrollView(this.type, border, bg);
	}
	
	return;
}

/*
 * File:   ui-v-scroll-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vertical ScrollView
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVScrollView() {
	return;
}

UIVScrollView.prototype = new UIScrollView();
UIVScrollView.prototype.isUIVScrollView = true;

UIVScrollView.prototype.initUIVScrollView = function(type, border, bg, scrollBarImg) {
	this.initUIScrollView(type, border, bg);	
	this.setSizeLimit(40, 100, 2000, 2000);
	this.setImage("scrollBarImg", scrollBarImg);
	this.rectSelectable = false;

	return this;
}


UIVScrollView.prototype.needScroll = function(point) {
	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	return (dy > 50 && dy > dx) || (dy > 50 && this.mode != C_MODE_EDITING);
}

UIVScrollView.prototype.getScrolledSize = function() {
	return Math.floor(this.getMoveAbsDeltaY()); 
}

UIVScrollView.prototype.getScrollDelta = function(point) {
	return Math.floor(this.getMoveDeltaY());
}

UIVScrollView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().y;
}

UIVScrollView.prototype.getPageSize = function() {
	return this.h;
}

UIVScrollView.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.x), y : (point.y - this.y + this.offset)};

	return p;
}

UIVScrollView.prototype.getScrollRange = function() {
	var range = 0;
	var r = this.calcChildrenRange();

	range = r.b;
	if(range < this.h) {
		 range = this.h;
	}

	var n = (this.mode === C_MODE_EDITING) ? this.h : 10;

	range = Math.ceil(range/n) * n;

	return range;
}

UIVScrollView.prototype.fixChildPosition = function(child) {
	if(child.widthAttr === C_WIDTH_FILL_PARENT) {
		child.x = this.hMargin;
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
		child.y = this.offset + this.vMargin;
		child.heightAttr = C_HEIGHT_SCALE;
	}
	
	if(child.widthAttr === C_WIDTH_FILL_PARENT && child.heightAttr === C_HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
	}

	return;
}

UIVScrollView.prototype.paintChildren = function(canvas) {
	var shape = null;
	var upClip = this.offset;
	var downClip = this.offset + this.h;

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.closePath();
	canvas.clip();

	canvas.beginPath();
	canvas.translate(0, -this.offset);

	for(var i = 0; i < this.children.length; i++) {
		shape = this.children[i];
		if(!shape.visible) {
			continue;
		}
		if((shape.y + shape.h) < upClip || shape.y > downClip) {
			continue;
		}

		this.beforePaintChild(shape, canvas);
		shape.paintSelf(canvas);
		this.afterPaintChild(shape, canvas);
	}
	
	this.paintTargetShape(canvas);

	canvas.restore();
	
	return;
}

UIVScrollView.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);

	return;
}

UIVScrollView.prototype.drawScrollBar = function(canvas) {
	var image = this.getHtmlImageByType("scrollBarImg");

	if(!this.scrollBarOpacity || !image) {
		return;
	}

	var range = this.getScrollRange();
	var x = this.w - image.width - 2;
	var w = image.width;
	var h = this.h * this.h/range;
	var y = (this.offset / range) * this.h;

	if((y + h) > this.h) {
		h = this.h - y;
		y = this.h - h;
	}
	
	if(y < 0) {
		h = h + y;
		y = 0;
	}

	canvas.save();
	canvas.globalAlpha = this.scrollBarOpacity;
	drawNinePatchEx(canvas, image, 0, 0, image.width, image.height, x, y, w, h);
	canvas.restore();

	return;
}

UIVScrollView.prototype.drawCache = function(canvas) {
	if(!this.cacheCanvas) {
		return false;
	}

	var y = Math.floor(this.offset - this.cacheOffset);
	canvas.drawImage(this.cacheCanvas, 0, y, this.w, this.h, 0, 0, this.w, this.h);
	this.drawScrollBar(canvas);

	console.log("y:" + y + " this.offset:" + this.offset + " this.cacheOffset:" + this.cacheOffset);
	return true;
}

UIVScrollView.prototype.prepareCache = function(offset, range) {
	var w = this.w;
	var h = this.h * 2;
	var tcanvas = cantkGetTempCanvas(w, h);
	var ctx = tcanvas.getContext("2d");

	ctx.clearRect(0, 0, w, h);
	var saveOffset = this.offset;
	var scrollBarOpacity = this.scrollBarOpacity;
	this.cacheCanvas = null;

	this.scrollBarOpacity = 0;

	if(range > 0) {
		this.offset = offset - range;
	}
	else {
		this.offset = offset;
	}
	this.cacheOffset = this.offset;
	console.log("this.cacheOffset:" + this.cacheOffset);
	
	ctx.save();
	ctx.translate(-this.x, -this.y);
	this.paintSelf(ctx);

	this.offset = this.offset + this.h;
	
	ctx.save();
	ctx.translate(0, this.h);
	this.paintSelf(ctx);
	ctx.restore();
	ctx.restore();

	this.offset = saveOffset;
	this.cacheCanvas = tcanvas;
	this.scrollBarOpacity = scrollBarOpacity;

	//window.open(tcanvas.toDataURL(), "_blank");

	return;
}

function UIVScrollViewCreator(border, bg, scrollBarImg) {
	var args = ["ui-v-scroll-view", "ui-v-scroll-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVScrollView();
		return g.initUIVScrollView(this.type, border, bg, scrollBarImg);
	}
	
	return;
}

/*
 * File:   ui-list-item.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List Item
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListItem() {
	return;
}

UIListItem.prototype = new UIElement();
UIListItem.prototype.isUIListItem = true;

UIListItem.prototype.initUIListItem = function(type, focusedImg, activeImg, normalImg, disableImg) {
	this.initUIElement(type);	

	this.setDefSize(200, 120);
	this.widthAttr = C_WIDTH_FILL_PARENT; 
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;
	this.setImage(CANTK_IMAGE_FOCUSED, focusedImg);
	this.setImage(CANTK_IMAGE_ACTIVE, activeImg);
	this.setImage(CANTK_IMAGE_NORMAL, normalImg);
	this.setImage(CANTK_IMAGE_DISABLE, disableImg);
	this.setImage(CANTK_IMAGE_POINTER_OVER, null);
	this.setImage(CANTK_IMAGE_DELETE_ITEM, null);
	this.addEventNames(["onLongPress", "onRemoved"]);

	return this;
}

UIListItem.prototype.dragMove = function(dx, dy) {
	this.y = this.y + dy;
	this.onDragging();

	return;
}

UIListItem.prototype.getDeleteItemIcon = function() {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DELETE_ITEM);

	return image;
}

UIListItem.prototype.shapeCanBeChild = function(shape) {

	if(shape.isUIMenu || shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPageManager || shape.isUIPage || shape.isUIListItem) {
		return false;
	}

	return true;
}

UIListItem.prototype.onUserResized = function() {
	var list = this.parentShape;
	if(list) {
		list.relayoutChildren();
	}

	return;
}

UIListItem.cachedBgImages = new Array();

UIListItem.prototype.addCacheImage = function(name, data, w, h) {
	var cacheImage = {name:name, data:data, w: w, h: h};

	UIListItem.cachedBgImages.push(cacheImage);

	return;
}

UIListItem.prototype.getCacheImage = function(name, w, h) {
	var i = 0;
	var iter = null;
	var images = UIListItem.cachedBgImages;
	var n = UIListItem.cachedBgImages.length;

	for(i = 0; i < n; i++) {
		iter = images[i];
		if(iter.w === w && iter.h === h && iter.name === name) {
			return iter.data;
		}
	}

	return null;
}

UIListItem.prototype.createCacheImage = function(image) {
	var dw = this.w;
	var dh = this.h;
	var data = null;
	var image = this.getBgImage();
	var canvasEl = BackendCanvasGet();
	var canvas = canvasEl.getContext("2d");

	if(image) {
		canvas.clearRect(0, 0, dw, dh);
		drawNinePatchEx(canvas, image, 0, 0, image.width, image.height, 0, 0, dw, dh);
		
		data = canvas.getImageData(0, 0, dw, dh);
		this.addCacheImage(image.src, data, dw, dh);
	}

	return data;
}

UIListItem.prototype.setSlideToRemove = function(value) {
	this.slideToRemove = value;

	return;
}

UIListItem.prototype.setHeightVariable = function(value) {
	this.heightVariable = value;
	
	return;
}

UIListItem.prototype.isHeightVariable = function() {
	return this.heightVariable;
}

UIListItem.prototype.measureHeight = function(height) {
	return this.h;
}

UIListItem.prototype.ANIM_DRAW_LINE = 1;
UIListItem.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || !this.slideToRemove) {
		return;
	}

	var dx = this.getMoveAbsDeltaX();
	var dy = this.getMoveAbsDeltaY();
	
	if(Math.abs(dx) < this.w/2 || (Math.abs(dy) > this.h)) {
		return;
	}

	var item = this;
	var duration = 300;
	var startTime = (new Date()).getTime();
	
	item.animateState = this.ANIM_DRAW_LINE;
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.style.setTextColor("#C0C0C0");
	}

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;
	
		if(percent < 1) {
			item.animatePercent = percent;
			setTimeout(animStep, 10);
		}
		else {
			item.animatePercent = 1;

			setTimeout(function() {
				delete startTime;
				delete item.animatePercent;
				delete item.animateState;

				var parentShape = item.parentShape;
				parentShape.removeChild(item);
				parentShape.relayoutChildren("default");
				parentShape.postRedraw();
			}, 300);
		}

		delete now;
		item.postRedraw();
	}

	animStep();

	return;
}

UIListItem.prototype.paintSelfOnly = function(canvas) {
	var image = this.getBgImage();

	if(image) {
		return;
	}

	canvas.beginPath();
	if(this.children.length === 0 && (this.isIcon || (this.parentShape && this.parentShape.isIcon))) {
		if(!this.isStrokeColorTransparent()) {
			canvas.strokeStyle = this.style.lineColor;
			drawDashedRect(canvas, 0, 0, this.w, this.h);
			canvas.stroke();
		}

		return;
	}
	
	var r = 10;
	var parentShape = this.parentShape;

	canvas.lineWidth = 2;
	canvas.strokeStyle = this.style.lineColor;

	if(this.pointerDown) {
		var dy = Math.abs(this.getMoveAbsDeltaY());
		canvas.fillStyle = dy < 5 ? this.style.textColor : this.style.fillColor;
	}
	else if(this.isPointerOverShape()) {
		canvas.fillStyle = this.style.overFillColor ? this.style.overFillColor : this.style.fillColor;
	}
	else if(this.isFocused()) {
		canvas.fillStyle = this.style.focusedFillColor ? this.style.focusedFillColor : this.style.fillColor;
	}
	else {
		canvas.fillStyle = this.style.fillColor;
	}

	if(!parentShape || parentShape.isUIListView || parentShape.isUIMenu) {
		canvas.fillRect(0, 0, this.w, this.h);
		canvas.moveTo(0, this.h);
		canvas.lineTo(this.w, this.h);
		canvas.stroke();

		return;
	}

	var r = Math.floor(this.h/12);
	var isFirst = (this == parentShape.children[0]);
	var isLast   = (this == parentShape.children[parentShape.children.length-1]);
	canvas.beginPath();
	if(isFirst && isLast) {
		drawRoundRect(canvas, this.w, this.h, r);
	}
	else if(isFirst) {
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.TL | RoundRect.TR);
	}
	else if(isLast) {
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.BL | RoundRect.BR);
	}
	else {
		canvas.rect(0, 0, this.w, this.h);
	}
	canvas.fill();
	canvas.stroke();

	return;
}

UIListItem.prototype.afterPaintChildren = function(canvas) {
	if(!this.animateState) {
		return;
	}

	var image = this.getDeleteItemIcon();
	if(this.animateState === this.ANIM_DRAW_LINE && image && image.width > 0) {
		var margin = 20;
		var percent = this.animatePercent;
		var w = (this.w - margin ) * percent - image.width;

		if(w > margin) {
			canvas.lineWidth = 1;
			canvas.strokeStyle = "#D0D0D0";
			canvas.moveTo(margin, this.h/2);
			canvas.lineTo(w, this.h/2);
			canvas.stroke();

			if(percent > 0.9) {
				var y = (this.h - image.height)/2;
				var x = this.w - image.width - margin;

				canvas.drawImage(image, x, y);
			}
		}
	}

	return;
}

UIListItem.prototype.afterChildAppended = function(shape) {
	if(shape.isUIButton || shape.isUICheckBox) {
		this.setImage(CANTK_IMAGE_ACTIVE, this.getImageByType(CANTK_IMAGE_NORMAL).getImageSrc());
		this.setImage(CANTK_IMAGE_FOCUSED, this.getImageByType(CANTK_IMAGE_NORMAL).getImageSrc());
	}

	return true;
}

function UIListItemCreator(focusedImg, activeImg, normalImg, disableImg) {
	var args = ["ui-list-item", "ui-list-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListItem();
		g.initUIListItem(this.type, focusedImg, activeImg, normalImg, disableImg);
	
		return g;
	}
	
	return;
}


/*
 * File:   ui-button-group.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Button Group
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIButtonGroup() {
	return;
}

UIButtonGroup.prototype = new UIElement();
UIButtonGroup.prototype.isUIButtonGroup = true;

UIButtonGroup.prototype.initUIButtonGroup = function(type, border, buttonMaxWidth, bg) {
	this.initUIElement(type);	

	this.setMargin(border, border);
	this.setDefSize(300, 60);
	this.setSizeLimit(100, 40, 1000, 120);

	this.buttonMaxWidth = buttonMaxWidth;
	this.widthAttr = C_WIDTH_FILL_PARENT; 
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.rectSelectable = false;
	this.addEventNames(["onInit"]);

	if(!bg) {
		this.style.setFillColor("White");
	}

	return this;
}

UIButtonGroup.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton || shape.isUIGroup || shape.isUIRadioBox || shape.isUICheckBox) {
		return true;
	}

	return false;
}

UIButtonGroup.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image && !this.isFillColorTransparent()) {
		canvas.beginPath();
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIButtonGroup.prototype.relayoutChildren = function() {
	var border = this.getHMargin();
	var n = this.children.length;

	if(n === 0 || this.disableRelayout) {
		return;
	}

	var x = border;
	var y = border;

	var h = this.h - 2 * border;
	var maxWidth = this.buttonMaxWidth;
	var defaultWidth = Math.floor((this.w - 2 * border)/n);
	var w = Math.min(defaultWidth, maxWidth);

	for(var i = 0; i < n; i++) {
		var child = this.children[i];
		
		x = i * defaultWidth + (defaultWidth - w)/2 + border;

		child.setPosition(x, y);
		child.setSize(w, h);
		child.setUserMovable(false);
		child.setUserResizable(false);
		child.relayoutChildren();
	}
	
	this.w = defaultWidth * n + 2 * border;

	return;
}

UIButtonGroup.prototype.afterChildAppended = function(shape) {
	shape.yAttr = C_Y_MIDDLE_IN_PARENT;

	return true;
}

function UIButtonGroupCreator(border, buttonMaxWidth, bg) {
	var args = ["ui-button-group", "ui-button-group", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIButtonGroup();
		return g.initUIButtonGroup(this.type, border, buttonMaxWidth, bg);
	}
	
	return;
}


/*
 * File:   ui-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Button
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIButton() {
	return;
}

UIButton.prototype = new UIElement();
UIButton.prototype.isUIButton = true;

UIButton.prototype.initUIButton = function(type, w, h) {
	this.initUIElement(type);	

	this.setMargin(5, 5);
	this.setDefSize(w, h);
	this.setSizeLimit(50, 50);
	this.setAutoScaleFontSize(true);
	this.setTextType(C_SHAPE_TEXT_INPUT);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;
	this.setImage(CANTK_IMAGE_FOCUSED, null);
	this.setImage(CANTK_IMAGE_ACTIVE, null);
	this.setImage(CANTK_IMAGE_NORMAL, null);
	this.setImage(CANTK_IMAGE_DISABLE, null);
	this.setImage(CANTK_IMAGE_POINTER_OVER, null);
	this.addEventNames(["onOnUpdateTransform"]); 

	return this;
}

UIButton.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage) {
		return true;
	}

	return false;
}

UIButton.prototype.paintSelfOnly =function(canvas) {
	if(this.pointerDown) {
		var image = this.getHtmlImageByType(CANTK_IMAGE_ACTIVE);

		if(!image) {
			canvas.fillRect(0, 0, this.w, this.h);
		}
	}

	return;
}

function UIButtonCreator(w, h) {
	var args = ["ui-button", "ui-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIButton();
		return g.initUIButton(this.type, w, h);
	}
	
	return;
}

/*
 * File:   ui-canvas.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Canvas
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICanvas() {
	return;
}

UICanvas.prototype = new UIElement();
UICanvas.prototype.isUICanvas = true;

UICanvas.prototype.initUICanvas = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.addEventNames(["onPaint", "onTimer", "onPointerDown", "onPointerMove", "onPointerUp", 
		"onKeyDown", "onKeyUp", "onLongPress", "onDoubleClick"]);

	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	
	return this;
}

UICanvas.prototype.paintChildren = function(canvas) {
	canvas.save();	
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	this.defaultPaintChildren(canvas);

	canvas.restore();

	return;
}

UICanvas.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUIButton || shape.isUIGroup || shape.isUILabel;
}

UICanvas.prototype.paintSelfOnly =function(canvas) {
	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();
	if(this.mode === C_MODE_EDITING) {
		canvas.fillRect(0, 0, this.w, this.h);
	}
	this.callPaintHandler(canvas);
	canvas.restore();

	return;
}

function UICanvasCreator(w, h) {
	var args = ["ui-canvas", "ui-canvas", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICanvas();
		return g.initUICanvas(this.type, w, h);
	}
	
	return;
}

/*
 * File:   ui-check-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Check Box
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICheckBox() {
	return;
}

UICheckBox.prototype = new UIElement();
UICheckBox.prototype.isUICheckBox = true;

UICheckBox.prototype.initUICheckBox = function(type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_INPUT);
	this.images.display = CANTK_IMAGE_DISPLAY_SCALE;

	onFocusedImg  = onFocusedImg ? onFocusedImg : onImg;
	onActiveImg   = onActiveImg ? onActiveImg : onImg;
	offFocusedImg = offFocusedImg ? offFocusedImg : offImg;
	offActiveImg   = offActiveImg ? offActiveImg : offImg;

	this.setImage(CANTK_IMAGE_ON_FG, onImg);
	this.setImage(CANTK_IMAGE_ON_ACTIVE, onActiveImg);
	this.setImage(CANTK_IMAGE_ON_FOCUSED, onFocusedImg);
	this.setImage(CANTK_IMAGE_OFF_FG, offImg);
	this.setImage(CANTK_IMAGE_OFF_ACTIVE, offActiveImg);
	this.setImage(CANTK_IMAGE_OFF_FOCUSED, offFocusedImg);
	this.addEventNames(["onChanged", "onOnUpdateTransform"]);
	this.setRoundRadius(5);
	this.value = true;

	return this;
}

UICheckBox.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUILabel;
}

UICheckBox.prototype.getValue = function() {
	return this.value;
}

UICheckBox.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChanged(this.value);
	}

	return;
}

UICheckBox.prototype.getFgImage =function() {
	var image = null;
	if(this.value) {
		if(this.pointerDown) {
			image = this.getImageByType(CANTK_IMAGE_ON_ACTIVE).getImage();
		}
		else {
			if(this.selected) {
				image = this.getImageByType(CANTK_IMAGE_ON_FOCUSED).getImage();
			}
		}

		if(!image) {
			image = this.getImageByType(CANTK_IMAGE_ON_FG).getImage();
		}
	}
	else {
		if(this.pointerDown) {
			image = this.getImageByType(CANTK_IMAGE_OFF_ACTIVE).getImage();
		}
		else {
			if(this.selected) {
				image = this.getImageByType(CANTK_IMAGE_OFF_FOCUSED).getImage();
			}
		}

		if(!image) {
			image = this.getImageByType(CANTK_IMAGE_OFF_FG).getImage();
		}
	}

	return image;
}

Shape.prototype.getTextColor = function(canvas) {
	return this.value ? this.style.fillColor : this.style.textColor;
}

Shape.prototype.getBgColor = function(canvas) {
	return !this.value ? this.style.fillColor : this.style.textColor;
}

UICheckBox.prototype.drawFgImage =function(canvas) {
	var image = this.getFgImage();

	if(image) {
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h);
	}
	else {
		var hw = this.w >> 1;
		var hh = this.h >> 1;

		canvas.beginPath();
		if(!this.roundRadius) {
			canvas.rect(0, 0, this.w, this.h);
		}
		else if(this.roundRadius < hw && this.roundRadius < hh) {
			drawRoundRect(canvas, this.w, this.h, this.roundRadius);
		}
		else {
			canvas.arc(hw, hh, Math.min(hh, hw), 0, Math.PI * 2);
		}

		canvas.fillStyle = this.getBgColor();
		canvas.strokeStyle = this.getLineColor();
		canvas.lineWidth = this.pointerDown ? 2 * this.style.lineWidth : this.style.lineWidth;
		canvas.fill();
		canvas.stroke();
	}

	return;
}

UICheckBox.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	this.setValue(!this.value);
	this.callClickHandler(point);

	return;
}

function UICheckBoxCreator(w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg) {
	var args = ["ui-checkbox", "ui-checkbox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICheckBox();
		return g.initUICheckBox(this.type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg);
	}
	
	return;
}


/*
 * File:   ui-circle-layout.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Circle Layout
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICircleLayout() {
	return;
}

UICircleLayout.prototype = new UIElement();
UICircleLayout.prototype.isUILayout = true;
UICircleLayout.prototype.isUICircleLayout = true;
UICircleLayout.O_CENTER = "c";
UICircleLayout.O_TOP_LEFT = "tl";
UICircleLayout.O_TOP_MIDDLE = "tm";
UICircleLayout.O_TOP_RIGHT = "tr";
UICircleLayout.O_LEFT_MIDDLE = "lm";
UICircleLayout.O_RIGHT_MIDDLE = "rm";
UICircleLayout.O_BOTTOM_LEFT = "bl";
UICircleLayout.O_BOTTOM_MIDDLE = "bm";
UICircleLayout.O_BOTTOM_RIGHT = "br";

UICircleLayout.prototype.initUICircleLayout = function(type, w, h, img) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, img);
	this.images.display = CANTK_IMAGE_DISPLAY_SCALE;
	this.setCanRectSelectable(false, false);
	this.addEventNames(["onInit"]);
	this.origin =  UICircleLayout.O_CENTER;
	this.setSizeLimit(120, 120, 1000, 1000, 1);

	return this;
}

UICircleLayout.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIImage || shape.isUIButton) {
		return true;
	}

	return false;
}

UICircleLayout.prototype.paintSelfOnly = function(canvas) {
	if(this.mode === C_MODE_EDITING) {
		switch(this.origin) {
			case UICircleLayout.O_CENTER: {
				var ox = this.w >> 1;
				var oy = this.h >> 1;
				var r = (this.w >> 1) - 30;
				var n = this.children.length ? this.children.length : 6;
				var angle = n > 1 ? (2 * Math.PI/(n-1)) : 0;

				canvas.beginPath();
				canvas.fillStyle = this.style.fillColor;
				canvas.strokeStyle = this.style.lineColor;
				canvas.arc(ox, oy, r, 0, Math.PI * 2);
				canvas.stroke();

				var deltaA = -0.5 * Math.PI;
				for(var i = 0; i < n; i++) {
					canvas.beginPath();

					if(i == 0) {
						canvas.arc(ox, oy, 10, 0, Math.PI * 2);
						canvas.stroke();
					}
					else {
						var a = angle * (i - 1) + deltaA;
						var x = ox + r * Math.cos(a);
						var y = oy + r * Math.sin(a);
						canvas.arc(x, y, 10, 0, Math.PI * 2);
						canvas.stroke();
					}
				}
				
				canvas.stroke();
				break;
			}
			default:break;
		}
	}

	return;
}


UICircleLayout.prototype.moveShapeToCenter = function(shape, x, y) {
	x = x - (shape.w >> 1);
	y = y - (shape.h >> 1);

	shape.move(x, y);

	return;
}

UICircleLayout.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	switch(this.origin) {
		case UICircleLayout.O_CENTER: {
			var ox = this.w >> 1;
			var oy = this.h >> 1;
			var r = (this.w >> 1) - 30;
			var n = this.children.length - 1;
			var angle = n > 0 ? (2 * Math.PI/n) : 0;

			var deltaA = -0.5 * Math.PI;
			for(var i = 0; i < this.children.length; i++) {
				var iter = this.children[i];
				if(i == 0) {
					this.moveShapeToCenter(iter, ox, oy);
				}
				else {
					var a = angle * (i - 1) + deltaA;
					var x = ox + r * Math.cos(a);
					var y = oy + r * Math.sin(a);
					this.moveShapeToCenter(iter, x, y);
				}
			}
			break;
		}
		default:break;
	}

	return;
}

UICircleLayout.prototype.afterChildAppended = function(shape) {
	shape.yAttr = C_Y_FIX_TOP;
	shape.xAttr = C_X_FIX_LEFT;
	shape.widthAttr = C_WIDTH_SCALE;
	shape.heightAttr = C_HEIGHT_SCALE;
	shape.setUserMovable(true);
	shape.setUserResizable(true);
	shape.setCanRectSelectable(false, true);

	return true;
}

function UICircleLayoutCreator(w, h, img) {
	var args = ["ui-circle-layout", "ui-circle-layout", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICircleLayout();

		return g.initUICircleLayout(this.type, w, h, img);
	}
	
	return;
}

/*
 * File:   ui-collapsable.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Collapsable
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICollapsable() {
	return;
}

UICollapsable.prototype = new UILayout();
UICollapsable.prototype.isUICollapsable = true;

UICollapsable.prototype.initUICollapsable = function(type, w, h, img) {
	this.initUILayout(type, w, h, img);	
	this.vLayout = (this.type === "ui-v-collapsable");

	return this;
}

UICollapsable.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPageManager || shape.isUIPage) {
		return false;
	}

	if(this.children.length >= 2) {
		return false;
	}

	return true;
}

UICollapsable.prototype.paintSelfOnly = function(canvas) {
	canvas.fillRect(0, 0, this.w, this.h);

	return;
}

UICollapsable.prototype.expandChild = function(child) {
	var animhint = "";
	if(this.children.length != 2 || !child || child.visible) {
		return;
	}

	var sibling = null;
	if(child === this.children[0]) {
		if(this.vLayout) {
			this.y = this.y - child.h;
			this.h = this.h + child.h;
			animhint = "anim-expand-up";
		}
		else {
			this.x = this.x - child.w;
			this.w = this.w + child.w;
			animhint = "anim-expand-left";
		}
	}
	else if(child === this.children[1]) {
		if(this.vLayout) {
			this.h = this.h + child.h;
			animhint = "anim-expand-down";
		}
		else {
			this.w = this.w + child.w;
			animhint = "anim-expand-right";
		}
	}
	else {
		return;
	}

	child.setVisible(true);
	this.relayoutChildren();
	this.parentShape.relayoutChildren("default");

	child.setVisible(false);
	animateUIElement(child, animhint);

	return;
}

UICollapsable.prototype.collapseChild = function(child) {
	child.setVisible(true);
	if(this.children.length != 2 || !child || !child.visible) {
		return;
	}

	var sibling = null;
	if(child === this.children[0]) {
		if(this.vLayout) {
			animhint = "anim-collapse-down";
			animateUIElement(child, animhint);

			this.y = this.y + child.h;
			this.h = this.h - child.h;
		}
		else {
			animhint = "anim-collapse-right";
			animateUIElement(child, animhint);

			this.x = this.x + child.w;
			this.w = this.w - child.w;
		}
	}
	else if(child === this.children[1]) {
		if(this.vLayout) {
			animhint = "anim-collapse-up";
			animateUIElement(child, animhint);
			
			this.h = this.h - child.h;
		}
		else {
			animhint = "anim-collapse-left";
			animateUIElement(child, animhint);
			
			this.w = this.w - child.w;
		}
	}
	else {
		return;
	}

	child.setVisible(false);
	this.relayoutChildren();
	this.parentShape.relayoutChildren("default");

	return;
}

UICollapsable.prototype.getChild = function(name) {
	var child = this.findChildByName(name);
	if(!child) {
		if(name === "first" || name === 0) {
			child = this.children[0];
		}
		if(name === "second" || name === 1) {
			child = this.children[1];
		}
	}

	return child;
}

UICollapsable.prototype.collapse = function(name) {

	this.collapseChild(this.getChild(name));

	return;
}

UICollapsable.prototype.expand = function(name) {
	this.collapseChild(this.getChild(name));

	return;
}

UICollapsable.prototype.collapseOrExpand = function(name) {
	var child = this.getChild(name);
	if(!child) {
		return;
	}

	if(child.visible) {
		this.collapseChild(child);
	}
	else {
		this.expandChild(child);
	}

	return;
}

UICollapsable.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var x = this.hMargin;
	var y = this.vMargin;
	var vLayout = this.vLayout;

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		
		if(!iter.visible) {
			continue;
		}

		if(vLayout) {
			iter.heightAttr = C_HEIGHT_FIX;
			iter.widthAttr =  C_WIDTH_FILL_PARENT;
			iter.relayout();
			iter.y = y;

			y = y + iter.h;
			if(y > this.h) {
				this.h = y + this.vMargin;
			}
		}
		else {
			iter.widthAttr = C_WIDTH_FIX;
			iter.heightAttr = C_HEIGHT_FILL_PARENT;
			iter.relayout();
			iter.x = x;
			
			x = x + iter.w;
			if(x > this.w) {
				this.w = x + this.hMargin;
			}
		}
	}

	return;
}

function UIVCollapsableCreator(w, h, img) {
	var args = ["ui-v-collapsable", "ui-collapsable", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICollapsable();
		g.isUIVCollapsable = true;
		return g.initUICollapsable(this.type, w, h, img);
	}
	
	return;
}

function UIHCollapsableCreator(w, h, img) {
	var args = ["ui-h-collapsable", "ui-collapsable", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICollapsable();

		g.isUIHCollapsable = true;
		return g.initUICollapsable(this.type, w, h, img);
	}
	
	return;
}

/*
 * File:   ui-color-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Color Bar
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIColorBar() {
	return;
}

UIColorBar.prototype = new UIElement();
UIColorBar.prototype.isUIButton = false;
UIColorBar.prototype.isUIColorBar = true;

UIColorBar.prototype.initUIColorBar = function(type, w, h) {
	this.initUIElement(type);	

	this.setBarPosition(0);
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setCanRectSelectable(false, false);
	this.barDierction = 0;

	return this;
}

UIColorBar.prototype.setBarDirection = function(direction) {
	this.barDirection = direction;

	return;
}

UIColorBar.prototype.getBarDirection = function() {
	return this.barDirection;
}


UIColorBar.prototype.setBarPosition = function(position) {
	this.barPosition = position;

	return;
}

UIColorBar.prototype.getBarPosition = function() {
	return this.barPosition;
}

UIColorBar.prototype.shapeCanBeChild = function(shape) {

	return shape.isUIImage || shape.isUIColorTile || shape.isUILabel;
}

UIColorBar.prototype.paintSelfOnly =function(canvas) {
	var ox = 0;
	var oy = 0;
	var v = this.barDirection;
	var n = this.style.lineWidth;
	switch(this.barPosition) {
		case -1:	{
			break;
		}
		case 1:	{
			if(v) {
				ox = this.w - n;
			}
			else {
				oy = this.h - n;
			}
			break;
		}
		default: {
			if(v) {
				ox = Math.floor((this.w - n)>>1);
			}
			else {
				oy = Math.floor((this.h - n)>>1);
			}
		}
	}

	if(v) {
		canvas.moveTo(ox, 0);
		canvas.lineTo(ox, this.h);
	}
	else {
		canvas.moveTo(0, oy);
		canvas.lineTo(this.w, oy);
	}
	
	canvas.lineWidth = this.style.lineWidth;
	canvas.strokeStyle = this.style.lineColor;
	canvas.stroke();

	return;
}

function UIColorBarCreator(w, h) {
	var args = ["ui-color-bar", "ui-color-bar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorBar();

		return g.initUIColorBar(this.type, w, h);
	}
	
	return;
}


/*
 * File:   ui-color-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Color Button
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIColorButton() {
	return;
}

UIColorButton.prototype = new UIElement();
UIColorButton.prototype.isUIButton = true;
UIColorButton.prototype.isUIColorButton = true;

UIColorButton.prototype.initUIColorTile = function(type, w, h) {
	this.initUIColorButton(type, w, h);
	this.isUIButton = false;
	this.isUIColorButton = false;
	this.isUIColorTile = true;
	this.setAutoScaleFontSize(true);
	this.addEventNames(["onOnUpdateTransform"]); 

	return this;
}

UIColorButton.prototype.initUIColorButton = function(type, w, h) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_INPUT);
	this.setCanRectSelectable(false, false);
	this.setMargin(8, 8);
	this.addEventNames(["onOnUpdateTransform"]); 

	return this;
}

UIColorButton.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIColorButton.prototype.setBgRotation =function(angle) {
	this.bgRotation = angle;

	return;
}

UIColorButton.prototype.paintSelfOnly =function(canvas) {
	var hw = this.w >> 1;
	var hh = this.h >> 1;

	canvas.save();
	if(this.bgRotation) {
		canvas.translate(hw, hh);
		canvas.rotate(this.bgRotation);
		canvas.translate(-hw, -hh);
	}

	canvas.beginPath();

	if(this.isUIColorButton && this.pointerDown) {
		canvas.lineWidth = 5;
	}
	else {
		canvas.lineWidth = 3;
	}

	canvas.translate(this.hMargin, this.vMargin);
	drawRoundRect(canvas, this.w-2*this.hMargin, this.h-2*this.vMargin, this.roundRadius);

	if(this.pointerDown) {
		canvas.fillStyle = this.style.activeFillColor ? this.style.activeFillColor : this.style.fillColor;
	}
	else {
		canvas.fillStyle = this.style.fillColor;
	}
	canvas.strokeStyle = this.style.lineColor;
	canvas.fill();
	canvas.stroke();	

	canvas.restore();

	return;
}

function UIColorTileCreator(w, h) {
	var args = ["ui-color-tile", "ui-color-tile", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorButton();

		return g.initUIColorTile(this.type, w, h);
	}
	
	return;
}

function UIColorButtonCreator(w, h) {
	var args = ["ui-color-button", "ui-color-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIColorButton();

		return g.initUIColorButton(this.type, w, h);
	}
	
	return;
}


/*
 * File:   ui-context-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Context Menu
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIContextMenu() {
	return;
}

UIContextMenu.prototype = new UIElement();
UIContextMenu.prototype.isUIMenu = true;
UIContextMenu.prototype.isUIContextMenu = true;

UIContextMenu.prototype.initUIContextMenu = function(type) {
	this.initUIElement(type);

	this.setMargin(5, 5);
	this.setDefSize(300, 80);
	this.setAlwaysOnTop(true);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setHideWhenPointerUp(true);

	return this;
}

UIContextMenu.prototype.onModeChanged = function() {
	if(this.mode === C_MODE_EDITING) {
		this.setVisible(true);
	}
	else {
		this.setVisible(false);
	}

	return;
}

UIContextMenu.prototype.show = function(callerElement) {
	this.showDown = true;
	this.fromLeft =  true;

	this.callerElement = callerElement;
	if(callerElement) {
		if(callerElement == this.getParent()) {
			var p = this.getParent();
			if(this.y > p.h/2) {
				this.showDown = false;
			}
		}
		else {
			var y = this.y;
			var winH = this.getWindow().h;
			var pos = callerElement.getPositionInWindow();

			if((pos.y + callerElement.h + this.h) < winH) {
				y = pos.y + callerElement.h;
			}
			else {
				y = pos.y - this.h;
				this.showDown = false;
			}

			this.y = y;
		}
	}

	var animHint = this.showDown ? "anim-expand-down" : "anim-expand-up";
	
	this.animShow(animHint);
	this.getWindow().grab(this);

	return;
}

UIContextMenu.prototype.hide = function(animHint) {
	if(!this.visible) {
		return;
	}

	if(animHint) {
		animHint = this.showDown ? "anim-collapse-up" : "anim-collapse-down";
		this.animHide(animHint);
	}
	else {
		this.setVisible(false);
	}

	this.getWindow().ungrab(this);
	delete this.showDown;
	delete this.fromLeft;
	delete this.callerElement;

	return;
}

UIContextMenu.prototype.setHideWhenPointerUp = function(hideWhenPointerUp) {
	this.hideWhenPointerUp = hideWhenPointerUp;

	return;
}

UIContextMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var clickOutside = (!point) || (point.x > this.w || point.y > this.h);
	if(this.hideWhenPointerUp || clickOutside) {
		this.hide("default");
	}

	return;
}

UIContextMenu.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIContextMenu.prototype.afterChildAppended = function(shape) {
	shape.setUserMovable(false);
	shape.setUserResizable(false);

	return;
}

UIContextMenu.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIButton || shape.isUIGroup || shape.isUIImage || shape.isUILabel 
		|| shape.isUIViewPager || shape.isUILayout || shape.isUIImageView 
		|| shape.isUIGrid;
}

UIContextMenu.prototype.relayoutChildren = function() {
	var n = 0;
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.visible) {
			continue;
		}

		n++;
	}

	if(this.disableRelayout || !n) {
		return;
	}

	var vMargin = this.getVMargin();
	var hMargin = this.getHMargin();
	var x = hMargin;
	var y = vMargin;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var vLayout = this.w < this.h;

	if(vLayout) {
		h = Math.floor(h/n);
	}
	else {
		w = Math.floor(w/n);
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.visible) {
			continue;
		}

		iter.x = x;
		iter.y = y;
		iter.w = w;
		iter.h = h;

		if(vLayout) {
			y = y + h;
		}
		else {
			x = x + w;
		}
		iter.relayoutChildren();
	}

	return;
}

function UIContextMenuCreator() {
	var args = ["ui-context-menu", "ui-context-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIContextMenu();
		return g.initUIContextMenu(this.type);
	}
	
	return;
}


/*
 * File: ui-device.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: Device 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIDevice() {
	return;
}

UIDevice.PORTRAIT = 0;
UIDevice.LANDSCAPE = 1;

UIDevice.prototype = new UIElement();

UIDevice.prototype.isUIDevice = true;

UIDevice.prototype.deviceToJson = function(o) {
	o.config = this.config;

	return;
}

UIDevice.prototype.deviceFromJson = function(js) {
	if(js.config) {
		this.config = dupDeviceConfig(js.config);
	}

	return;
}

UIDevice.prototype.resize = function(w, h) {
	if(this.state === C_STAT_NORMAL) {
		this.realResize(w, h);
	}

	return;
}

UIDevice.prototype.getDirection = function() {
	return (this.h > this.w) ? UIDevice.PORTRAIT : UIDevice.LANDSCAPE;
}

UIDevice.prototype.setDirection = function(direction) {
	var currDirection = this.getDirection();
	if(direction === currDirection) {
		return;		
	}

	var oldJson = JSON.stringify(this.toJson());

	var w = this.w;
	var h = this.h;
	var delta = (h - w)/2;
	this.x = this.x - delta;
	this.y = this.y + delta;

	var screenX = 0;
	var screenY = 0;
	var screenW = this.config.screenW;
	var screenH = this.config.screenH;

	if(currDirection === UIDevice.PORTRAIT) {
		this.y = 100;
		screenX = this.config.screenY;
		screenY = w - (this.config.screenX + this.config.screenW);
	}
	else {
		this.y = 0;
		screenY = this.config.screenX;
		screenX = h - (this.config.screenY + this.config.screenH);
	}

	this.w = h;
	this.h = w;
	this.config.screenX = screenX;
	this.config.screenY = screenY;
	this.config.screenW = screenH;
	this.config.screenH = screenW;

	var newJson = JSON.stringify(this.toJson());
	this.exec(new PropertyCommand(this, oldJson, newJson));

	return;
}

UIDevice.prototype.setName = function(name) {
	this.name = name;
	this.loadConfig();

	return;
}

UIDevice.prototype.beforePropertyChanged = function() {
	this.oldConfig = dupDeviceConfig(this.config);

	return;
}

UIDevice.prototype.afterPropertyChanged = function() {
	if(!isDeviceConfigEqual(this.oldConfig, this.config)) {
		this.notifyDeviceConfigChanged(this.oldConfig, this.config);
	}
	this.relayout();

	return;
}

UIDevice.prototype.onDeviceConfigChanged = function(oldConfig, newConfig) {
	this.relayoutChildren();

	return;
}

UIDevice.prototype.loadConfig = function() {
	var config = cantkGetDeviceConfig(this.name);

	if(!config) {
		config  = cantkGetDeviceConfig("iphone5");
	}

	if(config) {
		this.config = config;
	}

	return;
}

UIDevice.prototype.initUIDevice = function(type, w, h, name, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setName(name);
	this.loadConfig();
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setUserResizable(false);
	this.rectSelectable = false;
	this.regSerializer(this.deviceToJson, this.deviceFromJson);

	return this;
}

UIDevice.prototype.drawBgImage = function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);
	if(image) {
		var hw = this.h/this.w;
		var ihw = image.height/image.width;

		if((hw <= 1 && ihw <= 1) || (hw >= 1 && ihw >= 1)) {
			this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h);
		}
		else {
			canvas.save();
			canvas.translate(this.h/2, this.h/2);
			canvas.rotate(-Math.PI/2);
			canvas.translate(-this.h/2, -this.h/2);
			this.drawImageAt(canvas, image, this.images.display, 0, 0, this.h, this.w);
			canvas.restore();
		}
	}

	return;
}

UIDevice.prototype.getScreen = function() {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		
		if(child.isUIScreen) {
			return child;
		}
	}

	return null;
}

UIDevice.prototype.enterPreview = function() {
	var screen = this.getScreen();
	var windowManager = this.getWindowManager();
	if(!windowManager || !screen || !this.app) {
		return;
	}

	if(windowManager.mode != C_MODE_EDITING) {
		return;
	}
	
	var button = this.findChildByName("button-preview", false);
	if(button) {
		button.setText(dappGetText("Edit"));
	}
	
	if(this.app) {
		this.app.clearCommandHistory();
	}

	windowManager.saveState();
	this.setMode(C_MODE_PREVIEW);
	screen.setMode(C_MODE_PREVIEW, true);
	windowManager.systemInit();
	windowManager.showInitWindow();

	return;
}

UIDevice.prototype.exitPreview = function() {
	var screen = this.getScreen();
	var windowManager = this.getWindowManager();
	if(!windowManager || !screen || !this.app) {
		return;
	}

	if(windowManager.mode != C_MODE_PREVIEW) {
		return;
	}

	var button = this.findChildByName("button-preview", false);
	if(button) {
		button.setText(dappGetText("Preview"));
	}

	if(this.app) {
		this.app.clearCommandHistory();
	}

	windowManager.systemExit();
	this.setMode(C_MODE_EDITING);
	screen.setMode(C_MODE_EDITING, true);
	windowManager.restoreState();

	return;
}

UIDevice.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice) {
		var json = shape.toJson();

		json.x = this.x;
		json.y = this.y;

		this.fromJson(json);
		this.relayoutChildren();

		if(this.app) {
			this.app.clearCommandHistory();
		}

		return false;
	}

	if(shape.isUIButton) {
		return !this.findChildByName(shape.name);
	}

	return (shape.isUIScreen && this.getScreen() === null);
}

UIDevice.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;

	var device = this;
	for(var i = 0; i < this.children.length; i++) {
		var shape = this.children[i];
		if(shape.isUIScreen) {
			x = this.config.screenX;
			y = this.config.screenY;
			w = this.config.screenW;
			h = this.config.screenH;
			
			shape.widthAttr = C_WIDTH_FIX;
			shape.heightAttr = C_HEIGHT_FIX;

			shape.setPosition(x, y);
			shape.setSize(w, h);
			shape.relayout();
		}

		if(shape.isUIButton) {
			shape.setMode(C_MODE_RUNNING);
			if(this.config.screenW > 400) {
				shape.x = this.config.screenX;
				shape.w = this.config.screenW / 4;
			}
			else {
				shape.x = 20;
				shape.w = (this.w-40)/4;
			}
			shape.style.setFontSize(shape.w < 100 ? 10 : 16);

			y = this.config.screenY - shape.h - 5;

			if(y < 0) {
				y = 0;
			}

			if(shape.name === "button-prev") {
				x = shape.x;
				shape.setText(dappGetText("Prev Window"));
				shape.onClick = function(point, beforeChild) {
					if(beforeChild) {
						return;
					}
					var windowManager = device.getWindowManager();
					if(windowManager) {
						windowManager.showPrevFrame();
					}

					return;
				}
			}
			
			if(shape.name === "button-next") {
				x = shape.x + shape.w;
				shape.setText(dappGetText("Next Window"));
				shape.onClick = function(point, beforeChild) {
					if(beforeChild) {
						return;
					}
					var windowManager = device.getWindowManager();
					if(windowManager) {
						windowManager.showNextFrame();
					}

					return;
				}
			}
			
			if(shape.name === "button-direction") {
				var direction = device.getDirection();
				var buttonText = (direction === UIDevice.PORTRAIT) ? "Landscape" : "Portrait";
				
				x = shape.x + shape.w * 2;
				shape.setText(dappGetText(buttonText));

				shape.onClick = function(point, beforeChild) {
					if(beforeChild) {
						return;
					}
					
					var direction = device.getDirection();
					if(direction === UIDevice.PORTRAIT) {
						buttonText = "Portrait";
						device.setDirection(UIDevice.LANDSCAPE);
					}
					else {
						buttonText = "Landscape";
						device.setDirection(UIDevice.PORTRAIT);
					}
					this.setText(dappGetText(buttonText));

					return;
				}
			}
		
			if(shape.name === "button-preview") {
				shape.isPreview = false;
				x = shape.x + shape.w * 3;

				shape.setText(dappGetText("Preview"));
				shape.onClick = function(point, beforeChild) {
					if(beforeChild) {
						return;
					}

					this.isPreview = !this.isPreview;

					if(this.isPreview) {
						device.enterPreview();						
					}
					else {
						device.exitPreview();	
					}

					return;
				}
			}
			
			if(shape.name === "button-status") {
				shape.h = 40;
				shape.w = this.config.screenW/2;	
				shape.style.setFontSize(shape.w < 100 ? 12 : 18);
				y = this.config.screenY - 2 * shape.h - 10;
				x = this.config.screenX + (this.config.screenW - shape.w)/2;
				this.statusButton = shape;
				var windowManager = device.getWindowManager();
				this.statusButton.getLocaleText = function() {
					return windowManager ? windowManager.getStatusString() : "";
				}
			}

			shape.setMode = function(mode, recursive) {
				this.mode = C_MODE_RUNNING;
			}
		}

		shape.setPosition(x, y);
		shape.setUserMovable(false);
		shape.setUserResizable(false);
	}

	return true;
}

UIDevice.prototype.afterSetView = function() {
	this.relayoutChildren();

	return;
}

UIDevice.prototype.getWindowManager = function() {
	var screen = this.getScreen();

	return screen ? screen.getWindowManager() : null;
}

UIDevice.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		drawRoundRect(canvas, this.w, this.h, 40);
		canvas.fill();
		canvas.stroke();
	}

	return;
}

UIDevice.prototype.onKeyDownRunning = function(code) {
	var wm = this.getWindowManager();

	return wm.onKeyDownRunning(code);
}

UIDevice.prototype.onKeyUpRunning = function(code) {
	var wm = this.getWindowManager();

	if(code == KeyEvent.DOM_VK_P) {
		this.snapIt();
	}

	return wm.onKeyUpRunning(code);
}

UIDevice.prototype.snapIt = function() {
	var el = null;
	var snapDevice = cantkGetQueryParam("snap-device");
	var snapScreen = cantkGetQueryParam("snap-screen");

	if(snapDevice) {
		el = this;
	}

	if(snapScreen) {
		el = this.getWindowManager();
	}

	if(!el) {
		return;
	}

	var value = null;

	value = cantkGetQueryParam("width");
	var width = value ? parseInt(value) : el.w;

	value = cantkGetQueryParam("height");
	var height = value ? parseInt(value) : el.h;

	var tcanvas = cantkGetTempCanvas(width, height);
	var ctx = tcanvas.getContext("2d");

	var xscale = width/el.w;
	var yscale = height/el.h;

	ctx.save();
	ctx.scale(xscale, yscale);
	ctx.translate(-el.x, -el.y);
	el.paint(ctx);
	ctx.restore();

	window.open(tcanvas.toDataURL(), "_blank");

	return;
}

function UIDeviceCreator(name, version, w, h) {
	var args = ["ui-device", "ui-device", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDevice();
		g.initUIDevice(this.type, w, h, name+version, null);

		return g;
	}
	
	return;
}


/*
 * File:   ui-edit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Single Line Editor
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIEdit() {
	return;
}

UIEdit.prototype = new UIElement();
UIEdit.prototype.isUIEdit = true;

UIEdit.prototype.initUIEdit = function(type, w, h, leftMargin, rightMargin, initText, bg, focusedBg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setText(initText);
	this.leftMargin = leftMargin;
	this.rightMargin = rightMargin;
	this.setSizeLimit(60, 30, 1000, 80);
	this.setTextType(C_SHAPE_TEXT_INPUT);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setImage(CANTK_IMAGE_FOCUSED, focusedBg);
	this.setMargin(5, 5);
	this.setInputType("text");
	this.addEventNames(["onChanged", "onChanging", "onFocusIn", "onFocusOut"]);
	this.setTextAlignV("middle");
	this.setTextAlignH("left");

	return this;
}

UIEdit.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIButton) {
		return true;
	}

	return false;
}

UIEdit.prototype.textEditable = function(point) {
	return true;
}

UIEdit.prototype.getLocaleText = function(text) {
	if(text === " ") {
		return text;
	}

	if(this.inputType === "password" && text && text === this.text) {
		var str = "";
		var n = text.length;
		for(var i = 0; i < n; i++) {
			str = str + "*";
		}

		return str;
	}
	else {
		return text;
	}
}

UIEdit.prototype.drawText = function(canvas) {
	var y = this.h >> 1;
	var x = this.leftMargin;
	var text = this.getLocaleText(this.text);
	var width = this.w - x - this.rightMargin;

	if(!text || this.editing) {
		return;
	}
	
	canvas.save();
	canvas.font = this.style.getFont();
	canvas.fillStyle = this.style.textColor;	

	canvas.beginPath();
	canvas.rect(0, 0, this.w - this.rightMargin, this.h);
	canvas.clip();

	canvas.textAlign = "left";
	canvas.textBaseline = "middle";
	canvas.fillText(text, x, y);

	canvas.restore();

	return;
}

UIEdit.prototype.paintSelfOnly = function(canvas) {
	var image = this.getBgImage();

	if(image) {
		return;
	}

	canvas.beginPath();
	drawRoundRect(canvas, this.w, this.h, 8);
	canvas.fillStyle = this.style.fillColor;
	canvas.fill();
	canvas.strokeStyle = this.style.lineColor;
	canvas.lineWidth = this.isFocused() ? 4 : 2;
	canvas.stroke();

	return;
}

UIEdit.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	if(this.mode !== C_MODE_EDITING) {
		this.editText();
	}

	return;
}

UIEdit.prototype.getWidth = function(withoutBorder) {
	var w = this.w;
	if(withoutBorder) {
		w = w - this.leftMargin - this.rightMargin;
	}

	return w;
}

UIEdit.prototype.setText = function(text, notTriggerChanged) {
	if(this.text != text) {
		this.text = this.toText(text);
		if(!notTriggerChanged) {
			this.callOnChanged(text);
		}

		this.textNeedRelayout = true;
	}

	return;
}

UIEdit.prototype.getEditorRect = function() {
	var p = this.getPositionInView();
	var vp = this.view.getAbsPosition();
	var scale = this.view.getViewScale();
	var ox = vp.x;
	var oy = vp.y;

	var y = p.y * scale + oy;
	if(isMobile()) {
		var x = (p.x) * scale + ox;
		var w = this.getWidth() * scale;
	}
	else {
		var x = (p.x + this.leftMargin) * scale + ox;
		var w = this.getWidth(true) * scale;
	}
	var h = this.getHeight() * scale;

	var rect = {};

	rect.x = x;
	rect.y = y;
	rect.w = Math.max(60, w);
	rect.h = h;

	return rect;
}

UIEdit.prototype.editText = function(point) {
	var me = this;
	if(this.textType && this.textEditable(point)) {
		var shape = this;
		var editor = null;
		var text = this.getText();
		var rect = this.getEditorRect();
		var scale = this.getRealScale();
		var inputType = this.inputType ? this.inputType : "text";

		editor = cantkShowInput(rect.x, rect.y, rect.w, rect.h);
		editor.setShape(shape);
		editor.setInputType(inputType);
		editor.removeBorder();
		editor.setFontSize(this.style.fontSize * scale);
		editor.setText(text);

		editor.element.onchange= function() {
			if(text !== this.value) {
				shape.setText(this.value);

				shape.callOnChanged(shape.text);
				shape.postRedraw();
			}
			else {
				shape.text = text;
			}
			
			editor.element.onchange = null;
			editor.hide();

			shape.callOnFocusOut();
			return;
		}

		editor.element.onkeyup = function(e) {
			shape.callOnChanging(this.value);
		}

		this.callOnFocusIn();
	}

	return;
}

function UIEditCreator(w, h, leftMargin, rightMargin, bg, focusedBg) {
	var args = ["ui-edit", "ui-edit", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIEdit();
		return g.initUIEdit(this.type, w, h, leftMargin, rightMargin, dappGetText("Edit"), bg, focusedBg);
	}
	
	return;
}


/*
 * File:   ui-fan-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Fan Menu
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIFanMenu() {
	return;
}

UIFanMenu.prototype = new UIElement();
UIFanMenu.prototype.isUIMenu = true;
UIFanMenu.prototype.isUIFanMenu = true;

UIFanMenu.prototype.initUIFanMenu = function(type, w, h) {
	this.initUIElement(type);
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);

	return this;
}

UIFanMenu.prototype.getOriginElement = function() {
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(iter.name === "ui-origin") {
			return iter;
		}
	}

	if(this.children.length > 0) {
		return this.children[0];
	}

	return null;
}

UIFanMenu.prototype.onModeChanged = function() {
	if(this.mode === C_MODE_EDITING) {
		this.restoreState();
	}
	else {
		this.relayout();
		this.saveState();
		this.collapse();
	}

	return;
}

UIFanMenu.prototype.restoreState = function() {
	if(this.save) {
		this.x = this.save.x;
		this.y = this.save.y;
		this.w = this.save.w;
		this.h = this.save.h;
		
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			if(iter.save) {
				iter.x = iter.save.x;
				iter.y = iter.save.y;
				iter.opacity = 1;
			}
			iter.setVisible(true);
		}

		this.setVisible(true);
	}

	return;
}

UIFanMenu.prototype.saveState = function() {
	var origin = this.getOriginElement();

	if(origin) {
		this.save = {};
		this.save.x = this.x;
		this.save.y = this.y;
		this.save.w = this.w;
		this.save.h = this.h;
		
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.save = {};
			iter.save.x = iter.x;
			iter.save.y = iter.y;
			iter.save.opacity = iter.opacity;
		}
	}

	return;
}

UIFanMenu.prototype.expand = function() {
	this.getWindow().grab(this);

	if(this.save) {
		this.x = this.save.x;
		this.y = this.save.y;
		this.w = this.save.w;
		this.h = this.save.h;
	}

	return;
}

UIFanMenu.prototype.collapse = function() {
	var origin = this.getOriginElement();
	this.getWindow().ungrab(this);

	if(origin) {
		this.x = this.x + origin.x;
		this.y = this.y + origin.y;
		this.w = origin.w;
		this.h = origin.h;
		
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.setVisible(false);
		}

		origin.x = 0;
		origin.y = 0;
		origin.setVisible(true);
		this.relayout();
	}

	this.collapsed = true;

	return;
}

UIFanMenu.prototype.show = function() {
}

UIFanMenu.prototype.hide = function() {
	this.collapse();

	return;
}

UIFanMenu.prototype.showOrHideMenu = function() {
	if(this.collapsed) {
		this.showMenu();
	}
	else {
		this.hideMenu();
	}
}

UIFanMenu.prototype.showMenu = function() {
	var origin = this.getOriginElement();

	if(!origin || !this.collapsed) {
		return;
	}

	this.expand();
	origin.x = origin.save.x;
	origin.y = origin.save.y;
	
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.setVisible(true);
	}
	this.relayout();

	var config = {};
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.setVisible(true);
		iter.save.x = iter.x;
		iter.save.y = iter.y;
		
		if(iter != origin) {
			iter.x = origin.x;
			iter.y = origin.y;

			config.xStart = origin.x;
			config.yStart = origin.y;
			config.xEnd = iter.save.x;
			config.yEnd = iter.save.y;
			config.scaleStart = 0.5;
			config.scaleEnd = 1;
			config.opacityStart = 0.1;
			config.opacityEnd = 1;
			config.delay = 0;
			config.duration = 1000;
			
			iter.animate(config);
		}
	}

	delete this.collapsed;

	return;
}

UIFanMenu.prototype.hideMenu = function() {

	var origin = this.getOriginElement();
	if(!origin || this.collapsed) {
		return;
	}

	var config = {};
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(iter != origin) {
			config.xStart = iter.x;
			config.yStart = iter.y;
			config.xEnd = origin.x;
			config.yEnd = origin.y;
			config.opacityStart = 1;
			config.opacityEnd = 0.1;
			config.scaleStart = 1;
			config.scaleEnd = 0.5;
			config.delay = 0;
			config.duration = 1000;
			
			iter.animate(config);
		}
	}

	var menu = this;

	setTimeout(function() {
		menu.collapse();
	}, 200);

	return;
}

UIFanMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var origin = this.getOriginElement();
	if(origin !== this.targetShape) {
		if(this.targetShape) {
			this.hide();
		}
		else {
			this.animHide();
		}
	}

	return;
}

UIFanMenu.prototype.beforePaintChildren = function(canvas) {
	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	if(this.mode == C_MODE_EDITING) {
		canvas.fillStyle = this.style.lineColor;
		canvas.stroke();
	}
	canvas.clip();

	var origin = this.getOriginElement();
	if(origin) {
		var ox = origin.x + origin.w/2;
		var oy = origin.y + origin.w/2;
		canvas.strokeStyle = "Green";
		canvas.fillStyle = this.style.fillColor;
		var maxR = 0;
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			if(iter != origin) {
				var dx = ox - (iter.x+iter.w/2);
				var dy = oy - (iter.y+iter.h/2);
				var r = Math.sqrt(dx * dx + dy * dy);

				if(r > maxR) {
					maxR = r;
				}

				if(this.mode === C_MODE_EDITING) {
					canvas.beginPath();
					canvas.arc(ox, oy,r,0,2*Math.PI);
					canvas.stroke();
				}
			}
		}
		
		if(this.mode != C_MODE_EDITING) {
			canvas.beginPath();
			canvas.globalAlpha = 0.2;
			canvas.arc(ox, oy,maxR,0,2*Math.PI);
			canvas.fill();	
		}
		else {
			canvas.fill();
		}
	}

	canvas.restore();

	return;
}

function UIFanMenuCreator() {
	var args = ["ui-fan-menu", "ui-fan-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFanMenu();
		return g.initUIFanMenu(this.type, 200, 200);
	}
	
	return;
}

/*
 * File:   ui-flash.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Flash 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIFlash() {
	return;
}

UIFlash.prototype = new UIHtml();
UIFlash.prototype.isUIFlash = true;

UIFlash.prototype.getHtmlContent = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var src = this.value ? this.value : "";

	var html = '<object type="application/x-shockwave-flash" width="'+w+'" height="'+h+'"> <param name="movie" value="'+src+'" /> <param name="quality" value="high" /></object>';

	return html;
}

UIFlash.prototype.initUIFlash = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("test/5.swf");
	this.setImage(CANTK_IMAGE_DEFAULT, null);

	return this;
}

function UIFlashCreator() {
	var args = ["ui-flash", "ui-flash", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFlash();
		return g.initUIFlash(this.type);
	}
	
	return;
}


/*
 * File:   ui-frames.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Frames
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIFrames() {
	return;
}

UIFrames.prototype = new UIElement();
UIFrames.prototype.isUIFrames = true;

UIFrames.prototype.initUIFrames = function(type) {
	this.initUIElement(type);	

	this.current = 0;
	this.setDefSize(200, 200);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.widthAttr = C_WIDTH_FILL_PARENT;
	this.addEventNames(["onChanged"]);

	return this;
}

UIFrames.prototype.getStatusString = function() {
	var str = "";
	var current = this.current + 1;
	var n = this.children.length;
	var frame = this.getCurrentFrame();

	current = current <= n ? current : n;
	if(frame && frame.name) {
		str = frame.name + "(" + current + "/" + n + ")";
	}
	else {
		str = current + "/" + n;
	}

	return str;
}

UIFrames.prototype.getCurrent = function() {
	return this.current;
}

UIFrames.prototype.setCurrent = function(current) {
	if(this.current !== current) {
		this.current = current;
		
		if(this.mode != C_MODE_EDITING) {
			this.callOnChanged(current);
		}
	}

	return;
}

UIFrames.prototype.getCurrentFrame = function() {
	if(this.children.length < 1) {
		return null;
	}

	if(this.current < 0 || !this.current) {
		this.current = 0;
	}

	if(this.current >= this.children.length) {
		this.current = this.children.length - 1;
	}

	return this.children[this.current];
}

UIFrames.prototype.fixChildSize = function(child) {
	return;
}

UIFrames.prototype.fixChildPosition = function(child) {
	var x = child.x;
	var y = child.y;
	var h = child.h;
	var w = child.w;

	if(child.freePosition) {
		return;
	}
	
	if(child.widthAttr === C_WIDTH_FILL_PARENT) {
		x = this.getHMargin();
		w = this.getWidth(true);
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
		y = this.getVMargin();
		h = this.getHeight(true);
	}
	
	child.x = x;
	child.y = y;
	child.h = h;
	child.w = w;

	return;
}

UIFrames.prototype.setTarget = function(shape) {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(!shape) {
			child.setSelected(false);
			continue;
		}

		if(child != shape && child != shape.popupWindow) {
			child.setSelected(false);
		}
	}

	this.targetShape = shape;
	this.selected = !shape;

	return;
}
UIFrames.prototype.dispatchPointerDownToChildren = function(p) {
	var child = null;

	if(this.children.length < 1) {
		return false;
	}

	child = this.getCurrentFrame();

	if(child.onPointerDown(p)) {
		this.setTarget(child);

		return true;
	}

	return false;
}

UIFrames.prototype.addShapeIntoChildren = function(shape, p) {
	var child = null;

	if(this.children.length < 1) {
		return false;
	}

	child = this.getCurrentFrame();

	return child.addShape(shape, true, p);
}

UIFrames.prototype.paintChildren = function(canvas) {
	var child = this.getCurrentFrame();
	
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}
	
	return;
}

UIFrames.prototype.showNextFrame = function() {
	this.showFrame(this.current+1);
	this.relayoutChildren();

	return;
}

UIFrames.prototype.getFrame = function(index) {
	if(index < 0 || index >= this.children.length) {
		return null;
	}

	return this.children[index];
}

UIFrames.prototype.getFrameIndex = function(frame) {
	for(var i = 0; i < this.children.length; i++) {
		if(frame === this.children[i]) {
			return i;
		}
	}

	return -1;
}

UIFrames.prototype.getFrames = function() {
	return this.children.length;
}

UIFrames.prototype.showPrevFrame = function() {
	this.showFrame(this.current-1);
	this.relayoutChildren();

	return;
}

UIFrames.prototype.showFrame = function(index) {
	this.current = (index + this.children.length)%this.children.length;
	var currentFrame = this.children[this.current];
	
	if(currentFrame) {
		currentFrame.show(true);
	}

	return;
}

UIFrames.prototype.shapeCanBeChild = function(shape) {
	return true;
}

UIFrames.prototype.initDefaultNameForChild = function(shape) {
}

UIFrames.prototype.relayoutChildren = function() {

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		iter.x = 0;
		iter.y = 0;
		iter.w = this.w;
		iter.h = this.h;
		iter.widthAttr = C_WIDTH_FILL_PARENT;
		iter.heightAttr = C_HEIGHT_FILL_PARENT;
		iter.relayoutChildren();
	}

	return;
}

UIFrames.prototype.afterChildAppended = function(shape) {
	this.current = this.children.length - 1;

	if(!shape.name) {
		this.initDefaultNameForChild(shape);
	}

	return;
}

UIFrames.prototype.onChildRemoved = function(shape) {
	return;
}

UIFrames.prototype.afterChildRemoved = function(shape) {
	if(this.children.length === 0) {
		this.current = 0;
	}
	else if(this.current >= this.children.length) {
		this.current--;
	}

	this.onChildRemoved(shape);

	return;
}

UIFrames.prototype.findShapeByPoint = function(point, recursive) {
	var p = this.translatePoint(point);
	var curFrame = this.getCurrentFrame();

	if(curFrame) {
		return curFrame.findShapeByPoint(p, recursive);	
	}

	return this;
}


function UIFramesCreator() {
	var args = ["ui-frames", "ui-frames", null, 0];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFrames();

		return g.initUIFrames(this.type);
	}
	
	return;
}

/*
 * File:   ui-gauge.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Gauge
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIGauge() {
	return;
}

UIGauge.prototype = new UIElement();
UIGauge.prototype.isUIGauge = true;

UIGauge.prototype.initUIGauge = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.addEventNames(["onInit"]);

	return this;
}

UIGauge.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILedDigits || shape.isUILabel || shape.isUIGaugePointer;
}

UIGauge.prototype.afterChildAppended = function(shape) {
	var size = 20;
	var pointerNr = 0;

	if(shape.isUIGaugePointer) {
		shape.xAttr = C_X_CENTER_IN_PARENT;
		shape.yAttr = C_Y_MIDDLE_IN_PARENT;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		if(!iter.isUIGaugePointer) {
			continue;
		}

		switch(pointerNr) {
			case 0: {
				size = 100;
				break;
			}
			case 1: {
				size = 70;
				break;
			}
			case 2: {
				size = 40;
				break;
			}
		}
		pointerNr = pointerNr + 1;

		iter.setSizeLimit(size, size, size, size, 1);
		iter.setSize(size, size);
	}

	this.setSizeLimit(100, 100, 1000, 1000, 1);

	return;
}

UIGauge.prototype.paintSelfOnly = function(canvas) {

	return;
}

function UIGaugeCreator() {
	var args = ["ui-gauge", "ui-gauge", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGauge();
		return g.initUIGauge(this.type, 200, 200);
	}
	
	return;
}

///////////////////////////////////////////////////////////////////}-{

function UIGaugePointer() {
	return;
}

UIGaugePointer.prototype = new UIElement();
UIGaugePointer.prototype.isUIGaugePointer = true;

UIGaugePointer.prototype.initUIGaugePointer = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_IMAGE, null);
	
	this.value = 0;
	this.minAngle = 0;
	this.maxAngle = 360;
	this.minValue = 0;
	this.maxValue = 60;

	return this;
}

UIGaugePointer.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIGaugePointer.prototype.setText = function(text) {
	text = this.toText(text);
	try {
		this.setValue(parseInt(text));
	}catch(e) {
		console.log("UIGaugePointer.prototype.setText:" + e.message);
	}

	return;
}

UIGaugePointer.prototype.getText = function() {
	return this.getValue() + "";
}

UIGaugePointer.prototype.setValue = function(value) {
	if(value >= this.minValue && value <= this.maxValue) {
		this.value = value;
	}
	else {
		console.log("UIGaugePointer.prototype.setValue: Out Of Range.");
	}

	return;
}

UIGaugePointer.prototype.getValue = function() {
	return this.value;
}

UIGaugePointer.prototype.animSetValue = function(value, animHint) {
	return this.animSetValue(value, animHint);
}

UIGaugePointer.prototype.animateSetValue = function(value, animHint) {
	if(value < this.minValue) {
		value = this.minValue;
	}

	if(value > this.maxValue) {
		value = this.maxValue;
	}
	
	var pointer = this;
	var endValue = value;
	var startValue = this.getValue();
	var changeDelta = value - startValue;
	var changeAngle = Math.abs(changeDelta * (this.maxAngle - this.minAngle)/(this.maxValue - this.minValue));
	
	if(changeAngle < 5) {
		this.setValue(value);

		return;
	}

	var startTime = (new Date()).getTime();
	var duration = (animHint && animHint == "slow") ? 1000 : 500;

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;

		if(percent < 1) {
			var newValue = startValue + changeDelta * percent;	
			pointer.setValue(newValue);

			setTimeout(animStep, 10);
		}
		else {
			delete startTime;
			pointer.setValue(endValue);
		}

		delete now;
		pointer.postRedraw();
	}

	animStep();

	return;
}

UIGaugePointer.prototype.getAngle = function(canvas) {
	var rangeAngle = this.maxAngle - this.minAngle;
	var rangeValue = this.maxValue - this.minValue;
	var angle = (this.value/rangeValue) * rangeAngle + this.minAngle;

	angle = Math.PI * (angle / 180);

	return angle;
}

UIGaugePointer.prototype.paintSelfOnly = function(canvas) {
	var x = 0;
	var y = 0;
	var w = this.w;
	var h = this.h;
	var angle = this.getAngle();

	var image = this.getHtmlImageByType(CANTK_IMAGE_IMAGE);
	if(image && image.width) {
		var imageW = image.width;
		var imageH = image.height;

		canvas.translate(w/2, h/2);
		canvas.rotate(angle);
		canvas.translate(-w/2, -h/2);
		x = (w - imageW)/2;
		y = (h - imageH)/2;

		canvas.drawImage(image, x, y);
	}
	else {
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIGaugePointerCreator() {
	var args = ["ui-gauge-pointer", "ui-gauge-pointer", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGaugePointer();
		return g.initUIGaugePointer(this.type, 20, 200);
	}
	
	return;
}

/*
 * File:   ui-grid.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Grid
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIGrid() {
	return;
}

UIGrid.ITEM_FIXED_HEIGHT = 0;
UIGrid.ITEM_FIXED_ROWS   = 1;
UIGrid.ITEM_FIXED_WIDTH = 0;
UIGrid.ITEM_FIXED_COLS  = 1;

UIGrid.prototype = new UIElement();
UIGrid.prototype.isUIGrid = true;
UIGrid.prototype.isUILayout = true;

UIGrid.prototype.gridToJson = function(o) {
	o.spacer = this.spacer;
	o.itemWidth = this.itemWidth;
	o.itemHeight = this.itemHeight;
	o.itemWidthType = this.itemWidthType;
	o.itemHeightType = this.itemHeightType;
	o.scrollDirection = this.scrollDirection;

	return;
}

UIGrid.prototype.gridFromJson = function(js) {
	if(js.itemWidth) {
		this.itemWidth = js.itemWidth;
		this.itemWidthType = js.itemWidthType;
	}
	
	if(js.itemHeight) {
		this.itemHeight = js.itemHeight;
		this.itemHeightType = js.itemHeightType;
	}

	if(js.spacer) {
		this.spacer = js.spacer;
	}

	if(js.scrollDirection) {
		this.scrollDirection = js.scrollDirection;
	}

	return;
}

UIGrid.prototype.initUIGrid = function(type, border, itemSize, bg) {
	var size = itemSize * 3 + 2 * border;
	var minSize = itemSize + 2 * border;

	this.initUIElement(type);	

	this.spacer = 0;
	this.offset = 0;
	this.setDefSize(size, size);
	this.setMargin(border, border);
	this.setSizeLimit(minSize, minSize, 2000, 2000);

	this.itemSize = itemSize;
	this.itemWidth = itemSize;
	this.itemHeight = itemSize;
	this.itemWidthType = UIGrid.ITEM_FIXED_WIDTH;
	this.itemHeightType = UIGrid.ITEM_FIXED_HEIGHT;
	this.widthAttr = C_WIDTH_FILL_PARENT; 
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setImage(CANTK_IMAGE_DELETE_ITEM, null);
	this.regSerializer(this.gridToJson, this.gridFromJson);
	this.rectSelectable = false;
	this.addEventNames(["onChildDragged", "onChildDragging", "onInit"]);

	if(!bg) {
		this.style.setFillColor("White");
	}

	return this;
}

UIGrid.prototype.setRows = function(value) {
	if(value < 20) {
		this.itemHeightType = UIGrid.ITEM_FIXED_ROWS;
	}
	else {
		this.itemHeightType = UIGrid.ITEM_FIXED_HEIGHT;
	}
	this.itemHeight = value;

	return;
}

UIGrid.prototype.getRows = function() {
	if(this.itemHeightType === UIGrid.ITEM_FIXED_ROWS) {
		return this.itemHeight;
	}
	else {
		return Math.floor(this.getHeight(true)/(this.itemHeight+this.spacer));
	}

	return;
}

UIGrid.prototype.setCols = function(value) {
	if(value < 20) {
		this.itemWidthType = UIGrid.ITEM_FIXED_COLS;
	}
	else {
		this.itemWidthType = UIGrid.ITEM_FIXED_WIDTH;
	}

	this.itemWidth = value;

	return;
}

UIGrid.prototype.getCols = function() {
	if(this.itemWidthType === UIGrid.ITEM_FIXED_COLS) {
		return this.itemWidth;
	}
	else {
		return Math.floor(this.getWidth(true)/(this.itemWidth+this.spacer));
	}
}

UIGrid.prototype.getChildAt = function(row, col) {
	var cols = this.getCols();
	var index = row * cols + col;

	if(index < this.children.length) {
		return this.children[index];
	}
	else {
		return null;
	}
}

UIGrid.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

UIGrid.prototype.childIsBuiltin = function(child) {
	return child.name === "ui-last";
}

UIGrid.prototype.afterPaintChildren =function(canvas) {
	if(this.mode !== C_MODE_EDITING) {
		return;
	}
	
	var rows = 0;
	var cols = 0;
	var offset = 0;
	var x = this.vMargin;
	var y = this.hMargin;
	var w = this.w;
	var h = this.h;

	rows = this.rows ? this.rows : 3;
	cols = this.cols ? this.cols : 3;

	drawDashedRect(canvas, x, y, w, h);
	for(var i = 1; i < rows; i++) {
		offset = (h * i)/rows;
		drawDashedLine(canvas, {x:x, y:offset}, {x:w, y:offset}, 8, 4);
	}
	
	for(var i = 1; i < cols; i++) {
		offset = (w * i)/cols;
		drawDashedLine(canvas, {x:offset, y:y}, {x:offset, y:h}, 8, 4);
	}

	canvas.strokeStyle = this.style.lineColor;
	canvas.stroke();

	return;
}

UIGrid.prototype.calcItemSize = function() {
	var iw = 0;
	var ih = 0;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	
	if(this.itemWidthType === UIGrid.ITEM_FIXED_COLS) {
		iw = w/this.itemWidth - this.spacer;
	}
	else {
		var cols = Math.floor(w/this.itemWidth);
		iw = Math.floor(w/cols);
	}

	if(this.itemHeightType === UIGrid.ITEM_FIXED_ROWS) {
		ih = h/this.itemHeight - this.spacer;
	}
	else {
		var rows = Math.floor(h/this.itemHeight);
		ih = Math.floor(h/rows);
	}

	return {w:Math.floor(iw), h:Math.floor(ih)};
}

UIGrid.prototype.sortChildren = function() {
	var itemSize = this.calcItemSize();
	var itemH = itemSize.h;
	var iterW = itemSize.w;

	this.children.sort(function(a, b) {
		var aa = 0;
		var bb = 0;
		var ar = Math.floor((a.y + 5)/itemH);
		var br = Math.floor((b.y + 5)/itemH);
		
		if(ar === br) {
			bb = b.x;
			aa = (b.pointerDown && b.hitTestResult === C_HIT_TEST_MM) ? (a.x + a.w) : a.x;
		}
		else {
			aa = ar;
			bb = br;
		}

		return aa - bb;
	});

	return;
}

UIGrid.prototype.getChildIndexByPosition = function(point) {
	var border = this.getHMargin();
	var itemSize = this.calcItemSize();
	
	var spacer = this.spacer;
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var itemW = itemSize.w + spacer;
	var itemH = itemSize.h + spacer;
	var cols = Math.floor(w/itemW);
	var rows = Math.floor(h/itemH);

	var r = Math.floor((point.y - border)/itemSize.h);
	var c = Math.floor((point.x - border)/itemSize.w);

	var index = r * cols + c;

	return index;
}

UIGrid.prototype.onChildDragging = function(child, point) {
	var targetChildIndex = this.getChildIndexByPosition(point);
	var sourceChildIndex = this.getIndexOfChild(child);
	
	this.callOnChildDragging(sourceChildIndex, targetChildIndex);

	return;
}

UIGrid.prototype.onChildDragged = function(child, point) {
	var targetChildIndex = this.getChildIndexByPosition(point);
	var sourceChildIndex = this.getIndexOfChild(child);
	
	this.callOnChildDragged(sourceChildIndex, targetChildIndex);
	
	this.relayoutChildren("default");

	return;
}

UIGrid.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var spacer = this.spacer;
	var border = this.getHMargin();
	var itemSize = this.calcItemSize();

	var r = 0;
	var c = 0;
	var vborder = 0;
	var hborder = 0;
	var x = border;
	var y = border;
	var pageIndex = 0;
	var w = this.getWidth(true);
	var h = this.getHeight(true);

	var itemW = itemSize.w + spacer;
	var itemH = itemSize.h + spacer;
	var cols = Math.floor(w/itemW);
	var rows = Math.floor(h/itemH);

	vborder = border;
	hborder = (this.w - cols * itemW)/2;

	this.cols = cols;
	this.rows = rows;

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
	
		r = Math.floor(i/cols);
		c = Math.floor(i%cols);
	
		x = hborder + c * itemW;
		y = vborder + r * itemH;

		if(animHint || this.mode === C_MODE_EDITING) {
			child.animMove(x, y, animHint);
		}
		else {
			child.move(x, y);
		}

		child.xAttr = C_X_FIX_LEFT;
		child.yAttr = C_Y_FIX_TOP;
		child.widthAttr = C_WIDTH_FIX;
		child.heightAttr = C_HEIGHT_FIX;
		child.setSize(itemSize.w, itemSize.h);
		child.setUserMovable(true);
		child.setUserResizable(false);
		child.relayoutChildren();
		if(!this.isUIScrollView) {
			child.setDraggable(this.itemDraggable);
		}
	}

	return;
}

UIGrid.prototype.afterChildAppended = function(shape) {
	if(shape.view && this.mode === C_MODE_EDITING && shape.isCreatingElement()) {
		this.sortChildren();
	}

	this.moveMustBeLastItemToLast();
	shape.setUserMovable(true);
	shape.setUserResizable(false);
	shape.setCanRectSelectable(false, true);
	shape.setDraggable(this.itemDraggable);

	shape.xAttr = C_X_FIX_LEFT;
	shape.yAttr = C_Y_FIX_TOP;
	shape.widthAttr = C_WIDTH_FIX;
	shape.heightAttr = C_HEIGHT_FIX;

	return true;
}

UIGrid.prototype.triggerUserEditingMode = function() {
	if(this.mode === C_MODE_EDITING) {
		return;
	}

	this.userEditingMode = !this.userEditingMode;

	var grid = this;
	function redrawGrid() {
		grid.postRedraw();

		if(grid.userEditingMode) {
			setTimeout(redrawGrid, 20);
		}
	}

	redrawGrid();

	return;
}

UIGrid.prototype.isInUserEditingMode = function() {
	return this.userEditingMode && this.mode != C_MODE_EDITING;
}

UIGrid.prototype.beforePaintChild = function(child, canvas) {
	if(this.isInUserEditingMode()) {
		canvas.save();
		var cx = child.x + child.w/2;
		var cy = child.y + child.h/2;
		var t = (new Date()).getTime()/1000;
		var angle = 0.03 * Math.cos(20*t);

		canvas.translate(cx, cy);
		canvas.rotate(angle);
		canvas.translate(-cx, -cy);
	}

	return;
}

UIGrid.prototype.afterPaintChild = function(child, canvas) {
	if(this.isInUserEditingMode()) {
		var image = this.getHtmlImageByType(CANTK_IMAGE_DELETE_ITEM);

		if(image && image.width > 0) {
			var y = child.y + child.vMargin;
			var x = child.x + child.w - image.width - child.hMargin;
			canvas.drawImage(image, x, y);
		}

		canvas.restore();
	}

	return;
}

function UIGridCreator(border, itemSize, bg) {
	var args = ["ui-grid", "ui-grid", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGrid();
		return g.initUIGrid(this.type, border, itemSize, bg);
	}
	
	return;
}



/*
 * File:   ui-grid-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Grid View(Scrollable)
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIGridView() {
	return;
}

UIGridView.prototype = new UIVScrollView();
UIGridView.prototype.isUIGrid = true;
UIGridView.prototype.isUILayout= true;
UIGridView.prototype.isUIGridView = true;
UIGridView.prototype.gridToJson = UIGrid.prototype.gridToJson;
UIGridView.prototype.gridFromJson = UIGrid.prototype.gridFromJson;
UIGridView.prototype.sortChildren = UIGrid.prototype.sortChildren;
UIGridView.prototype.initUIGrid = UIGrid.prototype.initUIGrid;
UIGridView.prototype.shapeCanBeChild = UIGrid.prototype.shapeCanBeChild;
UIGridView.prototype.childIsBuiltin = UIGrid.prototype.childIsBuiltin;
UIGridView.prototype.paintSelfOnly = UIGrid.prototype.paintSelfOnly;
UIGridView.prototype.calcItemSize = UIGrid.prototype.calcItemSize;
UIGridView.prototype.relayoutChildren = UIGrid.prototype.relayoutChildren;
UIGridView.prototype.afterChildAppended = UIGrid.prototype.afterChildAppended;
UIGridView.prototype.triggerUserEditingMode = UIGrid.prototype.triggerUserEditingMode;
UIGridView.prototype.isInUserEditingMode = UIGrid.prototype.isInUserEditingMode;
UIGridView.prototype.beforePaintChild = UIGrid.prototype.beforePaintChild;
UIGridView.prototype.afterPaintChild = UIGrid.prototype.afterPaintChild;
UIGridView.prototype.afterPaintChildren = UIGrid.prototype.afterPaintChildren;

UIGridView.prototype.initUIGridView = function(type, border, itemHeight, bg) {
	this.initUIGrid(type, border, itemHeight, bg);
	this.initUIVScrollView(type, 0, bg, null);	

	return this;
}

UIGridView.prototype.onModeChanged = function() {
	this.offset = 0;

	return;
}

function UIGridViewCreator(border, itemSize, bg) {
	var args = ["ui-grid-view", "ui-grid-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGridView();
		return g.initUIGridView(this.type, border, itemSize, bg);
	}
	
	return;
}


/*
 * File:   ui-html.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  HTML 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIHtml() {
	return;
}

UIHtml.prototype = new UIElement();
UIHtml.prototype.isUIHtml = true;

UIHtml.prototype.initUIHtml = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);

	return this;
}

UIHtml.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIHtml.prototype.paintSelfOnly =function(canvas) {
	if(!this.htmlVisible) {
		canvas.beginPath();
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

UIHtml.prototype.drawImage =function(canvas) {
	if(this.mode === C_MODE_EDITING || this.isIcon) {
		this.drawBgImage(canvas);
	}

	return;
}

UIHtml.prototype.setVisible = function(visible) {
	if(this.visible != visible) {
		if(visible) {
			this.onShowHTML();
		}
		else {
			this.onHideHTML();
		}
		this.visible = visible;
	}

	return;
}

UIHtml.prototype.showHTMLElement = function() {
	var el = this.element;
	if(el) {
		var scale = this.getRealScale();
		var p = this.getPositionInView();
		var x = p.x * scale + this.view.getX();
		var y = p.y * scale + this.view.getY();
		var w = this.w * scale;
		var h = this.h * scale;
		
		el.style.position = "absolute";
		el.style.left = x + "px";
		el.style.top = y + "px";
		el.style.width = w + "px";
		el.style.height = h + "px";
		el.style.visibility = 'visible';
		
		this.htmlVisible = true;
	}

	return;
}

UIHtml.prototype.createHTMLElement = function(name) {
	var element = null;
	if(!this.element) {
		element = document.createElement(name);
		element.id = this.type + this.name;
		document.body.appendChild(element);
		this.element = element;
	}

	return this.element;
}

UIHtml.prototype.beforeShowHTML = function() {
}

UIHtml.prototype.setScrollable = function(scrollable) {
	this.scrollable = scrollable;

	return;
}

UIHtml.prototype.onSetElementStyle = function() {
	var fontSize = Math.floor(this.scaleForCurrentDensity(14));

	this.element.style.fontSize = fontSize + "px";
	this.element.style.marginLeft = "6px";
	this.element.style.marginTop = "6px";
	this.element.style.marginBottom = "6px";
	this.element.style.marginRight = "6px";

	return;
}

UIHtml.prototype.onShowHTML = function() {
	this.createHTMLElement("div");
	this.element.innerHTML = this.getHtmlContent();
	this.element.style.overflow = this.scrollable ? "scroll" : "hidden";
	this.element.style.zIndex = 5;
	this.element.style["-ms-touch-action"] = "auto";

	this.onSetElementStyle();

	if(this.mode != C_MODE_EDITING) {
		this.beforeShowHTML();
		this.showHTMLElement();
	}

	return;
}

UIHtml.prototype.beforeHideHTML = function() {
}

UIHtml.prototype.onHideHTML = function() {
	this.htmlVisible = false;
	if(this.element) {
		this.beforeHideHTML();
		this.element.style.visibility = 'hidden';
	}

	return;
}

UIHtml.prototype.getValue = function() {
	return this.value;
}

UIHtml.prototype.setValue = function(value) {
	this.value = value;

	return;
}

function UIHtmlCreator(w, h) {
	var args = ["ui-html", "ui-html", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHtml();
		return g.initUIHtml(this.type, w, h);
	}
	
	return;
}

/*
 * File:   ui-html-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  HTML View
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIHtmlView() {
	return;
}

UIHtmlView.prototype = new UIHtml();
UIHtmlView.prototype.isUIHtmlView = true;

UIHtmlView.prototype.getHtmlContent = function() {
	var html = "<p>hello html view";
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var url = this.getUrl();
	var content = this.getValue();

	if(url) {
		html = '<iframe seamless="seamless" scrolling="yes" width="'+w+'" height="'+h+'" src="'+url+'"></iframe>';
	}
	else if(content) {
		html = content;
	}

	return html;
}

UIHtmlView.prototype.setText = function(text) {
	this.text = text;

	return;
}


UIHtmlView.prototype.getValue = function() {
	return this.text ? this.text : "";
}

UIHtmlView.prototype.setValue = function(text) {
	this.text = text;

	return;
}

UIHtmlView.prototype.getUrl = function() {
	return this.url ? this.url : "";
}

UIHtmlView.prototype.setUrl = function(url) {
	this.url = url;

	return;
}

UIHtmlView.prototype.paintSelfOnly = function(canvas) {
	if(!this.htmlVisible) {
		var x = this.w >> 1;
		var y = this.h >> 1;
		var str = dappGetText("HtmlView");
		canvas.textBaseline = "middle";
		canvas.textAlign = "center";
		canvas.font = this.style.getFont();
		canvas.fillStyle = this.style.textColor;
		canvas.fillText(str, x, y);
	}

	return;
}

UIHtmlView.prototype.initUIHtmlView = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("<p>hello html view");
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.setScrollable(true);

	return this;
}

function UIHtmlViewCreator() {
	var args = ["ui-html-view", "ui-html-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIHtmlView();
		return g.initUIHtmlView(this.type);
	}
	
	return;
}


/*
 * File:   ui-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImage() {
	return;
}

UIImage.prototype = new UIElement();
UIImage.prototype.isUIImage = true;

UIImage.prototype.initUIImage = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.images.display = CANTK_IMAGE_DISPLAY_CENTER;
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	this.addEventNames(["onOnUpdateTransform"]); 

	this.clickable = false;
	this.clickedStyleParam = 0.8;
	this.clickedStyleType = 0;

	return this;
}

UIImage.prototype.getImageSrcRect = function() {
	if(this.imageSrcW && this.imageSrcH) {
		var rect = {};
		rect.x = this.imageSrcX;
		rect.y = this.imageSrcY;
		rect.w = this.imageSrcW;
		rect.h = this.imageSrcH;

		return rect;
	}
	else {
		return null;
	}
}

UIImage.prototype.setImageSrcRect = function(x, y, w, h) {
	this.imageSrcX = x;
	this.imageSrcY = y;
	this.imageSrcW = w;
	this.imageSrcH = h;

	return;
}

UIImage.prototype.setValue = function(value) {
	this.setImage(CANTK_IMAGE_DEFAULT, value);

	return;
}

UIImage.prototype.setImageSrc = function(value) {
	this.setImage(CANTK_IMAGE_DEFAULT, value);

	return;
}

UIImage.prototype.getImageSrc = function(type) {
	return this.getImageSrcByType(type ? type : CANTK_IMAGE_DEFAULT);
}

UIImage.prototype.getHtmlImage = function() {
	return this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);
}

UIImage.prototype.setBorderStyle = function(borderColor, borderWidth) {
	this.borderColor = borderColor;
	this.borderWidth = borderWidth;

	return;
}

UIImage.prototype.setClickedStyle = function(type, param) {
	this.clickedStyleType = type;

	if(!param) {
		switch(type) {
			case UIImage.CLICKED_STYLE_SHADOW: {
				param = 10;			
				break;
			}
			case UIImage.CLICKED_STYLE_OPACITY: {
				param = 0.5;
				break;
			}
			case UIImage.CLICKED_STYLE_RECT_BG: {
				break;
			}
			case UIImage.CLICKED_STYLE_RECT_BORDER:{
				param = 2;
			}
			default:break;
		}
	}

	this.clickedStyleParam = param;

	return;
}

UIImage.CLICKED_STYLE_SHADOW = 1;
UIImage.CLICKED_STYLE_OPACITY = 2;
UIImage.CLICKED_STYLE_RECT_BG = 3;
UIImage.CLICKED_STYLE_RECT_BORDER = 4;

UIImage.prototype.drawImage =function(canvas) {
	
	canvas.save();

	var globalAlpha = canvas.globalAlpha;
	if(this.clickable && this.pointerDown) {
		switch(this.clickedStyleType) {
			case UIImage.CLICKED_STYLE_OPACITY: {
				canvas.globalAlpha = globalAlpha * this.clickedStyleParam;
				break;
			}
			case UIImage.CLICKED_STYLE_RECT_BG: {
				canvas.fillStyle = this.style.fillColor;
				canvas.fillRect(0, 0, this.w, this.h);
				break;
			}
			case UIImage.CLICKED_STYLE_SHADOW: {
				canvas.shadowColor = this.style.lineColor;
				canvas.shadowBlur = isNaN(this.clickedStyleParam) ? 25 : this.clickedStyleParam;
				canvas.shadowOffsetX = 0;
				canvas.shadowOffsetY = 0;
				break;
			}
		}
		
	}

	var image = this.getBgImage();
	var srcRect = this.getImageSrcRect();
	this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, srcRect);

	if(this.clickable && this.pointerDown) {
		switch(this.clickedStyleType) {
			case UIImage.CLICKED_STYLE_OPACITY: {
				canvas.globalAlpha = globalAlpha;
				break;
			}
			case UIImage.CLICKED_STYLE_RECT_BORDER: {
				canvas.strokeStyle = this.style.lineColor;
				canvas.lineWidth = isNaN(this.clickedStyleParam) ? 1 : this.clickedStyleParam;
				canvas.rect(0, 0, this.w, this.h);
				canvas.stroke();
				break;
			}
			case UIImage.CLICKED_STYLE_SHADOW: {
				canvas.shadowColor = null;
				canvas.shadowBlur = 0;
				canvas.shadowOffsetX = 0;
				canvas.shadowOffsetY = 0;
				break;
			}
		}
	}
	else if(this.borderColor && this.borderWidth) {
		canvas.strokeStyle = this.borderColor;
		canvas.lineWidth = this.borderWidth;
		canvas.rect(0, 0, this.w, this.h);
		canvas.stroke();
	}

	canvas.restore();

	return;
}

UIImage.prototype.setClickable = function(clickable) {
	this.clickable = clickable;

	return;
}

UIImage.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;


function UIImageCreator(type, w, h, defaultImage) {
	var args = [type, "ui-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImage();
		return g.initUIImage(this.type, w, h, defaultImage);
	}
	
	return;
}

/*
 * File:   ui-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Use image to present a value, such as sound volume/battery status.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageValue() {
	return;
}

UIImageValue.prototype = new UIImage();
UIImageValue.prototype.isUIImageValue = true;

UIImageValue.prototype.initUIImageValue = function(type, w, h) {
	this.initUIImage(type, w, h, null);	
	this.value = 0;

	return this;
}

UIImageValue.prototype.getImageSrcByValue = function(value) {
	var type = "option_image_" + value; 

	return this.getImageSrcByType(type);
}

UIImageValue.prototype.getValue = function() {
	return this.value;
}

UIImageValue.prototype.setValue = function(value) {
	var src = this.getImageSrcByValue(value);

	if(src) {
		this.value = value;
		this.setImage(CANTK_IMAGE_DEFAULT, src);
	}

	return this.value;
}

UIImageValue.prototype.inc = function() {
	var value = this.value + 1;

	return this.setValue(value);	
}

UIImageValue.prototype.dec = function() {
	var value = this.value - 1;

	return this.setValue(value);	
}

UIImageValue.prototype.shapeCanBeChild = function(shape) {
	return false;
}


function UIImageValueCreator(w, h, defaultImage) {
	var args = ["ui-image-value", "ui-image-value", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageValue();
		return g.initUIImageValue(this.type, w, h, defaultImage);
	}
	
	return;
}

/*
 * File:   ui-image-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief: Image View 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageView() {
	return;
}

UIImageView.prototype = new UIElement();
UIImageView.prototype.isUIImageView = true;

UIImageView.cachedImages = {};
UIImageView.IMAGE_STATE_PENDING = 0;
UIImageView.IMAGE_STATE_ERROR   = 1;
UIImageView.IMAGE_STATE_DONE    = 2;

imageViewInitCustomProp = function(me) {
}

imageThumbViewInitCustomProp = function(me) {
}

imageAnimationInitCustomProp = function(me) {
}

imageSlideViewInitCustomProp = function(me) {
}


UIImageView.prototype.imageViewToJson = function(o) {
	o.userImages = this.getValue();

	return o;
}

UIImageView.prototype.imageViewFromJson = function(js) {
	this.cacheInvalid = true;

	if(js.userImages) {
		this.userImages = [];
		var arr = js.userImages.split("\n");

		var n = arr.length;
		for(var i = 0; i < n; i++) {
			var type = "image_" + (i+1);	
			var src = this.getImageSrcByType(type);
			if(src && src.length > 4) {
				this.userImages.push(src);
			}
		}
	}

	return;
}

UIImageView.prototype.initUIImageView = function(w, h) {
	this.setDefSize(w, h);
	this.userImages = [];
	
	this.onSized               = UIImageView.prototype.onSized;
	this.afterRelayout         = UIImageView.prototype.afterRelayout;
	this.setValue              = UIImageView.prototype.setValue;
	this.getValue              = UIImageView.prototype.getValue;
	this.ensureImages          = UIImageView.prototype.ensureImages;
	this.addUserImage          = UIImageView.prototype.addUserImage;
	this.imageViewToJson       = UIImageView.prototype.imageViewToJson;
	this.imageViewFromJson     = UIImageView.prototype.imageViewFromJson;
	this.onScaleForDensityDone = UIImageView.prototype.onScaleForDensityDone;

	imageViewInitCustomProp(this);

	this.regSerializer(this.imageViewToJson, this.imageViewFromJson);

	return this;
}

UIImageView.createImage = function(src, onLoadDone) {
	var image = UIImageView.cachedImages[src];
	
	if(!image) {
		image = new Image();

		image.src = src;
		image.onLoadDoneListeners = [];

		function notifyImageLoadDone(image, result) {
			if(!image || !image.onLoadDoneListeners) {
				return;
			}

			for(var i = 0; i < image.onLoadDoneListeners.length; i++) {
				var onLoad = image.onLoadDoneListeners[i];
			
				onLoad(image, result);
			}

			image.onLoadDoneListeners.clear();

			return;
		}

		image.onload = function(e) {
			notifyImageLoadDone(this, true);
			this.loaded = true;
		}
		
		image.onabort = function(e) {
			notifyImageLoadDone(this, false);	
			this.failed = true;
			console.log("load " + this.src + " failed.");
		}
		
		image.onerror = function(e) {
			notifyImageLoadDone(this, false);	
			this.failed = true;
			console.log("load " + this.src + " failed.");
		}
	}
	else {
		console.log("Create Image From Cache: " + src);
	}

	if(onLoadDone) {
		if(image.loaded) {
			onLoadDone(image, true);
		}
		else if(image.failed) {
			onLoadDone(image, false);
		}
		else {
			image.onLoadDoneListeners.push(onLoadDone);
		}
	}

	return image;
}

UIImageView.drawImageAtCenter = function(ctx, image, x, y, w, h, keepRatio, clearColor) {
	if(clearColor) {
		ctx.fillStyle = clearColor;
		ctx.fillRect(x, y, w, h);
	}
	else {
		ctx.clearRect(x, y, w, h);
	}

	if(image && image.width > 0) {
		var dw = w;
		var dh = h;
		var sw = image.width;
		var sh = image.height;
		var imageW = image.width;
		var imageH = image.height;

		if(keepRatio) {
			var scaleX = dw/imageW;
			var scaleY = dh/imageH;
		
			if(scaleX < scaleY) {
				sw = Math.min(imageW, dw/scaleY);
			}
			else {
				sh = Math.min(imageH, dh/scaleX);
			}
		}

		ctx.drawImage(image, 0, 0, sw, sh, x, y, dw, dh);
	}

	return;
}

UIImageView.prototype.ensureImages = function() {
	if(!this.cacheInvalid) {
		return;
	}

	var imageview = this;
	function onLoadDone(image, result) {
		imageview.postRedraw();

		return;
	}

	this.cachedImages = [];
	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		var image = UIImageView.createImage(src, onLoadDone);

		this.cachedImages.push(image);
	}

	delete this.cacheInvalid;

	return;
}

UIImageView.prototype.afterRelayout = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.onSized = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.onScaleForDensityDone = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.addUserImage = function(src) {
	this.cacheInvalid = true;
	this.userImages.push(src);

	var key = "image_" + this.userImages.length;

	this.setImage(key, src);

	return;
}

UIImageView.prototype.getCurrentImage = function() {
	return this.curentImage;
}

UIImageView.prototype.setValue = function(srcs) {
	var arr = srcs.split("\n");

	this.userImages = [];
	this.images = {};
	this.images.display = 0;

	for(var i = 0; i < arr.length; i++) {
		if(arr[i]) {
			this.addUserImage(arr[i]);
		}
	}

	return;
}

UIImageView.prototype.getValue = function() {
	var srcs = "";

	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		src = src.replace(/http:\/\/www.drawapp8.net/, "");
		src = src.replace(/http:\/\/www.drawapp8.com/, "");
		srcs = srcs + src + "\n";	
	}

	return srcs;
}

/*
 * File:   ui-image-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Animation.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageAnimation() {
	return;
}

UIImageAnimation.prototype = new UIImageView();
UIImageAnimation.prototype.isUIImageAnimation = true;

UIImageAnimation.prototype.initUIImageAnimation = function(type, w, h) {
	this.initUIElement(type);	
	this.initUIImageView(w, h);
	
	this.addEventNames(["onChanged"]);
	this.setTextType(C_SHAPE_TEXT_NONE);
	imageAnimationInitCustomProp(this);

	return this;
}

UIImageAnimation.prototype.setCurrent = function(current) {
	if(this.userImages.length) {
		current = current%this.userImages.length;
	}

	if(this.currFrame != current) {
		this.callOnChanged(current);
	}

	this.currFrame = current;

	return;
}

UIImageAnimation.prototype.onInit = function() {
	var imageAnim = this;

	this.currFrame = 0;

	function nextFrame() {
		if(imageAnim.isVisible()) {
			var duration = 1000/imageAnim.getFrameRate();
			
			imageAnim.postRedraw();
			setTimeout(nextFrame, duration);
			imageAnim.setCurrent(imageAnim.currFrame + 1);
		}
	}

	var duration = 1000/this.getFrameRate();
	setTimeout(nextFrame, duration);

	return;
}

UIImageAnimation.prototype.getFrameRate = function() {
	return this.frameRate ? this.frameRate : 5;
}

UIImageAnimation.prototype.setFrameRate = function(frameRate) {
	this.frameRate = Math.max(1, Math.min(frameRate, 30));

	return;
}

UIImageAnimation.prototype.drawImage = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currFrame = (this.currFrame ? this.currFrame : 0)%this.userImages.length;
	var image = this.cachedImages[currFrame];

	if(image && image.width > 0) {
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h);
	}

	return;
}


UIImageAnimation.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIImageAnimationCreator() {
	var args = [ "ui-image-animation", "ui-image-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageAnimation();
		return g.initUIImageAnimation(this.type, 200, 200);
	}
	
	return;
}


/*
 * File:   ui-image-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Button
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageButton() {
	return;
}

UIImageButton.prototype = new UIButton();
UIImageButton.prototype.isUIImageButton = true;

UIImageButton.prototype.initUIImageButton = function(type, w, h) {
	this.initUIButton(type, w, h);
	this.noTextAlignment = true;
	this.setImage(CANTK_IMAGE_NORMAL_FG, null);
	this.setImage(CANTK_IMAGE_ACTIVE_FG, null);
	this.setImage(CANTK_IMAGE_DISABLE_FG, null);

	return this;
}

UIImageButton.prototype.drawText = function(canvas) {
	return;
}

UIImageButton.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIImageButton.prototype.drawFgImage = function(canvas) {
	var bgImage = this.getBgImage();
	var gapBetweenTextImage = 2;
	var imageActive = this.getHtmlImageByType(CANTK_IMAGE_ACTIVE_FG);
	var imageNormal = this.getHtmlImageByType(CANTK_IMAGE_NORMAL_FG);
	var imageDisable = this.getHtmlImageByType(CANTK_IMAGE_DISABLE_FG);
	var str = this.getLocaleText(this.text);
	var fontSize = this.style.fontSize;

	var x = 0;
	var y = 0;
	var w = this.w;
	var h = this.h;

	var image = null;
	if(this.enable) {
		image = this.pointerDown ? imageActive : imageNormal;
		if(this.pointerDown) {
			if(!bgImage) {
				canvas.fillStyle = this.style.fillColor;
				canvas.fillRect(0, 0, w, h);
			}
			if(!image) {
				image = imageNormal;
				canvas.translate(1, 2);
			}
		}
	}
	else {
		image = imageDisable;
	}

	canvas.font = this.style.getFont();
	canvas.fillStyle = this.enable ? this.style.textColor : "#CCCCCC";
	if(image) {
		var imageW = image.width;
		var imageH = image.height;
		var hMargin = this.hMargin;

		if(str) {
			var textW = canvas.measureText(str).width + 4;
			if(textW > w) {
				var fontSize = Math.round((w/textW) * this.style.fontSize);
				this.style.setFontSize(fontSize)
				canvas.font = this.style.getFont();
			}
			
			if(this.w > 6 * this.h) {
				var dx = x + hMargin;
				var dy = Math.floor(y + (h-imageH)/2);
				canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);

				dy = Math.floor(y + h/2);
				dx = Math.floor(x + (w-imageW)/2 + imageW);
				canvas.textAlign = "center";
				canvas.textBaseline = "middle";
				canvas.fillText(str, dx, dy);
			}
			else {
				var size = this.h - fontSize;
				var dw = Math.min(size, imageW);
				var dh = Math.min(size, imageH);
				var dx = Math.floor(x + (w-dw)/2);
				var dy = Math.floor(y + (h-dh-6)/2);
				var rect = {x:0, y:0, w:imageW, h:imageH};

				if(dy > 0 && size < imageH) {
					dy = 0;
				}

				this.drawImageAt(canvas, image, CANTK_IMAGE_DISPLAY_CENTER, dx, dy, dw, dh, rect);

				dx = Math.floor(x + w/2);
				dy = dy + dh + gapBetweenTextImage;
				if((dy + fontSize + 3) > this.h) {
					dy = this.h - fontSize - 3;
				}
				canvas.textAlign = "center";
				canvas.textBaseline = "top";
				canvas.fillText(str, dx, dy);
			}
		}
		else {
			this.drawImageAt(canvas, image, this.images.display, x, y, this.w, this.h);
		}
	}
	else {
		if(str) {
			canvas.textAlign = "center";
			canvas.textBaseline = "middle";
			canvas.fillText(str, Math.floor(x+w/2), Math.floor(y+h/2));
		}
	}

	return;
}

function UIImageButtonCreator(w, h) {
	var args = ["ui-image-button", "ui-image-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageButton();
		return g.initUIImageButton(this.type, w, h);
	}
	
	return;
}


/*
 * File:   ui-image-normal-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Normal Image View 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageNormalView() {
	return;
}

UIImageNormalView.prototype = new UIImageView();
UIImageNormalView.prototype.isUIImageNormalView = true;

UIImageNormalView.prototype.initUIImageNormalView = function(type, w, h) {
	this.userImages = [];
	this.cachedImages = [];

	this.initUIElement(type);
	this.initUIImageView(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.current = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.imageScale = 1;

	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator();
	this.errorImage = UIImageView.createImage("drawapp8/images/common/failed.png", null);
	this.loadingImage = UIImageView.createImage("drawapp8/images/common/loading.png", null);
	
	return this;
}

UIImageNormalView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.velocityTracker.clear();

	return;
}

UIImageNormalView.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.offsetX = this.offsetX + this.getMoveDeltaX();
	this.offsetY = this.offsetY + this.getMoveDeltaY();

	this.addMovementForVelocityTracker();

	return ;
}

UIImageNormalView.prototype.getVelocity = function() {
	return this.velocityTracker.getVelocity().x;
}

UIImageNormalView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var velocity = this.velocityTracker.getVelocity();
	var xa = this.w;
	var ya = this.h;
	var xt = velocity.x/xa;
	var yt = velocity.y/ya;
	var t = Math.max(xt, yt);

	var xd = 0.5 * xa * xt * xt;
	var yd = 0.5 * ya * yt * yt;

	xd = velocity.x > 0 ? xd : -xd;
	yd = velocity.y > 0 ? yd : -yd;
	this.scrollTo(xd, yd, t * 1000);

	return true;
}

UIImageNormalView.prototype.scrollTo = function(xd, yd, t) {
	var imageview = this;
	var duration = Math.max(500, Math.min(t, 1000));
	
	var startTime = (new Date()).getTime();
	var offsetXStart = this.offsetX;
	var offsetYStart = this.offsetY;
	var currentImage = this.cachedImages[this.current];

	var dx = Math.min(currentImage.width/2, xd);
	var dy = Math.min(currentImage.height/2, yd);

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;
		
		if(percent < 1) {
			imageview.offsetX = offsetXStart + percent * dx;
			imageview.offsetY = offsetYStart + percent * dy;

			setTimeout(animStep, 10);
		}
		else {
			delete startTime;
			imageview.offsetX = offsetXStart + dx;
			imageview.offsetY = offsetYStart + dy;
		}

		delete now;
		imageview.postRedraw();
	}

	animStep();

	return;
}

UIImageNormalView.prototype.switchTo = function(offset) {
	var current = this.current;
	var n = this.userImages.length;
	if(offset > 0) {
		if((this.current+offset) < n) {
			current = this.current + offset;	
		}
	}
	else {
		if((this.current+offset) > 0) {
			current = this.current + offset;
		}
	}
}

UIImageNormalView.prototype.calcImageDefaultOffset = function() {
	var index = this.current;
	if(index < 0 || index >= this.cachedImages.length) {
		return;
	}

	var image = this.cachedImages[index];
	if(!image || !image.width) {
		return;
	}

	this.imageScale = Math.min(this.w/image.width, this.h/image.height);
	
	var w = this.imageScale * image.width;
	var h = this.imageScale * image.height;

	this.offsetX = (this.w-w)/2;
	this.offsetY = (this.h-h)/2;

	return;
}

UIImageNormalView.prototype.setCurrentImage = function(index) {
	if(index < 0 || index >= this.userImages.length) {
		return;
	}

	this.current = index;
	this.calcImageDefaultOffset();

	return;
}

UIImageNormalView.prototype.onDoubleClick = function(point, beforeChild) {
	this.calcImageDefaultOffset();
	return this.callDoubleClickHandler(point);
}

UIImageNormalView.prototype.paintSelfOnly = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currentImage = this.cachedImages[this.current];
	if(!currentImage || !currentImage.width) {
		return;
	}

	this.imageScale = 1;
	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();

	canvas.translate(this.offsetX, this.offsetY);
	canvas.scale(this.imageScale, this.imageScale);
	canvas.drawImage(currentImage, 0, 0);
	canvas.restore();

	return;
}

function UIUIImageNormalViewCreator() {
	var args = ["ui-image-normal-view", "ui-image-normal-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageNormalView();

		return g.initUIImageNormalView(this.type, 300, 300);
	}
	
	return;
}


/*
 * File:   ui-image-slide-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Slide View.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIImageSlideView() {
	return;
}

UIImageSlideView.prototype = new UIImageView();
UIImageSlideView.prototype.isUIImageSlideView = true;

UIImageSlideView.prototype.initUIImageSlideView = function(type, w, h) {
	this.initUIElement(type);	
	this.initUIImageView(w, h);
	
	this.offset = 0;
	this.addEventNames(["onChanged"]);
	this.setTextType(C_SHAPE_TEXT_NONE);
	imageSlideViewInitCustomProp(this);

	return this;
}

UIImageSlideView.prototype.onInit = function() {
	var slideview = this;

	this.currFrame = 0;

	function nextFrame() {
		if(slideview.mode != C_MODE_EDITING && slideview.isVisible()) {
			var duration = slideview.getFrameDuration();
			
			slideview.postRedraw();
			setTimeout(nextFrame, duration);

			var newFrame = slideview.currFrame + 1;
			slideview.animScrollTo(-slideview.w, newFrame);
		}
	}

	var duration = this.getFrameDuration();
	setTimeout(nextFrame, duration);

	return;
}

UIImageSlideView.prototype.getFrameDuration = function() {
	return this.frameDuration ? this.frameDuration : 5000;
}

UIImageSlideView.prototype.setFrameDuration = function(frameDuration) {
	this.frameDuration = Math.max(1000, Math.min(frameDuration, 300000));

	return;
}

UIImageSlideView.prototype.setShowIndicator = function(value) {
	this.showIndicator = value;

	return;
}

UIImageSlideView.prototype.getFrameIndicatorParams = function() {
	var n = this.userImages.length;
	var itemSize = Math.min((0.5 * this.w)/n, 40);
	var indicatorWidth = itemSize * n;

	var dx = (this.w - indicatorWidth)/2;
	var dy = 0.8 * this.h;

	return {offsetX:dx, offsetY:dy, itemSize:itemSize, n:n};
}

UIImageSlideView.prototype.setCurrentFrame = function(currFrame) {
	this.offset = 0;
	this.currFrame = (currFrame + this.userImages.length)%this.userImages.length;
	this.postRedraw();

	this.callOnChanged(this.currFrame);

	return;
}

UIImageSlideView.prototype.animScrollTo = function(range, newFrame) {
	var duration = 1000;
	var slideview = this;
	var startOffset = this.offset;
	var startTime = (new Date()).getTime();
	var interpolator = new DecelerateInterpolator(2);

	if(slideview.animating) {
		return;
	}

	slideview.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);
		
		if(timePercent < 1) {
			slideview.offset = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			slideview.offset = 0;
			slideview.setCurrentFrame(newFrame);
			delete startTime;
			delete interpolator;
			delete slideview.animating;
		}

		delete now;
		slideview.postRedraw();
	}

	animStep();

	return;
}

UIImageSlideView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();

	return true;
}

UIImageSlideView.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.currFrame;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	}
	else {
		return;
	}

	this.offset = dx;
	this.addMovementForVelocityTracker();

	return;
}

UIImageSlideView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}
	
	var frames = this.getFrames();
	var currFrame = this.currFrame;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	}
	else {
		return;
	}

	var range = 0;
	var offsetX = this.offset;
	var newFrame = this.currFrame;
	var velocity = this.velocityTracker.getVelocity().x;
	var distance = offsetX + velocity;

	//console.log("offsetX: " + offsetX + "velocity:" + velocity + " distance:" + distance );
	if(Math.abs(offsetX) < 10) {
		this.offset = 0;

		return;
	}

	if(Math.abs(distance) > this.w/3) {
		if(offsetX > 0) {
			range = this.w - offsetX;	
			newFrame = this.currFrame - 1;
		}
		else {
			range = -this.w - offsetX;
			newFrame = this.currFrame + 1;
		}
	}
	else {
		range = -offsetX;
	}

	this.animScrollTo(range, newFrame);

	return;
}

UIImageSlideView.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	var params = this.getFrameIndicatorParams();

	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;
	var n = params.n;
	var x = point.x;
	var y = point.y;

	if(y < dy || y > (dy + itemSize) || x < dx || x > (dx + n * itemSize)) {
		return;
	}

	for(var i = 0; i < n; i++) {
		if(x > dx && x < (dx + itemSize)) {
			this.setCurrentFrame(i);	
			break;
		}

		dx += itemSize;
	}

	return;
}

UIImageSlideView.prototype.drawFrameIndicator = function(canvas, currFrame) {
	var params = this.getFrameIndicatorParams();

	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;
	var n = params.n;

	dx += itemSize/2;
	dy += itemSize/2;

	for(var i = 0; i < n; i++) {
		canvas.beginPath();
		canvas.arc(dx, dy, 10, 0, Math.PI * 2);
		dx += itemSize;
	

		if(i === currFrame) {
			canvas.save();
			canvas.shadowColor = this.style.lineColor;
			canvas.shadowBlur = 5;
			canvas.shadowOffsetX = 0;
			canvas.shadowOffsetY = 0;

			canvas.fill();
			canvas.stroke();
			canvas.restore();
		}
		else {
			canvas.fill();
		}
	}

	return;
}

UIImageSlideView.prototype.getPrevFrame = function() {
	var index = (this.currFrame - 1 + this.userImages.length)%this.userImages.length;

	return this.cachedImages[index];
}

UIImageSlideView.prototype.getFrames = function() {
	return this.userImages.length;
}

UIImageSlideView.prototype.getNextFrame = function() {
	var index = (this.currFrame + 1) % this.userImages.length;

	return this.cachedImages[index];
}

UIImageSlideView.prototype.drawOneImage = function(canvas, image) {
	var fillColor = this.style.fillColor;

	if(this.images.display === CANTK_IMAGE_DISPLAY_SCALE) {
		canvas.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.w, this.h);
	}
	else if(this.images.display === CANTK_IMAGE_DISPLAY_SCALE_KEEP_RATIO) {
		var rect = {x:0, y:0};
		rect.w = image.width;
		rect.h = image.height;

		this.drawImageAt(canvas, image, CANTK_IMAGE_DISPLAY_SCALE_KEEP_RATIO, 0, 0, this.w, this.h, rect);
	}
	else {
		UIImageView.drawImageAtCenter(canvas, image, 0, 0, this.w, this.h, true, fillColor);
	}

	return;
}

UIImageSlideView.prototype.drawImage = function(canvas) {
	if(!this.userImages || !this.userImages.length) {
		return;
	}
	
	this.ensureImages();

	var currFrame = (this.currFrame ? this.currFrame : 0)%this.userImages.length;
	var image = this.cachedImages[currFrame];

	if(image && image.width > 0) {
		canvas.save();
		canvas.rect(0, 0, this.w, this.h);
		canvas.clip();
		canvas.beginPath();

		canvas.translate(this.offset, 0);

		this.drawOneImage(canvas, image);

		var offset = Math.abs(this.offset);
		if(this.offset < 0) {
			image = this.getNextFrame();
			if(image && image.width > 0) {
				canvas.translate(this.w, 0);
				this.drawOneImage(canvas, image);
			}
		}
		else if(offset > 0) {
			image = this.getPrevFrame();
			if(image && image.width > 0) {
				canvas.translate(-this.w, 0);
				this.drawOneImage(canvas, image);
			}
		}
		canvas.restore();

		if(this.showIndicator) {
			this.drawFrameIndicator(canvas, currFrame);
		}
	}

	return;
}


UIImageSlideView.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage;
}

function UIImageSlideViewCreator() {
	var args = [ "ui-image-slide-view", "ui-image-slide-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageSlideView();
		return g.initUIImageSlideView(this.type, 200, 200);
	}
	
	return;
}


/*
 * File:   ui-image-thumb-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Thumb Image View 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageThumbView() {
	return;
}

UIImageThumbView.prototype = new UIImageView();
UIImageThumbView.prototype.isUIImageThumbView = true;

UIImageThumbView.prototype.initUIImageThumbView = function(w, h) {
	this.userImages = [];
	this.imageProxies = [];

	this.itemSize = 0;
	this.setDefSize(w, h);
	this.initUIImageView(w, h);

	this.setItemSize = UIImageThumbView.prototype.setItemSize;
	this.getCacheCanvas        = UIImageThumbView.prototype.getCacheCanvas;
	this.getCacheCanvasContext = UIImageThumbView.prototype.getCacheCanvasContext;
	this.getCurrentImage       = UIImageThumbView.prototype.getCurrentImage;
	this.getCurrentImageSrc       = UIImageThumbView.prototype.getCurrentImageSrc;

	imageThumbViewInitCustomProp(this);
	this.errorImage = UIImageView.createImage("drawapp8/images/common/failed.png", null);
	this.loadingImage = UIImageView.createImage("drawapp8/images/common/loading.png", null);
	
	return this;
}

UIImageThumbView.prototype.setItemSize = function(itemSize) {
	this.itemSize = itemSize ? itemSize : 100;

	if(itemSize) {
		this.setSizeLimit(100, itemSize + 10, 2000, 2000);
	}

	return;
}

UIImageThumbView.prototype.setKeepRatio = function(keepRatio) {
	if(this.keepRatio != keepRatio) {
		this.cacheInvalid = true;
	}

	this.keepRatio = keepRatio;

	return;
}

UIImageThumbView.prototype.getCacheCanvasContext = function(w, h) {
	if(!this.cacheImagesCanvas) {
		canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;

		this.cacheImagesCanvas = canvas;
	}

	if(canvas.width != w) {
		canvas.width = w;
	}

	if(canvas.height != h) {
		canvas.height = h;
	}

	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, w, h);

	return ctx;
}

UIImageThumbView.prototype.getCurrentImageSrc = function() {
	return this.currentImageProxy ? this.currentImageProxy.src : null;
}

UIImageThumbView.prototype.getCurrentImage = function() {
	return this.currentImageProxy ? this.currentImageProxy.image : null;
}

UIImageThumbView.createImageProxy = function(thumbview, src, loadingImage, errorImage, ctxToDraw, x, y, w, h) {
	var imageProxy = {};

	imageProxy.x = x;
	imageProxy.y = y;
	imageProxy.w = w;
	imageProxy.h = h;
	imageProxy.src = src;
	imageProxy.imageState = UIImageView.IMAGE_STATE_PENDING;

	function onLoadDone(image, result) {
		var keepRatio = thumbview.keepRatio;

		if(result) {
			imageProxy.imageState = UIImageView.IMAGE_STATE_DONE;
			UIImageView.drawImageAtCenter(ctxToDraw, image, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
		}
		else {
			imageProxy.imageState = UIImageView.IMAGE_STATE_ERROR;
			UIImageView.drawImageAtCenter(ctxToDraw, errorImage, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
		}

		console.log("onLoadDone: " + image.src);
		thumbview.postRedraw();	
	}

	imageProxy.image = UIImageView.createImage(src, onLoadDone);

	if(imageProxy.imageState === UIImageView.IMAGE_STATE_PENDING) {
		var keepRatio = thumbview.keepRatio;	
		UIImageView.drawImageAtCenter(ctxToDraw, loadingImage, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
	}

	return imageProxy;
}

UIImageThumbView.prototype.createCacheCanvas = function() {
	
}

UIImageThumbView.prototype.getCacheCanvas = function() {
	if(this.cacheInvalid || !this.cacheImagesCanvas) {
		this.createCacheCanvas();
	}

	return this.cacheImagesCanvas;
}

/////////////////////////////////////////////////////////////////////////}-{

function UIImageThumbViewTape() {
	return;
}

UIImageThumbViewTape.prototype = new UIHScrollView();

UIImageThumbViewTape.prototype.isUIImageView = true;
UIImageThumbViewTape.prototype.isUIImageThumbView = true;
UIImageThumbViewTape.prototype.isUIImageThumbViewTape = true;

UIImageThumbViewTape.prototype.initUIImageView = UIImageView.prototype.initUIImageView;
UIImageThumbViewTape.prototype.initUIImageThumbView = UIImageThumbView.prototype.initUIImageThumbView;

UIImageThumbViewTape.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIImageThumbViewTape.prototype.initUIImageThumbViewTape = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	
	this.initUIImageThumbView (w, h);

	this.heightAttr = C_HEIGHT_FIX;

	return this;
}

UIImageThumbViewTape.prototype.getSpaceBetweenImages = function() {
	return this.spaceBetweenImages ? this.spaceBetweenImages : 2;
}

UIImageThumbViewTape.prototype.createCacheCanvas = function() {
	var space = this.getSpaceBetweenImages();
	var w = this.w;
	var h = this.h;
	var size = (this.itemSize > 0 && this.itemSize < h) ? this.itemSize : h;

	var canvas = this.cacheImagesCanvas;
	var n = this.userImages.length;
	
	delete this.cacheInvalid;
	this.imageProxies.clear();
	this.currentImageProxy = null;

	if(!n) {
		return;
	}

	w = n * (size + space);

	var x = 0; 
	var y = Math.floor((h - size)/2);
	var errorImage = this.errorImage;
	var loadingImage = this.loadingImage;
	var ctx = this.getCacheCanvasContext(w, h);

	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		
		var imageProxy = UIImageThumbView.createImageProxy(this, src, loadingImage, errorImage, ctx, x, y, size, size);
		this.imageProxies.push(imageProxy);
		
		x = x + size + space;
	}

	return;
}

UIImageThumbViewTape.prototype.getScrollRange = function() {
	var size = this.h;
	var space = this.getSpaceBetweenImages();
	var range = this.userImages.length * (size + space) + space;

	return range;
}

UIImageThumbViewTape.prototype.paintChildren = function(canvas) {
	return;
}

UIImageThumbViewTape.prototype.getCacheCanvasOffset = function() {
	var offset = Math.max(0, (this.w - this.cacheImagesCanvas.width)/2);

	return offset;
}

UIImageThumbViewTape.prototype.onClick = function(point, beforeChild) {
	if(!this.imageProxies || !this.imageProxies.length || beforeChild) {
		return;
	}

	this.currentImageProxy = null;
	var x = point.x - this.getCacheCanvasOffset();

	for(var i = 0; i < this.imageProxies.length; i++) {
		var iter = this.imageProxies[i];
		if(x >= iter.x && x < (iter.x + iter.w)) {
			this.currentImageProxy = iter;	
		}
	}
	
	this.callClickHandler(point, beforeChild);

	return;
}

UIImageThumbViewTape.prototype.paintSelfOnly = function(canvas) {
	if(!this.userImages || !this.userImages.length || !this.getCacheCanvas()) {
		canvas.rect(0, 0, this.w, this.h);
		canvas.stroke();

		return;
	}

	var w = 0;
	var y = 0;
	var h = this.h;
	var selfW = this.w;
	var cacheCanvas = this.getCacheCanvas();
	var cacheCanvasOffset = this.getCacheCanvasOffset();
	var x = cacheCanvasOffset;

	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	if(this.offset >= 0) {
		if(x > this.offset) {
			x = x-this.offset;
			var w = cacheCanvas.width;
			canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, x, y, w, h);
			cacheCanvasOffset = x;
		}
		else {
			var offset = this.offset - x; 
			var w = Math.min(selfW, cacheCanvas.width-offset);
			canvas.drawImage(this.cacheImagesCanvas, offset, 0, w, h, 0, y, w, h);
			cacheCanvasOffset = -offset;
		}
	}
	else {
		x = x-this.offset;
		var w = Math.min(selfW+this.offset, cacheCanvas.width);
		canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, x, y, w, h);
		cacheCanvasOffset = x;
	}

	if(this.currentImageProxy) {
		x = cacheCanvasOffset + this.currentImageProxy.x;
		y = this.currentImageProxy.y;

		canvas.lineWidth = 3;
		canvas.rect(x, y, this.currentImageProxy.w, this.currentImageProxy.h);
		canvas.stroke();
	}

	return;
}

function UIUIImageThumbViewTapeCreator() {
	var args = ["ui-image-thumb-view-tape", "ui-image-thumb-view-tape", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageThumbViewTape();

		return g.initUIImageThumbViewTape(this.type, 300, 100);
	}
	
	return;
}

/////////////////////////////////////////////////////////////////////////}-{

function UIImageThumbViewGrid() {
	return;
}

UIImageThumbViewGrid.prototype = new UIHScrollView();

UIImageThumbViewGrid.prototype.isUIImageView = true;
UIImageThumbViewGrid.prototype.isUIImageThumbView = true;
UIImageThumbViewGrid.prototype.isUIImageThumbViewGrid = true;

UIImageThumbViewGrid.prototype.initUIImageView = UIImageView.prototype.initUIImageView;
UIImageThumbViewGrid.prototype.initUIImageThumbView = UIImageThumbView.prototype.initUIImageThumbView;

UIImageThumbViewGrid.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIImageThumbViewGrid.prototype.initUIImageThumbViewGrid = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	
	this.initUIImageThumbView (w, h);
	this.setSizeLimit(100, 40, 2000, 2000);

	this.rows = 4;
	this.cols = 3;
	this.pageNr = 1;
	this.itemSize = 100;

	return this;
}

UIImageThumbViewGrid.prototype.calcSize = function() {
	if(!this.userImages) {
		return;
	}

	if(this.isIcon) {
		this.cols = 3;
		this.rows = 4;
		this.pageNr = 1;

		return;
	}

	var n = this.userImages.length;
	var deviceConfig = this.getDeviceConfig();
	var density = deviceConfig ? deviceConfig.lcdDensity : "hdpi";
	var densityScale = this.getDensitySizeByName(density)/160;
	var w = this.w/densityScale;
	var h = this.h/densityScale;

	var cols = Math.round(w/this.itemSize);
	var rows = Math.round(h/this.itemSize);

	this.cols = cols;
	this.rows = rows;
	this.pageNr = Math.ceil(n/(rows*cols));

	return;
}

UIImageThumbViewGrid.prototype.getSpaceBetweenImages = function() {
	return this.spaceBetweenImages ? this.spaceBetweenImages : 2;
}

UIImageThumbViewGrid.prototype.createCacheCanvas = function() {
	var n = this.userImages.length;
	var space = this.getSpaceBetweenImages();

	delete this.cacheInvalid;
	this.imageProxies.clear();
	this.currentImageProxy = null;

	this.calcSize();

	if(!n) {
		return;
	}

	var x = 0;
	var y = 0;
	var k = 0;
	var h = this.h;
	var w = this.pageNr * this.w;
	var ctx = this.getCacheCanvasContext(w, h);
	var itemW = Math.floor((this.w-space)/this.cols) - space;
	var itemH = Math.floor((this.h-space)/this.rows) - space;

	var errorImage = this.errorImage;
	var loadingImage = this.loadingImage;

	for(var i = 0; i < this.pageNr; i++) {
		y = space;
		for(var r = 0; r < this.rows; r++) {
			x = i * this.w + space;
			for(var c = 0; c < this.cols; c++, k++) {
				if(k >= n) {
					break;
				}

				var src = this.userImages[k];
				var imageProxy = UIImageThumbView.createImageProxy(this, src, loadingImage, errorImage, ctx, x, y, itemW, itemH);

				this.imageProxies.push(imageProxy);

				x = x + itemW + space;
			}
			y = y + itemH + space;
		}
	}

	return;
}

UIImageThumbViewGrid.prototype.getScrollRange = function() {
	var range = this.pageNr * this.w;

	return range;
}

UIImageThumbViewGrid.prototype.paintChildren = function(canvas) {
	return;
}

UIImageThumbViewGrid.prototype.getCacheCanvasOffset = function() {
	return this.getSpaceBetweenImages();
}

UIImageThumbViewGrid.prototype.onClick = function(point, beforeChild) {
	if(!this.imageProxies || !this.imageProxies.length || beforeChild) {
		return;
	}

	var x = point.x;
	var y = point.y;
	var n = this.imageProxies.length;

	var page = Math.floor(x/this.w);
	var row = Math.floor(y*this.rows/this.h) ;
	var col = Math.floor((x%this.w) * this.cols/this.w);
	var i = page * this.rows * this.cols + row * this.cols + col;

	if(i < n) {
		this.currentImageProxy = this.imageProxies[i];
	}

	return this.callClickHandler(point, beforeChild);
}

UIImageThumbViewGrid.prototype.paintSelfOnly = function(canvas) {
	var space = this.getSpaceBetweenImages();
	if(!this.userImages || !this.userImages.length || !this.getCacheCanvas()) {
		canvas.rect(0, 0, this.w, this.h);
		canvas.stroke();

		return;
	}

	var w = 0;
	var selfW = this.w;
	var offset = this.offset;
	var cacheCanvas = this.getCacheCanvas();

	var h = cacheCanvas.height;
	var canvasWidth = cacheCanvas.width;

	if(offset >= 0) {
		var w = Math.min(selfW, canvasWidth-offset);
		canvas.drawImage(this.cacheImagesCanvas, offset, 0, w, h, 0, 0, w, h);
	}
	else {
		var w = Math.min(canvasWidth+offset, selfW);
		canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, -offset, 0, w, h);
	}

	if(this.currentImageProxy) {
		y = this.currentImageProxy.y;
		x = this.currentImageProxy.x - offset;

		canvas.rect(x, y, this.currentImageProxy.w, this.currentImageProxy.h);
		canvas.lineWidth = 3;
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();

	}

	return;
}

function UIUIImageThumbViewGridCreator() {
	var args = ["ui-image-thumb-view-grid", "ui-image-thumb-view-grid", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageThumbViewGrid();

		return g.initUIImageThumbViewGrid(this.type, 300, 100);
	}
	
	return;
}

/*
 * File:   ui-label.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Label
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILabel() {
	return;
}

UILabel.prototype = new UIElement();
UILabel.prototype.isUILabel = true;

UILabel.prototype.initUILabel = function(type, initText, bg) {
	this.initUIElement(type);	

	this.setText(initText);
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.setTextType(C_SHAPE_TEXT_TEXTAREA);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.addEventNames(["onChanged", "onOnUpdateTransform"]);


	return this;
}


UILabel.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILabel || shape.isUIImage;
}

UILabel.prototype.setText = function(text) {
	this.text = this.toText(text);
	this.textNeedRelayout = true;

	this.callOnChanged(text);

	return;
}

UILabel.prototype.drawText = function(canvas) {
	this.layoutText(canvas);
	
	this.defaultDrawText(canvas);

	return;
}

function UILabelCreator() {
	var args = ["ui-label", "ui-label", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILabel();
		return g.initUILabel(this.type, dappGetText("Text"), null);
	}
	
	return;
}


/*
 * File:   ui-led-digits.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  LED Digits 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UILedDigits() {
	return;
}

UILedDigits.prototype = new UIElement();
UILedDigits.prototype.isUILedDigits = true;

UILedDigits.prototype.initUILedDigits = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);

	return this;
}

UILedDigits.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UILedDigits.prototype.setText = function(text) {
	this.text = "";

	text = this.toText(text); 
	for(var i = 0; i < text.length; i++) {
		var c = text[i];

		switch(c) {
			case '.':
			case ':':
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case 'E':
			case 'F':
			case 'F': {
				this.text = this.text + c;
			}
			default:break;
		}
	}

	return;
}

UILedDigits.prototype.drawBarVL = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, 0);
	canvas.lineTo(0, h);
	canvas.lineTo(w, h-w);
	canvas.lineTo(w, w);
	canvas.lineTo(0, 0);

	return;
}

UILedDigits.prototype.drawBarVR = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(w, 0);
	canvas.lineTo(w, h);
	canvas.lineTo(0, h-w);
	canvas.lineTo(0, w);
	canvas.lineTo(w, 0);

	return;
}

UILedDigits.prototype.drawBarHT = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, 0);
	canvas.lineTo(w, 0);
	canvas.lineTo(w-h, h);
	canvas.lineTo(h, h);
	canvas.lineTo(0, 0);

	return;
}

UILedDigits.prototype.drawBarHM = function(canvas, w, h) {
	canvas.beginPath();
	var space = Math.round(h/3);
	w = w - 2 * space;
	canvas.translate(space, 0);
	canvas.moveTo(0, h/2);
	canvas.lineTo(h/2, 0);
	canvas.lineTo(w-h/2, 0);
	canvas.lineTo(w, h/2);
	canvas.lineTo(w-h/2, h);
	canvas.lineTo(h/2, h);
	canvas.lineTo(0, h/2);
	canvas.translate(-space, 0);

	return;
}
UILedDigits.prototype.drawBarHB = function(canvas, w, h) {
	canvas.beginPath();
	canvas.moveTo(0, h);
	canvas.lineTo(w, h);
	canvas.lineTo(w-h, 0);
	canvas.lineTo(h, 0);
	canvas.lineTo(0, h);

	return;
}

UILedDigits.prototype.drawBar = function(canvas, w, h) {
	if(w < h) {
		this.drawBarV(canvas, w, h);
	}
	else {
		this.drawBarH(canvas, w, h);
	}

	return;
}

UILedDigits.prototype.drawDot = function(canvas, w, h, dot) {
	var size = (w/4 + h/8)/2;

	if(dot === ".") {
		canvas.fillRect((w-size)/2, 0.75*h - size/2, size, size);
	}
	else if(dot = ":") {
		canvas.fillRect((w-size)/2, 0.25*h - size/2, size, size);
		canvas.fillRect((w-size)/2, 0.75*h - size/2, size, size);
	}

	return;
}

UILedDigits.prototype.map = {
	"0":0x7d,
	"1":0x60,
	"2":0x37,
	"3":0x67,
	"4":0x6a,
	"5":0x4f,
	"6":0x5f,
	"7":0x61,
	"8":0x7f,
	"9":0x6f,
	"E":0x1f,
	"F":0x1b,
	"H":0x7a
};

UILedDigits.prototype.fillBar = function(canvas, light) {
	if(light) {
		canvas.fillStyle = this.style.textColor;
		canvas.fill();
	}
	else {
		canvas.lineWidth = 1;
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();
	}

	return;
}

UILedDigits.prototype.drawDigit = function(canvas, w, h, digit) {
	var hBarHeight = Math.max(3, Math.round(h/10));
	var vBarWidht = Math.max(3, Math.round(w/10));
	var size = Math.round((vBarWidht + hBarHeight)/2);

	var space = 1;
	var hBarWidth = w - 2 * space;
	var vBarHeight = Math.floor(h/2 - 2 * space);
	var mask = this.map[digit];

	canvas.translate(space, 0);
	this.drawBarHT(canvas, hBarWidth, size);
	canvas.translate(-space, 0);
	this.fillBar(canvas, mask & 0x01);

	var yOffset = Math.floor((h-hBarHeight)/2);
	canvas.translate(space, yOffset);
	this.drawBarHM(canvas, hBarWidth, size);
	canvas.translate(-space, -yOffset);
	this.fillBar(canvas, (mask >> 1) & 0x01);

	var yOffset = h-hBarHeight;
	canvas.translate(space, yOffset);
	this.drawBarHB(canvas, hBarWidth, size);
	canvas.translate(-space, -yOffset);
	this.fillBar(canvas, (mask >> 2) & 0x01);

	canvas.translate(0, space);
	this.drawBarVL(canvas, size, vBarHeight);
	canvas.translate(0, -space);
	this.fillBar(canvas, (mask >> 3) & 0x01);

	var yOffset = Math.round(2*space + (h-hBarHeight)/2)+space;
	canvas.translate(0, yOffset);
	this.drawBarVL(canvas, size, vBarHeight);
	canvas.translate(0, -yOffset);
	this.fillBar(canvas, (mask >> 4) & 0x01);

	canvas.translate((w-size), space);
	this.drawBarVR(canvas, size, vBarHeight);
	canvas.translate(-(w-size), -space);
	this.fillBar(canvas, (mask >> 5) & 0x01);

	canvas.translate((w-size), yOffset);
	this.drawBarVR(canvas, size, vBarHeight);
	canvas.translate(-(w-size), -yOffset);
	this.fillBar(canvas, (mask >> 6) & 0x01);
	
	return;
}

UILedDigits.prototype.drawDigits = function(canvas) {
	var dots = 0;
	var text = this.text
	var n = text.length;

	if(!n) {
		return;
	}

	for(var i = 0; i < n; i++) {
		var d = text[i];
		if(d === "." || d === ":") {
			dots = dots + 1;
		}
	}

	var space = this.w/n * 0.2;
	var w = this.w/n - space;
	var h = this.h;

	canvas.save();
	canvas.translate(w/4 * dots, 0);
	for(var i = 0; i < n; i++) {
		var d = text[i];
		if(d === "." || d === ":") {
			this.drawDot(canvas, w/2, h, text[i]);
			canvas.translate(w/2+space, 0);
		}
		else {
			this.drawDigit(canvas, w, h, text[i]);
			canvas.translate(w+space, 0);
		}
	}
	canvas.restore();

	return;
}

UILedDigits.prototype.paintSelfOnly = function(canvas) {
	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
	}

	canvas.fillStyle = this.style.lineColor;
	this.drawDigits(canvas);

	return;
}

function UILedDigitsCreator(w, h) {
	var args = ["ui-led-digits", "ui-led-digits", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UILedDigits();
		return g.initUILedDigits(this.type, w, h);
	}
	
	return;
}


/*
 * File:   ui-list-checkable-item.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Checkable List Item 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListCheckableItem() {
	return;
}

UIListCheckableItem.prototype = new UIListItem();
UIListCheckableItem.prototype.isUIListCheckableItem = true;

UIListCheckableItem.prototype.initUIListCheckableItem = function(isRadio, type, focusedImg, 
	activeImg, normalImg, disableImg,checkedImg, uncheckImg) {

	this.initUIListItem(type, focusedImg, activeImg, normalImg, disableImg);

	this.isRadio = isRadio;
	this.setImage(CANTK_IMAGE_CHECKED_FG, checkedImg);
	this.setImage(CANTK_IMAGE_UNCHECK_FG, uncheckImg);
	this.addEventNames(["onChanged"]);

	return this;
}

UIListCheckableItem.prototype.getValue = function() {
	return this.value;
}

UIListCheckableItem.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChanged(this.value);
	}

	return;
}

UIListCheckableItem.prototype.setChecked = function() {
	var parentShape = this.parentShape;
	if(parentShape) {
		for(var i = 0; i < parentShape.children.length; i++) {
			var shape = parentShape.children[i];
			if(shape.isUIListCheckableItem) {
				shape.setValue(false);
			}
		}
	}

	this.setValue(true);

	return;
}

UIListCheckableItem.prototype.setParent = function(parentShape) {
	this.parentShape = parentShape;

	if(this.value) {
		this.setChecked();
	}

	return;
}

UIListCheckableItem.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	if(this.isRadio) {
		this.setChecked();
	}
	else {
		this.setValue(!this.value);
	}

	return;
}

UIListCheckableItem.prototype.drawFgImage = function(canvas) {
	var image = this.getHtmlImageByType(this.value ? CANTK_IMAGE_CHECKED_FG : CANTK_IMAGE_UNCHECK_FG);

	if(image) {
		var x = this.w - image.width - 20;
		var y = (this.h - image.height)/2;

		canvas.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
	}

	return;
}

function UIListCheckBoxItemCreator(focusedImg, activeImg, normalImg, disableImg, checkedImg, uncheckImg) {
	var args = ["ui-list-checkbox-item", "ui-list-checkbox-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListCheckableItem();
		g.initUIListCheckableItem(false, this.type, focusedImg, activeImg, normalImg, disableImg, checkedImg, uncheckImg);
		return g;
	}
	
	return;
}

function UIListRadioBoxItemCreator(focusedImg, activeImg, normalImg, disableImg, checkedImg, uncheckImg) {
	var args = ["ui-list-radiobox-item", "ui-list-radiobox-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListCheckableItem();
		g.initUIListCheckableItem(true, this.type, focusedImg, activeImg, normalImg, disableImg, checkedImg, uncheckImg);
		return g;
	}
	
	return;
}

/*
 * File:   ui-list-item-group.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List Item Group
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListItemGroup() {
	return;
}

UIListItemGroup.prototype = new UIList();

UIListItemGroup.prototype.isUIListItem = true;
UIListItemGroup.prototype.isUIListItemGroup = true;
UIListItemGroup.prototype.isHeightVariable = UIListItem.prototype.isHeightVariable;
UIListItemGroup.prototype.setHeightVariable = UIListItem.prototype.setHeightVariable;

UIListItemGroup.prototype.initUIListItemGroup = function(type) {
	this.initUIList(type, 0, 30, null);
	this.setHeightVariable(true);
	this.setSizeLimit(100, 30);

	return this;
}

UIListItemGroup.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	if(this.mode === C_MODE_EDITING) {
		this.collapsed = false;
	}
		
	UIList.prototype.relayoutChildren.call(this, animHint);
	this.h = this.getNewHeight();

	return;
}

UIListItemGroup.prototype.collapseOrExpand = function(animHint) {
	if(this.collapsed) {
		this.expand(animHint);
	}
	else {
		this.collapse(animHint);
	}

	return;
}

UIListItemGroup.prototype.collapseSelf = function() {
	var n = this.children.length;
	if(n < 1) {
		return;
	}

	var h = this.h;
	this.collapsed = true;
	this.relayoutChildren();
	this.h = h;

	return;
}

UIListItemGroup.prototype.collapse = function(animHint) {
	this.collapseSelf();
	if(this.parentShape) {
		this.parentShape.relayoutChildren(animHint);
	}

	return;
}

UIListItemGroup.prototype.expandSelf = function() {
	var n = this.children.length;
	if(n < 1) {
		return;
	}

	var h = this.h;
	this.collapsed = false;
	this.relayoutChildren();
	this.h = h;

	return;
}

UIListItemGroup.prototype.expand = function(animHint) {
	this.expandSelf();
	if(this.parentShape) {
		this.parentShape.relayoutChildren(animHint);
	}

	return;
}

UIListItemGroup.prototype.getNewHeight = function() {
	var n = this.children.length;
	if(n > 0) {
		if(this.collapsed) {
			this.newHeight = this.children[0].h;
		}
		else {
			var newHeight = 0;
			for(var i = 0; i < n; i++) {
				var iter = this.children[i];
				newHeight = newHeight + iter.h;
			}
			this.newHeight = newHeight;
		}
	}
	else {
		this.newHeight = this.h;
	}

	return this.newHeight;
}

UIListItemGroup.prototype.afterChildAppended = function(shape) {
	UIList.prototype.afterChildAppended.call(this, shape);

	if(this.disableRelayout) {
		return;
	}

	if(this.parentShape) {
		this.parentShape.relayoutChildren("default");
	}

	return true;
}

UIListItemGroup.prototype.afterChildRemoved = function(shape) {
	if(this.disableRelayout) {
		return;
	}

	if(this.parentShape) {
		this.parentShape.relayoutChildren("default");
	}

	return true;
}

UIListItemGroup.prototype.shapeCanBeChild = function(shape) {
	if(!shape.isUIListItem || shape.isUIListItemGroup) {
		return false;
	}

	return true;
}

UIListItemGroup.prototype.measureHeight = function(height) {
	if(this.mode === C_MODE_EDITING) {
		this.collapsed = false;
	}

	return this.getNewHeight();
}

UIListItemGroup.prototype.fixListItemImage = function(item, position) {
}

UIListItemGroup.prototype.onModeChanged = function() {
	if(this.collapsedDefault && this.mode != C_MODE_EDITING) {
		this.collapsed = true;
		this.h = this.getNewHeight();
	}

	return;
}

function UIListItemGroupCreator() {
	var args = ["ui-list-item-group", "ui-list-item-group", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListItemGroup();
		return g.initUIListItemGroup(this.type);
	}
	
	return;
}


/*
 * File:   ui-list-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List View (Scrollable)
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListView() {
	return;
}

UIListView.prototype = new UIVScrollView();
UIListView.prototype.isUIList = true;
UIListView.prototype.isUILayout = true;
UIListView.prototype.isUIListView = true;
UIListView.prototype.setItemHeight = UIList.prototype.setItemHeight;
UIListView.prototype.sortChildren = UIList.prototype.sortChildren;
UIListView.prototype.initUIList = UIList.prototype.initUIList;
UIListView.prototype.shapeCanBeChild = UIList.prototype.shapeCanBeChild;
UIListView.prototype.paintSelfOnly = UIList.prototype.paintSelfOnly;
UIListView.prototype.fixListItemImage = function(item, position) {};
UIListView.prototype.afterChildAppended = UIList.prototype.afterChildAppended;
UIListView.prototype.childIsBuiltin = UIList.prototype.childIsBuiltin;
UIListView.prototype.onKeyUpRunning = UIList.prototype.onKeyUpRunning;
UIListView.prototype.onKeyDownRunning = UIList.prototype.onKeyDownRunning;

UIListView.UPDATE_STATUS_NONE = 0;
UIListView.UPDATE_STATUS_TIPS = 1;
UIListView.UPDATE_STATUS_SYNC = 2;

UIListView.prototype.beginUpdate = function() {
	this.updateStatus = UIListView.UPDATE_STATUS_SYNC;
	var statusItem = this.findChildByName("ui-list-item-update-status");
	if(statusItem) {
		var waitBox = statusItem.findChildByName("ui-wait-box");
		if(waitBox) {
			waitBox.show();
			waitBox.start();
		}

		var loading = statusItem.findChildByName("ui-label-loading");
		if(loading) {
			loading.setText(dappGetText("Loading..."));
		}
	}

	return;
}

UIListView.prototype.endUpdate = function() {
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;
	var statusItem = this.findChildByName("ui-list-item-update-status");
	if(statusItem) {
		var waitBox = statusItem.findChildByName("ui-wait-box");
		if(waitBox) {
			waitBox.stop();
		}
		this.setLastUpdateTime(new Date());
	}

	return;
}

UIListView.prototype.initUIListView = function(type, border, itemHeight, bg) {
	this.initUIList(type, border, itemHeight, bg);
	this.initUIVScrollView(type, 0, bg, null);	
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;
	this.addEventNames(["onUpdateData"]);

	return this;
}

UIListView.prototype.onModeChanged = function() {
	this.offset = 0;
	this.updateStatus = UIListView.UPDATE_STATUS_NONE;

	return;
}

UIListView.prototype.updateDone = function() {
	var list = this;

	list.endUpdate();
	setTimeout(function() {
		list.relayoutChildren();
		list.postRedraw();
	}, 1000);

	return;
}

UIListView.prototype.callOnUpdateData = function() {
	if(!this.handleOnUpdateData || this.mode === C_MODE_PREVIEW) {
		var sourceCode = this.events["onUpdateData"];
		if(sourceCode) {
			sourceCode = "this.handleOnUpdateData = function(value) {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnUpdateData) {
		try {
			this.handleOnUpdateData();
		}catch(e) {
			console.log("this..handleOnUpdateData:" + e.message);
		}
	}

	this.beginUpdate();

	var listView = this;
	setTimeout(function() {
		listView.updateDone();
	}, 10000);

	return true;
}

UIListView.prototype.setLastUpdateTime = function(lastUpdateTime) {
	var tipsItem = this.findChildByName("ui-list-item-update-tips");

	if(tipsItem && lastUpdateTime) {
		var str = "";
		var now = new Date();
		
		if(now.getFullYear() === lastUpdateTime.getFullYear() 
			&& now.getDate() === lastUpdateTime.getDate()
			&& now.getMonth() === lastUpdateTime.getMonth()) {
			
			str = dappGetText("Today");
		}
		else {
			str = lastUpdateTime.getMonth() + "-" + lastUpdateTime.getDate();
		}

		str = str + " " + lastUpdateTime.getHours() + ":" + lastUpdateTime.getMinutes();

		var updateTime = tipsItem.findChildByName("ui-label-update-time");
		if(updateTime) {
			updateTime.setText(str);
		}
		
		var updateTime = tipsItem.findChildByName("ui-label-update-time");
		if(updateTime) {
			updateTime.setText(str);
		}
		
		var updateTimeTips = tipsItem.findChildByName("ui-label-update-time-tips");
		if(updateTimeTips) {
			updateTimeTips.setText(dappGetText("Last Update:"));
		}
	}

	return;
}

UIListView.prototype.onDrag = function(offset) {
	var tipsItem = this.findChildByName("ui-list-item-update-tips");

	if(tipsItem) {
		var indicator = tipsItem.findChildByName("ui-image");
		var tips = tipsItem.findChildByName("ui-label-tips");

		if(indicator) {
			
			if(offset < -115) {
				if(indicator.rotation === 0) {
					function animationRotate() {
						var angle = indicator.rotation + 0.2 * Math.PI;
						if(angle > Math.PI) {
							angle = Math.PI;
						}
						indicator.setRotation(angle);
						if(angle < Math.PI) {
							setTimeout(animationRotate, 50);
						}
						indicator.postRedraw();

						return;
					}
					
					animationRotate();
					if(tips) {
						tips.setText(dappGetText("Release To Update."));
					}
				}
			}
			else {
				indicator.setRotation(0);
				if(tips) {
					tips.setText(dappGetText("Pull To Update."));
				}
			}
		}
	}

	return;
}

UIListView.prototype.onOutOfRange = function(offset) {

	if(offset < -115) {
		this.callOnUpdateData();
		this.relayoutChildren();
	}

	return;
}

UIListView.prototype.relayoutChildren = function(animHint) {
	if(this.disableRelayout) {
		return;
	}

	var border = this.getHMargin();

	var x = border;
	var y = border;
	var w = this.w - 2 * border;
	var h = this.itemHeight;
	var n = this.children.length;
	var itemHeightVariable = this.itemHeightVariable;
	var range = this.getScrollRange();
	var pageSize = this.getPageSize();
	var userMovable = true;

	
	for(var i = 0; i < n; i++) {
		var config = {};
		var isBuiltin = false;
		var child = this.children[i];
		
		if(itemHeightVariable || child.isHeightVariable()) {
			h = child.measureHeight(this.itemHeight);
		}
		else {
			h = this.itemHeight;
		}

		if(child.name === "ui-list-item-update-tips") {
			if(this.mode !== C_MODE_EDITING) {
				child.move(x, -h);
				child.x = x;
				child.y = -h;
				child.w = w;
				child.h = h;
				child.setUserMovable(false);
				child.setUserResizable(false);
				child.setVisible(this.updateStatus !== UIListView.UPDATE_STATUS_TIPS);

				continue;
			}
			else {
				child.setVisible(true);
			}
			isBuiltin = true;
		}
		else if(child.name === "ui-list-item-update-status") {
			if(this.mode !== C_MODE_EDITING) {
				if(this.updateStatus !== UIListView.UPDATE_STATUS_SYNC) {
					child.setVisible(false);
				}else {
					child.setVisible(true);
				}
			}
			else {
				child.setVisible(true);
			}
			isBuiltin = true;
		}
		
		if(!child.visible) {
			continue;
		}

		animatable =  child.isVisible() && !isBuiltin && (y < this.h) && (animHint || this.mode === C_MODE_EDITING);
		if(animatable && (x != child.x || y != child.y || w != child.w || h != child.h)) {
			config.xStart = child.x;
			config.yStart = child.y;
			config.wStart = child.w;
			config.hStart = child.h;
			config.xEnd = x;
			config.yEnd = y;
			config.wEnd = w;
			config.hEnd = h;

			config.delay = 10;
			config.duration = 1000;
			config.element = child;
			config.onDone = function (el) {
				el.relayoutChildren();
			}
			child.animate(config);
		}
		else {
			child.move(x, y);
			child.setSize(w, h);
			child.relayoutChildren();
		}

		child.widthAttr = C_WIDTH_FILL_PARENT;
		if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
			child.heightAttr = C_HEIGHT_FIX;
		}
		child.setUserMovable(userMovable);
		child.setUserResizable(itemHeightVariable || child.isHeightVariable());

		y += h;
	}

	return;
}

UIListView.prototype.drawText = function(canvas) {
	if(this.children.length == 0 && this.text) {
		this.defaultDrawText(canvas);
	}

	return;
}

UIListView.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);
	
	if(this.mode === C_MODE_EDITING) {
		this.drawPageDownUp(canvas);
	}

	return;
}

function UIListViewCreator(border, itemHeight, bg) {
	var args = ["ui-list-view", "ui-list-view", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListView();
		return g.initUIListView(this.type, border, itemHeight, bg);
	}
	
	return;
}


/*
 * File:   ui-mledit.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Multi Line Editor
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIMLEdit() {
	return;
}

UIMLEdit.prototype = new UIElement();
UIMLEdit.prototype.isUIMLEdit = true;

UIMLEdit.prototype.initUIMLEdit = function(type, w, h, margin, initText, bg, focusedBg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setText(initText);
	this.setTextType(C_SHAPE_TEXT_TEXTAREA);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setImage(CANTK_IMAGE_FOCUSED, focusedBg);
	this.setMargin(margin, margin);
	this.addEventNames(["onChanged", "onFocusIn", "onFocusOut"]);
	this.setTextAlignV("top");
	this.setTextAlignH("left");

	return this;
}

UIMLEdit.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIMLEdit.prototype.textEditable = function(point) {
	return true;
}

UIMLEdit.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	if(this.mode !== C_MODE_EDITING) {
		this.editText();
	}

	return;
}

UIMLEdit.prototype.getEditorRect = function() {
	var p = this.getPositionInView();
	var vp = this.view.getAbsPosition();
	var scale = this.view.getViewScale();
	var ox = vp.x;
	var oy = vp.y;

	var x = (p.x + this.hMargin) * scale + ox;
	var y = (p.y + this.vMargin) * scale + oy;
	var w = this.getWidth(true) * scale;
	var h = this.getHeight(true) * scale;
	
	var rect = {};

	rect.x = x;
	rect.y = y;
	rect.w = Math.max(60, w);
	rect.h = h;

	return rect;
}

UIMLEdit.prototype.editText = function(point) {
	if(this.textType && this.textEditable(point)) {
		var shape = this;
		var editor = null;
		var rect = this.getEditorRect();
		var scale = this.getRealScale();
		var inputType = this.inputType ? this.inputType : "text";

		var text = this.getText();
		
		editor = cantkShowTextArea(rect.x, rect.y, rect.w, rect.h);
		editor.setShape(shape);
		editor.setInputType(inputType);
		editor.removeBorder();
		editor.setFontSize(this.style.fontSize * scale);
		editor.setText(text);
		
		editor.element.onchange= function() {
			if(text !== this.value) {
				shape.setText(this.value);
				shape.callOnChanged(shape.text);
				shape.postRedraw();
			}
			else {
				shape.setText(text);
			}

			editor.element.onchange = null;
			editor.hide();
			
			shape.callOnFocusOut();

			return;
		}
		
		this.callOnFocusIn();
	}

	return;
}

UIMLEdit.prototype.getTextTipsPosition = function() {
	var pos = {};

	pos.x = this.hMargin;
	pos.y = this.vMargin;
	pos.textAlign = "left";
	pos.textBaseline = "top";

	return pos;
}

function UIMLEditCreator(w, h, margin, bg, focusedBg) {
	var args = ["ui-mledit", "ui-mledit", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIMLEdit();
		return g.initUIMLEdit(this.type, w, h, margin, dappGetText("Edit"), bg, focusedBg);
	}
	
	return;
}


/*
 * File:   ui-page-indicator.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Page Indicator
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIPageIndicator() {
	return;
}

UIPageIndicator.prototype = new UIHScrollView();
UIPageIndicator.prototype.isUIPageIndicator = true;
UIPageIndicator.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIPageIndicator.prototype.isScrollable = function() {
	return this.getPages() > this.getVisibleTabs();
}

UIPageIndicator.prototype.setVisibleTabs = function(visibleTabs) {
	this.visibleTabs = visibleTabs;
	
	return;
}

UIPageIndicator.prototype.getVisibleTabs = function() {
	return this.visibleTabs ? this.visibleTabs : 6;
}

UIPageIndicator.prototype.getTabWidth = function() {
	var n = this.getPages();
	var visibleTabs = this.getVisibleTabs();

	if(n < visibleTabs) {
		return this.w/n;
	}
	else {
		return this.w/visibleTabs;
	}
}

UIPageIndicator.prototype.getScrollRange = function() {
	var visibleTabs = this.getVisibleTabs();

	if(visibleTabs < 6) {
		return this.w;
	}
	else {
		var n = this.getPages();
		return this.getTabWidth() * n;
	}
}

UIPageIndicator.prototype.initUIPageIndicator = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.setCanRectSelectable(false, false);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;

	return this;
}

UIPageIndicator.prototype.getViewPager = function() {
	if(!this.getParent()) {
		return;
	}

	if(!this.viewPager) {
		this.viewPager = this.getParent().findChildByType("ui-view-pager", true);
		if(!this.viewPager && this.isUIPageIndicatorSimple) { 
			this.viewPager = this.getWindow().findChildByType("ui-view-pager", true);
		}
	}

	if(this.viewPager) {
		this.viewPager.setShowIndicator(false);
	}

	return this.viewPager;
}

UIPageIndicator.prototype.getViewPagerOffset = function() {
	var viewPager = this.getViewPager();

	return viewPager ? viewPager.offset/viewPager.w : 0;
}

UIPageIndicator.prototype.getPages = function() {
	var viewPager = this.getViewPager();

	if(viewPager) {
		viewPager.pageIndicator = this;
	}

	return viewPager ? viewPager.getFrames() : 3;
}

UIPageIndicator.prototype.getCurrent = function() {
	var viewPager = this.getViewPager();
	
	return viewPager ? viewPager.getCurrent() : 0;
}

UIPageIndicator.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {
	canvas.beginPath();
	canvas.arc(x+w/2, y+h/2, 10, 0, 2 * Math.PI);
	canvas.fill();
	if(isCurrent) {
		canvas.stroke();
	}

	return;
}

UIPageIndicator.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIPageIndicator.prototype.paintOneIndicatorCircle = function(canvas, isCurrent, index, x, y, w, h) {
	var r = Math.floor(Math.max(10, h/4));

	canvas.fillStyle = isCurrent ? this.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.lineColorOfCurrent : this.style.lineColor;

	canvas.beginPath();
	canvas.arc(x+w/2, y+h/2, r, 0, 2 * Math.PI);
	canvas.fill();
	canvas.stroke();

	return;
}

UIPageIndicator.prototype.paintOneIndicatorNumber = function(canvas, isCurrent, index, x, y, w, h) {
	var r = Math.floor(Math.max(10, h/4));
	var ox = Math.floor(x+w/2);
	var oy = Math.floor(y+h/2);

	canvas.fillStyle = isCurrent ? this.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.lineColorOfCurrent : this.style.lineColor;

	canvas.beginPath();
	canvas.arc(ox, oy, r, 0, 2 * Math.PI);
	canvas.fill();
	canvas.stroke();

	canvas.font = r < 20 ? "16px sans" : "22px sans";
	canvas.textAlign = "center";
	canvas.textBaseline = "middle";
	canvas.fillStyle = this.style.textColor;
	canvas.fillText(index+1, ox, oy);
	
	return;
}

UIPageIndicator.prototype.paintOneIndicatorRect = function(canvas, isCurrent, index, x, y, w, h) {
	var size = 10;
	if(w > h) {
		size = Math.max(20, h/4);
	}
	else {
		size = Math.max(20, w/4);
	}
	size = Math.floor(size);

	canvas.fillStyle = isCurrent ? this.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.lineColorOfCurrent : this.style.lineColor;
	
	var dx = (w - size)/2;
	var dy = (h - size)/2;

	canvas.beginPath();
	canvas.rect(x+dx, y+dy, size, size);
	canvas.fill();
	canvas.stroke();

	return;
}

UIPageIndicator.prototype.paintOneIndicatorLine = function(canvas, isCurrent, index, x, y, w, h) {
	var size = 4;
	if(w > h) {
		size = Math.max(4, h/4);
	}
	else {
		size = Math.max(4, w/4);
	}
	size = Math.floor(size);

	canvas.fillStyle = isCurrent ? this.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.lineColorOfCurrent : this.style.lineColor;
	
	var dx = (w - size)/2;
	var dy = (h - size)/2;

	canvas.beginPath();
	if(w > h) {
		canvas.rect(x, y+dy, w, size);
	}
	else {
		canvas.rect(x+dx, y, size, h);
	}
	
	canvas.fill();
	canvas.stroke();

	return;
}


UIPageIndicator.prototype.onClickItem = function(index) {
	var viewPager = this.getViewPager();
	if(viewPager) {
		viewPager.setCurrent(index);
	}

	return;
}

UIPageIndicator.prototype.findItemByPoint = function(point) {
	var n = this.getPages();

	if(this.w > this.h) {
		var itemW = this.getTabWidth();

		for(var i = 0; i < n; i++) {
			if(point.x > i * itemW && point.x < (i+1) * itemW) {
				return i;
			}
		}
	}
	else {
		var itemH = this.h/n;
		for(var i = 0; i < n; i++) {
			if(point.y > i * itemH && point.y < (i+1) * itemH) {
				return i;
			}
		}
	}

	return -1;
}

UIPageIndicator.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var index = this.findItemByPoint(point);
	
	if(index >= 0) {
		this.onClickItem(index);
	}

	this.callClickHandler(point, index);

	return;
}

UIPageIndicator.prototype.paintBackground = function(canvas) {
}

UIPageIndicator.prototype.paintSelfOnly = function(canvas) {
	var n = this.getPages();
	var current = this.getCurrent();
	var point = {};
	point.x = this.lastPosition.x - this.x;
	point.y = this.lastPosition.y - this.y;

	this.pointerOnItem = this.findItemByPoint(point);

	this.paintBackground(canvas);

	canvas.translate(-this.offset, 0);
	if(this.w > this.h) {
		var itemH = this.h;
		var itemW = this.getTabWidth();
		var offset = Math.floor(this.getViewPagerOffset() * itemW);

		for(var i = 0; i < n; i++) {
			var dx = i*itemW;
			this.paintOneIndicator(canvas, i === current, i, dx, 0, itemW, itemH);
		}
	}
	else {
		var itemW = this.w;
		var itemH = this.h / n;

		for(var i = 0; i < n; i++) {
			var dy = i*itemH; 
			this.paintOneIndicator(canvas, i === current, i, 0, dy, itemW, itemH);
		}
	}
	canvas.translate(this.offset, 0);
	delete this.pointerOnItem;

	return;
}

function UIPageIndicatorCreator() {
	var args = ["ui-page-indicator", "ui-page-indicator", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicator();

		return g.initUIPageIndicator(this.type, 200, 60);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorSimple() {
	
	return;
}

UIPageIndicatorSimple.prototype.isScrollable = function() {
	return this.getPages() > this.getVisibleTabs();
}

UIPageIndicatorSimple.prototype = new UIPageIndicator();
UIPageIndicatorSimple.prototype.isUIPageIndicatorSimple = true;

UIPageIndicatorSimple.prototype.initUIPageIndicatorSimple = function(type, w, h) {
	this.initUIPageIndicator(type, w, h);	
	this.fillColorOfCurrent = "Gray";
	this.lineColorOfCurrent = "Black";
	this.setAlwaysOnTop(true);
	this.setVisibleTabs(12);

	return this;
}

UIPageIndicatorSimple.prototype.setLineColorOfCurrent = function(value) {
	this.lineColorOfCurrent = value;

	return;
}

UIPageIndicatorSimple.prototype.setFillStyleOfCurrent = function(value) {
	this.fillColorOfCurrent = value;

	return;
}

function UIPageIndicatorCircleCreator() {
	var args = ["ui-page-indicator-circle", "ui-page-indicator-circle", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		g.paintOneIndicator = UIPageIndicator.prototype.paintOneIndicatorCircle;

		return g.initUIPageIndicatorSimple(this.type, 200, 60);
	}
	
	return;
}

function UIPageIndicatorNumberCreator() {
	var args = ["ui-page-indicator-number", "ui-page-indicator-number", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		g.paintOneIndicator = UIPageIndicator.prototype.paintOneIndicatorNumber;

		return g.initUIPageIndicatorSimple(this.type, 200, 60);
	}
	
	return;
}

function UIPageIndicatorRectCreator() {
	var args = ["ui-page-indicator-rect", "ui-page-indicator-rect", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		g.paintOneIndicator = UIPageIndicator.prototype.paintOneIndicatorRect;

		return g.initUIPageIndicatorSimple(this.type, 200, 60);
	}
	
	return;
}

function UIPageIndicatorLineCreator() {
	var args = ["ui-page-indicator-line", "ui-page-indicator-line", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		g.paintOneIndicator = UIPageIndicator.prototype.paintOneIndicatorLine;

		return g.initUIPageIndicatorSimple(this.type, 200, 60);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorNormal() {
	
	return;
}

UIPageIndicatorNormal.prototype = new UIPageIndicator();
UIPageIndicatorNormal.prototype.isUIPageIndicatorNormal = true;

UIPageIndicatorNormal.prototype.initUIPageIndicatorNormal = function(type, w, h) {
	this.initUIPageIndicator(type, w, h);	

	this.itemTexts = [];
	this.itemImages = [];
	this.imagePosition = "left";
	this.itemImagesOfCurrent = [];

	this.setMargin(5, 5);
	this.setAlwaysOnTop(false);
	this.setImage(CANTK_ITEM_BG_NORMAL, null);
	this.setImage(CANTK_ITEM_BG_ACTIVE, null);
	this.setImage(CANTK_ITEM_BG_CURRENT_NORMAL, null);
	this.setImage(CANTK_ITEM_BG_CURRENT_ACTIVE, null);

	return this;
}

UIPageIndicatorNormal.prototype.fixImagePath = function(oldConfig, newConfig) {
	var oldVersion	= oldConfig.version;
	var oldPlatform = oldConfig.platform;
	var oldDensity	= oldConfig.lcdDensity;
	var newVersion	= newConfig.version;
	var newPlatform = newConfig.platform;
	var newDensity	= newConfig.lcdDensity;
	
	UIElement.prototype.fixImagePath.call(this, oldConfig, newConfig);

	function srcReplace(src) {
		src = src.replaceAll("/" + oldVersion + "/", "/" + newVersion + "/");
		src = src.replaceAll("/" + oldPlatform + "/", "/" + newPlatform + "/");
		src = src.replaceAll("/" + oldDensity + "/", "/" + newDensity + "/");

		return src;
	}

	var str = srcReplace(this.strItemImages);
	this.setItemImagesByStr(str);

	str = srcReplace(this.strItemImagesOfCurrent);
	this.setItemImagesOfCurrentByStr(str);

	return;
}

UIPageIndicatorNormal.prototype.setEnableAnimatePage = function(value) {
	this.enableAnimatePage = value;

	return;
}

UIPageIndicatorNormal.prototype.setItemImagesByStr = function(str) {
	this.itemImages = [];
	var arr = str.split("\n");
	var name = "item-images-";

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.itemImages.push(new CanTkImage(iter));
			this.setImage(name + i, iter);
		}
	}

	this.strItemImages = str;

	return;
}

UIPageIndicatorNormal.prototype.setItemImagesOfCurrentByStr = function(str) {
	this.itemImagesOfCurrent = [];
	var arr = str.split("\n");
	var name = "current-item-images-";

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.itemImagesOfCurrent.push(new CanTkImage(iter));
			this.setImage(name + i, iter);
		}
	}

	this.strItemImagesOfCurrent = str;

	return;
}

UIPageIndicatorNormal.prototype.setItemTextsByStr = function(str) {
	this.strItemTexts = str;
	this.itemTexts = str.split("\n");

	return;
}

UIPageIndicatorNormal.prototype.setImagePosition = function(value) {
	this.imagePosition = value;

	return;
}

UIPageIndicatorNormal.prototype.getItemImagesStr = function() {
	return this.strItemImages ? this.strItemImages : "";
}

UIPageIndicatorNormal.prototype.getItemImagesStrOfCurrent = function() {
	return this.strItemImagesOfCurrent ? this.strItemImagesOfCurrent : "";
}

UIPageIndicatorNormal.prototype.getItemImages = function() {
	if(!this.itemImages.length && this.strItemImages) {
		this.setItemImagesByStr(this.strItemImages);
	}

	return this.itemImages;
}

UIPageIndicatorNormal.prototype.getItemImagesOfCurrent = function() {
	if(!this.itemImagesOfCurrent.length && this.strItemImagesOfCurrent) {
		this.setItemImagesOfCurrentByStr(this.strItemImagesOfCurrent);
	}

	return this.itemImagesOfCurrent;
}

UIPageIndicatorNormal.prototype.getItemTextsStr = function() {
	return this.strItemTexts ? this.strItemTexts : "";
}

UIPageIndicatorNormal.prototype.getItemTexts = function() {
	if(!this.itemTexts.length && this.strItemTexts) {
		this.setItemTextsByStr(this.strItemTexts);
	}

	return this.itemTexts;
}

UIPageIndicatorNormal.prototype.getItemImage = function(index, isCurrent) {
	var images = isCurrent ? this.getItemImagesOfCurrent() : this.getItemImages();
	if(images && index < images.length) {
		return images[index];
	}

	return null;
}

UIPageIndicatorNormal.prototype.getBackgroundImage = function(index, isCurrent) {
	var type = "";
	var active = this.pointerDown && this.pointerOnItem === index;
	if(isCurrent) {
		type = active ? CANTK_ITEM_BG_CURRENT_ACTIVE : CANTK_ITEM_BG_CURRENT_NORMAL;
	}
	else {
		type = active ? CANTK_ITEM_BG_ACTIVE : CANTK_ITEM_BG_NORMAL;
	}

	return this.getImageByType(type);
}

UIPageIndicatorNormal.prototype.paintOneIndicatorBackground = function(canvas, isCurrent, index, x, y, w, h) {
	var image = this.getBackgroundImage(index, isCurrent);

	if(!image || !image.getImage()) {
		return;
	}

	image = image.getImage();
	var imageW = image.width;
	var imageH = image.height;

	this.drawImageAt(canvas, image, this.images.display, x, y, w, h);

	return;
}

UIPageIndicatorNormal.prototype.setItemTextColorOfCurrent = function(value) {
	this.itemTextColorOfCurrent = value;

	return;
}

UIPageIndicatorNormal.prototype.getItemTextColorOfCurrent = function() {
	return this.itemTextColorOfCurrent ? this.itemTextColorOfCurrent : "green";
}

UIPageIndicatorNormal.prototype.paintBackground = function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_NORMAL);

	if(!image) {
		canvas.fillStyle = this.style.fillColor;
		canvas.rect(0, 0, this.w, this.h);
		canvas.fill();
	}

	return;
}

UIPageIndicatorNormal.prototype.getItemLocaleText= function(index) {
	var str = null;
	var texts = this.getItemTexts();
	
	if(texts && index < texts.length) {
		str = webappGetText(texts[index]);
		if(!str) {
			str = texts[index];
		}
	}

	return str;
}

UIPageIndicatorNormal.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {
	var image = this.getItemImage(index, isCurrent);
	this.paintOneIndicatorBackground(canvas, isCurrent, index, x, y, w, h);

	if(image) {
		image = image.getImage();
	}

	var gapBetweenTextImage = 4;
	var fontSize = this.style.fontSize;
	var str = this.getItemLocaleText(index);

	canvas.font = this.style.getFont();
	canvas.fillStyle = isCurrent ? this.getItemTextColorOfCurrent() : this.style.textColor; 
	
	if(image) {
		var imageW = image.width;
		var imageH = image.height;
		var hMargin = this.hMargin;

		if(str) {
			var textW = w;
			if(this.imagePosition === "left") {
				var dx = x + hMargin;
				var dy = Math.floor(y + (h-imageH)/2);
				canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);

				dy = Math.floor(y + h/2);
				dx = Math.floor(x + (w-imageW)/2 + imageW);
				textW = w - imageW - 2 * hMargin;

				canvas.textAlign = "center";
				canvas.textBaseline = "middle";
				canvas.fillText(str, dx, dy, textW);
			}
			else if(this.imagePosition === "middle") {
				this.drawImageAt(canvas, image, CANTK_IMAGE_DISPLAY_9PATCH, x, y, w, h);

				var dy = Math.floor(y + h/2);
				var dx = Math.floor(x + w/2);
				textW = w - 2 * hMargin;
	
				canvas.font = this.style.getFont();
				canvas.textAlign = "center";
				canvas.textBaseline = "middle";
				canvas.fillText(str, dx, dy, textW);
			}
			else {
				var dx = Math.floor(x + (w-imageW)/2);
				var dy = Math.floor(y + (h-imageH-fontSize-gapBetweenTextImage)/2);
				canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);

				dx = Math.floor(x + w/2);
				dy = dy + imageH + gapBetweenTextImage;
				textW = w - 2 * hMargin;

				canvas.textAlign = "center";
				canvas.textBaseline = "top";
				canvas.fillText(str, dx, dy, textW);
			}
		}
		else {
			var dx = Math.floor(x + (w-imageW)/2);
			var dy = Math.floor(y + (h-imageH)/2);
			canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);
		}
	}
	else {
		if(str) {
			canvas.textAlign = "center";
			canvas.textBaseline = "middle";
			canvas.fillText(str, Math.floor(x+w/2), Math.floor(y+h/2));
		}
	}

	return;
}

UIPageIndicator.prototype.onClickItem = function(index) {
	var viewPager = this.getViewPager();
	if(viewPager) {
		if(this.enableAnimatePage) {
			viewPager.switchTo(index);
		}
		else {
			viewPager.setCurrent(index);
		}
	}

	return;
}

function UIPageIndicatorNormalCreator() {
	var args = ["ui-page-indicator-normal", "ui-page-indicator-normal", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorNormal();

		return g.initUIPageIndicatorNormal(this.type, 200, 60);
	}
	
	return;
}


/*
 * File:   ui-page.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  TabPage
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPage() {
	return;
}

UIPage.prototype = new UIElement();
UIPage.prototype.isUIPage = true;

UIPage.prototype.initUIPage = function(type, bg) {
	this.initUIElement(type);	

	this.setDefSize(200, 200);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.widthAttr = C_WIDTH_FILL_PARENT;
	this.heightAttr = C_HEIGHT_FILL_PARENT;

	if(!bg) {
		this.style.setFillColor("Gold");
	}

	return this;
}

UIPage.prototype.show = function() {
	this.setVisible(true);
	this.showHTML();

	return;
}

UIPage.prototype.hide = function() {
	this.setVisible(false);
	this.hideHTML();
	cantkHideAllInput();

	return;
}

UIPage.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPage) {
		return false;
	}

	return true;
}

UIPage.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIPageCreator(bg) {
	var args = ["ui-page", "ui-page", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPage();

		return g.initUIPage(this.type, bg);
	}
	
	return;
}

/*
 * File:   ui-page-manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  TabPage Manager
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPageManager() {
}

UIPageManager.prototype = new UIFrames();
UIPageManager.prototype.isUIPageManager = true;

UIPageManager.prototype.initUIPageManager = function(type) {
	return this.initUIFrames(type);
}

UIPageManager.prototype.beforeAddShapeIntoChildren = function(shape) {
	return !shape.isUIPage;
}

UIPageManager.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPage;
}

UIPageManager.prototype.relayoutChildren = function() {
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.x = 0;
		iter.y = 0;
		iter.w = this.w;
		iter.h = this.h;
		iter.relayoutChildren();
		iter.setUserMovable(false);
		iter.setUserResizable(false);
	}

	return;
}

UIPageManager.prototype.showHTML = function() {
	var child = this.getCurrentFrame();
	
	if(child) {
		child.showHTML();
	}

	return;
}

UIPageManager.prototype.hideHTML = function() {
	var child = this.getCurrentFrame();
	
	if(child) {
		child.hideHTML();
	}

	return;
}


UIPageManager.prototype.switchTo = function(index) {
	var pageManager = this;
	var curFrame = this.getCurrentFrame();
	var newFrame = this.getFrame(index);
	var current = this.current;

	if(curFrame) {
		curFrame.hideHTML();
	}

	if(current < 0 || current === index || !curFrame || !newFrame) {
		this.showFrame(index);

		if(newFrame) {
			newFrame.showHTML();
		}

		return;
	}

	function showNewFrame() {
		pageManager.showFrame(index);
		pageManager.postRedraw();

		return;
	}

	if(!this.isOnTopWindow()) {
		showNewFrame();	
		return;
	}

	var animation = null;
	var backendCanvas = null;
	var p = this.getPositionInScreen();

	if(index < current) {
		animation = animationCreate("anim-backward"); 
		backendCanvas = preparseBackendCanvas(newFrame, curFrame);
	}
	else {
		animation = animationCreate("anim-forward"); 
		backendCanvas = preparseBackendCanvas(curFrame, newFrame);
	}

//	window.open(backendCanvas.toDataURL(), "_blank");
	animation.setScale(this.getRealScale());
	animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, showNewFrame);
	animation.run();

	return;
}

function UIPageManagerCreator() {
	var args = ["ui-page-manager", "ui-page-manager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageManager();

		g.initUIPageManager(this.type);

		return g;
	}
	
	return;
}

/*
 * File:   ui-placeholder.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Place Holder
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPlaceholder() {
	return;
}

UIPlaceholder.prototype = new UIElement();
UIPlaceholder.prototype.isUIPlaceholder = true;
UIPlaceholder.prototype.initUIPlaceholder = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setCanRectSelectable(false, false);

	return this;
}

UIPlaceholder.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIPlaceholder.prototype.paintSelfOnly = function(canvas) {
	if(this.mode === C_MODE_EDITING) {
		var x = this.vMargin;
		var y = this.hMargin;
		var w = this.getWidth(true);
		var h = this.getHeight(true);

		drawDashedRect(canvas, x, y, w, h);
		canvas.stroke();
	}

	return;
}

function UIVPlaceholderCreator(w, h) {
	var args = ["ui-v-placeholder", "ui-placeholder", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPlaceholder();

		g.initUIPlaceholder(this.type, w, h);
		g.widthAttr = C_WIDTH_FILL_PARENT;
		g.MIN_SIZE = 4;
		g.setSizeLimit(20, 4);

		return g;
	}
	
	return;
}

function UIHPlaceholderCreator(w, h) {
	var args = ["ui-h-placeholder", "ui-placeholder", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPlaceholder();

		g.initUIPlaceholder(this.type, w, h);
		g.heightAttr = C_HEIGHT_FILL_PARENT;
		g.MIN_SIZE = 4;
		g.setSizeLimit(4, 20);

		return g;
	}
	
	return;
}

/*
 * File:   ui-progressbar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Slider/ProgressBar
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIProgressBar() {
	return;
}

UIProgressBar.prototype = new UIElement();
UIProgressBar.prototype.isUIProgressBar = true;

UIProgressBar.prototype.initUIProgressBar = function(type, w, h, interactive, bgImg, fgImg, dragImg) {
	this.initUIElement(type);	

	this.setPercent(50);
	this.setDefSize(w, h);
	this.setInteractive(interactive);
	this.setTextType(C_SHAPE_TEXT_INPUT);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;
	this.setSizeLimit(120, 40, null, 80);
	this.setImage(CANTK_IMAGE_DEFAULT, bgImg);
	this.setImage(CANTK_IMAGE_NORMAL_FG, fgImg);

	this.drawSize = h;
	this.dragImg = dragImg;

	if(interactive) {
		this.addEventNames(["onChanged"]);
		this.addEventNames(["onChanging"]);
	}

	return this;
}

UIProgressBar.prototype.shapeCanBeChild = function(shape) {
	return (shape.isUIImage || shape.isUILabel || shape.isUIColorTile);
}

UIProgressBar.prototype.relayoutChildren = function() {
	var w = this.h;
	var h = this.h;
	var shape = this.drag;

	if(shape) {
		if(shape.isUIColorTile) {
			w = this.h >> 1;
		}

		shape.setSize(w, h);
		shape.y = 0;
	}

	return;
}

UIProgressBar.prototype.afterChildAppended =function(shape) {
	var bar = this;
	var size = this.drawSize ? this.drawSize : this.h;

	this.setTextType(C_SHAPE_TEXT_NONE);

	shape.yAttr = C_Y_MIDDLE_IN_PARENT;
	shape.setTextType(C_SHAPE_TEXT_NONE);

	var w = size;
	var h = size;
	if(shape.isUIColorTile) {
		w = size >> 1;
	}
	shape.setSize(w, h);
	shape.setSizeLimit(w, h, w, h);
	shape.setUserResizable(false);

	shape.horMove = function(x) {
		var v = x;
		var max = bar.w - this.w;
		v = v < 0 ? 0 : v;
		v = v <= max ? v : max;

		this.move(v, this.y);
		
		return;
	}

	bar.onPointerMoveRunning = function(point, beforeChild) {
		if(beforeChild) {
			return;
		}

		if(this.pointerDown) {
			bar.isChanging = true;
			shape.horMove(point.x);
		}
		
		return;
	}

	bar.onPointerUpRunning = function(point, beforeChild) {
		if(beforeChild) {
			return;
		}
		
		delete this.isChanging;
		shape.horMove(point.x);
		shape.onMoved();

		return;
	}

	bar.onSized = function() {
		this.updateLayoutParams();
		this.setPercent(this.getPercent());

		return;
	}

	shape.onMoved = function() {
		var percent = 100 * (shape.x + shape.w/2) / bar.w; 
		if(shape.x === 0) {
			percent = 0;
		}

		if((shape.x + shape.w) === bar.w) {
			percent = 100;
		}

		bar.setPercentOnly(percent);
		bar.relayoutChildren();

		return;
	}
	this.drag = shape;
	
	return;
}

UIProgressBar.prototype.setInteractive = function(value) {
	this.interactive = value;

	return;
}

UIProgressBar.prototype.setPercentOnly = function(value, notNotify) {
	var newValue = (value%101)/100;
	if(this.value != newValue) {
		this.value = newValue;
	}

	if(this.mode === C_MODE_EDITING || !this.isVisible()) {
		return;
	}

	if(notNotify) {
		return;
	}

	if(this.isChanging) {
		this.callOnChanging(this.getValue());
	}
	else {
		this.callOnChanged(this.getValue());
	}

	return;
}

UIProgressBar.prototype.setPercent = function(value, notNotify) {
	this.setPercentOnly(value, notNotify);

	if(this.drag) {
		var dx = this.value * this.w - this.drag.w + 5;

		this.drag.y = Math.floor((this.h - this.drag.h)/2);
		this.drag.x = Math.floor(dx > 0 ? dx : 0);
	}


	return;
}

UIProgressBar.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	if(!this.drag && this.interactive) {
		var x = point.x - this.x;
		var value = x / this.w;
		this.setPercent(value * 100);
	}

	return;
}

UIProgressBar.prototype.getPercent = function() {
	return this.value * 100;
}

UIProgressBar.prototype.getValue = function() {
	return this.getPercent();
}

UIProgressBar.prototype.setValue = function(value, notNotify) {
	this.setPercent(value, notNotify);

	return;
}

UIProgressBar.prototype.paintSelfOnly = function(canvas) {
	var w = this.w;
	var h = this.h >> 1;
	var y = this.h >> 2;
	var r = this.h >> 3;

	var bg = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);
	var fg = this.getHtmlImageByType(CANTK_IMAGE_NORMAL_FG);

	if(bg && fg) {
		return;
	}

	canvas.save();
	canvas.translate(0, y);

	if(!bg) {
		canvas.beginPath();
		canvas.fillStyle = this.style.fillColor;
		drawRoundRect(canvas, w, h, r);
		canvas.fill();
	}

	w = this.w * this.value;
	if(!fg) {
		canvas.fillStyle = this.style.lineColor;
		canvas.beginPath();
		if(w > 2 * r) {
			drawRoundRect(canvas, w, h, r);
		}
		canvas.fill();
	}
	canvas.restore();

	return;
}

UIProgressBar.prototype.drawImage = function(canvas) {
	var image = null;
	var y = 0;
	var h = this.h;	
	
	image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);
	if(image) {
		h = image.height;
		y = (this.h - h)>>1;
		drawNinePatchEx(canvas, image, 0, 0, image.width, image.height, 0, y, this.w, h);
	}
	
	image = this.getHtmlImageByType(CANTK_IMAGE_NORMAL_FG);
	if(image) {
		var w = this.w * this.value;
		
		h = image.height;
		y = (this.h - h)>> 1;
		if(w >= image.width) {
			drawNinePatchEx(canvas, image, 0, 0, image.width, image.height, 0, y, this.w * this.value, h);
		}
		else {
			canvas.drawImage(image, 0, y);
		}
	}

	return;
}

function UIProgressBarCreator(w, h, interactive, bgImg, fgImg, dragImg) {
	var type = interactive ? "ui-slider" : "ui-progressbar";
	var args = [type, "ui-progressbar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIProgressBar();
		return g.initUIProgressBar(this.type, w, h, interactive, bgImg, fgImg, dragImg);
	}
	
	return;
}

/*
 * File:   ui-radio-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Radio Box
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIRadioBox() {
	return;
}

UIRadioBox.prototype = new UICheckBox();
UIRadioBox.prototype.isUIRadioBox = true;

UIRadioBox.prototype.initUIRadioBox = function(type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg) {
	return this.initUICheckBox(type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg)
}

UIRadioBox.prototype.setParent = function(parentShape) {
	this.parentShape = parentShape;

	if(this.value) {
		this.setChecked();
	}

	return;
}

UIRadioBox.prototype.setChecked = function() {
	var parentShape = this.getParent();

	if(parentShape) {
		for(var i = 0; i < parentShape.children.length; i++) {
			var shape = parentShape.children[i];
			if(shape.isUIRadioBox) {
				shape.setValue(false);
			}
		}
	}

	this.setValue(true);

	return;
}

UIRadioBox.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	this.setChecked();
	
	return this.callClickHandler(point, beforeChild);
}

function UIRadioBoxCreator(w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg) {
	var args = ["ui-radiobox", "ui-radiobox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRadioBox();
		g.initUIRadioBox(this.type, w, h, onFocusedImg, onActiveImg, onImg, offFocusedImg, offActiveImg, offImg);

		return g;
	}
	
	return;
}


/*
 * File: ui-screen.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: Screen 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScreen() {
	return;
}

UIScreen.prototype = new UIElement();
UIScreen.prototype.isUIScreen = true;

UIScreen.prototype.initUIScreen = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	
	return this;
}

UIScreen.prototype.getWindowManager = function() {
	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		
		if(child.isUIWindowManager) {
			return child;
		}
	}

	return;
}

UIScreen.prototype.shapeCanBeChild = function(shape) {
	if(!shape.isUIStatusBar && !shape.isUIWindowManager) {
		return false;
	}

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if(child.type === shape.type) {
			return false;
		}
	}

	return true;
}

UIScreen.prototype.beforeRelayoutChild = function(shape) {
	this.relayoutChildren();

	return false;
}

UIScreen.prototype.relayoutChildren = function() {
	if(this.disableRelayout) {
		return;
	}

	var x = 0;
	var y = 0;
	var h = 0;
	var w = this.w;
	var menuBar = null;
	var statusBar = null;
	var windowManager = null;

	for(var i = 0; i < this.children.length; i++) {
		var child = this.children[i];

		child.x = 0;
		child.w = w;
		child.setUserMovable(false);
		child.setUserResizable(false);
		child.widthAttr = C_WIDTH_FILL_PARENT;

		if(child.type === "ui-status-bar") {
			statusBar = child;
			if(child.h > this.h/4) {
				child.h = this.h/4;
			}
			child.move(0, 0);
			child.relayout();
			continue;
		}

		if(child.type === "ui-menu-bar") {
			var config = this.getDeviceConfig();
			var visible = config && config.hasMenuBar && this.h > this.w;

			if(visible) {
				menuBar = child;
				if(child.h > this.h/4) {
					child.h = this.h/4;
				}
				child.move(0, this.h - child.h);
				child.relayout();
			}
			else {
				child.y = 0;
				child.x = 0;
			}
			child.setVisible(visible);
			child.setEnable(visible);
			continue;
		}

		if(child.isUIWindowManager) {
			windowManager = child;
			continue;
		}
	}

	h = this.h;
	if(windowManager) {
		if(statusBar) {
			y = statusBar.h;
			h = h - statusBar.h;
		}

		if(menuBar) {
			h = h - menuBar.h;
		}

		windowManager.h = h;
		windowManager.relayout();
	}

	return;
}

function UIScreenCreator(w, h) {
	var args = ["ui-screen", "ui-screen", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScreen();
		return g.initUIScreen(this.type, w, h);
	}
	
	return;
}


/*
 * File:   ui-scroll-text.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scroll Text
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScrollText() {
	return;
}

UIScrollText.prototype = new UIElement();
UIScrollText.prototype.isUIScrollText = true;

UIScrollText.prototype.initUIScrollText = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_TEXTAREA);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.addEventNames(["onScrollDone"]);

	return this;
}

UIScrollText.prototype.onModeChanged = function() {
	this.offsetX = 0;
	this.offsetY = 0;

	return;
}

UIScrollText.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIScrollText.prototype.getAnimationDuration = function() {
	return this.animationDuration ? this.animationDuration : 1000;
}

UIScrollText.prototype.setAnimationDuration = function(animationDuration) {
	this.animationDuration = animationDuration;

	return;
}

UIScrollText.prototype.getPauseDuration = function() {
	return this.pauseDuration ? this.pauseDuration : 0;
}

UIScrollText.prototype.setPauseDuration = function(pauseDuration) {
	this.pauseDuration = pauseDuration;

	return;
}

UIScrollText.prototype.startVScroll = function() {
	var scrolltext = this;
	var textHeight = this.getTextHeight();
	var lineHeight = this.getLineHeight(true);

	if(textHeight <= this.h) {
		return;
	}

	this.offsetX = 0;
	this.offsetY = 0;
	var startTime = 0;
	var startOffset = 0;
	var duration = this.getAnimationDuration();
	var pauseDuration = this.getPauseDuration();
	this.h = Math.floor(this.h/lineHeight) * lineHeight;

	var range = -this.h;
	var firstTime = true;
	var interpolator =  new DecelerateInterpolator();

	function animStep() {
		if(firstTime) {
			firstTime = false;
			startTime = (new Date()).getTime();
		}

		if(!scrolltext.isVisible()) {
			return;
		}
	
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = pauseDuration > 0 ? interpolator.get(timePercent) : timePercent;
		delete now;

		if(timePercent < 1) {
			scrolltext.offsetY = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			scrolltext.offsetY = startOffset + range;

			if(Math.abs(scrolltext.offsetY) < (textHeight-scrolltext.h)) {
				firstTime = true;

				startOffset = scrolltext.offsetY;
				setTimeout(animStep, pauseDuration);
			}
			else {
				delete interpolator;
				scrolltext.callOnScrollDone();
			}

			delete startTime;
		}

		delete now;
		scrolltext.postRedraw();
	}

	setTimeout(animStep, pauseDuration);

	return;
}

UIScrollText.prototype.startHScroll = function() {
	var scrolltext = this;
	var textWidth = this.textWidth;

	if(textWidth <= this.w) {
		return;
	}

	this.offsetX = 0;
	this.offsetY = 0;
	var startTime = 0;
	var startOffset = 0;
	var duration = this.getAnimationDuration();
	var pauseDuration = this.getPauseDuration();

	var range = -this.w;
	var firstTime = true;
	var interpolator =  new DecelerateInterpolator();

	function animStep() {
		if(firstTime) {
			firstTime = false;
			startTime = (new Date()).getTime();
		}

		if(!scrolltext.isVisible()) {
			return;
		}
	
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = pauseDuration > 0 ? interpolator.get(timePercent) : timePercent;

		if(timePercent < 1) {
			scrolltext.offsetX = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			scrolltext.offsetX = startOffset + range;

			if(Math.abs(scrolltext.offsetX) < (textWidth-scrolltext.w)) {
				firstTime = true;

				startOffset = scrolltext.offsetX;
				setTimeout(animStep, pauseDuration);
			}
			else {
				delete startTime;
				scrolltext.callOnScrollDone();
			}
		}

		delete now;
		scrolltext.postRedraw();
	}

	setTimeout(animStep, pauseDuration);

	return;
}

UIScrollText.prototype.startScroll = function() {
	if(!this.isVisible()) {
		return;
	}

	if(this.type === "ui-vscroll-text") {
		this.startVScroll();
	}
	else {
		this.startHScroll();
	}

	return;
}

UIScrollText.prototype.onInit = function() {
	this.offsetX = 0;
	this.offsetY = 0;

	var scrolltext = this;
	setTimeout(function() {
			scrolltext.startScroll();
		}, 1000);

	return;
}

UIScrollText.prototype.drawText = function(canvas) {
	var offsetX = this.offsetX ? this.offsetX : 0;
	var offsetY = this.offsetY ? this.offsetY : 0;

	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.translate(offsetX, offsetY);
    canvas.beginPath();
    canvas.font = this.style.getFont();
    canvas.fillStyle = this.style.textColor;
    canvas.strokeStyle = this.style.lineColor;
    canvas.lineWidth = 1;

	if(this.type === "ui-vscroll-text") {
		this.drawMLText(canvas, false, true);
	}
	else {
		this.textWidth = this.draw1LText(canvas, true);
	}
	canvas.restore();

	return;
}

function UIScrollTextCreator(type, w, h) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScrollText();
		
		return g.initUIScrollText(this.type, w, h);
	}
	
	return;
}


/*
 * File:   ui-select.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scrollable Select
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISelect() {
	return;
}

UISelect.prototype = new UIElement();
UISelect.prototype.isUISelect = true;

UISelect.prototype.initUISelect = function(type, w, h) {
	this.initUIElement(type);
	
	this.offset = 0;
	this.options = [];
	this.visibleItems = 5;	
	this.setDefSize(w, h);
	this.addEventNames(["onInit", "onChanged"]);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setCanRectSelectable(false, true);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;

	return this;
}

UISelect.prototype.getItemHeight = function() {
	return Math.round(this.h/this.visibleItems);
}

UISelect.prototype.getVisibleItems = function() {
	return this.visibleItems;
}

UISelect.prototype.setVisibleItems = function(visibleItems) {
	if(visibleItems <= 3) {
		this.visibleItems = 3;
	}
	else {
		this.visibleItems = 5;
	}
}

UISelect.prototype.setHighlightTextColor = function(color) {
	this.highlightTextColor = color;

	return;
}

UISelect.prototype.getHighlightTextColor = function() {
	return this.highlightTextColor ? this.highlightTextColor : this.style.textColor;
}


UISelect.prototype.scrollTo = function(offsetEnd) {
	var itemHeight = this.getItemHeight();

	offsetEnd = Math.round(offsetEnd/itemHeight) * itemHeight;

	var me = this;
	var duration = 500;
	var offsetStart = this.offset;
	var range = offsetEnd - offsetStart;
	var startTime = (new Date()).getTime();
	var interpolator =  new DecelerateInterpolator();

	this.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(timePercent < 1) {
			me.setOffset(Math.floor(offsetStart + percent * range));
			setTimeout(animStep, 10);
		}
		else {
			me.setOffset(offsetStart + range, true);
			delete startTime;
			delete interpolator;
			delete me.animating;
		}

		delete now;
	}

	setTimeout(function() {
		animStep();
	}, 10);

	return;
}

UISelect.prototype.setOffset = function(offset, triggerOnChanged) {
	this.offset = offset;
	this.postRedraw();

	if(triggerOnChanged) {
		var value = this.getValue();
		this.callOnChanged(value);
	}

	return;
}

UISelect.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();
	this.saveOffset = this.offset;

	return true;
}

UISelect.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}
	
	this.addMovementForVelocityTracker();

	var dy = this.getMoveAbsDeltaY();
	this.setOffset(this.saveOffset + dy);

	return;
}

UISelect.prototype.getMaxOffset = function() {
	var n = Math.floor(0.5 * this.visibleItems);

	return n * this.getItemHeight();
}

UISelect.prototype.getMinOffset = function() {
	var itemHeight = this.getItemHeight();

	var n = Math.round(0.5 * this.visibleItems);

	if(this.options.length <= n) {
		return 0;
	}
	else {
		return -(this.options.length-n)  * itemHeight;
	}
}
	
UISelect.prototype.handleClicked = function(point) {
	var itemHeight = this.getItemHeight();

	var m = Math.floor((this.h/2 - this.offset)/itemHeight);
	var i = Math.floor((point.y - this.offset)/itemHeight);

	var d = (i - m) * itemHeight;
	var offset = this.offset-d;
	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();

	if(offset < minOffset) {
		offset = minOffset;
	}

	if(offset > maxOffset) {
		offset = maxOffset;
	}
	
	this.scrollTo(offset);

	return;
}

UISelect.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	var dy = this.getMoveAbsDeltaY();
	var velocity = this.velocityTracker.getVelocity().y;

	var distance = dy + velocity/2;

	if(Math.abs(distance) < 10) {
		this.setOffset(this.saveOffset);
		this.handleClicked(point);

		return;
	}

	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();
	var offset = this.saveOffset + dy + velocity;

	if(offset < minOffset) {
		offset = minOffset;
	}

	if(offset > maxOffset) {
		offset = maxOffset;
	}

	this.scrollTo(offset);

	return;
}

UISelect.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UISelect.prototype.setText =function(text) {
	text = this.toText(text);
	if(text) {
		this.options = text.split("\n");
		this.options.remove("");
	}
	else {
		this.options = [];
	}

	this.text = text;

	return;
}

UISelect.prototype.drawImage = function(canvas) {
	var y = 0;
	var b = 0;
	var w = this.w;
	var h = this.h;
	var x = w >> 1;
	var offset = 0;
	var yOffset = this.offset;
	var itemHeight = this.getItemHeight();

	canvas.beginPath();
	canvas.rect(0, 0, w, h);
	canvas.clip();

	var n = this.options.length;

	var hasImage = this.getBgImage() != null;
	this.drawBgImage(canvas);
	if(!hasImage) {
		canvas.lineWidth = 3;
		canvas.strokeStyle = this.style.lineColor;
		canvas.beginPath();

		y = (this.visibleItems >> 1) * itemHeight;
		canvas.moveTo(5, y);
		canvas.lineTo(w-10, y);
		canvas.moveTo(5, y+itemHeight);
		canvas.lineTo(w-10, y+itemHeight);
		canvas.stroke();
	}

	this.style.setTextB(false);
	this.style.setFontSize(Math.floor(itemHeight * 0.5));
	var normalFont = this.style.getFont();
	var normalTxtColor = this.style.textColor;
	
	this.style.setTextB(true);
	this.style.setFontSize(Math.floor(itemHeight * 0.6));
	var highlightFont = this.style.getFont();
	var highlightTextColor = this.getHighlightTextColor();

	canvas.textAlign = "center";
	canvas.textBaseline = "middle";
	canvas.font = this.style.getFont();
	canvas.fillStyle = this.style.textColor;

	canvas.translate(0, yOffset);

	var m = Math.floor((0.5 * h - yOffset)/itemHeight);

	for(var i = 0; i < n; i++) {
		var text = this.options[i];

		y = i * itemHeight;
		b = y + itemHeight;

		offset = -yOffset;
		if(b < offset && y < offset) {
			continue;
		}

		offset = -(yOffset - h);
		if(b > offset && y > offset) {
			continue;
		}

		if(m == i) {
			canvas.font = highlightFont;
			canvas.fillStyle = highlightTextColor;
		}
		else {
			canvas.font = normalFont;
			canvas.fillStyle = normalTxtColor;
		}

		y = y + (itemHeight >> 1);
		canvas.fillText(text, x, y, w);
	}

	return;
}

UISelect.prototype.getValue = function() {
	var h = this.h;
	var yOffset = this.offset;
	var itemHeight = this.getItemHeight();
	var i = Math.floor((0.5 * h - yOffset)/itemHeight);

	var value = (i < this.options.length) ? this.options[i] : "";

	return value;
}

UISelect.prototype.setValueByIndex = function(index, animate) {
	var i = index;
	var itemHeight = this.getItemHeight();

	if(i >= 0) {
		var offset = -(i - (this.getVisibleItems()>> 1)) * itemHeight;

		if(animate) {
			this.scrollTo(offset);
		}
		else {
			this.setOffset(offset, true);
		}
	}

	return;
}

UISelect.prototype.setValue = function(value, animate) {
	var i = this.options.indexOf(value.toString());

	this.setValueByIndex(i, animate);

	return;
}

function UISelectCreator(w, h) {
	var args = ["ui-select", "ui-select", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISelect();
		return g.initUISelect(this.type, w, h);
	}
	
	return;
}


/*
 * File:   ui-shortcut.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  ShortCut 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIShortcut() {
	return;
}

UIShortcut.prototype = new UIElement();
UIShortcut.prototype.isUIShortcut = true;

UIShortcut.prototype.initUIShortcut = function(type) {
	this.initUIElement(type);	

	this.setText("#ABCDEFGHIJKLMNOPQRSTUVYWXYZ");
	this.setDefSize(200, 200);
	this.setMargin(5, 5);
	this.setTextType(C_SHAPE_TEXT_INPUT);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.addEventNames(["onChanged"]);

	return this;
}

UIShortcut.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIShortcut.prototype.drawText = function(canvas) {
	var text = this.text;
	var n = text.length;

	if(!n) {
		return;
	}

	canvas.textBaseline = "middle";
	canvas.textAlign = "center";
	canvas.font = this.style.getFont();

	var x = this.w >> 1;
	var y = this.vMargin;
	var w = this.getWidth(true);

	var ih = this.getHeight(true)/n;
	var ihh = ih >> 1;

	canvas.strokeStyle = this.style.lineColor;
	for(var i = 0; i < text.length; i++) {
		var c = text[i];

		if(this.currentItem === i) {
			canvas.rect(0, y, this.w, ih);
			if(this.pointerDown) {
				canvas.fillStyle = this.style.fillColor;
				canvas.fill();
			}
			
			canvas.stroke();
		}

		canvas.fillStyle = this.style.textColor;
		canvas.fillText(c, x, y + ihh);

		y += ih;
	}

	return;
}

UIShortcut.prototype.findItemByPoint = function(point) {
	var text = this.text;
	var vMargin = this.vMargin;
	var h = this.getHeight(true);
	var index = Math.floor(text.length * (point.y-vMargin)/h);

	return index;
}

UIShortcut.prototype.changeItemByPoint = function(point) {
	var text = this.text;
	var index = this.findItemByPoint(point);

	if(index >= 0 && index < text.length) {
		var value = text[index];

		if(this.currentItem != index) {
			this.callOnChanged(value);
			this.currentItem = index;
		}
	}

	return;
}

UIShortcut.prototype.setValue = function(value) {
	var index = this.text.indexOf(value);
	if(index >= 0) {
		if(this.currentItem != index) {
			this.currentItem = index;
			this.callOnChanged(value);
		}
	}

	return;
}

UIShortcut.prototype.getValue = function() {
	if(this.text && this.currentItem >= 0 && this.currentItem < this.text.length) {
		return this.text[this.currentItem];
	}
	else {
		return "";
	}
}

UIShortcut.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || !this.text) {
		return;
	}

	this.changeItemByPoint(point);

	return;
}

UIShortcut.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || !this.text) {
		return;
	}

	if(this.pointerDown) {
		this.changeItemByPoint(point);
	}

	return;
}

function UIShortcutCreator() {
	var args = ["ui-shortcut", "ui-shortcut", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIShortcut();
		return g.initUIShortcut(this.type);
	}
	
	return;
}


/*
 * File:   ui-simple-html.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Simple HTML View
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISimpleHTML() {
	return;
}

UISimpleHTML.prototype = new UIVScrollView();
UISimpleHTML.prototype.isUISimpleHTML = true;

UISimpleHTML.prototype.initUISimpleHTML = function(type, initText, bg) {
	this.initUIVScrollView(type, 10, bg, null);	

	this.setText(initText);
	this.setDefSize(200, 200);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);

	return this;
}

UISimpleHTML.prototype.extractHtmlElements = function(el, indexInParent) {
	var i = 0;
	var node = null;
	var simpleHtml = this;
	var tag = el.localName;
	var n = el.childNodes.length;
	var childNodes = el.childNodes;

	function createNode(type) {
		var newNode = {x:0, y:0};
		newNode.type = type;

		return newNode;
	}

	if(tag === "b") {
		this.bold = this.bold + 1;	
	}
	else if(tag === "i") {
		this.italic = this.italic + 1;	
	}
	else if(tag === "u") {
		this.underline = this.underline + 1;	
	}
	else if(tag === "a") {
		this.anchor = this.anchor + 1;	
	}
	else if(tag === "ol" || tag === "ul") {
		if(indexInParent > 0) {
			node = createNode("newline");
		}
	}
	else if(tag === "li") {
		node = createNode("text");
		if(el.parentNode.localName === "ol") {
			node.value = "    " + (indexInParent+1) + ". ";
		}
		else {
			node.value = "    o. ";
		}
		node.bold = true;
		node.color = "gray";
		node.fontStyle = "bold ";
	}

	if(el.style && el.style.color) {
		this.colors.push(el.style.color);
	}
	
	if(node) {
		node.tag = tag;
		this.elements.push(node);
		node = null;
	}

	for(var i = 0; i < n; i++) {
		var iter = childNodes[i];
		this.extractHtmlElements(iter, i);
	}
	
	if(tag === "img" && el.src) {
		var src = el.src;
		var image = new Image();
		
		image.onload = function (e) {
			node.imageLoaded = true;
			simpleHtml.textNeedRelayout = true;

			return;
		};
	
		image.onerror = function (e) {
			node.imageLoaded = false;
			if(src) {
				console.log("load " + src + " failed.");
			}
		};

		image.onabort = function (e) {
			node.imageLoaded = false;
			if(src) {
				console.log("load " + src + " failed(abort).");
			}
		};
		
		image.src = src;
		node = createNode("img");
		node.value = image;
		node.displayWidth = el.width;
		node.displayHeight = el.height;
	}
	else if(!n && el.textContent) {
		var str = el.textContent.replace(/(\t|\n|\r)+/g, '');		
		var text = str.replace(/ +/g, ' ');

		if(text) {
			node = createNode("text");
			node.value = text;
			node.bold = this.bold;
			node.italic = this.italic;
			node.underline = this.underline;
			node.anchor = this.anchor;
			node.fontStyle = "";
			if(this.colors.length) {
				node.color = this.colors[this.colors.length-1];
			}

			if(node.bold) {
				node.fontStyle = node.fontStyle + "bold ";
			}

			if(node.italic) {
				node.fontStyle = node.fontStyle + "italic ";
			}
		}
	}

	if(tag === "b") {
		this.bold = this.bold - 1;	
	}
	if(tag === "i") {
		this.italic = this.italic - 1;	
	}
	if(tag === "u") {
		this.underline = this.underline - 1;	
	}
	if(tag === "a") {
		node = createNode("a");
		node.href = el.href;
		this.anchor = this.anchor - 1;	
	}

	if(tag === "p" || (el.style != null && el.style.display === "block")) {
		node = createNode("newblock");
	}
	else if(tag === "li" || tag === "br" || tag === "hr" || tag === "dd") {
		node = createNode("newline");
	}

	if(el.style && el.style.color) {
		this.colors.pop();
	}

	if(node) {
		node.tag = tag;
		this.elements.push(node);
	}

	return;
}


UISimpleHTML.prototype.getNodeByPoint = function(point) {
	var i = 0;
	var x = point.x;
	var y = point.y;
	var node = null;
	var next = null;
	var rect = {};
	var n = this.elements.length;
	var elements = this.elements;
	
	for(i = 0; i < n; i++) {
		node = elements[i];
		next = ((i + 1) < n) ?  elements[i+1] : null;		
		
		if(y < node.y) {
			continue;
		}
		
		if(next && (y > next.y && node.y < next.y)) {
			continue;
		}

		if(node.type === "text") {
			var k = 0;
			var m = node.lines.length;

			rect.h = node.lineHeight;
			for(k = 0; k < m; k++) {
				rect.x = 0;
				rect.y = node.y + k * node.lineHeight;

				if(k === 0) {
					rect.x = node.x;
					rect.w = node.firstLineWidth;
				}
				else if((k + 1) === m) {
					rect.w = node.lastLineWidth;
				}
				else {
					rect.w = this.w;
				}

				if(isPointInRect(point, rect)) {
					return node;
				}
			}
		}
		else if(node.type === "img") {
			rect.x = node.x;
			rect.y = node.y;
			rect.w = node.w;
			rect.h = node.h;

			if(isPointInRect(point, rect)) {
				return node;
			}
		}
	}

	return node;
}

UISimpleHTML.prototype.layoutHtmlElements = function(canvas) {
	var i = 0;
	var offsetX = 0;
	var offsetY = 0;
	var node = null;
	var lineWidth = 0;
	var lineInfo = null;
	var n = this.elements.length;
	var elements = this.elements;
	var width = this.getWidth(true);
	var fontSize = this.style.fontSize;
	var textLayout = new TextLayout(canvas);
	var fontStr = fontSize + "pt " + this.style.fontFamily; 
	var lineGap = fontSize * 2;
	
	canvas.font = fontStr;

	for(i = 0; i < n; i++) {
		node = elements[i];
		
		if(node.type === "text") {
			node.lines = [];
			node.x = offsetX;
			node.y = offsetY;
			node.firstLineWidth = 0;
			canvas.font = node.fontStyle + fontStr;
			node.lineHeight = lineGap;
			textLayout.setText(node.value);

			while(true) {
				lineWidth = width - offsetX;
				
				if(textLayout.hasNext()) {
					lineInfo = textLayout.nextLine(lineWidth, fontSize);
					node.lines.push(lineInfo.text);
					if(node.lines.length === 1) {
						node.firstLineWidth = lineInfo.width;
					}

					if(textLayout.hasNext()) {
						offsetX = 0;
						offsetY = offsetY + lineGap;
					}
					else {
						offsetX = offsetX + lineInfo.width;
						node.lastLineWidth = lineInfo.width;
						break;
					}
				}
				else {
					break;
				}
			}
		}
		else if(node.type === "newline") {
			node.x = offsetX;
			node.y = offsetY; 
			
			offsetX = 0;
			offsetY = offsetY + lineGap;
		}
		else if(node.type === "newblock") {
			node.x = offsetX;
			node.y = offsetY; 
			
			offsetX = 0;
			offsetY = offsetY + lineGap * 1.5;
		}
		else if(node.type === "img") {
			if(node.imageLoaded) {
				var image = node.value;
				var ratio = image.height/image.width;
				var imageW = node.displayWidth ? node.displayWidth : image.width;
				var imageH = node.displayHeight ? node.displayHeight : image.height;

				node.y = offsetY + lineGap * 0.5;
				
				if(imageW < width) {
					node.w = imageW;
					node.x = Math.floor((width - imageW)/2);
					node.h = Math.floor(node.w * ratio);
				}
				else {
					node.x = 0;
					node.w = width;
					node.h = Math.floor(node.w * ratio);
				}
			
				offsetY = node.y + node.h;
				offsetY = offsetY + 0.5 * lineGap;
			}
			else {
				offsetY = offsetY + lineGap;
			}
			offsetX = 0;
		}

		this.scrollRange = offsetY;
	}

	return;
}

UISimpleHTML.prototype.getScrollRange = function() {
	return this.scrollRange ? this.scrollRange : this.h;	
}


UISimpleHTML.prototype.loadUrl = function(dataUrl, onLoadDone) {
	var rInfo = {};
	var shape = this;

	rInfo.method = "GET";
	rInfo.url = dataUrl;
	rInfo.headers = {"Cache-Control":"no-cache", "Pragma":"no-cache"};

	rInfo.onDone = function(result, xhr, respContent) {
		var success = (xhr.status === 200);
		if(xhr.status === 200) {
			var data = respContent;
			try {
				shape.setText(data);
				console.log("loadUrl: done");
			}
			catch(e) {
				success = false;
				console.log("loadUrl: failed" + e.message);
			}
		}
		
		if(onLoadDone) {
			onLoadDone(success);
		}

		return;
	}

	httpDoRequest(rInfo);

	return;
}

UISimpleHTML.prototype.setText = function(text) {
	this.text = this.toText(text);

	this.elements = [];
	var el = document.createElement("div");
	el.innerHTML = this.text;
	
	this.bold = 0;
	this.anchor = 0;
	this.italic = 0;
	this.underline = 0;
	this.strong = 0;
	this.colors = [];
	
	this.extractHtmlElements(el, 0);

	delete this.colors;
	delete this.anchor;
	delete this.bold;
	delete this.italic;
	delete this.underline;
	delete this.strong;

	this.textNeedRelayout = true;

	return;
}

UISimpleHTML.prototype.layoutHtml = function(canvas) {
	if(!this.textNeedRelayout) {
		return;
	}

	if(!this.text) {
		return;
	}

	this.layoutHtmlElements(canvas);

	this.textNeedRelayout = false;

	return;
}

UISimpleHTML.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UISimpleHTML.prototype.paintSelfOnly = function(canvas) {
	if(this.drawCache(canvas)) {
		return;
	}

	var i = 0;
	var x = 0;
	var y = 0;
	var b = 0;
	var h = this.h;
	var w = this.w;
	var node = null;
	var hMargin = this.hMargin;
	var width = this.getWidth(true);
	var fontSize = this.style.fontSize;	
	var lineGap = 2 * fontSize;
	var offsetX = this.hMargin;
	var offsetY = -this.offset + this.vMargin;
	var fontStr = fontSize + "pt " + this.style.fontFamily; 

	this.layoutHtml(canvas);

	canvas.save();
	canvas.rect(0, 0, w, h);
	canvas.clip();

	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fill();
	}
	canvas.beginPath();

	canvas.font = fontStr;
	canvas.textAlign = "left";
	canvas.textBaseline = "top";
	canvas.fillStyle = this.style.textColor;	

	var n = this.elements.length;
	var elements = this.elements;

	for(i = 0; i < n; i++) {
		node = elements[i];
		if(node.type === "text" && node.lines && node.lines.length) {
			var size = node.lines.length;
			canvas.font = node.fontStyle + fontStr;
			
			if(node.color) {
				canvas.fillStyle = node.color;
			}
			else if(node.anchor) {
				canvas.fillStyle = "Blue";
			}
			else {
				canvas.fillStyle = this.style.textColor;	
			}

			for(k = 0; k < size; k++) {
				if(k === 0) {
					x = node.x;
					y = node.y;
				}
				else {
					x = 0;
					y = node.y + k * (lineGap);
				}

				x = x + offsetX;
				y = y + offsetY;
				b = y + fontSize;
				if(y < h && b >=0) {
					width = w - x - hMargin;
					canvas.fillText(node.lines[k], x, y, width);
				}
			}
		}
		else if(node.type === "img" && node.imageLoaded) {
			var image = node.value;
			var imageW = image.width;
			var imageH = image.height;

			x = node.x + offsetX;
			y = node.y + offsetY;
			
			b = y + node.h;
			if(y < h && b >=0) {
				canvas.drawImage(image, 0, 0, imageW, imageH, x, y, node.w, node.h);
			}
		}
	}
	canvas.restore();

	return;
}

function UISimpleHTMLCreator() {
	var args = ["ui-simple-html", "ui-simple-html", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISimpleHTML();
		var initDoc = 'Simpe HTML';

		return g.initUISimpleHTML(this.type, initDoc, null);
	}
	
	return;
}


/*
 * File:   ui-sliding-menu.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Sliding Menu
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISlidingMenu() {
	return;
}

UISlidingMenu.prototype = new UIElement();
UISlidingMenu.prototype.isUISlidingMenu = true;

UISlidingMenu.prototype.initUISlidingMenu = function(type, w, h) {
	this.initUIElement(type);	

	this.offset = 0;
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.setCanRectSelectable(false, false);
	this.images.display = CANTK_IMAGE_DISPLAY_9PATCH;

	return this;
}

UISlidingMenu.prototype.onAppendedInParent = function() {
	var menu = this.getMenu();

	if(!menu) {
		return;
	}

	if(this.offset) {
		this.setOffset(menu.w);
	}
	else {
		this.setOffset(0);
	}

	return;
}

UISlidingMenu.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPage && this.children.length < 2;
}

UISlidingMenu.prototype.afterChildAppended = function(shape) {
	shape.setUserMovable(false);

	if(this.children.length > 1 && this.mode == C_MODE_EDITING) {
		var menu = this.getMenu();
		this.setOffset(menu.w);
	}

	return;
}

UISlidingMenu.prototype.onDoubleClick = function(point, beforeChild) {
	if(beforeChild || this.mode != C_MODE_EDITING) {
		return;
	}

	if(this.offset) {
		this.hideMenu();
	}
	else {
		this.showMenu();
	}

	return;
}

UISlidingMenu.prototype.getMenu = function() {
	if(this.children.length > 0) {
		return this.children[0];
	}

	return null;
}

UISlidingMenu.prototype.getContent = function() {
	if(this.children.length >  1) {
		return this.children[1];
	}

	return null;
	
}

UISlidingMenu.prototype.showMenu = function() {
	var menu = this.getMenu();

	if(menu) {
		this.scrollTo(menu.w);
	}

	return;
}

UISlidingMenu.prototype.hideMenu = function() {
	var menu = this.getMenu();

	if(menu) {
		this.scrollTo(0);
	}

	return;
}

UISlidingMenu.prototype.relayoutChildren = function() {
	var menu = null;
	var content = null;
	var n = this.children.length;

	if(!n) {
		return;
	}

	if(n === 1) {
		menu = this.children[0];

		menu.y = 0;
		menu.x = 0;
		menu.h = this.h;
		menu.xAttr = C_X_FIX_LEFT;
		menu.yAttr = C_Y_FIX_TOP;
		menu.widthAttr = C_WIDTH_SCALE;
		menu.heightAttr = C_HEIGHT_FILL_PARENT;
		menu.relayout();
		
		return;
	}
	else {
		menu = this.children[0];
		content = this.children[1];

		var oldMenuW = menu.w;

		menu.y = 0;
		menu.h = this.h;
		menu.xAttr = C_X_FIX_LEFT;
		menu.yAttr = C_Y_FIX_TOP;
		menu.widthAttr = C_WIDTH_SCALE;
		menu.heightAttr = C_HEIGHT_FILL_PARENT;
		menu.relayout();
		
		if(oldMenuW === this.offset) {
			this.offset = menu.w;
		}

		var ratio = this.offset/menu.w;
		menu.x = -Math.round(0.5 * ((1-ratio) * menu.w));
	
		content.y = 0;
		content.x = this.offset;
		content.h = this.h;
		content.w = this.w;
		content.xAttr = C_X_FIX_LEFT;
		content.widthAttr = C_WIDTH_FIX;
		content.heightAttr = C_HEIGHT_FILL_PARENT;

		menu.relayoutChildren();
		content.relayoutChildren();
	}

	return;
}

UISlidingMenu.prototype.getMinOffset = function() {
	return 0;
}

UISlidingMenu.prototype.getMaxOffset = function() {
	var menu = this.getMenu();

	return menu ? menu.w : 0;
}

UISlidingMenu.prototype.scrollTo = function(offsetEnd) {
	var me = this;
	var duration = 500;
	var offsetStart = this.offset;
	var range = offsetEnd - offsetStart;
	var startTime = (new Date()).getTime();
	var interpolator =  new DecelerateInterpolator();

	this.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);

		if(timePercent < 1) {
			me.setOffset(Math.floor(offsetStart + percent * range));
			setTimeout(animStep, 10);
		}
		else {
			me.setOffset(offsetStart + range);
			delete startTime;
			delete interpolator;
			delete me.animating;
		}

		delete now;
	}

	setTimeout(function() {
		animStep();
	}, 10);

	return;
}

UISlidingMenu.prototype.setOffset = function(offset) {
	var menu = this.getMenu();
	this.offset = offset;

	if(menu) {
		if(this.offset < 0) {
			this.offset = 0;
		}

		if(this.offset > menu.w) {
			this.offset = menu.w;
		}
	}

	this.relayoutChildren();
	this.postRedraw();

	return;
}

UISlidingMenu.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();
	this.saveOffset = this.offset;

	return true;
}

UISlidingMenu.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}
	this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	
	this.addMovementForVelocityTracker();

	var dx = this.getMoveAbsDeltaX();
	var dy = this.getMoveAbsDeltaY();

	if(Math.abs(dx) > Math.abs(dy)) {
		this.setOffset(this.saveOffset + dx);
	}

	return;
}
	
UISlidingMenu.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}
	this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);

	var dx = this.getMoveAbsDeltaX();
	var dy = this.getMoveAbsDeltaY();

	if(Math.abs(dx) < Math.abs(dy)) {
		return;
	}

	var velocity = this.velocityTracker.getVelocity().x;
	var distance = dx + velocity/2;

	if(Math.abs(distance) < 10) {
		var menu = this.getMenu();
		if(this.offset > 10 && menu && (point.x > (menu.x + menu.w))) {
			this.hideMenu();
		}
		else {
			this.setOffset(this.saveOffset);
		}

		return;
	}

	var minOffset = this.getMinOffset();
	var maxOffset = this.getMaxOffset();
	var offset = this.saveOffset + dx + velocity;

	if(offset < minOffset) {
		offset = minOffset;
	}

	if(offset > maxOffset) {
		offset = maxOffset;
	}

	if(this.saveOffset > (minOffset + maxOffset)/2) {
		if(offset <= minOffset) {
			offset = minOffset;
		}
		else {
			offset = maxOffset;
		}
	}
	else {
		if(offset >= maxOffset) {
			offset = maxOffset;
		}
		else {
			offset = minOffset;
		}
	}

	this.scrollTo(offset);

	return;
}

UISlidingMenu.prototype.onInit = function() {
	if(this.offset) {
		var menu = this.getMenu();
		if(menu) {
			this.setOffset(menu.w);
		}
	}
	else {
		this.setOffset(0);
	}

	return;
}

UISlidingMenu.prototype.dispatchPointerDownToChildren = function(p) {
	var menu = this.getMenu();
	var content = this.getContent();

	var child = this.offset ? menu : content;

	if(menu && content && menu.x == content.x && menu.x == 0) {
		this.setOffset(0);
	}

	if(child && child.visible && child.onPointerDown(p)) {
		this.setTarget(child);

		return true;
	}

	return false;
}

UISlidingMenu.prototype.paintChildren = function(canvas) {
	canvas.save();	
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	this.defaultPaintChildren(canvas);

	canvas.restore();

	return;
}

function UISlidingMenuCreator() {
	var args = ["ui-sliding-menu", "ui-sliding-menu", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISlidingMenu();

		return g.initUISlidingMenu(this.type, 200, 200);
	}
	
	return;
}


/*
 * File:   ui-static-map.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Static Map 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIStaticMap() {
	return;
}

UIStaticMap.prototype = new UIImage();
UIStaticMap.prototype.isUIStaticMap = true;

UIStaticMap.prototype.initUIStaticMap = function(type) {
	this.initUIImage(type, 200, 200, null);

	return this;
}

UIStaticMap.prototype.setMapProvider = function(value) {
	this.mapProvider = value;

	return;
}

UIStaticMap.prototype.setMapType = function(value) {
	this.mapType = value;

	return;
}

UIStaticMap.prototype.setMapZoom = function(value) {
	this.mapZoom = value;

	return;
}

UIStaticMap.prototype.setMapCenter = function(value) {
	this.mapCenter = value;

	return;
}

UIStaticMap.prototype.setMapWidth = function(value) {
	this.mapWidth = value;

	return;
}

UIStaticMap.prototype.setMapHeight = function(value) {
	this.mapHeight = value;

	return;
}

UIStaticMap.prototype.setMapExtraParams = function(value) {
	this.mapEtraParams = value;

	return;
}

UIStaticMap.prototype.getMapType = function() {
	return this.mapType ? this.mapType : "";
}

UIStaticMap.prototype.getMapProvider = function() {
	return this.mapProvider ? this.mapProvider : "google";
}

UIStaticMap.prototype.getMapZoom = function() {
	return this.mapZoom ? this.mapZoom : 10;
}

UIStaticMap.prototype.getMapWidth = function() {
	return this.mapWidth ? this.mapWidth : 600;
}

UIStaticMap.prototype.getMapHeight = function() {
	return this.mapHeight ? this.mapHeight : 600;
}

UIStaticMap.prototype.getMapCenter = function() {
	if(!this.mapCenter && this.currentLocation) {
		return this.currentLocation;
	}
	else {
		return this.mapCenter ? this.mapCenter : "China";
	}
}

UIStaticMap.prototype.getMapExtraParams = function() {
	return this.mapEtraParams ? this.mapEtraParams : "";
}

//http://developer.baidu.com/map/staticimg.htm
//https://developers.google.com/maps/documentation/staticmaps/?hl=zh-CN&csw=1

UIStaticMap.prototype.getMapURL = function() {
	var url = "";
	if(this.mapProvider === "baidu") {
		url = "http://api.map.baidu.com/staticimage?center="+this.getMapCenter()
			+ "&width=" + this.getMapWidth()
			+ "&height="+ this.getMapHeight()
			+ "&zoom=" + this.getMapZoom()
			+ this.getMapExtraParams();
	}
	else if(this.mapProvider === "google"){
		url = "http://maps.googleapis.com/maps/api/staticmap?center="+this.getMapCenter()
			+ "&size=" + this.getMapWidth() + "x"+this.getMapHeight()
			+ "&zoom=" + this.getMapZoom()
			+ "&maptype=" + this.getMapType() + "&sensor=true"
			+ this.getMapExtraParams();
	}

	console.log("Map URL:" + url);

	return url;
}

UIStaticMap.prototype.updateMap = function() {
	var url = this.getMapURL();

	this.setImageSrc(url);

	return;
}

UIStaticMap.prototype.onInit = function() {
	var map = this;
	
	function onCurrentLocation(position) {
		map.currentLocation = position.coords.latitude+","+position.coords.longitude;
		map.updateMap();

		return;
	}

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onCurrentLocation);
	}
	this.updateMap();

	return;
}

UIStaticMap.prototype.drawImage =function(canvas) {

	this.drawBgImage(canvas);

	return;
}

function UIStaticMapCreator() {
	var args = ["ui-static-map", "ui-static-map", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIStaticMap();
		return g.initUIStaticMap(this.type);
	}
	
	return;
}

/*
 * File:   ui-status-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Status Bar 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIStatusBar() {
	return;
}

UIStatusBar.prototype = new UIElement();
UIStatusBar.prototype.isUIStatusBar = true;

UIStatusBar.prototype.initUIStatusBar = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.images.display = CANTK_IMAGE_DISPLAY_SCALE;
	this.widthAttr = C_WIDTH_FILL_PARENT;

	return this;
}

UIStatusBar.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton) {
		return true;
	}

	return false;
}

UIStatusBar.prototype.afterChildAppended = function(shape) {
	shape.yAttr = C_Y_MIDDLE_IN_PARENT;
	if(this.type === "ui-menu-bar") {
		shape.hideSelectMark = true;
		shape.textType = C_SHAPE_TEXT_NONE;
		this.hideSelectMark = true;
	}

	return true;
}

UIStatusBar.prototype.beforeRelayoutChild = function(shape) {
	shape.yAttr = C_Y_MIDDLE_IN_PARENT;

	return true;
}

function UIStatusBarCreator(type, w, h, bg) {
	var args = [type, "ui-status-bar", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIStatusBar();
		return g.initUIStatusBar(this.type, w, h, bg);
	}
	
	return;
}


/*
 * File:   ui-suggestion.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Suggestion Input
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function SuggestionProvider() {
	this.query = function(key, onDone) {
	}

	this.init = function(options) {
	}

	return;
}

function StaticSuggestionProvider() {
	this.init = function(options) {
		if(typeof options == "string") {
			options = options.split("\n");
		}

		this.options = options;
		if(this.options) {
			this.options.sort();
		}

		return;
	}

	this.query = function(key, onDone) {
		if(!key || !this.options) {
			onDone([]);
			return;
		}

		function compareStr(str1, str2) {
			if(str1.indexOf(str2) == 0) {
				return 0;
			}

			if(str1 < str2) {
				return -1;
			}
			else {
				return 1;
			}
		}

		var arr = [];
		var start = this.options.binarySearch(key, compareStr);
		
		if(start >= 0) {
			var n = this.options.length;
			
			for(;start >= 0; start--) {
				var iter = this.options[start];
				if(iter.indexOf(key) !== 0) {
					start = start+1;
					break;
				}
			}

			for(var i = start; i < n; i++) {
				var iter = this.options[i];
				if(iter.indexOf(key) === 0) {
					arr.push(iter);
				}
				else {
					break;
				}
			}
		}

		onDone(arr);

		return;
	}

	return;
}

function createSuggestionProvider(type, args) {
	var suggestionProvider = null;
	if(type === "static") {
		suggestionProvider = new StaticSuggestionProvider();
	}

	if(suggestionProvider) {
		suggestionProvider.init(args);
	}

	return suggestionProvider;
}

function UISuggestion() {
	return;
}

UISuggestion.prototype = new UIListView();
UISuggestion.prototype.isUISuggestion = true;

UISuggestion.prototype.initUISuggestion = function(type) {
	this.initUIListView(type, 5, 100, null);	
	this.maxSuggestionItems = 10;
	this.suggestionProviderParams = "";
	this.suggestionProviderName = "static";

	return this;
}

UISuggestion.prototype.onInit = function() {
	this.suggestionProvider = createSuggestionProvider(this.suggestionProviderName, this.suggestionProviderParams);

	return;
}

UISuggestion.prototype.setSuggestionProvider = function(suggestionProvider) {
	this.suggestionProvider = suggestionProvider;

	return;
}

UISuggestion.prototype.getSuggestionProvider = function() {
	return this.suggestionProvider;
}

//override this.
UISuggestion.prototype.onSuggestionSelected = function(str) {

}

UISuggestion.prototype.showSuggestion = function(suggestions) {
	var data = {children:[]};
	
	if(suggestions.length > this.maxSuggestionItems) {
		suggestions.length = this.maxSuggestionItems;
	}

	for(var i = 0; i < suggestions.length; i++) {
		var item = {children:[]};
		var value = suggestions[i];
		item.children.push({text: value});
		data.children.push(item);
	}
		
	this.bindData(data, null, true);

	return;

}

UISuggestion.prototype.onSuggestionShow = function() {
}

UISuggestion.prototype.query = function(key) {
	var me = this;
	this.suggestionProvider.query(key, function(arr) {
		me.showSuggestion(arr);
		me.onSuggestionShow();
	});
}

function UISuggestionCreator() {
	var args = ["ui-suggestion", "ui-suggestion", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISuggestion();
		return g.initUISuggestion(this.type);
	}
	
	return;
}

/*
 * File:   ui-switch.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Switch
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISwitch() {
	return;
}

UISwitch.prototype = new UICheckBox();
UISwitch.prototype.isUISwitch = true;

UISwitch.prototype.initUISwitch = function(type, w, h, maskWidth, img) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.images.display = CANTK_IMAGE_DISPLAY_CENTER;
	this.setImage(CANTK_IMAGE_DEFAULT, img);
	
	this.value = true;
	this.imageWidth = 412;
	this.maskWidth = maskWidth;
	this.offsetImage = maskWidth;
	this.addEventNames(["onChanged"]);
	this.interpolator =  new DecelerateInterpolator(2);

	return this;
}

UISwitch.prototype.updateImageSize = function(imageWidth) {
	this.imageWidth = imageWidth;
	this.maskWidth = Math.floor(imageWidth * 0.373786);

	if(!this.animating) {
		this.offsetImage = this.value ? this.maskWidth : (this.imageWidth - this.maskWidth);
	}

	return;
}

UISwitch.prototype.animateChange = function() {
	var switcher = this;
	var date  = new Date();
	var startTime = date.getTime();
	var startOffset = this.offsetImage;
	var endOffset = this.value ? this.maskWidth : (this.imageWidth - this.maskWidth);
	var range = endOffset - startOffset;
	this.animating = true;
	var duration = 500;
	function offsetIt() {
		var now = new Date();
		var nowTime = now.getTime();
		var timePercent = (nowTime - startTime)/duration;
		var percent = switcher.interpolator.get(timePercent);
		var offset = startOffset + range * percent;	

		if(timePercent < 1) {
			switcher.offsetImage = offset;
			setTimeout(offsetIt, 10);
		}
		else {
			switcher.offsetImage = endOffset;
			delete this.animating;
		}
		switcher.postRedraw();
		delete now;

		return;
	}
	
	setTimeout(offsetIt, 30);

	return;
}

UISwitch.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.mode !== C_MODE_EDITING) {
		return;
	}
	this.setValue(!this.value);

	return;
}

UISwitch.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.pointerDownPosition = point;

	return;
}

UISwitch.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	var dx = point.x - this.pointerDownPosition.x;
	if(Math.abs(dx) < 5) {
		this.setValue(!this.value);
	}
	else {
		this.setValue(dx > 0);
	}

	return;
}

UISwitch.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChanged(this.value);
		this.animateChange();
	}

	return;
}

UISwitch.prototype.drawBgImage =function(canvas) {
	return;
}

UISwitch.prototype.drawFgImage =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(image) {
		this.updateImageSize(image.width);
		var h = image.height;
		var w = this.maskWidth;
		var dx = (this.w - w)/2;
		var dy = (this.h - h)/2;

		this.imageWidth = image.width;
		canvas.drawImage(image, this.offsetImage, 0, w, h, dx, dy, w, h);

		/*draw mask Image*/
		canvas.drawImage(image, 0, 0, w, h, dx, dy, w, h);
	}

	return;
}

function UISwitchCreator(w, h, maskWidth, img) {
	var args = ["ui-switch", "ui-switch", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISwitch();
		return g.initUISwitch(this.type, w, h, maskWidth, img);
	}
	
	return;
}

/*
 * File:   ui-tips.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Tips
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UITips() {
	return;
}

UITips.prototype = new UIElement();
UITips.prototype.isUITips = true;

UITips.prototype.initUITips = function(type, bg) {
	this.initUIElement(type);	

	this.roundRadius = 8;
	this.setDefSize(200, 200);
	this.setClickable(true);
	this.setTextType(C_SHAPE_TEXT_TEXTAREA);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.pointerDirection = UITips.BOTTOM;
	this.pointerOffset = 1;
	this.pointer = {x:0, y:0};
	this.setMargin(20, 20);
	this.setSizeLimit(80, 80);
	this.autoAdjustHeight = true;

	this.style.setShadow(true, {x:0, y:0, shadowBlur:10, color: "white"});

	return this;
}

UITips.TOP = 0;
UITips.LEFT = 1;
UITips.RIGHT = 2;
UITips.BOTTOM = 3;

UITips.prototype.getPointer = function() {
	var x = 0;
	var y = 0;
	var minX = this.roundRadius+this.hMargin*2;
	var minY = this.roundRadius+this.vMargin*2;

	switch(this.pointerDirection) {
		case UITips.TOP: 
		case UITips.BOTTOM: {
			x = this.pointerOffset * this.w;
			x = Math.max(x, minX);
			x = Math.min(x, this.w-minX);

			y = this.pointerDirection === UITips.TOP ? 0 : this.h;
			break
		}
		case UITips.LEFT: 
		case UITips.RIGHT: { 
			y = this.pointerOffset * this.h;
			y = Math.max(y, minY);
			y = Math.min(y, this.h-minY);

			x = this.pointerDirection === UITips.LEFT ? 0 : this.w;
			break
		}
	}

	return {x:x, y:y};
}

UITips.prototype.getMoreSelectMark = function(type, point) {
	if(type === C_HIT_TEST_HANDLE) {
		point.x = this.pointer.x;
		point.y = this.pointer.y;

		return true;
	}

	return false;
}

UITips.prototype.moveHandle = function(dx, dy) {
	var hw = 0.5 * this.w;
	var hh = 0.5 * this.h;
	var delta = this.roundRadius + this.hMargin;
	var pointer = this.pointer;

	pointer.x += dx;
	pointer.y += dy;

	var x = pointer.x >= 0 ? pointer.x : 0;
	x = x < this.w ? x : this.w;

	var y = pointer.y >= 0 ? pointer.y : 0;
	y = y < this.h ? y : this.h;

	if(pointer.y < delta) {
		this.pointerOffset = (x/this.w);
		this.pointerDirection = UITips.TOP;	
	}
	else if(pointer.y < (this.h-delta)){
		this.pointerOffset = (y/this.h);
		this.pointerDirection = pointer.x < hw ? UITips.LEFT : UITips.RIGHT;	
	}
	else {
		this.pointerOffset = (x/this.w);
		this.pointerDirection = UITips.BOTTOM;	
	}

	this.pointer = pointer;

	return;
}


UITips.prototype.setAutoAdjustHeight = function(autoAdjustHeight) {
	this.autoAdjustHeight = autoAdjustHeight;

	return true;
}

UITips.prototype.setClickable = function(clickable) {
	this.clickable = clickable;

	return;
}

UITips.prototype.drawPath = function(canvas) {
	var x = this.hMargin/2;
	var y = this.vMargin/2;
	var w = this.getWidth(true) + this.hMargin;
	var h = this.getHeight(true) + this.vMargin;
	var pointer = this.getPointer();
	var px = pointer.x;
	var py = pointer.y;
	var delta = this.hMargin * 0.75;
	var r = this.roundRadius;
	
	var rx = x + w - r;
	var ry = y + h - r;
	var rw = x + w;
	var rh = y + h;

	/*top*/
	if(py <= y && (px > x && px < rw)) {
		py = 0;

		if(px < (x + r + delta)) {
			px = x + r + delta;
		}
		canvas.moveTo(px-delta, y);
		canvas.lineTo(px, py);
		canvas.lineTo(px+delta, y);
		canvas.lineTo(rx, y);
		canvas.arc(rx, y+r, r, 1.5*Math.PI, 2*Math.PI,  false);
		canvas.lineTo(rw, ry);
		canvas.arc(rx, ry, r, 0, 0.5*Math.PI, false);
		canvas.lineTo(x+r, rh);
		canvas.arc(x+r, ry, r, 0.5*Math.PI, Math.PI, false);
		canvas.lineTo(x, r+y);
		canvas.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI, false);
		canvas.lineTo(px-delta, y);
	}
	else if(py > y && (px > x && px < rw)) {
		/*bottom*/
		py = this.h;
		if(px < (x + r + delta)) {
			px = x + r + delta;
		}

		canvas.moveTo(x+r, y);
		canvas.arc(rx, y+r, r, 1.5*Math.PI, 2*Math.PI,  false);
		canvas.lineTo(rw, ry);
		canvas.arc(rx, ry, r, 0, 0.5*Math.PI, false);

		canvas.lineTo(px + delta, rh);
		canvas.lineTo(px, py);
		canvas.lineTo(px - delta, rh);

		canvas.arc(x+r, ry, r, 0.5*Math.PI, Math.PI, false);
		canvas.lineTo(x, r+y);
		canvas.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI, false);
	}
	else if(px <= x && (py > y && py < rh)) {
	/*left*/
		px = 0;

		if(py < (y + r + delta)) {
			py = y + r + delta;
		}

		canvas.moveTo(x+r, y);
		canvas.arc(rx, y+r, r, 1.5*Math.PI, 2*Math.PI,  false);
		canvas.lineTo(rw, ry);
		canvas.arc(rx, ry, r, 0, 0.5*Math.PI, false);
		canvas.lineTo(x+r, rh);
		canvas.arc(x+r, ry, r, 0.5*Math.PI, Math.PI, false);

		canvas.lineTo(x, py+delta);
		canvas.lineTo(px, py);
		canvas.lineTo(x, py-delta);

		canvas.lineTo(x, r+y);
		canvas.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI, false);
	}
	else if(px > x && (py > y && py < rh)) {
		/*right*/
		px = this.w;

		if(py < (y + r + delta)) {
			py = y + r + delta;
		}

		canvas.moveTo(x+r, y);
		canvas.arc(rx, y+r, r, 1.5*Math.PI, 2*Math.PI,  false);

		canvas.lineTo(rw, py-delta);
		canvas.lineTo(px, py);
		canvas.lineTo(rw, py+delta);

		canvas.lineTo(rw, ry);
		canvas.arc(rx, ry, r, 0, 0.5*Math.PI, false);
		canvas.lineTo(x+r, rh);
		canvas.arc(x+r, ry, r, 0.5*Math.PI, Math.PI, false);

		canvas.lineTo(x, r+y);
		canvas.arc(x+r, y+r, r, Math.PI, 1.5*Math.PI, false);
	}

	return;
}

UITips.prototype.paintSelfOnlyAndroid =function(canvas) {
	canvas.beginPath();
	this.drawPath(canvas);
	canvas.fill();
	
	canvas.lineWidth = (this.pointerDown && this.clickable) ? 6 : 3;
	canvas.strokeStyle = "Gray";
	canvas.stroke();
	
	canvas.lineWidth = 1;
	canvas.strokeStyle = this.style.lineColor;
	canvas.stroke();

	return;
}

UITips.prototype.paintSelfOnly =function(canvas) {
	if(this.autoAdjustHeight && (!this.children || !this.children.length)) {
		var textHeight = this.getTextHeight();
		this.h = textHeight + this.vMargin * 2 + this.style.fontSize;
	}

	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
		if(isAndroid()) {
			/*Avoid Shadow Bugs on android.*/
			return this.paintSelfOnlyAndroid(canvas);
		}

		var style = this.style;
		canvas.shadowColor   = style.shadow.color;
		canvas.shadowOffsetX = style.shadow.x;
		canvas.shadowOffsetY = style.shadow.y;
		canvas.shadowBlur    = style.shadow.blur;
		canvas.beginPath();
		this.drawPath(canvas);
		canvas.fill();

		if(this.pointerDown && this.clickable) {
			canvas.lineWidth = 3;
			canvas.shadowBlur = 2 * canvas.shadowBlur;
		}
		else {
			canvas.lineWidth = 2;
			canvas.shadowBlur = 0;
		}
		canvas.stroke();
		
		canvas.shadowBlur = 0;
	}

	return;
}

UITips.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage;
}

function UITipsCreator() {
	var args = ["ui-tips", "ui-tips", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITips();
		return g.initUITips(this.type, null);
	}
	
	return;
}

/*
 * File:   ui-toolbar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Toolbar
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIToolBar() {
	return;
}

UIToolBar.prototype = new UIElement();
UIToolBar.prototype.isUIToolBar = true;

UIToolBar.prototype.initUIToolBar = function(type, atTop, h, bg) {
	this.initUIElement(type);	

	this.xAttr = C_X_LEFT_IN_PARENT;
	this.widthAttr = C_WIDTH_FILL_PARENT;
	this.yAttr = atTop ? C_Y_TOP_IN_PARENT : C_Y_BOTTOM_IN_PARENT;

	this.setDefSize(200, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, bg);
	this.setSizeLimit(100, 50, 2000, 200);

	return this;
}

UIToolBar.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage || shape.isUIButton || shape.isUIGroup || shape.isUIButtonGroup || shape.isUIEdit
	|| shape.isUICheckBox || shape.isUIRadioBox || shape.isUIProgressBar || shape.isUISwitch 
	|| shape.isUILedDigits || shape.isUIGroup || shape.isUILayout || shape.isUIWaitBar || shape.isUIColorBar) {
		return true;
	}

	return false;
}

UIToolBar.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}

function UIToolBarCreator(type, atTop, h, bg) {
	var args = [type, "ui-toolbar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIToolBar();
		return g.initUIToolBar(type, atTop, h, bg);
	}
	
	return;
}

/*
 * File:   ui-vedio.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vedio 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVideo() {
	return;
}

UIVideo.prototype = new UIHtml();
UIVideo.prototype.isUIVideo = true;

UIVideo.prototype.getHtmlContent = function() {
	var w = this.getWidth(true);
	var h = this.getHeight(true);
	var src = this.value ? this.value : "";
	var loop = this.loop ? 'loop="loop" ' : "";
	var autoPlay = this.autoPlay ? 'autoplay="true" ' : "";
	var showControls = this.showControls ? 'controls="controls" ' :"";

	var html = '<video width="'+w+'" height="'+h+'" preload="true" '+ showControls + loop + autoPlay + 'src="'+src+'"></video>';

	return html;
}

UIVideo.prototype.beforeHideHTML = function() {
	video = this.getVideoElement();
	if(video.src && !video.puased) {
		video.pause();
	}

	return;
}

UIVideo.prototype.getVideoElement = function() {
	if(this.element) {
		var video = this.element.getElementsByTagName("video");
		return video.length ? video[0] : null;
	}

	return null;
}

UIVideo.prototype.setShowControls = function(value) {
	this.showControls = value;

	return;
}

UIVideo.prototype.isShowControls = function() {
	return this.showControls;
}

UIVideo.prototype.setLoop = function(value) {
	this.loop = value;

	return;
}

UIVideo.prototype.isLoop = function() {
	return this.loop;
}

UIVideo.prototype.setAutoPlay = function(value) {
	this.autoPlay = value;

	return;
}

UIVideo.prototype.isAutoPlay = function() {
	return this.autoPlay;
}

UIVideo.prototype.initUIVideo = function(type) {
	this.initUIHtml(type, 400, 300);
	this.setValue("http://www.w3school.com.cn/i/movie.ogg");
	this.setImage(CANTK_IMAGE_DEFAULT, null);

	return this;
}

function UIVideoCreator() {
	var args = ["ui-video", "ui-video", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVideo();
		return g.initUIVideo(this.type);
	}
	
	return;
}


/*
 * File:   ui-view-pager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  View Page (AKA Tab Control)
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIViewPager() {
	return;
}

UIViewPager.prototype = new UIPageManager();
UIViewPager.prototype.isUIViewPager = true;

UIViewPager.prototype.initUIViewPager = function(type) {
	this.initUIPageManager(type);	

	this.current = 0;
	this.setDefSize(200, 200);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.widthAttr = C_WIDTH_FILL_PARENT;
	this.heightAttr = C_HEIGHT_FILL_PARENT;

	return this;
}

UIViewPager.prototype.getFrameIndicatorParams = function() {
	var n = this.children.length;
	var itemSize = Math.min((0.5 * this.w)/n, 40);
	var indicatorWidth = itemSize * n;

	var dx = (this.w - indicatorWidth)/2;
	var dy = 0.8 * this.h;

	return {offsetX:dx, offsetY:dy, itemSize:itemSize, n:n};
}

UIViewPager.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.animating) {
		return;
	}

	if(!this.needShowIndicator()) {
		return;
	}

	var params = this.getFrameIndicatorParams();

	var x = point.x;
	var y = point.y;
	var n = params.n;
	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;

	if(y < dy || y > (dy + itemSize) || x < dx || x > (dx + n * itemSize)) {
		return;
	}

	for(var i = 0; i < n; i++) {
		if(x > dx && x < (dx + itemSize)) {
			this.setCurrent(i);	
			break;
		}

		dx += itemSize;
	}

	return;
}

UIViewPager.prototype.drawFrameIndicator = function(canvas, currFrame) {
	var params = this.getFrameIndicatorParams();

	var n = params.n;
	var dx = params.offsetX;
	var dy = params.offsetY;
	var itemSize = params.itemSize;

	dx += itemSize/2;
	dy += itemSize/2;

	var r = 15;
	canvas.fillStyle = this.style.fillColor;
	for(var i = 0; i < n; i++) {
		canvas.beginPath();
		canvas.arc(dx, dy, r, 0, Math.PI * 2);
		dx += itemSize;
	
		if(i === currFrame) {
			canvas.save();
			canvas.shadowColor = this.style.lineColor;
			canvas.shadowBlur = 5;
			canvas.shadowOffsetX = 0;
			canvas.shadowOffsetY = 0;

			canvas.fill();
			canvas.stroke();
			canvas.restore();
		}
		else {
			canvas.fill();
		}
	}

	return;
}

UIViewPager.prototype.needShowIndicator = function() {
	if(this.pageIndicator) {
		return false;
	}

	if(this.mode === C_MODE_EDITING || this.showIndicator) {
		return true;
	}

	return false;
}

UIViewPager.prototype.afterPaintChildren = function(canvas) {
	if(this.needShowIndicator()) {
		this.drawFrameIndicator(canvas, this.current);
	}

	return;
}

UIViewPager.prototype.getPrevFrame = function() {
	var n = this.children.length;
	var index = (this.current - 1 + n)%n;

	return this.children[index];
}

UIViewPager.prototype.getNextFrame = function() {
	var n = this.children.length;
	var index = (this.current + 1)%n;

	return this.children[index];
}

UIViewPager.prototype.animScrollTo = function(range, newFrame) {

	var duration = 1000;
	var slideview = this;
	var startOffset = this.offset;
	var startTime = (new Date()).getTime();
	var interpolator = new DecelerateInterpolator(2);

	if(slideview.animating) {
		return;
	}

	slideview.animating = true;
	function animStep() {
		var now = new Date();
		var timePercent = (now.getTime() - startTime)/duration;
		var percent = interpolator.get(timePercent);
		
		if(timePercent < 1) {
			slideview.offset = startOffset + range * percent;
			setTimeout(animStep, 10);
		}
		else {
			slideview.offset = 0;
			slideview.setCurrent(newFrame);
			delete startTime;
			delete interpolator;
			delete slideview.animating;
		}

		delete now;
		slideview.postRedraw();
	}

	animStep();

	return;
}

UIViewPager.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild || this.animating || !this.slideToChange) {
		return;
	}

	if(!this.velocityTracker) {
		this.velocityTracker = new VelocityTracker();
	}
	this.velocityTracker.clear();

	return true;
}

UIViewPager.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(!this.slideToChange) {
		return;
	}
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.current;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	}
	else {
		return;
	}

	var dx = Math.abs(this.getMoveAbsDeltaX());
	var dy = Math.abs(this.getMoveAbsDeltaY());
	
	if(dx > dy && dx > 10) {
		this.offset = this.getMoveAbsDeltaX();
	}
	else {
		this.offset = 0;
	}

	this.addMovementForVelocityTracker();

	return;
}
	
UIViewPager.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(!this.slideToChange) {
		return;
	}
	if(this.animating) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
		return;
	}
	if(this.getLastEventStatus() == UIElement.EVENT_STATUS_HANDLED) {
		return;
	}
	if(beforeChild) {
		return;
	}

	var frames = this.getFrames();
	var currFrame = this.current;
	var dx = this.getMoveAbsDeltaX();
	if((currFrame > 0 && dx > 0) || ((currFrame+1) < frames && dx < 0)) {
		this.setLastEventStatus(UIElement.EVENT_STATUS_HANDLED);
	}
	else {
		return;
	}

	var range = 0;
	var offsetX = this.offset;
	var newFrame = this.current;
	var dy = Math.abs(this.getMoveAbsDeltaY());
	var velocity = this.velocityTracker.getVelocity().x;

	if(Math.abs(offsetX) < 5 || dy > 60) {
		this.offset = 0;

		return;
	}

	var n = this.children.length;
	var distance = offsetX + velocity;

	if(Math.abs(distance) > this.w/3) {
		if(offsetX > 0) {
			range = this.w - offsetX;	
			newFrame = (this.current - 1 + n)%n;
		}
		else {
			range = -this.w - offsetX;
			newFrame = (this.current + 1)%n;
		}
	}
	else {
		range = -offsetX;
	}

	this.animScrollTo(range, newFrame);

	return;
}

UIViewPager.prototype.paintChildrenAnimating = function(canvas) {
	var currFrame = this.getCurrentFrame();
	var prevFrame = this.getPrevFrame();
	var nextFrame = this.getNextFrame();

	canvas.save();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();

	if(this.offset > 0) {
		var offsetX = this.w-this.offset;
		prevFrame.x = -offsetX;
		prevFrame.paintSelf(canvas);
		offsetX = this.offset;
		currFrame.x = offsetX;
		currFrame.paintSelf(canvas);
	}
	else {
		currFrame.x = this.offset;
		currFrame.paintSelf(canvas);
		nextFrame.x = this.w + this.offset;
		nextFrame.paintSelf(canvas);
	}
	currFrame.x = 0;
	nextFrame.x = 0;
	prevFrame.x = 0;
	canvas.restore();

	return;
}

UIViewPager.prototype.paintChildrenNormal = function(canvas) {
	var child = this.getCurrentFrame();
	
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}
	
	return;
}

UIViewPager.prototype.paintChildren = function(canvas) {
	if(this.offset && this.children.length > 1) {
		this.paintChildrenAnimating(canvas);
	}
	else {
		this.paintChildrenNormal(canvas);
	}

	return;
}

UIViewPager.prototype.setSlideToChange = function(value) {
	this.slideToChange = value;

	return;
}

UIViewPager.prototype.setShowIndicator = function(value) {
	this.showIndicator = value;

	return;
}

UIViewPager.prototype.onModeChanged = function() {
	this.setCurrent(0);

	return;
}

function UIViewPagerCreator() {
	var args = ["ui-view-pager", "ui-view-pager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIViewPager();

		return g.initUIViewPager(this.type);
	}
	
	return;
}

/*
 * File:   ui-v-scroll-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Vertical Scrollable Image
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIVScrollImage() {
	return;
}

UIVScrollImage.prototype = new UIVScrollView();

UIVScrollImage.prototype.initUIVScrollImage = function(type) {
	this.initUIVScrollView(type, 0, null, null);	
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.widthAttr = C_WIDTH_SCALE;
	this.heightAttr = C_HEIGHT_SCALE;
	this.setSize(200, 200);
	
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);

	return this;
}

UIVScrollImage.prototype.drawBgImage = function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);
	if(!image || !image.height) {
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(0, 0, this.w, this.h);
		return;
	}
	var scale = this.w/image.width;
	var range = image.height * scale;

	var x = 0; 
	var y = this.offset/scale;
	var w = image.width;
	var h = Math.min(this.h/scale, image.height-y);
	var dx = 0; 
	var dy = 0;
	var dw = this.w; 
	var dh = h * scale;

	canvas.drawImage(image, x, y, w, h, dx, dy, dw, dh);

	return;
}

UIVScrollImage.prototype.getScrollRange = function() {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);
	if(image && image.height && image.width) {
		var scale = this.w/image.width;

		return scale * image.height + 60;
	}
	else {
		return this.h;
	}
}

UIVScrollImage.prototype.afterPaintChildren = function(canvas) {
	this.drawScrollBar(canvas);

	if(this.mode === C_MODE_EDITING) {
		this.drawPageDownUp(canvas);
	}

	return;
}

function UIVScrollImageCreator() {
	var args = ["ui-v-scroll-image", "ui-v-scroll-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIVScrollImage();
		return g.initUIVScrollImage(this.type);
	}
	
	return;
}

/*
 * File:   ui-wait-bar.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Wait Bar
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIWaitBar() {
	return;
}

UIWaitBar.TILES = 8;
UIWaitBar.prototype = new UIElement();
UIWaitBar.prototype.isUIWaitBar = true;

UIWaitBar.prototype.initUIWaitBar = function(type, w, h, image, imageDisplay) {
	this.initUIElement(type);	

	this.offset = 0;
	this.running = false;
	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.images.display = imageDisplay;
	this.setImage(CANTK_IMAGE_DEFAULT, image);

	return this;
}

UIWaitBar.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIWaitBar.prototype.isRunning = function() {
	return this.running;
}

UIWaitBar.prototype.start = function() {
	this.running = true;

	return;
}

UIWaitBar.prototype.stop = function() {
	this.running = false;

	return;
}

UIWaitBar.prototype.drawBgImage =function(canvas) {
	var image = this.getHtmlImageByType(CANTK_IMAGE_DEFAULT);
	
	if(!image) {
		return;
	}

	var imageWidth = image.width;
	var imageHeight = image.height;
	var tileHeight = imageHeight/UIWaitBar.TILES;
	var yOffset = this.offset * tileHeight;

	var sx = 0;
	var sy = yOffset;
	var w = imageWidth;
	var h = imageHeight;
	var dw = this.w;
	var dh = this.h;
	var dx = (dw - imageWidth)/2;
	var dy = (dh - tileHeight)/2;
		
	if(imageWidth < 100 && imageHeight < 100) {
		sy = 0;
		dy = (dh - imageHeight)/2;
		canvas.save();
		canvas.translate(this.w/2, this.h/2);
		canvas.rotate(0.1*Math.PI*this.offset);
		canvas.translate(-this.w/2, -this.h/2);
		canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, imageWidth, imageHeight);
		canvas.restore();
	}
	else {
		switch(this.images.display) {
			case CANTK_IMAGE_DISPLAY_CENTER: {
				canvas.drawImage(image, sx, sy, w, tileHeight, dx, dy, w, tileHeight);
				break;
			}
			default: {
				canvas.drawImage(image, sx, sy, w, tileHeight, 0, dy, dw, tileHeight);
				break;
			}
		}	
	}

	return;
}

UIWaitBar.prototype.needRedraw = function() {
	if(!this.isVisible() || !this.running) {
		return false;
	}

	if(this.mode === C_MODE_EDITING) {
		return false;
	}

	return true;
}

function UIWaitBarCreator(type, w, h, image, imageDisplay) {
	var args = [type, "ui-wait-bar", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWaitBar();
		if(type !== C_CREATE_FOR_ICON) {
			setInterval(function() {
				if(g.needRedraw()) {
					g.offset = (g.offset + 1);
					if(g.type === "ui-wait-bar") {
						g.offset = g.offset%UIWaitBar.TILES;
					}
					g.postRedraw();
				}
			}, 100);
		}
		return g.initUIWaitBar(this.type, w, h, image, imageDisplay);
	}
	
	return;
}

/*
 * File:   ui-window-manager.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Window Manager
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIWindowManager() {
}

UIWindowManager.prototype = new UIFrames();
UIWindowManager.prototype.isUIWindowManager = true;

UIWindowManager.prototype.initUIWindowManager = function(type) {
	this.initUIFrames(type);
	this.history = new Array();

	this.showLoadingProgress = true;
	this.progressBarBorderColor = "White";
	this.progressBarFillColor = "Gold";
	this.progressTextColor = "Green";
	this.loadingTextColor = "White";
	this.loadingBgColor = "Black";

	return this;
}

UIWindowManager.prototype.beforeAddShapeIntoChildren = function(shape) {
	return !shape.isUIWindow;
}

UIWindowManager.prototype.initDefaultNameForChild = function(shape) {
	shape.name = "newwin";

	return;
}

UIWindowManager.prototype.getSplashWindow = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow && win.windowType === "splash") {
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.getMainWindow = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow && win.windowType === "main") {
			return win;
		}
	}
	
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		if(win.isUINormalWindow) {
			return win;
		}
	}

	return null;
}

UIWindowManager.prototype.getWindowNames = function() {
	var names = [];
	
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];
		names.push(win.name);
	}

	return names;
}

UIWindowManager.prototype.showInitWindow = function() {
	var initWin = null;
	if(this.children.length === 0) {
		return false;
	}

	this.history.clear();

	var startWinName = getQueryParameter("startwin");
	if(startWinName) {	
		initWin = this.findBestFitWindowByName(startWinName);
	}
	
	if(!initWin) {
		initWin = this.getSplashWindow();
		if(!initWin) {
			initWin = this.getMainWindow();
		}
	}

	if(initWin) {
		this.targetShape = initWin;
		console.log("showInitWindow: set targetShape:" + this.targetShape.name);

		initWin.relayout();
		index = this.getFrameIndex(initWin);
		this.showFrame(index);
		initWin.callOnBeforeOpen();
		initWin.callOnOpen();
		this.history.push(index);
		this.postRedraw();
	}

	return true;
}

UIWindowManager.prototype.callOnLoad = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		win.callOnLoad();
	}

	return true;
}

UIWindowManager.prototype.callOnUnload = function() {
	for(var i = 0; i < this.children.length; i++) {
		var win = this.children[i];

		win.callOnUnload();
	}

	return true;
}

UIWindowManager.prototype.systemInit = function() {
	this.callOnLoad();
	console.log("systemInit");

	return;
}

UIWindowManager.prototype.systemExit = function() {
	var curWin = this.getCurrentWindow();
	if(curWin) {
		curWin.hide();
	}
	this.callOnUnload();
	console.log("systemExit");

	return;
}

function preparseBackendCanvas(leftWin, RightWin) {
	var w = leftWin.w;
	var h = leftWin.h;
	var backendCanvas = BackendCanvasGet(2 * w, h);
	var context = backendCanvas.getContext("2d");
	context.clearRect(0, 0, 2*w, h);
	context.save();
	leftWin.paint(context);
	context.translate(w, 0);
	RightWin.paint(context);
	context.restore();

	return backendCanvas;
}

UIWindowManager.prototype.findBestFitWindowByName = function(name) {
	var win = null;
	var bestWin1 = null;
	var bestWin2 = null;
	var bestWin3 = null;
	var bestWin4 = null;
	var deviceConfig = this.getDeviceConfig();
	var bestWinName1 = name;
	var bestWinName2 = name + "-" + deviceConfig.platform;
	var bestWinName3 = bestWinName2 + "-" + deviceConfig.lcdDensity;
	var bestWinName4 = bestWinName3 + "-" + deviceConfig.screenW + "x" + deviceConfig.screenH;

	for(var i = 0; i < this.children.length; i++) {
		win = this.children[i];

		switch(win.name) {
			case bestWinName1: {
				if(deviceConfig.lcdDensity === win.lcddensity) {
					bestWin3 = win;
				}
				else if(!win.lcddensity || win.lcddensity === "all") {
					bestWin1 = win;
				}
				else {
					if(!bestWin1) {
						bestWin1 = win;
					}
				}

				break;
			}
			case bestWinName2: {
				bestWin2 = win;
				break;
			}
			case bestWinName3: {
				bestWin3 = win;
				break;
			}
			case bestWinName4: {
				bestWin4 = win;
				break;
			}
			default:break;
		}
	}

	if(bestWin4) {
		console.log("Find " + bestWin4.name);
		return bestWin4;
	}
	
	if(bestWin3) {
		console.log("Find " + bestWin3.name);
		return bestWin3;
	}
	
	if(bestWin2) {
		console.log("Find " + bestWin2.name);
		return bestWin2;
	}
	
	if(bestWin1) {
		console.log("Find " + bestWin1.name);
		return bestWin1;
	}

	return null;
}

UIWindowManager.prototype.openWindow = function(name, onClose, closeCurrent, initData) {
	var newWin = null;
	if(name) {
		newWin = this.findBestFitWindowByName(name);
	}
	else {
		newWin = this.getMainWindow();
	}

	if(!newWin) {
		alert("Can not find window: " + name);
		return;
	}

	if(newWin.pendingLoadChildren) {
		newWin.loadChildren();
	}

	if(this.isWindowOpen(newWin)) {
		console.log(newWin.name + " is open already.");
		return false;
	}

	if(!newWin) {
		console.log("Not findBestFitWindowByName window " + name);
		return false;
	}
	
	if(newWin.openPending) {
		newWin.openPending = false;
		console.log("This window is already open:" + name);
		return false;
	}

	if(!newWin.isUIWindow) {
		console.log("It is not a window: " + name);
		return false;
	}
	
	newWin.openPending = true;
	newWin.initData = initData;
	newWin.onClose = onClose;
	newWin.callOnBeforeOpen(initData);

	this.targetShape = newWin;
	console.log("openWindow: set targetShape:" + this.targetShape.name);

	if(newWin.isUINormalWindow) {
		return this.openNormalWindow(newWin, closeCurrent);
	}
	else {
		return this.openPopupWindow(newWin, closeCurrent);
	}
}

UIWindowManager.prototype.openPopupWindow = function(newWin, closeCurrent) {
	if(closeCurrent) {
		this.closeCurrentWindow(0, true);
	}

	var wm = this;
	var curWin = this.getCurrentFrame();

	newWin.relayout();
	function openPopupWindow() {
		newWin.show();
		curWin.setPopupWindow(newWin);
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);
	}

	if(curWin) {
		curWin.callOnSwitchToBack();
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = animationCreate(newWin.getAnimationName(true)); 
			var backendCanvas = preparseBackendCanvas(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, openPopupWindow);
			animation.setRectOfFront(newWin.x, newWin.y, newWin.w, newWin.h);
			animation.run();
		}
		else {
			openPopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.openNormalWindow = function(newWin, closeCurrent) {
	if(closeCurrent) {
		this.closeCurrentWindow(0, true);
	}

	var wm = this;
	var index = 0;

	newWin.relayout();	
	var curWin = this.getCurrentFrame();
	function closeAndOpenWindow() {

		index = wm.getFrameIndex(newWin);
		wm.showFrame(index);
		wm.history.push(index);
		curWin = wm.getCurrentFrame();
		wm.postRedraw();
		newWin.callOnOpen(newWin.initData);

		return;
	}

	if(curWin) {
		curWin.callOnSwitchToBack();
		if(newWin.isAnimationEnabled()) {
			var p = this.getPositionInScreen();
			var animation = animationCreate(newWin.getAnimationName(true)); 
			var backendCanvas = preparseBackendCanvas(curWin, newWin);
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, closeAndOpenWindow);
			animation.run();
		}
		else {
			setTimeout(closeAndOpenWindow, 10);
		}
	}
	else {
		closeAndOpenWindow();
	}
	
	return true;
}

UIWindowManager.prototype.getCurrentWindow = function() {
	var curWin = this.getCurrentFrame();
	var childWin = curWin.getPopupWindow();

	return childWin ? childWin : curWin; 
}

UIWindowManager.prototype.backToHomeWin = function() {
	var history = this.history;
	var n = history.length - 1;

	if(!n) {
		return;
	}

	if(n === 1) {
		this.closeCurrentWindow(0);

		return;
	}
	
	var mainWinIndex = history[0];
	var curWin = this.getCurrentWindow();
	var lastWin = this.getFrame(mainWinIndex);
	
	if(curWin.isAnimationEnabled()) {
		var p = this.getPositionInScreen();
		var animation = animationCreate(curWin.getAnimationName(false)); 
		var backendCanvas = preparseBackendCanvas(lastWin, curWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, function() {});
		animation.run();
	}

	for(var i = 0; i < n; i++) {
		this.closeCurrentWindow(0, true);
	}

	return;
}

UIWindowManager.prototype.closeCurrentWindow = function(retInfo, syncClose) {
	var curWin = this.getCurrentWindow();

	if(!curWin || curWin.mode === C_MODE_EDITING) {
		return  false;
	}
	
	if(curWin.isUINormalWindow) {
		return this.closeCurrentNormalWindow(curWin, retInfo, syncClose);
	} 
	else {
		return this.closeCurrentPopupWindow(curWin, retInfo, syncClose);
	}
}

UIWindowManager.prototype.closeCurrentPopupWindow = function(popupWin, retInfo, syncClose) {
	var wm = this;
	var curWin = this.getCurrentFrame();

	if(curWin) {
		function closePopupWindow() {
			curWin.removePopupWindow(popupWin);
			curWin.callOnSwitchToFront();
			wm.postRedraw();

			setTimeout(function() {
				popupWin.callOnClose(retInfo);
			}, 100);
		}

		if(popupWin.isAnimationEnabled() && !syncClose) {
			var p = this.getPositionInScreen();
			var animation = animationCreate(popupWin.getAnimationName(false)); 

			curWin.removePopupWindow(popupWin);
			var backendCanvas = preparseBackendCanvas(curWin, popupWin);
			curWin.setPopupWindow(popupWin);
		
			animation.setScale(this.getRealScale());
			animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, closePopupWindow);
			animation.setRectOfFront(popupWin.x, popupWin.y, popupWin.w, popupWin.h);
			animation.run();
		}
		else {
			closePopupWindow();
		}
	}

	return true;
}

UIWindowManager.prototype.closeCurrentNormalWindow = function(curWin, retInfo, syncClose) {
	var wm = this;
	var lastWin = null;

	if(this.history.length < 2) {
		return false;
	}

	lastWinIndex = this.history[this.history.length-2];
	lastWin = this.getFrame(lastWinIndex);

	function showLastWindow() {
		wm.showFrame(lastWinIndex);
		lastWin.callOnSwitchToFront();
		
		wm.postRedraw();

		setTimeout(function() {
			curWin.callOnClose(retInfo);
		}, 100);

		return;
	}
	
	wm.history.remove(wm.current);
	if(syncClose) {
		showLastWindow();
	}
	else if(curWin.isAnimationEnabled()) {
		var p = this.getPositionInScreen();
		var animation = animationCreate(curWin.getAnimationName(false)); 
		var backendCanvas = preparseBackendCanvas(lastWin, curWin);
		animation.setScale(this.getRealScale());
		animation.prepare(p.x, p.y, this.w, this.h, backendCanvas, showLastWindow);
		animation.run();
	}
	else {
		setTimeout(showLastWindow, 10);
	}

	return;
}

UIWindowManager.prototype.isWindowOpen = function(win) {
	for(var i = 0; i < this.history.length; i++) {
		var index = this.history[i];
		var iter = this.children[index];
		if(iter === win || iter.popupWindow === win) {
			return true;
		}
	}

	return false;
}

UIWindowManager.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIWindow) {
		if(this.mode == C_MODE_EDITING) {
			var win = this.findChildByName(shape.name);
			if(win) {
				shape.name = shape.name + this.children.length;
			}
		}

		return true;
	}

	return false;
}

UIWindowManager.prototype.onChildrenChanged = function() {
}

UIWindowManager.prototype.afterChildAppended = function(shape) {
	if(this.mode !== C_MODE_RUNNING && !this.isUnpacking) {
		var index = this.getFrameIndex(shape);
		this.showFrame(index);
	}

	this.onChildrenChanged();

	return;
}

UIWindowManager.prototype.onChildRemoved = function(shape) {
	this.onChildrenChanged();

	return;
}

UIWindowManager.prototype.scaleForDensity = function(sizeScale, lcdDensity, recuresive) {
	if(!sizeScale || sizeScale === 1) {
		return;
	}

	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];

		if(!iter.lcddensity || iter.lcddensity === "all") {
			if(iter.pendingLoadChildren) {
				iter.scaleInfo = {};
				iter.scaleInfo.sizeScale = sizeScale;
				iter.scaleInfo.lcdDensity = lcdDensity;
			}
			else {
				iter.scaleForDensity(sizeScale, lcdDensity, recuresive);
			}
		}
	}

	return;
}

UIWindowManager.prototype.setDeviceConfig = function(deviceConfig) {
	var oldConfig = this.deviceConfig;
	
	this.oldConfig = this.deviceConfig;
	this.deviceConfig = deviceConfig;

	if(oldConfig && deviceConfig) {
		if(oldConfig.lcdDensity != deviceConfig.lcdDensity) {
			var sizeScale = this.getSizeScale(oldConfig.lcdDensity, deviceConfig.lcdDensity);
			this.scaleForDensity(sizeScale, deviceConfig.lcdDensity, true);
		}
		this.notifyDeviceConfigChanged(oldConfig, deviceConfig);
		console.log("call this.notifyDeviceConfigChanged: " + this.type);
	}

	console.log("setDeviceConfig platform:" + deviceConfig.platform);
	return;
}

UIWindowManager.prototype.getDeviceConfig = function() {
	if(this.deviceConfig) {
		return this.deviceConfig;
	}
	else {
		var device = this.getDevice();
		if(device) {
			return device.config;
		}
	}

	return null;
}

UIWindowManager.prototype.paintLoadingStatus = function(canvas, percent, text) {
	var text = "Loading...";
	var percent = CanTkImage.getLoadProgress();
	
	var w = this.w;
	var h = this.h;
	var barW = w * 0.8;
	var barH = 60;
	var fillBarW = percent * barW/100;

	var x = (w - barW) >> 1;
	var y = (h - barH) >> 1;
	canvas.fillStyle = this.loadingBgColor;
	canvas.fillRect(0, 0, w, h);

	canvas.lineWidth = 4;
	canvas.strokeStyle = this.progressBarBorderColor;
	canvas.rect(x, y, barW, barH);
	canvas.stroke();

	canvas.fillStyle = this.progressBarFillColor;
	canvas.fillRect(x+4, y+4, fillBarW-8, barH-8);

	canvas.fillStyle = this.loadingTextColor;
	canvas.font = "32px serif";
	canvas.textBaseline = "middle";
	canvas.textAlign = "center";
	canvas.fillText(text, w >> 1, (h >> 1) - barH);

	canvas.fillStyle = this.progressTextColor;

	text = percent.toString().substr(0, 4) + "%";
	canvas.fillText(text, w >> 1, h >> 1);

	return;
}

UIFrames.prototype.paintChildren = function(canvas) {
	if(this.mode === C_MODE_RUNNING && this.showLoadingProgress) {
		var me = this;
		var percent = CanTkImage.getLoadProgress();

		if(percent < 95) {
			setTimeout(function() {
				me.postRedraw();
			}, 100);

			return this.paintLoadingStatus(canvas, percent, webappGetText("Loading..."));
		}
	}
	
	var child = this.getCurrentFrame();
	if(child) {
		canvas.save();
		canvas.beginPath();
		child.paintSelf(canvas);
		canvas.restore();
	}

	return;
}

UIWindowManager.prototype.afterPaintChildren = function(canvas) {
	var creatingShape = this.getCreatingShape();

	if(creatingShape && creatingShape.isUIElement && this.showHignlight) {

		if(!creatingShape.isUIDevice) {
			canvas.beginPath();
			canvas.rect(0, 0, this.w, this.h);
			canvas.lineWidth = 5;
			canvas.strokeStyle = "Orange";
			canvas.stroke();
		}

		if(creatingShape.isUIWindow) {
			canvas.textBaseline = "middle";
			canvas.textAlign = "center";
			canvas.fillStyle = "Gray";
			canvas.font = "24pt Sans";
			canvas.fillText(dappGetText("Please Drag Window To Here."), this.w/2, this.h*0.2);
		}
	}

	this.showHignlight = !this.showHignlight;

	return;
}

UIWindowManager.prototype.paintSelfOnly =function(canvas) {
	this.setThisAsCurrentWindowManager();

	if(this.mode === C_MODE_EDITING) {
		canvas.fillStyle = "white";
		canvas.fillRect(0, 0, this.w, this.h);

		UIWindowManager.updateWindowThumbView(this.current);
	}

	return;
}

UIWindowManager.prototype.relayoutChildren = function() {
	var curWin = this.getCurrentFrame();

	if(this.mode === C_MODE_EDITING) {
		for(var i = 0; i < this.children.length; i++) {
			var iter = this.children[i];
			iter.relayout();
		}
	}
	else {
		if(curWin) {
			curWin.relayout();
			
			var childWin = curWin.getPopupWindow();
			if(childWin) {
				childWin.relayout();
			}
		}
	}

	return;
}

UIWindowManager.prototype.onKeyDown= function(code) {
	var win = this.getCurrentWindow();

	return win.onKeyDown(code);
}

UIWindowManager.prototype.onKeyUp= function(code) {
	var win = this.getCurrentWindow();

	return win.onKeyUp(code);
}

function UIWindowManagerCreator() {
	var args = ["ui-window-manager", "ui-window-manager", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIWindowManager();

		return g.initUIWindowManager(this.type);
	}
	
	return;
}

function dupDeviceConfig(config) {
	var o = {};

	o.name = config.name;
	o.bg = config.bg
	o.platform = config.platform;
	o.version = config.version;
	o.lcdDensity = config.lcdDensity;
	o.width = config.width;
	o.height = config.height;
	o.screenX = config.screenX;
	o.screenY = config.screenY;
	o.screenW = config.screenW;
	o.screenH = config.screenH;
	o.hasMenuBar = config.hasMenuBar;

	return o;
}
	
function cantkDetectDeviceConfig() {
	var deviceConfig = {version:4};
		
	if(isAndroid()) {
		deviceConfig.platform = "android";
	}
	else if(isIPhone () || isIPad()) {
		deviceConfig.platform = "iphone";
	}
	else if(isFirefoxMobile()) {
		deviceConfig.platform = "firefox";
	}
	else if(isWinPhone()) {
		deviceConfig.platform = "winphone";
	}
	else if(isTizen()) {
		deviceConfig.platform = "tizen";
	}
	else {
		deviceConfig.platform = "android";
	}

	if(window.devicePixelRatio > 2.2) {
		deviceConfig.lcdDensity = "xxhdpi";
	}
	else if(window.devicePixelRatio > 1.5) {
		deviceConfig.lcdDensity = "xhdpi";
	}
	else if(window.devicePixelRatio > 1.1) {
		deviceConfig.lcdDensity = "hdpi";
	}
	else if(window.devicePixelRatio > 0.8) {
		deviceConfig.lcdDensity = "mdpi";
	}
	else if(!window.devicePixelRatio) {
		var minSize = Math.min(window.orgViewPort.width, window.orgViewPort.height);

		if(minSize > 600) {
			deviceConfig.lcdDensity = "xhdpi";
		}
		else {
			deviceConfig.lcdDensity = "hdpi";
		}
	}
	else {
		deviceConfig.lcdDensity = "ldpi";
	}

	if(isFirefoxMobile()) {
		deviceConfig.lcdDensity = "mdpi";
	}

	if(!isMobile()) {
		deviceConfig.lcdDensity = "hdpi";
	}

	console.log("deviceConfig.lcdDensity:" + deviceConfig.lcdDensity);
	console.log("deviceConfig.platform:" + deviceConfig.platform);

	return deviceConfig;
}

function isDeviceConfigEqual(c1, c2) {
	var s1 = JSON.stringify(c1);
	var s2 = JSON.stringify(c2);

	return s1 === s2;
}

function cantkPreloadImage(src) {
	var image = new CanTkImage(src);

	return image;
}
	
function cantkLoadUserScripts() {
	console.log("cantkLoadUserScripts");
	registerViewBeforeLoadListener(function(view, js) {
		var meta = js.meta;
		if(meta && meta.extlibs) {
			clearUserAppScript();

			for(var i = 0; i < meta.extlibs.length; i++) {
				addUserAppScript(meta.extlibs[i]);
			}
			loadUserAppScripts(function() {
				console.log("All User App Scripts Loaded");
			});
		}
	});

	registerViewAfterLoadListener(function(view, js) {
	});

	return;
}

var gTempCanvas = null;
function cantkGetTempCanvas(width, height) {
	if(!gTempCanvas) {
		gTempCanvas = document.createElement("canvas");

		gTempCanvas.type = "backend_canvas";
		gTempCanvas.width = width;
		gTempCanvas.height = height;
	}

	if(gTempCanvas) {
		if(gTempCanvas.width != width) {
			gTempCanvas.width = width;
		}

		if(gTempCanvas.height != height) {
			gTempCanvas.height = height;
		}
	}

	return gTempCanvas;
}

//////////////////////////////////////////////////////////////////////////}-{

var gApp8LocaleStrings = null;
function webappGetText(text) {
	var str = null;
	if(!text) {
		return "";
	}

	if(gApp8LocaleStrings) {
		str = gApp8LocaleStrings[text];
	}

	if(!str) {
//		console.log("\""+text+"\":" + "\"" +text+ "\",");
	}

	return str;
}

function webappSetLocaleStrings(strs) {
	gApp8LocaleStrings = strs;

	return;
}


var gDeviceConfigs = [];
function cantkRegisterDevice(device) {
	gDeviceConfigs.push(dupDeviceConfig(device));

	return;
}

function cantkGetDeviceConfig(name) {
	for(var i = 0; i < gDeviceConfigs.length; i++) {
		var device = gDeviceConfigs[i];
		if(device.name === name) {
			return dupDeviceConfig(device);
		}
	}

	return null;
}

function cantkGetAllDeviceConfig() {
	return gDeviceConfigs;
}

function cantkLoadDefaultDeviceConfigs() {

	var firefoxOSEmulator = {
		name : "firefox-QVGA-Emulator",
		bg: "/drawapp8/images/devices/device_firefoxos.png",
		platform:"firefox",
		version: "4",
		lcdDensity:"mdpi",
		width:390,
		height:754,
		screenX: 34,
		screenY: 138,
		screenW: 320,
		screenH: 480,
		hasMenuBar:false
	};

	var androidWVGA800 = {
		name : "android-WVGA800",
		bg: "/drawapp8/images/devices/device_800x480.png",
		platform:"android",
		version: "4",
		lcdDensity:"hdpi",
		width:600,
		height:1126,
		screenX: 60,
		screenY: 198,
		screenW: 480,
		screenH: 800,
		hasMenuBar:true
	};
	
	var tizenWVGA800 = {
		name : "tizen-WVGA800",
		bg: "/drawapp8/images/devices/device_800x480.png",
		platform:"tizen",
		version: "4",
		lcdDensity:"hdpi",
		width:600,
		height:1126,
		screenX: 60,
		screenY: 198,
		screenW: 480,
		screenH: 800
	};

	var tizenWXGA720 = {
		name : "tizen-WXGA720",
		bg: "/drawapp8/images/devices/device_1280x720.png",
		platform:"tizen",
		version: "4",
		lcdDensity:"xhdpi",
		width:860,
		height:1802,
		screenX: 74,
		screenY: 268,
		screenW: 720,
		screenH: 1280
	};

	var androidWXGA720 = {
		name : "android-WXGA720",
		bg: "/drawapp8/images/devices/device_1280x720.png",
		platform:"android",
		version: "4",
		lcdDensity:"xhdpi",
		width:860,
		height:1802,
		screenX: 74,
		screenY: 268,
		screenW: 720,
		screenH: 1280,
		hasMenuBar:true
	};

	var androidWXGA800 = {
		name : "android-WXGA800",
		bg: "/drawapp8/images/devices/device.png",
		platform: "android",
		version: "4",
		lcdDensity:"mdpi",
		width:1400,
		height:964,
		screenX: 60,
		screenY: 82,
		screenW: 1280,
		screenH: 800,
		hasMenuBar:true
	};
	
	var androidWSVGA = {
		name : "android-WSVGA",
		bg: "/drawapp8/images/devices/device.png",
		platform:"android",
		version: "4",
		lcdDensity:"mdpi",
		width:1130,
		height:764,
		screenX: 60,
		screenY: 82,
		screenW: 1024,
		screenH: 600,
		hasMenuBar:true
	};

	
	var iphone4s = {
		name : "iphone4s",
		bg: "/drawapp8/images/devices/device_iphone4s.png",
		platform: "iphone",
		version: "4s",
		lcdDensity:"xhdpi",
		width:760,
		height:1487,
		screenX: 65,
		screenY: 265,
		screenW: 640,
		screenH: 960,
		hasMenuBar:false
	};
	
	var iphone5 = {
		name : "iphone5",
		bg: "/drawapp8/images/devices/device_iphone5.png",
		platform: "iphone",
		version: "5",
		lcdDensity:"xhdpi",
		width:765,
		height:1600,
		screenX: 65,
		screenY: 238,
		screenW: 640,
		screenH: 1136,
		hasMenuBar:false
	};
	
	var blackberryQ10 = {
		name : "BlackBerry Q10",
		bg: "/drawapp8/images/devices/device_bb_q10.jpg",
		platform: "blackberry",
		version: "10",
		lcdDensity:"xhdpi",
		width:860,
		height:1520,
		screenX: 66,
		screenY: 246,
		screenW: 720,
		screenH: 720,
		hasMenuBar:false
	};
	
	var blackberryZ10 = {
		name : "BlackBerry Z10",
		bg: "/drawapp8/images/devices/device_bb_z10.jpg",
		platform: "blackberry",
		version: "10",
		lcdDensity:"xhdpi",
		width:920,
		height:1820,
		screenX: 72,
		screenY: 258,
		screenW: 768,
		screenH: 1280,
		hasMenuBar:false
	};
	
	var lumia800 = {
		name : "Nokia Lumia 800",
		bg: "/drawapp8/images/devices/device_nokia_lumia_800.jpg",
		platform: "winphone",
		version: "8",
		lcdDensity:"hdpi",
		width:620,
		height:1170,
		screenX: 86,
		screenY: 146,
		screenW: 480,
		screenH: 800,
		hasMenuBar:false
	};
	
	var lumia920 = {
		name : "Nokia Lumia 920",
		bg: "/drawapp8/images/devices/device_nokia_lumia_920.jpg",
		platform: "winphone",
		version: "8",
		lcdDensity:"xhdpi",
		width:1050,
		height:1780,
		screenX: 136,
		screenY: 192,
		screenW: 768,
		screenH: 1280,
		hasMenuBar:false
	};
	
	var ipadmini = {
		name : "iPad Mini",
		bg: "/drawapp8/images/devices/device_ipad_mini.jpg",
		platform: "iphone",
		version: "5",
		lcdDensity:"mdpi",
		width:876,
		height:1290,
		screenX: 52,
		screenY: 132,
		screenW: 768,
		screenH: 1024,
		hasMenuBar:false
	};
	
	var ipad4 = {
		name : "iPad 4",
		bg: "/drawapp8/images/devices/device_ipad_4.jpg",
		platform: "iphone",
		version: "5",
		lcdDensity:"hdpi",
		width:1942,
		height:2542,
		screenX: 198,
		screenY: 238,
		screenW: 1536,
		screenH: 2048,
		hasMenuBar:false
	};
	
	var pcLandscape = {
		name : "PC-Landscape",
		bg: "/drawapp8/images/pc-800x600.png",
		platform: "android",
		version: "4",
		lcdDensity:"hdpi",
		width:860,
		height:680,
		screenX: 32,
		screenY: 38,
		screenW: 800,
		screenH: 600,
		hasMenuBar:false
	};
	
	var pcPortrait = {
		name : "PC-Portrait",
		bg: "/drawapp8/images/pc-460x740.png",
		platform: "android",
		version: "4",
		lcdDensity:"hdpi",
		width:520,
		height:800,
		screenX: 31,
		screenY: 29,
		screenW: 460,
		screenH: 740,
		hasMenuBar:false
	};

	cantkRegisterDevice(iphone4s);
	cantkRegisterDevice(iphone5);
	cantkRegisterDevice(androidWVGA800);
	cantkRegisterDevice(androidWXGA720);
	cantkRegisterDevice(androidWXGA800);
	cantkRegisterDevice(androidWSVGA);
	cantkRegisterDevice(tizenWVGA800);
	cantkRegisterDevice(tizenWXGA720);
	cantkRegisterDevice(firefoxOSEmulator);
	cantkRegisterDevice(blackberryQ10);
	cantkRegisterDevice(blackberryZ10);
	cantkRegisterDevice(lumia800);
	cantkRegisterDevice(lumia920);
	cantkRegisterDevice(ipadmini);
	cantkRegisterDevice(ipad4);
	cantkRegisterDevice(pcLandscape);
	cantkRegisterDevice(pcPortrait);

	return;
}

cantkLoadDefaultDeviceConfigs();

/*
 * File: audio.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: html5 audio support.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function MusicPlayer() {
	this.songs = [];
	this.volume = 1;
	this.current = 0;
	this.state = MusicPlayer.STATE_STOPPED;

	var player = this;

	function notifyTimeEllapsed() {
		if(player.isPlaying()) {
			player.notify("time-ellapsed", player.getPercent());
		}

		setTimeout(notifyTimeEllapsed, 1000);
	}

	setTimeout(notifyTimeEllapsed, 1000);

	return;
}

MusicPlayer.STATE_STOPPED = 0;
MusicPlayer.STATE_PLAYING = 1;
MusicPlayer.STATE_PAUSED  = 2;

MusicPlayer.prototype.clear = function() {
	this.stop();
	this.setCurrent(0);
	this.songs.clear();

	return;
}

MusicPlayer.prototype.setState = function(state) {
	if(this.state != state) {
		this.notify("state-changed", state);
	}

	this.state = state;

	return;
}

MusicPlayer.prototype.isPlaying = function() {
	return this.state === MusicPlayer.STATE_PLAYING;
}

MusicPlayer.prototype.isPaused = function() {
	return this.state === MusicPlayer.STATE_PAUSED;
}

MusicPlayer.prototype.isStopped = function() {
	return this.state === MusicPlayer.STATE_STOPPED;
}

MusicPlayer.prototype.setEventListener = function(onNotify) {
	this.onNotify = onNotify;

	return;
}

MusicPlayer.prototype.notify = function(eventName, eventParam) {
	if(this.onNotify) {
		this.notifying = true;
		var onNotify = this.onNotify;
		try {
			onNotify(eventName, eventParam);
		}catch(e) {
			console.log("notify error: " + e.message);
		}
		delete this.notifying;
	}

	return;
}

MusicPlayer.prototype.addSong = function(url, preload) {
	var player = this;
	var song = new Audio();
	
	console.log("addSong: " + this.songs.length + " " + url);
	song.addEventListener('ended',function(e){
		player.next(true);
		console.log("song end");

		return;
	});
	
	song.addEventListener('error', function(e){
		player.songs.remove(song);
		console.log("error:" + song.src);

		return;
	});

	song.addEventListener('playing',function(e){
		console.log("playing:" + song.src);
		return;
	});

	song.addEventListener('progress',function(e){
		console.log("progress:" + song.src);
		return;
	});
	
	if(preload) {
		song.src = url;
		song.load();
	}
	else {
		song.realSrc = url;
	}

	this.songs.push(song);

	return;
}

MusicPlayer.prototype.addSongs = function(urls, preload) {
	for(var i = 0; i < urls.length; i++) {
		this.addSong(url[i], preload);
	}

	return;
}

MusicPlayer.prototype.removeSong = function(song) {
	var index = this.songs.indexOf(song);

	return this.removeSongByIndex(index);
}

MusicPlayer.prototype.removeSongByUrl = function(url) {
	for(var i = 0; i < this.songs.length; i++) {
		var iter = this.songs[i];
		if(iter.src.indexOf(url) >= 0) {
			this.removeSongByIndex(i);
			break;
		}
	}

	return;
}

MusicPlayer.prototype.removeSongByIndex = function(index) {
	if(index >= 0 && index < this.songs.length) {
		if(index === this.current) {
			if(this.state === MusicPlayer.STATE_PLAYING) {
				this.stop();
			}

			this.songs.remove(this.songs[index]);
			this.setCurrent(this.current);
		}
		else {
			this.songs.remove(this.songs[index]);
		}
	}

	return;
}

MusicPlayer.prototype.getSongsNr = function() {
	return this.songs.length;
}

MusicPlayer.prototype.getSongByIndex = function(index) {
	return (index >= 0 && index < this.songs.length) ? this.songs[index] : null;
}

MusicPlayer.prototype.setCurrent = function(index) {
	if(index >= 0 && this.songs.length > 0) {
		this.current = index % this.songs.length;
	}

	return;
}

MusicPlayer.prototype.getCurrent = function() {
	return this.current;
}

MusicPlayer.prototype.setVolume = function(value) {
	this.volume = (value <= 1 && value >= 0) ? value : 1;

	return;
}

MusicPlayer.prototype.getVolume = function() {
	return this.volume;
}

MusicPlayer.prototype.next = function(autoPlay) {
	var n = this.songs.length;
	if(n > 1) {
		this.stop();
		this.current = (this.current + 1)%n;
		if(autoPlay) {
			this.play();
		}
	}

	return;
}

MusicPlayer.prototype.prev = function(autoPlay) {
	var n = this.songs.length;
	if(n > 1) {
		this.stop();
		this.current = (this.current + n - 1)%n;
		if(autoPlay) {
			this.play();
		}
	}

	return;
}

MusicPlayer.prototype.playOrPause = function() {
	if(this.isPlaying()) {
		this.pause();
	}
	else {
		this.play();
	}

	return;
}

MusicPlayer.prototype.play = function() {
	if(this.state === MusicPlayer.STATE_PLAYING) {
		return;
	}

	var n = this.songs.length;
	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];
		song.volume = this.volume;

		if(!song.src && song.realSrc) {
			song.src = song.realSrc;
			song.load();
		}

		song.play();
		var player = this;
		this.setState(MusicPlayer.STATE_PLAYING);
	}

	return;
}

MusicPlayer.prototype.stop = function() {
	if(this.state === MusicPlayer.STATE_STOPPED) {
		return;
	}
	
	var n = this.songs.length;
	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];
		if(!song.paused) {
			song.pause();
		}
		this.setState(MusicPlayer.STATE_STOPPED);
	}

	return;
}

MusicPlayer.prototype.pause = function() {
	if(this.state !== MusicPlayer.STATE_PLAYING) {
		return;
	}
	
	var n = this.songs.length;
	if(n > 0 && this.current < n) {
		this.songs[this.current].pause();
		this.setState(MusicPlayer.STATE_PAUSED);
	}

	return;
}

MusicPlayer.prototype.seekTo = function(percent) {
	var n = this.songs.length;
	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];
		song.currentTime = song.duration * percent/100;
	}

	console.log("seekTo:" +  percent + " " + this.getPercent());

	return;
}

MusicPlayer.prototype.getPercent = function() {
	var n = this.songs.length;

	if(this.state === MusicPlayer.STATE_STOPPED) {
		return 0;
	}

	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];

		return song.currentTime * 100/song.duration;
	}

	return 0;
}

MusicPlayer.prototype.getEllapsedTime = function() {
	var n = this.songs.length;

	if(this.state === MusicPlayer.STATE_STOPPED) {
		return 0;
	}

	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];

		return song.currentTime;
	}

	return 0;
}

MusicPlayer.prototype.getDuration = function() {
	var n = this.songs.length;

	if(this.state === MusicPlayer.STATE_STOPPED) {
		return 0;
	}

	if(n > 0 && this.current < n) {
		var song = this.songs[this.current];

		return song.duration;
	}

	return 0;
}

var gMusicPlayer = new MusicPlayer();

function getMusicPlayer() {
	return gMusicPlayer;
}

///////////////////////////////////////////////////////////

function EffectsPlayer() {
	this.effects = {};
}

EffectsPlayer.prototype.load = function(name, url) {
	var effect = this.effects[name];

	if(!effect) {
		effect = {};
		effect.name = name;
		effect.state = MusicPlayer.STATE_STOPPED;
	}

	effect.audio = new Audio();

	effect.audio.addEventListener('ended',function(e){
		console.log("effect.audio end:" + effect.name);
		effect.state = MusicPlayer.STATE_STOPPED;

		return;
	});
	
	effect.audio.addEventListener('error', function(e){
		console.log("error:" + effect.audio.src);
		effect.state = MusicPlayer.STATE_STOPPED;

		return;
	});

	effect.audio.src = url;
	effect.audio.load();

	this.effects[name] = effect;

	return;
}

EffectsPlayer.prototype.loadTone = function(name, freq, duration, volume) {
	var cfg = {
		seconds: (duration > 100) ? duration/1000 : duration,
		volume: (volume < 1) ? volume*32767 : volume,
		freq: freq
	}

    var url = window.makeToneDataURI(cfg);

	this.load(name, url);

	return;
}

EffectsPlayer.prototype.play = function(name) {
	var effect = this.effects[name];

	if(effect) {
		effect.state = MusicPlayer.STATE_PLAYING;
		effect.audio.currentTime = 0;
		effect.audio.play();
	}

	return;
}

var gEffectsPlayer = new EffectsPlayer();

function getEffectsPlayer() {
	return gEffectsPlayer;
}

//from: http://mrcoles.com/piano

(function() {
	myextend = function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// extend jQuery itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

    // test if we can use blobs
    var canBlob = false;
    if (window.webkitURL && window.Blob) {
        try {
            new Blob();
            canBlob = true;
        } catch(e) {}
    }

    function asBytes(value, bytes) {
        // Convert value into little endian hex bytes
        // value - the number as a decimal integer (representing bytes)
        // bytes - the number of bytes that this value takes up in a string

        // Example:
        // asBytes(2835, 4)
        // > '\x13\x0b\x00\x00'
        var result = [];
        for (; bytes>0; bytes--) {
            result.push(String.fromCharCode(value & 255));
            value >>= 8;
        }
        return result.join('');
    }

    function attack(i) {
        return i < 200 ? (i/200) : 1;
    }

    var DataGenerator = myextend(function(styleFn, volumeFn, cfg) {
        cfg = myextend({
            freq: 440,
            volume: 32767,
            sampleRate: 11025, // Hz
            seconds: .5,
            channels: 1
        }, cfg);

        var data = [];
        var maxI = cfg.sampleRate * cfg.seconds;
        for (var i=0; i < maxI; i++) {
            for (var j=0; j < cfg.channels; j++) {
                data.push(
                    asBytes(
                        volumeFn(
                            styleFn(cfg.freq, cfg.volume, i, cfg.sampleRate, cfg.seconds, maxI),
                            cfg.freq, cfg.volume, i, cfg.sampleRate, cfg.seconds, maxI
                        ) * attack(i), 2
                    )
                );
            }
        }
        return data;
    }, {
        style: {
            wave: function(freq, volume, i, sampleRate, seconds) {
                // wave
                // i = 0 -> 0
                // i = (sampleRate/freq)/4 -> 1
                // i = (sampleRate/freq)/2 -> 0
                // i = (sampleRate/freq)*3/4 -> -1
                // i = (sampleRate/freq) -> 0
                return Math.sin((2 * Math.PI) * (i / sampleRate) * freq);
            },
            squareWave: function(freq, volume, i, sampleRate, seconds, maxI) {
                // square
                // i = 0 -> 1
                // i = (sampleRate/freq)/4 -> 1
                // i = (sampleRate/freq)/2 -> -1
                // i = (sampleRate/freq)*3/4 -> -1
                // i = (sampleRate/freq) -> 1
                var coef = sampleRate / freq;
                return (i % coef) / coef < .5 ? 1 : -1;
            },
            triangleWave: function(freq, volume, i, sampleRate, seconds, maxI) {
                return Math.asin(Math.sin((2 * Math.PI) * (i / sampleRate) * freq));
            },
            sawtoothWave: function(freq, volume, i, sampleRate, seconds, maxI) {
                // sawtooth
                // i = 0 -> -1
                // i = (sampleRate/freq)/4 -> -.5
                // i = (sampleRate/freq)/2 -> 0
                // i = (sampleRate/freq)*3/4 -> .5
                // i = (sampleRate/freq) - delta -> 1
                var coef = sampleRate / freq;
                return -1 + 2 * ((i % coef) / coef);
            }
        },
        volume: {
            flat: function(data, freq, volume) {
                return volume * data;
            },
            linearFade: function(data, freq, volume, i, sampleRate, seconds, maxI) {
                return volume * ((maxI - i) / maxI) * data;
            },
            quadraticFade: function(data, freq, volume, i, sampleRate, seconds, maxI) {
                // y = -a(x - m)(x + m); and given point (m, 0)
                // y = -(1/m^2)*x^2 + 1;
                return volume * ((-1/Math.pow(maxI, 2))*Math.pow(i, 2) + 1) * data;
            }
        }
    });
    DataGenerator.style.defaultVal = DataGenerator.style.wave;
    DataGenerator.volume.defaultVal = DataGenerator.volume.linearFade;


    function makeToneDataURI(cfg) {

        cfg = myextend({
            channels: 1,
            sampleRate: 11025, // Hz
            bitDepth: 16, // bits/sample
            seconds: .5,
            volume: 20000,//32767,
            freq: 440
        }, cfg);

        //
        // Format Sub-Chunk
        //

        var fmtChunk = [
            'fmt ', // sub-chunk identifier
            asBytes(16, 4), // chunk-length
            asBytes(1, 2), // audio format (1 is linear quantization)
            asBytes(cfg.channels, 2),
            asBytes(cfg.sampleRate, 4),
            asBytes(cfg.sampleRate * cfg.channels * cfg.bitDepth / 8, 4), // byte rate
            asBytes(cfg.channels * cfg.bitDepth / 8, 2),
            asBytes(cfg.bitDepth, 2)
        ].join('');

        //
        // Data Sub-Chunk
        //

        var sampleData = DataGenerator(
            cfg.styleFn || DataGenerator.style.defaultVal,
            cfg.volumeFn || DataGenerator.volume.defaultVal,
            cfg);
        var samples = sampleData.length;

        var dataChunk = [
            'data', // sub-chunk identifier
            asBytes(samples * cfg.channels * cfg.bitDepth / 8, 4), // chunk length
            sampleData.join('')
        ].join('');

        //
        // Header + Sub-Chunks
        //

        var data = [
            'RIFF',
            asBytes(4 + (8 + fmtChunk.length) + (8 + dataChunk.length), 4),
            'WAVE',
            fmtChunk,
            dataChunk
        ].join('');

        if (canBlob) {
            // so chrome was blowing up, because it just blows up sometimes
            // if you make dataURIs that are too large, but it lets you make
            // really large blobs...
            var view = new Uint8Array(data.length);
            for (var i = 0; i < view.length; i++) {
                view[i] = data.charCodeAt(i);
            }
            var blob = new Blob([view], {type: 'audio/wav'});
            return  window.webkitURL.createObjectURL(blob);
        } else {
            return 'data:audio/wav;base64,' + btoa(data);
        }
    }

    function noteToFreq(stepsFromMiddleC) {
        return 440 * Math.pow(2, (stepsFromMiddleC+3) / 12);
    }

    var Notes = {
        sounds: {},
        getDataURI: function(n, cfg) {
            cfg = cfg || {};
            cfg.freq = noteToFreq(n);
            return makeToneDataURI(cfg);
        },
        getCachedSound: function(n, data) {
            var key = n, cfg;
            if (data && typeof data == "object") {
                cfg = data;
                var l = [];
                for (var attr in data) {
                    l.push(attr);
                    l.push(data[attr]);
                }
                l.sort();
                key += '-' + l.join('-');
            } else if (typeof data != 'undefined') {
                key = n + '.' + key;
            }

            var sound = this.sounds[key];
            if (!sound) {
                sound = this.sounds[key] = new Audio(this.getDataURI(n, cfg));
            }
            return sound;
        },
        noteToFreq: noteToFreq
    };

	window.makeToneDataURI = makeToneDataURI;
    window.DataGenerator = DataGenerator;
    window.Notes = Notes;

})();


var C_UI_ELEMENTS = "";
function cantkRegisterUIElements() {
	var shapeFactory = ShapeFactoryGet();

	shapeFactory.addShapeCreator(new UIImageValueCreator(200, 200, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UICircleLayoutCreator(400, 400), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVScrollImageCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIFlashCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHtmlViewCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVideoCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIShortcutCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UILoadingWindowCreator(null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISuggestionCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISelectCreator("ui-select", 300, 50), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIFanMenuCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISlidingMenuCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIStaticMapCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListItemGroupCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageButtonCreator(120, 90), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIMenuCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIContextMenuCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageCreator(null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIViewPagerCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorNormalCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorCircleCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorNumberCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorRectCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageIndicatorLineCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIPageManagerCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIScrollTextCreator("ui-vscroll-text", 200, 200), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIScrollTextCreator("ui-hscroll-text", 200, 50), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageSlideViewCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageAnimationCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIUIImageNormalViewCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIUIImageThumbViewTapeCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIUIImageThumbViewGridCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGaugePointerCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGaugeCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UILedDigitsCreator(100, 100), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVCollapsableCreator(100, 100, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHCollapsableCreator(100, 100, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVLayoutCreator(100, 100, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVPlaceholderCreator(100, 20), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHLayoutCreator(100, 100, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHPlaceholderCreator(20, 100), C_UI_ELEMENTS);


	shapeFactory.addShapeCreator(new UITipsCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGridViewCreator(5, 114, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListViewCreator(5, 114, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISimpleHTMLCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIColorTileCreator(80, 80), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIColorButtonCreator(80, 80), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIColorBarCreator(100, 10), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIStatusBarCreator("ui-status-bar", 640, 40, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIStatusBarCreator("ui-menu-bar", 640, 96, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGroupCreator(200, 200, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListCheckBoxItemCreator(null, null, null, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListRadioBoxItemCreator(null, null, null, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UISwitchCreator(154, 54, 154, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIVScrollViewCreator(0, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIHScrollViewCreator(0, null), C_UI_ELEMENTS);

	shapeFactory.addShapeCreator(new UIDeviceCreator("android", "", 420, 700), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIScreenCreator(640, 960), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListItemCreator(null, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIToolBarCreator("ui-toolbar", true, 85, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIDialogCreator(600, 400, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UINormalWindowCreator(null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIWindowManagerCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIListCreator(5, 114, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIGridCreator(5, 150, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIButtonGroupCreator(5, 200, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIProgressBarCreator(200, 45, false, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIProgressBarCreator(200, 45, true, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UILabelCreator(), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIEditCreator(120, 50, 12, 12, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIMLEditCreator(300, 300, 12, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageCreator("ui-icon", 32, 32, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIImageCreator("ui-image", 200, 200, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIWaitBarCreator("ui-wait-box", 60, 60, null, CANTK_IMAGE_DISPLAY_CENTER), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIWaitBarCreator("ui-wait-bar", 200, 24, null, CANTK_IMAGE_DISPLAY_SCALE), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIButtonCreator(120, 60), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UICheckBoxCreator(160, 60, null, null, null, null,	null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UIRadioBoxCreator(50, 50, null, null, null, null, null, null), C_UI_ELEMENTS);
	shapeFactory.addShapeCreator(new UICanvasCreator(200, 200), C_UI_ELEMENTS);

	return;
}

////////////////////////////////////empty functions///////////////////////}-{
UIWindowManager.prototype.setThisAsCurrentWindowManager = function() {
}

UIWindowManager.updateWindowThumbView = function(index) {
}

UIWindowManager.drawWindowThumbView = function(canvas, index) {
}


/*
 * File: ui_animation.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: ui animation.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

//////////////////////////////////////////////////

VelocityTracker.prototype.HISTORY_SIZE = 20;
VelocityTracker.prototype.HORIZON = 200 * 1000000;
VelocityTracker.prototype.MIN_DURATION = 10 * 1000000;

function Movement() {
	this.eventTime = 0;
	this.point = new Point(0, 0);

	this.getPoint = function() {
		return this.point;
	}

	return this;
}

function VelocityTracker() {
    this.clear();

    return this;
}

VelocityTracker.prototype.clear = function() {
    this.index = 0;
	
	var HISTORY_SIZE = this.HISTORY_SIZE;
    if(!this.movements) {
		this.movements = new Array();
		for(var i = 0; i < HISTORY_SIZE; i++) {
			this.movements.push(new Movement());
		}
    }

	for(var i = 0; i < HISTORY_SIZE; i++) {
		var iter = this.movements[i];
		iter.eventTime = 0;
		iter.point = {x:0, y:0};
	}

    return;
}

VelocityTracker.prototype.addMovement = function(eventTime, point) {
    if (++this.index == this.HISTORY_SIZE) {
        this.index = 0;
    }

    this.movements[this.index].eventTime = eventTime;
    this.movements[this.index].point = point;

    return;
}

VelocityTracker.prototype.getVelocity = function() {
	var velocity = {x:0, y:0};

	this.estimate();

	velocity.x = this.xVelocity;
	velocity.y = this.yVelocity;

	return velocity;
}

VelocityTracker.prototype.estimate = function() {
	var HORIZON = this.HORIZON;
	var MIN_DURATION = this.MIN_DURATION;
	var HISTORY_SIZE = this.HISTORY_SIZE;
    var newestMovement = this.movements[this.index];
    var minTime = newestMovement.eventTime - HORIZON;
    var oldestIndex = this.index;
    var numTouches = 1;

    do {
        var nextOldestIndex = (oldestIndex == 0 ? HISTORY_SIZE : oldestIndex) - 1;
        var nextOldestMovement = this.movements[nextOldestIndex];
        if (nextOldestMovement.eventTime < minTime) {
            break;
        }
        oldestIndex = nextOldestIndex;
    } while (++numTouches < HISTORY_SIZE);

    var accumVx = 0;
    var accumVy = 0;
    var index = oldestIndex;
    var samplesUsed = 0;
    var oldestMovement = this.movements[oldestIndex];
   	var oldestPosition = oldestMovement.getPoint();
    var lastDuration = 0;

    while (numTouches-- > 1) {
        if (++index == HISTORY_SIZE) {
            index = 0;
        }
        var movement = this.movements[index];
        var duration = movement.eventTime - oldestMovement.eventTime;

        if (duration >= MIN_DURATION) {
            var position = movement.getPoint();
            var scale = 1000000000.0 / duration; // one over time delta in seconds
            var vx = (position.x - oldestPosition.x) * scale;
            var vy = (position.y - oldestPosition.y) * scale;
            accumVx = (accumVx * lastDuration + vx * duration) / (duration + lastDuration);
            accumVy = (accumVy * lastDuration + vy * duration) / (duration + lastDuration);
            lastDuration = duration;
            samplesUsed += 1;
        }
    }

    // Report velocity.
    if (samplesUsed) {
		this.xVelocity = accumVx;
		this.yVelocity = accumVy;
    } else {
		this.xVelocity = 0;
		this.yVelocity = 0;
    }

    return true;
}

function testVelocityTracker() {
	var v = null;
	var vt = new VelocityTracker();
	function toNs(ms) {
		return ms * 1000000;
	}

	for(var i = 0; i < 20; i++) {
		vt.addMovement(toNs(10 * i), {x:10*i, y:10*i*i/2});
	}

	v = vt.getVelocity();

	console.log("xv: " + v.x + " yv: " + v.y);

	return;
}

//testVelocityTracker();

//////////////////////////////////////////////////////////////////////

function Interpolator() {
	this.get = function(percent) {
		return 0;
	}

	return this;
}

function LinearInterpolator() {
	this.get = function(percent) {
		return percent;
	}

	return this;
}

function BounceInterpolator() {
	function bounce(percent) {
		return 8 * percent * percent;
	}

	this.get = function(percent) {
		percent *= 1.1226;
        if (percent < 0.3535) return bounce(percent);
        else if (percent < 0.7408) return bounce(percent - 0.54719) + 0.7;
        else if (percent < 0.9644) return bounce(percent - 0.8526) + 0.9;
        else return bounce(percent - 1.0435) + 0.95;
	}

	return this;
}

function AccelerateInterpolator() {
	this.get = function(percent) {
		return percent * percent;
	}

	return this;
}

function AccDecelerateInterpolator() {
	this.get = function(percent) {
		return ((Math.cos((percent + 1) * Math.PI) / 2.0) + 0.5);
	}

	return this;
}

function DecelerateInterpolator(factor) {
	this.factor = factor ? factor : 2;
	this.get = function(percent) {
		if(this.factor === 1) {
			return (1.0 - (1.0 - percent) * (1.0 - percent));
		}
		else {
			return (1.0 - Math.pow((1.0 - percent), 2 * this.factor));
		}
	}

	return this;
}

//////////////////////////////////////////////////////////////////////
function AnimationFactory() {
	this.animations = [];

	this.createAnimation = function(name) {
		var animation = this.animations[name];
		if(animation) {
			return animation;
		}
		var durationWeight = isIPhone() ? 2 : 3;
		switch(name) {
			case "anim-forward": {
				var interpolator =  new DecelerateInterpolator();
				animation = isAndroid() ? new AnimationHTranslateAndroid(true) : new AnimationHTranslate(true);
				animation.toLeft();
				animation.init(200 * durationWeight, interpolator);
				break;
			}
			case "anim-backward": {
				var interpolator =  new DecelerateInterpolator();
				animation = isAndroid() ? new AnimationHTranslateAndroid(true) : new AnimationHTranslate(false);
				animation.toRight();
				animation.init(200 * durationWeight, interpolator);
				break;
			}
			case "anim-scale-show-win": {
				var interpolator =  new DecelerateInterpolator(1);
				if(isMobile()) {
					animation = new AnimationBrowserScaleWin(true);
					animation.setRange(1.2, 1.0);
				}
				else {
					animation = new AnimationScale(true);
					animation.setRange(0.9, 1.0);
				}
				animation.init(600, interpolator);
				break;
			}
			case "anim-scale-hide-win": {
				var interpolator =  new AccelerateInterpolator();
				if(isMobile()) {
					animation = new AnimationBrowserScaleWin(false);
					animation.setRange(0.9, 1.0);
				}
				else {
					animation = new AnimationScale(false);
					animation.setRange(1.0, 0.9);
				}
				animation.init(400, interpolator);
				break;
			}
			case "anim-scale-show-dialog": {
				var interpolator =  new DecelerateInterpolator();
				animation = isAndroid() ? new AnimationBrowserScaleDialog(true) : new AnimationScale(true);
				animation.setRange(0.9, 1.0);
				animation.init(300, interpolator);
				break;
			}
			case "anim-scale-hide-dialog": {
				var interpolator =  new AccelerateInterpolator();
				animation = isAndroid() ? new AnimationBrowserScaleDialog(false) : new AnimationScale(false);
				animation.setRange(1.0, 0.9);
				animation.init(300, interpolator);
				break;
			}
			case "anim-fade-in": {
				var interpolator =  new AccelerateInterpolator();
				animation = isAndroid() ? new AnimationBrowserAlpha(true) : new AnimationAlpha(true);
				animation.setRange(0.6, 1.0);
				animation.init(500, interpolator);
				break;
			}
			case "anim-fade-out": {
				var interpolator =  new AccelerateInterpolator();
				animation = isAndroid() ? new AnimationBrowserAlpha(false) : new AnimationAlpha(false);
				animation.setRange(1.0, 0.8);
				animation.init(300, interpolator);
				break;
			}
			case "anim-move-up": {
				var interpolator =  new DecelerateInterpolator();
				animation = isMobile() ? new AnimationBrowserMove(true) : new AnimationMove(true);
				animation.init(600, interpolator);
				break;
			}
			case "anim-move-down": {
				var interpolator =  new AccelerateInterpolator();
				animation = isMobile() ? new AnimationBrowserMove(false) : new AnimationMove(false);
				animation.init(600, interpolator);
				break;
			}
			case "anim-expand-up": 
			case "anim-expand-left": 
			case "anim-expand-right": 
			case "anim-expand-down": {
				var interpolator =  new DecelerateInterpolator(); 
				animation = new Animation1Expand(true);
				animation.init(400, interpolator);
				break;
			}
			case "anim-collapse-up": 
			case "anim-collapse-left": 
			case "anim-collapse-right": 
			case "anim-collapse-down": {
				var interpolator =  new AccelerateInterpolator(); 
				animation = new Animation1Expand(true);
				animation.init(400, interpolator);
				break;
			}
			case "anim-scale1-show-origin-topleft":
			case "anim-scale1-show-origin-center":
			case "anim-scale1-show-origin-bottomleft":
			case "anim-scale1-show-origin-topright":
			case "anim-scale1-show-origin-bottomright":
			case "anim-scale1-show": {
				var interpolator =  new DecelerateInterpolator(); 
				animation = new Animation1Scale(true);
				animation.init(400, interpolator);
				break;
			}
			case "anim-scale1-hide-origin-topleft":
			case "anim-scale1-hide-origin-center":
			case "anim-scale1-hide-origin-bottomleft":
			case "anim-scale1-hide-origin-topright":
			case "anim-scale1-hide-origin-bottomright":
			case "anim-scale1-hide": {
				var interpolator =  new AccelerateInterpolator(); 
				animation = new Animation1Scale(false);
				animation.init(400, interpolator);
				break;
			}
			case "anim-alpha1-show": {
				var interpolator =  new DecelerateInterpolator(); 
				animation = new Animation1Alpha(true);
				animation.init(400, interpolator);
				break;
			}
			case "anim-alpha1-hide": {
				var interpolator =  new AccelerateInterpolator(); 
				animation = new Animation1Alpha(false);
				animation.init(400, interpolator);
				break;
			}
			
		}
		
		this.animations[name] = animation;

		return animation;
	}

	return this;
}

var gAnimationFactory = null;
function AnimationFactoryGet() {
	if(!gAnimationFactory) {
		gAnimationFactory = new AnimationFactory();
	}

	return gAnimationFactory;
}

function animationCreate(name) {
	return AnimationFactoryGet().createAnimation(name);
}

var gAnimationOldWinCanvas = null;
function AnimationOldWinCanvasGet() {
	if(!gAnimationOldWinCanvas) {
		gAnimationOldWinCanvas= document.createElement("canvas");
		gAnimationOldWinCanvas.type = "animation_canvas";
	}
	
	gAnimationOldWinCanvas.style["opacity"] = 1;
	gAnimationOldWinCanvas.style.zIndex = 9;
	
	return gAnimationOldWinCanvas;
}

function AnimationCanvasGet() {
	var canvas = AnimationOldWinCanvasGet();
	scaleElement(canvas, 1, 1);

	return canvas;
}

var gAnimationNewWinCanvas = null;
function AnimationNewWinCanvasGet() {
	if(!gAnimationNewWinCanvas) {
		gAnimationNewWinCanvas= document.createElement("canvas");
		gAnimationNewWinCanvas.type = "animation_canvas";
	}

	gAnimationNewWinCanvas.style["opacity"] = 1;
	gAnimationNewWinCanvas.style.zIndex = 9;
	
	return gAnimationNewWinCanvas;
}

var gBackendCanvas = null;
function BackendCanvasGet(width, height) {
	if(!gBackendCanvas) {
		gBackendCanvas = document.createElement("canvas");

		gBackendCanvas.type = "backend_canvas";
		gBackendCanvas.width = width;
		gBackendCanvas.height = height;
	}

	if(gBackendCanvas) {
		if(gBackendCanvas.width != width) {
			gBackendCanvas.width = width;
		}

		if(gBackendCanvas.height != height) {
			gBackendCanvas.height = height;
		}
	}
	scaleElement(gBackendCanvas, 1, 1);

	return gBackendCanvas;
}


function Animation(showWin) {
	this.scale = 1;
	this.visible = false;
	this.showWin = showWin;

	this.init = function(duration, interpolator) {
		this.duration = duration ? duration : 500;
		this.interpolator = interpolator;

		return;
	}

	this.setRectOfFront = function(x, y, w, h) {
		this.frontX = x;
		this.frontY = y;
		this.frontW = w;
		this.frontH = h;

		return;
	}

	this.setScale = function(scale) {
		this.scale = scale;

		return;
	}

	this.prepare = function(x, y, w, h, canvasImage, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.onFinish = onFinish;
		this.canvasImage = canvasImage;

		this.setRectOfFront(0, 0, w, h);
		if(canvasImage) {
			this.sw = canvasImage.width;
			this.sh = canvasImage.height;
		}

		this.show();

		return true;
	}

	this.moveResizeCanvas = function(canvasElement, x, y, w, h) {
		canvasElement.style.position = "absolute";
		canvasElement.width = w;
		canvasElement.height = h;
		canvasElement.style.left = x + "px";
		canvasElement.style.top = y + "px";
		canvasElement.style.width = w + "px";
		canvasElement.style.height = h + "px";
		canvasElement.style.visibility = 'visible';

		return;
	}

	this.show = function() {
		var w = this.w * this.scale;
		var h = this.h * this.scale;

		this.visible = true;
		this.canvasElement = AnimationCanvasGet();

		this.moveResizeCanvas(this.canvasElement, this.x, this.y, w, h);
		document.body.appendChild(this.canvasElement);
		
		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement) {
			document.body.removeChild(this.canvasElement);
			this.canvasElement = null;
		}

		return true;
	}

	this.getTimePercent = function() {
		var date = new Date();
		var elapsed = date.getTime() - this.startTime;

		return elapsed/this.duration;
	}

	this.getPercent = function(timePercent) {
		return this.interpolator.get(timePercent);	
	}

	this.step = function(percent) {
		/*Overwrite it*/
		return true;
	}
	
	this.beforeRun = function() {
		/*Optional Overwrite it*/
		return true;
	}
	
	this.afterRun = function() {
		/*Optional Overwrite it*/
		return true;
	}

	this.drawBackground = function(canvas) {
		if(this.isFirstStep) {
			this.canvas.drawImage(this.canvasImage, 0, 0, this.w, this.h, 0, 0, this.w, this.h);
		}
		else {
			var x = this.frontX;
			var y = this.frontY;
			var w = this.frontW;
			var h = this.frontH;

			this.canvas.drawImage(this.canvasImage, x, y, w, h, x, y, w, h);
		}

		return;
	}

	this.doStep = function(percent) {
		this.canvas.save();
		this.canvas.scale(this.scale, this.scale);
		this.step(percent);
		this.canvas.restore();

		return;
	}
	
	this.run = function() {
		var date = new Date();
		var animation = this;
		this.startTime = date.getTime();
		animation.isFirstStep = true;

		this.beforeRun();

		function animStep() {
			var percent = 0;
			var timePercent = animation.getTimePercent();

			if(timePercent < 1) {
				percent = animation.getPercent(timePercent);
				animation.doStep(percent);

				requestAnimFrame(animStep);
			}
			else {
				animation.cleanup();
				animation.afterRun();
				console.log("Animation done.");
			}
			animation.isFirstStep = false;
		}
		
		animStep();

		return;
	}

	this.cleanup = function() {
		var animation = this;
		var onFinish = this.onFinish;

		setTimeout(function() {
			animation.hide();
		}, 100);

		if(onFinish) {
			onFinish();
		}
	}

	this.hide();

	return this;
}

function setElementPosition(element, x, y) {
	element.style.position = "absolute";
	element.style.left = Math.round(x) + "px";
	element.style.top = Math.round(y) + "px";
	element.style["opacity"] = 1.0;

	return;
}

function moveElement(element, x, y) {
	setElementPosition(element, x, y);

	return;
}

function alphaElement(element, opacity) {
	element.style["opacity"] = opacity;

	return;
}

function showElement(element) {
	element.style["opacity"] = 1;
}

function hideElement(element) {
	element.style["opacity"] = 0;
}

function scaleElement(element, scale, opacity, xOrigin, yOrigin) {
	var origin = (xOrigin && yOrigin) ? xOrigin + " " + yOrigin : "50% 50%";
	var transforms = ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"];

	element.style['transform-style'] = "preserve-3d";
	for(var i = 0; i < transforms.length; i++) {
		var trans = transforms[i];
		element.style[trans + "-origin"] = origin;
		element.style[trans] = "scale("+scale+")";
	}
	element.style["opacity"] = opacity;

	return;
}

function AnimationHTranslateAndroid() {
	Animation.apply(this, arguments);
	
	this.leftToRight = true;

	this.show = function() {
		document.body.appendChild(gBackendCanvas);
		gBackendCanvas.style.zIndex = 9;
		this.canvasElement = gBackendCanvas;
		setElementPosition(gBackendCanvas, this.x, this.y);

		return true;
	}

	this.hide = function() {
		if(this.canvasElement) {
			document.body.removeChild(this.canvasElement);
			this.canvasElement = null;
		}
		return true;
	}

	this.doStep = function(percent) {
		this.step(percent);
		return;
	}

	this.beforeRun = function() {
		var range = this.sw - this.w;
		
		this.range = range * 0.7;
		this.start = range - this.range;

		return;
	}
	
	this.toLeft = function() {
		this.leftToRight = true;

		return;
	}
	
	this.toRight = function() {
		this.leftToRight = false;

		return;
	}

	this.step = function(percent) {
		var ox = 0;
		if(this.leftToRight) {
			ox = this.start + this.range * percent;
		}
		else {
			ox = this.w - this.range * percent - this.start;
		}

		moveElement(gBackendCanvas, -ox+this.x, this.y);

		return true;
	}
}

function AnimationHTranslate() {
	Animation.apply(this, arguments);
	
	this.leftToRight = true;

	this.beforeRun = function() {
		var range = this.sw - this.w;
		
		if(isMobile()) {
			this.range = range * 0.8;
		}
		else {
			this.range = range;
		}

		this.start = range - this.range;
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.toLeft = function() {
		this.leftToRight = true;

		return;
	}
	
	this.toRight = function() {
		this.leftToRight = false;

		return;
	}

	this.step = function(percent) {
		var ox = 0;
		if(this.leftToRight) {
			ox = this.start + this.range * percent;
		}
		else {
			ox = this.w - this.range * percent - this.start;
		}

		if(this.lastOffset === ox) {
			return true;
		}

		this.canvas.drawImage(this.canvasImage, ox, 0, this.w, this.h, 0, 0, this.w, this.h);
		this.lastOffset = ox;
		//console.log("Step: " + percent + " ox=" + ox);
		return true;
	}
}

function AnimationScale() {
	Animation.apply(this, arguments);

	this.to = 1.0;
	this.from = 0;
	this.frontX = 0;
	this.frontY = 0;
	this.frontW = 0;
	this.frontH = 0;

	this.setRange = function(from, to) {
		this.to = to;
		this.from = from;

		return;
	}

	this.beforeRun = function() {
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.step = function(percent) {
		var scale = this.from + percent * (this.to - this.from);
		var alpha = this.to > this.from ? percent : (1-percent);
		if(this.canvasImage) {
			var canvas = this.canvas;
			var cx = this.frontX + 0.5 * this.frontW;
			var cy = this.frontY + 0.5 * this.frontH;

			this.drawBackground(canvas);

			canvas.save();
			canvas.translate(cx, cy);
			canvas.globalAlpha = alpha;
			canvas.scale(scale, scale);
			canvas.translate(-0.5 * this.frontW, -0.5 * this.frontH);

			canvas.drawImage(this.canvasImage, this.frontX + this.w, this.frontY, this.frontW, this.frontH,
				0, 0, this.frontW, this.frontH);
			canvas.restore();
		}

		//console.log("Step: " + percent + " scale=" + scale);
		return true;
	}
}

function AnimationAlpha() {
	Animation.apply(this, arguments);

	this.to = 1.0;
	this.from = 0;
	this.frontX = 0;
	this.frontY = 0;
	this.frontW = 0;
	this.frontH = 0;

	this.setRange = function(from, to) {
		this.to = to;
		this.from = from;

		return;
	}

	this.beforeRun = function() {
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.step = function(percent) {
		var alpha = this.from + percent * (this.to - this.from);

		if(this.canvasImage) {
			var canvas = this.canvas;
			
			canvas.drawImage(this.canvasImage, 0, 0, this.w, this.h, 0, 0, this.w, this.h);
			canvas.save();
			canvas.globalAlpha = alpha;
			canvas.drawImage(this.canvasImage, this.frontX + this.w, this.frontY, this.frontW, this.frontH,
				this.frontX, this.frontY, this.frontW, this.frontH);
			canvas.restore();
		}

		//console.log("Step: " + percent + " alpha=" + alpha);
		return true;
	}
}

function AnimationMove(showWin) {
	Animation.apply(this, arguments);

	this.beforeRun = function() {
		this.range = this.frontH;
		this.canvas = this.canvasElement.getContext("2d");

		return true;;
	}

	this.step = function(percent) {
		this.drawBackground(this.canvas);

		var x = this.frontX;
		var y = this.frontY;
		var w = this.frontW;
		var dy = this.range * percent;
		var h = this.showWin ? dy : (this.range - dy);		
		var oy = this.showWin ? (this.frontY + this.range - dy) : (this.frontY + dy);
		
		if(h > 0) {
			this.canvas.drawImage(this.canvasImage, x+this.w, y, w, h, x, oy, w, h);
		}

		return true;
	}
}

//////////////////////////////////////////////////////////////////

function AnimationBrowser(showWin) {
	Animation.apply(this, arguments);
	
	this.to = 1.0;
	this.from = 0;
	this.frontX = 0;
	this.frontY = 0;
	this.frontW = 0;
	this.frontH = 0;

	function removeCanvas(canvas) {
		try {
			document.body.removeChild(canvas);
		}
		catch(e) {
			console.log(e.toString());
		}

		return;
	}

	this.setRange = function(from, to) {
		this.to = to;
		this.from = from;

		return;
	}

	this.onShowCanvas = function() {
		setElementPosition(this.oldWinCanvas, this.x, this.y);
		setElementPosition(this.newWinCanvas, this.x, this.y);
		showElement(this.oldWinCanvas);
		showElement(this.newWinCanvas);

		return;
	}

	this.showCanvas = function(oldWinZIndex, newWinZIndex) {
		var w = this.w;
		var h = this.h;
		var oldWinCanvas = AnimationOldWinCanvasGet();
		var newWinCanvas = AnimationNewWinCanvasGet();

		this.moveResizeCanvas(oldWinCanvas, this.x, this.y, w, h);
		this.moveResizeCanvas(newWinCanvas, this.x, this.y, w, h);

		oldWinCanvas.style.zIndex = oldWinZIndex;
		newWinCanvas.style.zIndex = newWinZIndex;
		
		var oldWin = oldWinCanvas.getContext("2d");
		var newWin = newWinCanvas.getContext("2d");

		if(this.showWin) {
			oldWin.drawImage(gBackendCanvas, 0, 0, w, h, 0, 0, w, h);
			newWin.drawImage(gBackendCanvas, this.w, 0, w, h, 0, 0, w, h);
		}
		else {
			newWin.drawImage(gBackendCanvas, 0, 0, w, h, 0, 0, w, h);
			oldWin.drawImage(gBackendCanvas, this.w, 0, w, h, 0, 0, w, h);
		}

		this.oldWinCanvas = oldWinCanvas;
		this.newWinCanvas = newWinCanvas;

		this.onShowCanvas();
	
		if(oldWinZIndex > newWinZIndex) {
			document.body.appendChild(newWinCanvas);
			document.body.appendChild(oldWinCanvas);
		}
		else {
			document.body.appendChild(newWinCanvas);
			document.body.appendChild(oldWinCanvas);
		}

		return true;
	}
	
	this.show = function() {
		this.showCanvas(8, 9);

		return true;
	}

	this.hide = function() {
		if(this.oldWinCanvas && this.newWinCanvas) {
			if(this.showWin) {
				removeCanvas(this.oldWinCanvas);
				removeCanvas(this.newWinCanvas);
			}
			else {
				removeCanvas(this.oldWinCanvas);
				removeCanvas(this.newWinCanvas);
			}
			this.newWinCanvas = null;
			this.oldWinCanvas = null;
		}

		return true;
	}

	this.afterRun = function() {
	}

	this.doStep = function(percent) {
		this.step(percent);
		return;
	}

	this.step = function(percent) {
		var scale = this.from + percent * (this.to - this.from);
		var alpha = percent;
		scaleElement(this.newWinCanvas, scale, alpha);

		return true;
	}
}

function AnimationBrowserScaleWin(showWin) {
	AnimationBrowser.apply(this, arguments);
	
	this.onShowCanvas = function() {
		setElementPosition(this.oldWinCanvas, this.x, this.y);
		setElementPosition(this.newWinCanvas, this.x, this.y);
		showElement(this.oldWinCanvas);
		hideElement(this.newWinCanvas);

		return;
	}
	
	this.step = function(percent) {
		var alpha = percent;
		var scale = this.from + percent * (this.to - this.from);

		scaleElement(this.newWinCanvas, scale, alpha);

		return true;
	}
}

function AnimationBrowserScaleDialog(showWin) {
	AnimationBrowser.apply(this, arguments);
	
	this.show = function() {
		if(this.showWin) {
			this.showCanvas(8, 9);
		}
		else {
			this.showCanvas(9, 8);
		}

		return true;
	}
	
	this.step = function(percent) {
		var scale = this.from + percent * (this.to - this.from);
		var alpha = this.showWin ? percent : 1-percent;

		if(this.showWin) {
			scaleElement(this.newWinCanvas, scale, alpha);
		}
		else {
			scaleElement(this.oldWinCanvas, scale, alpha);
		}

		return true;
	}
}

function AnimationBrowserAlpha(showWin) {
	AnimationBrowser.apply(this, arguments);
	
	this.show = function() {
		if(this.showWin) {
			this.showCanvas(8, 9);
		}
		else {
			this.showCanvas(9, 8);
		}
	}

	this.step = function(percent) {
		var alpha = this.from + percent * (this.to - this.from);

		if(this.showWin) {
			alphaElement(this.newWinCanvas, alpha);
		}
		else {
			alphaElement(this.oldWinCanvas, alpha);
		}

		return true;
	}
}
function AnimationBrowserMove(showWin) {
	AnimationBrowser.apply(this, arguments);

	this.onShowCanvas = function() {
		if(this.showWin) {
			setElementPosition(this.oldWinCanvas, this.x, this.y);
			setElementPosition(this.newWinCanvas, this.x, this.frontH);
		}
		else {
			setElementPosition(this.oldWinCanvas, this.x, this.y);
			setElementPosition(this.newWinCanvas, this.x, this.y);
		}
		showElement(this.oldWinCanvas);
		showElement(this.newWinCanvas);

		return;
	}

	this.show = function() {
		if(this.showWin) {
			this.showCanvas(8, 9);
		}
		else {
			this.showCanvas(9, 8);
		}

		return;
	}

	this.step = function(percent) {
		var oy = 0;
		this.range = this.frontH;
		var dy = this.range * percent;
		if(this.showWin) {
			oy = this.range - dy;
			moveElement(this.newWinCanvas, 0, oy);
		}
		else {
			oy = dy;
			moveElement(this.oldWinCanvas, 0, oy);
		}
	
		return true;
	}
}

//////////////////////////////////////////widget animations/////////////////////////////////////////

var C_DIR_UP = 1;
var C_DIR_DOWN = 2;
var C_DIR_LEFT = 3;
var C_DIR_RIGHT = 4;
var C_ACTION_EXPAND = 1;
var C_ACTION_COLLAPSE = 2;

function Animation1Expand() {
	Animation.apply(this, arguments);
	
	this.prepare = function(x, y, w, h, canvasImage, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.onFinish = onFinish;
		this.canvasImage = canvasImage;
		
		this.xto = this.xfrom = 0;
		this.yto = this.yfrom = 0;
		this.wto = this.wfrom = w;
		this.hto = this.hfrom = h;
		
		this.show();

		return;
	}

	this.expandV = function(up) {
		this.direction = up? C_DIR_UP : C_DIR_DOWN;
		this.action =  C_ACTION_EXPAND;
		this.yfrom = this.h;
		this.yto = 0;
		this.hfrom = 0;
		this.hto = this.h;

		return;
	}
	
	this.expandH = function(left) {
		this.direction = left ? C_DIR_LEFT : C_DIR_RIGHT;
		this.action =  C_ACTION_EXPAND;
		this.xfrom = this.w;
		this.xto = 0;
		this.wfrom = 0;
		this.wto = this.w;

		return;
	}
	
	this.collapseV = function(up) {
		this.direction = up? C_DIR_UP : C_DIR_DOWN;
		this.action =  C_ACTION_COLLAPSE;
		this.yfrom = 0;
		this.yto = this.h;
		this.hfrom = this.h;
		this.hto = 0;

		return;
	}
	
	this.collapseH = function(left) {
		this.direction = left ? C_DIR_LEFT : C_DIR_RIGHT;
		this.action =  C_ACTION_COLLAPSE;
		this.xfrom = 0;
		this.xto = this.w;
		this.wfrom = this.w;
		this.wto = 0;

		return;
	}

	this.expandUp = function() {
		return this.expandV(true);
	}
	
	this.expandDown = function() {
		return this.expandV(false);
	}

	this.expandLeft = function() {
		return this.expandH(true);
	}

	this.expandRight = function() {
		return this.expandH(false);
	}

	this.collapseUp = function() {
		return this.collapseV(true);
	}
	
	this.collapseDown = function() {
		return this.collapseV(false);
	}

	this.collapseLeft = function() {
		return this.collapseH(true);
	}

	this.collapseRight = function() {
		return this.collapseH(false);
	}

	this.show = function() {
		this.canvasElement = AnimationCanvasGet(); 
		this.moveResizeCanvas(this.canvasElement, this.x, this.y, this.w, this.h);
		this.canvas = this.canvasElement.getContext("2d");
		document.body.appendChild(this.canvasElement);
		this.canvasElement.style.zIndex = 9;
		setElementPosition(this.canvasElement, this.x, this.y);
		showElement(this.canvasElement);

		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement) {
			document.body.removeChild(this.canvasElement);
			this.canvasElement = null;
		}

		return true;
	}

	this.step = function(percent) {
		var canvas = this.canvas;
		var x = this.xfrom + ((this.xto - this.xfrom) * percent);
		var y = this.yfrom + ((this.yto - this.yfrom) * percent);
		
		var w = this.wfrom + (this.wto - this.wfrom) * percent;
		var h = this.hfrom + (this.hto - this.hfrom) * percent;

		if(!w || !h) {
			return;
		}

		canvas.clearRect(0, 0, this.w, this.h);
		
		var dx = x;
		var dy = y;
		var sx = x;
		var sy = y;

		if(this.action === C_ACTION_EXPAND) {
			switch(this.direction) {
				case C_DIR_UP: {
					sy = 0;			
					break;
				}
				case C_DIR_DOWN: {
					dy = 0;			
					break;
				}
				case C_DIR_LEFT: {
					sx = 0;			
					break;
				}
				case C_DIR_RIGHT: {
					dx = 0;			
					break;
				}
			}
		}
		else {
			switch(this.direction) {
				case C_DIR_UP: {
					dy = 0;			
					break;
				}
				case C_DIR_DOWN: {
					sy = 0;			
					break;
				}
				case C_DIR_LEFT: {
					dx = 0;			
					break;
				}
				case C_DIR_RIGHT: {
					sx = 0;			
					break;
				}
			}
		}

		//console.log("y:" + y + " h:" + h);
		canvas.drawImage(this.canvasImage, sx, sy, w, h, dx, dy, w, h);
		//canvas.fillRect(dx, dy, w, h);

		return true;
	}
}

function Animation1Alpha() {
	Animation.apply(this, arguments);
	
	this.prepare = function(x, y, w, h, canvasImage, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.onFinish = onFinish;
		this.canvasImage = canvasImage;
		
		this.show();

		return;
	}

	this.setRange = function(from, to) {
		this.from = from;
		this.to = to;

		return;
	}
	
	this.show = function() {
		this.canvasElement = AnimationCanvasGet(); 
		this.moveResizeCanvas(this.canvasElement, this.x, this.y, this.w, this.h);
		this.canvas = this.canvasElement.getContext("2d");
		document.body.appendChild(this.canvasElement);
		this.canvasElement.style.zIndex = 9;
		setElementPosition(this.canvasElement, this.x, this.y);
		showElement(this.canvasElement);

		this.canvas.drawImage(this.canvasImage, 0, 0, this.w, this.h, 0, 0, this.w, this.h);

		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement) {
			try {
				document.body.removeChild(this.canvasElement);
			}catch(e) {
				console.log("document.body.removeChild: not found.");
			}
			this.canvasElement = null;
		}

		return true;
	}

	this.step = function(percent) {
		var canvas = this.canvas;
		var opacity = this.from + (this.to - this.from) * percent;

		alphaElement(this.canvasElement, opacity);
		console.log("opacity:" + opacity);
		return true;
	}
}

function Animation1Scale() {
	Animation.apply(this, arguments);
	
	this.prepare = function(x, y, w, h, canvasImage, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.xOrigin = "50%";
		this.yOrigin = "50%";
		this.onFinish = onFinish;
		this.canvasImage = canvasImage;
		
		this.show();

		return;
	}

	this.setOrigin = function(xOrigin, yOrigin) {
		this.xOrigin = xOrigin;
		this.yOrigin = yOrigin;

		return;
	}

	this.setRange = function(from, to) {
		this.from = from;
		this.to = to;

		return;
	}
	
	this.show = function() {
		this.canvasElement = AnimationCanvasGet(); 
		this.moveResizeCanvas(this.canvasElement, this.x, this.y, this.w, this.h);
		this.canvas = this.canvasElement.getContext("2d");
		document.body.appendChild(this.canvasElement);
		this.canvasElement.style.zIndex = 9;
		setElementPosition(this.canvasElement, this.x, this.y);
		showElement(this.canvasElement);

		this.canvas.drawImage(this.canvasImage, 0, 0, this.w, this.h, 0, 0, this.w, this.h);

		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement) {
			document.body.removeChild(this.canvasElement);
			this.canvasElement = null;
		}

		return true;
	}

	this.step = function(percent) {
		var canvas = this.canvas;
		var scale = this.from + (this.to - this.from) * percent;
		var alpha = this.showWin ? percent : 1-percent;

		scaleElement(this.canvasElement, scale, alpha, this.xOrigin, this.yOrigin);

		return true;
	}
}

function animateUIElement(uiElement, animHint) {
	var visible = false;
	var scale = uiElement.getRealScale();
	var p = uiElement.getPositionInView();
	var pv = uiElement.view.getAbsPosition();

	var x = Math.round(p.x * scale) + pv.x;
	var y = Math.round(p.y * scale) + pv.y;
	var w = Math.round(uiElement.w * scale);
	var h = Math.round(uiElement.h * scale);

	var canvasElement = BackendCanvasGet(w, h);
	var canvas = canvasElement.getContext("2d");

	canvas.save();
	visible = uiElement.visible;
	uiElement.visible = true;
	canvas.scale(scale, scale);
	canvas.translate(-uiElement.x, -uiElement.y);
	uiElement.paint(canvas);
	uiElement.visible = visible;
	canvas.restore();

	var anim = animationCreate(animHint);

	anim.prepare(x, y, w, h, canvasElement, function() {
		uiElement.setVisible(!visible);
		uiElement.postRedraw();
	});

	if(visible) {
		uiElement.setVisible(!visible);
		uiElement.postRedraw();
	}

	switch(animHint) {
		case "anim-expand-up": {
			anim.expandUp();
			break;
		}
		case "anim-expand-left": {
			anim.expandLeft();
			break;
		}
		case "anim-expand-right": {
			anim.expandRight();
			break;
		}
		case "anim-expand-down": {
			anim.expandDown();
			break;
		}
		case "anim-collapse-up": {
			anim.collapseUp();
			break;
		}
		case "anim-collapse-left": {
			anim.collapseLeft();
			break;
		}
		case "anim-collapse-right": {
			anim.collapseRight();
			break;
		}
		case "anim-collapse-down": {
			anim.collapseDown();
			break;
		}
		case "anim-scale1-show-origin-topleft": {
			anim.setOrigin("0%", "0%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show-origin-center": {
			anim.setOrigin("50%", "50%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show-origin-bottomleft": {
			anim.setOrigin("0%", "100%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show-origin-topright": {
			anim.setOrigin("100%", "0%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show-origin-bottomright": {
			anim.setOrigin("100%", "100%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show": {
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-hide-origin-topleft": {
			anim.setOrigin("0%", "0%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide-origin-center": {
			anim.setOrigin("50%", "50%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide-origin-bottomleft": {
			anim.setOrigin("0%", "100%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide-origin-topright": {
			anim.setOrigin("100%", "0%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide-origin-bottomright": {
			anim.setOrigin("100%", "100%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide": {
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-alpha1-show": {
			anim.setRange(0.2, 1.0);
			break;
		}
		case "anim-alpha1-hide": {
			anim.setRange(1.0, 0.2);
			break;
		}
	}

	anim.run();

	return;
}


function testAnimation1Expand(uiElement) {
	var testElement = uiElement.getWindow().findChildByName("ui-button-test", true);

	testElement.setVisible(false);
	testElement.postRedraw();
	setTimeout(function() {
		animateUIElement(testElement, "anim-alpha1-show");
	}, 100);
	
	setTimeout(function() {
		animateUIElement(testElement, "anim-alpha1-hide");
	}, 3000);

	return;
}

////////////////////////////////////////////////////////////////////////////////////

function DeviceLocalFileSystem() {
	this.rootEntry = null;
	this.fileSystem = null;
	
	this.setContentType = function(contentType) {
		this.contentType = contentType;

		return;
	}
	
	this.setInitPath = function(path) {
		return path;
	}
	
	this.setVirtualRoot = function(path) {
		return path;
	}

	this.init = function() {
		var me = this;	

		function gotFS(fileSystem) {
			console.log("gotFS");
			me.fileSystem = fileSystem;
			me.rootEntry = fileSystem.root;
			
			return;
		}

		function getFsFail(error) {
			console.log("requestFileSystem failed: " + error);

			return;
		}

		console.log("init");

		window.requestFileSystem(1, 2*1024*1024, gotFS, getFsFail);
	}

	this.list = function (path, onItems) {
		var onGetDirectoryOK = function(dirEntry) {
			function onReadEntriesOK(entries) {
				var items = [];
				for (var i=0; i<entries.length; i++) {
					var item = {};
					var iter = entries[i];
					
					if(iter.name.indexOf(".") === 0) {
						continue;
					}

					item.size = 0;
					item.mtime = 0;
					item.name = iter.name;
					item.type = iter.isDirectory ? "folder" : "file";
					
					iter.getMetadata(function(metadata) {
						item.mtime = metadata.modificationTime;
					}, function(error) {
					});
					items.push(item);
				}
				onItems(items);
				
				console.log("onReadEntriesOK");
			}

			function readEntriesFail(error) {
				onItems(null);
			}

			var directoryReader = dirEntry.createReader();
			directoryReader.readEntries(onReadEntriesOK, readEntriesFail);
			console.log("onGetDirectoryOK");

			return;
		}
		
		function onGetDirectoryFail(error) {
			console.log("error getting dir:" + path)
		}

		console.log("list");
		this.fileSystem.root.getDirectory(path, {create: true, exclusive: false}, onGetDirectoryOK, onGetDirectoryFail);
		return;
	}

	this.read = function(filename, onContent) {
		function gotFile(file) {
        	var reader = new FileReader();
        	reader.onloadend = function(evt) {
        		onContent(filename, evt.target.result);
        	};
        	reader.readAsText(file);

        	return;
		}

		function getFileFail(error) {
			console.log("getFile Failed: " + filename);
		}
		
		function gotFileEntry(fileEntry) {
			fileEntry.file(gotFile, getFileFail);

			return;
		}

		this.fileSystem.root.getFile(filename, {create: false, exclusive: false}, gotFileEntry, getFileFail);

		return;
	}
	
	this.remove = function(filename, onDone) {
		function onError(e) {
			onDone(false);
			console.log('Remove File Fail:' + filename);
			return;
		}

		this.fileSystem.root.getFile(filename, {create: false}, function(fileEntry) {
			fileEntry.remove(function() {
				onDone(true);
				console.log('File removed:' + filename);
			}, onError);
		}, onError);

		return;
	}

	this.save = function(filename, content, onDone) {
		function win(writer) {
			writer.onerror = function(evt) {
				console.log("write failed:" + filename);
				onDone(false, filename);
			};

			if(writer.length) {
				writer.truncate(0);
				console.log("truncate " + filename);
				writer.onwriteend = function(evt) {
					console.log("writer.truncate done");

					writer.onwriteend = function(evt) {
						console.log("write success:" + filename);
						onDone(true, filename);
					}
					writer.write(content);
				}
			}
			else {
				writer.onwriteend = function(evt) {
					console.log("write success:" + filename);
					onDone(true, filename);
				}
				writer.write(content);
			}

			return;
		}

		function fail(error) {
			alert(dappGetText("Write File Failed: " + filename));
			console.log("getFile Failed: " + filename + " code:" + error.code);
		}
		
		function gotFileEntry(fileEntry) {
			fileEntry.createWriter(win, fail);
			return;
		}
	
		this.fileSystem.root.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);

		return;
	}

	this.init();

	return;
}

////////////////////////////////////////////////////////////////////////////////////

function WebStorageFileSystem() {
	this.setContentType = function(contentType) {
		this.contentType = contentType;

		return;
	}

	this.setInitPath = function(cwd) {
		return "/";
	}
	
	this.setVirtualRoot = function(path) {
		return "/";
	}

	this.fileNameToName = function(fileName) {
		var arr = fileName.split("/");
		return arr.pop();
	}
	
	this.makeKey = function(name) {
		return "fs-" + name;
	}

	this.getMetaInfos = function() {
		var str = localStorage.fsMetaInfos;
		var metaInfos = str ? JSON.parse(str) : null;

		if(!metaInfos) {
			metaInfos = [];
		}

		return metaInfos;
	}
	
	this.removeMetaInfo = function(name) {
		var metaInfos = this.getMetaInfos();

		for(var i = 0; i < metaInfos.length; i++) {
			var iter = metaInfos[i];
			if(iter.name == name) {
				metaInfos.splice(i, 1);
				break;
			}
		}

		localStorage.fsMetaInfos = JSON.stringify(metaInfos);

		return;
	}

	this.addMetaInfo = function(name, time, size) {
		var metaInfos = this.getMetaInfos();

		for(var i = 0; i < metaInfos.length; i++) {
			var iter = metaInfos[i];
			if(iter.name == name) {
				metaInfos.splice(i, 1);
				break;
			}
		}

		var metaInfo = {};
		metaInfo.name = name;
		metaInfo.size = size;
		metaInfo.mtime = time;
		metaInfos.push(metaInfo);

		localStorage.fsMetaInfos = JSON.stringify(metaInfos);

		return;
	}

	this.list = function (path, onItems) {
		var items = [];
		var metaInfos = this.getMetaInfos();

		for(var i = 0; i < metaInfos.length; i++) {
			var iter = metaInfos[i];
			var item = {};					

			item.type = "file";
			item.name = iter.name;
			item.size = iter.size;
			item.mtime = iter.mtime;

			items.push(item);					
		}		
		onItems(items);
		
		return;
	}

	this.read = function(filename, onContent) {
		var name = this.fileNameToName(filename);
		var content = localStorage[this.makeKey(name)];

		onContent(filename, content);

		return;
	}
	
	this.remove = function(filename, onDone) {
		var name = this.fileNameToName(filename);
		
		delete localStorage[this.makeKey(name)];
		this.removeMetaInfo(name);

		onDone(true, filename);

		return;
	}

	this.save = function(filename, content, onWriteDone) {
		var name = this.fileNameToName(filename);
		var now = (new Date()).getTime();
		var size = content ? content.length : 0;

		this.addMetaInfo(name, now, size);
		localStorage[this.makeKey(name)] = content;

		onWriteDone(true, filename);

		return;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////

var gDefaultFileSystem = null;

function getDefaultFileSystem() {
	if(!gDefaultFileSystem) {
		appInitFilesystem();
	}

	return gDefaultFileSystem;
}

function appInitFilesystem() {
	if(gDefaultFileSystem) {
		return;
	}

	if(window.tizen) {
		tizenFsInit();
		gDefaultFileSystem = new TizenFileSystem();
	}
	else if(window.requestFileSystem) {
		gDefaultFileSystem = new DeviceLocalFileSystem();	
	}
	else {
		gDefaultFileSystem = new WebStorageFileSystem();
	}

	console.log("window.requestFileSystem: " + window.requestFileSystem);

	return;
}

///////////////////////////////////////////////////////////////////////////////////////////
var tizenStockDirs = {};
var tizenStockDirNames = ["documents", "downloads", "images", "music", "removable", "videos"];

function tizenFsInit() {
	function onTizenFsError(e) {
		console.log("tizen.filesystem.resolve Error: " + e.message);
	}

	function resolveOne(name) {
		console.log("resolve: " + name);
		tizen.filesystem.resolve(name, function(dir) {
			dir.name = dir.name ? dir.name : name;
			tizenStockDirs[name] = dir;
			console.log("tizen.filesystem.resolve done:" + name + ":" + dir);
		}, onTizenFsError, 'rw');
	}
	
	for(var i = 0; i < tizenStockDirNames.length; i++) {
		var iter = tizenStockDirNames[i];
		try {
			resolveOne(iter);
		}catch(e) {
			console.log(e.message);
		}
	}
	
	console.log("tizenFsInit");

	return;
}

function TizenFileSystem() {
	this.contentType = "String";

	this.setContentType = function(contentType) {
		this.contentType = contentType;

		return;
	}

	this.setInitPath = function(path) {
		return path;
	}
	
	this.setVirtualRoot = function(path) {
		return path
	}

	this.getDirHandle = function(path, onDone) {
		var index = 1;
		var arr = path.split("/");
		arr.remove("");
		arr.remove("");
		
		var rootDirName = arr.length > 0 ? arr[0] :  "/";
		var rootDir = tizenStockDirs[rootDirName];
		var currentDir = rootDir;
	
		if(!rootDir) {
			onDone(rootDir);

			return;
		}

		if(arr.length < 2) {
			onDone(rootDir);

			return;
		}

		function onFail(e) {
			console.log(e.message);
		}
				
		function onListFiles(items) {
			var found = false;
			var name = arr[index];
			
			for(var i = 0; i < items.length; i++) {
				var iter = items[i];
				if(iter.name == arr[index]) {
					if(!iter.isDirectory) {
						currentDir = null;
						onDone(null);
						return;
					}
					found = true;
					
					index += 1;
					currentDir = iter;
					if(index < arr.length) {
						currentDir.listFiles(onListFiles, onFail);
					}
					else {
						onDone(currentDir);
					}
				}
			}
			
			if(!found) {
				currentDir = currentDir.createDirectory(name);
				index += 1;
				if(index < arr.length) {
					currentDir.listFiles(onListFiles, onFail);
				}
				else {
					onDone(currentDir);
				}
			}
		}

		rootDir.listFiles(onListFiles, onFail);
	}

	this.list = function (path, onItems) {
		if(!path || path === "/") {
			var items = [];
			
			for(var i = 0; i < tizenStockDirNames.length; i++) {
				var iter = tizenStockDirNames[i];
				var dir = tizenStockDirs[iter];
				
				if(dir) {
					var item = {};					
					item.type = "folder";
					item.name = iter;
					item.size = dir.length;
					item.userData = dir;
					items.push(item);					
					
					console.log(i + ": " + item.name + " " + item.type);
				}
			}		
			onItems(items);
			
			return;
		}
		
		function onDone(dir) {
			function onListFiles(arr) {
				var items = []
				
				for(var i = 0; i < arr.length; i++) {
					var item = {};
					var iter = arr[i];
					
					item.type = iter.isFile ? "file" : "folder";
					item.name = iter.name;
					item.size = iter.isFile ? iter.fileSize : iter.length;
					item.userData = iter;
					
					console.log(i + ": " + item.name + " " + item.type);
					items.push(item);
				}
				
				onItems(items);
			}
			
			function onFail(e) {
				onItems(null);
			}
			dir.listFiles(onListFiles, onFail);
		}
		
		this.getDirHandle(path, onDone);

		return;
	}

	this.read = function(filename, onContent) {
		var me = this;
		var arr = filename.split("/");
		var name = arr.pop();
		var path = arr.join("/");
		
		function onDone(dir) {
			function onOpenStream(fs) {
				var content = null;

				if(me.contentType == "ArrayBytes") {
					content = fs.readBytes(fs.bytesAvailable);
				}
				else if(me.contentType == "ArrayBuffer") {
					var data = fs.readBytes(fs.bytesAvailable);
					var n = data.length;

					content = new Uint8Array(n); 
					for(var i = 0; i < n; i++) {
						content[i] = data[i];
					}

					console.log("Read As ArrayBuffer: length=" + n);
				}
				else {
					content = fs.read(fs.bytesAvailable);
					console.log("Read As String: length=" + content.length);
				}

				onContent(filename, content);
				fs.close();
			}
			
			function onFail(e) {
				onContent(filename, null);
			}
			
			function onListFiles(arr) {		
				for(var i = 0; i < arr.length; i++) {
					var iter = arr[i];
					
					if(iter.name == name) {
						if(iter.isFile) {
							iter.openStream("r", onOpenStream, onFail,"UTF-8");
						}
						else {
							onContent(filename, null);
						}
						
						return;
					}
				}
				
				onContent(filename, null);
			}
	
			dir.listFiles(onListFiles, onFail);
		}
		
		this.getDirHandle(path, onDone);
		
		return;
	}
	
	this.remove = function(filename, onDone) {
		var arr = filename.split("/");
		var rootDirName = arr.shift();

		while(!rootDirName && arr.length) {
			rootDirName = arr.shift();
		}
		filename = arr.join("/");

		function onSuccess(e) {
			onDone(true);
			console.log("deleteFile OK:" + filename);
		}
		
		function onFailed(e) {
			onDone(false);
			console.log("deleteFile Failed:" + e.message);
		}
		
		var rootDir = tizenStockDirs[rootDirName];
		if(rootDir) {
			try {
				rootDir.deleteFile(rootDir.fullPath + "/" +filename, onSuccess, onFailed);
			}catch(e) {
				console.log("deleteFile Failed: " + e.message);
			}
		}
		else {
			onDone(false);
		}

		return;
	}

	this.save = function(filename, content, onWriteDone) {
		var me = this;
		var arr = filename.split("/");
		var name = arr.pop();
		var path = arr.join("/");
		
		function onDone(dir) {
			if(!dir) {
				alert("Save File Failed.");
				onWriteDone(false, filename);
				return;
			}

			function onOpenStream(fs) {
				try {
					if(me.contentType == "base64") {
						if(content.indexOf("data:") >= 0 && content.indexOf(";base64,") > 0) {
							var offset = content.indexOf(";base64,") + 8;
							fs.writeBase64(content.substr(offset));
						}
						else {
							fs.writeBase64(content);
						}
					}
					else if(me.contentType == "ArrayBytes") {
						fs.writeBytes(content);
					}
					else if(me.contentType == "ArrayBuffer") {
						var data = [];
						var n = content.byteLength; 
						var arr = new Uint8Array(content);

						for(var i = 0; i < n; i++) {
							data.push(arr[i]);
						}

						fs.writeBytes(data);
					}
					else {
						fs.write(content);
					}
					fs.close();
					onWriteDone(true, filename);
				}
				catch(e) {
					onWriteDone(false, filename);
				}
			}
			
			function onFail(e) {
				alert("Save File Failed.");
				onWriteDone(false, filename);
			}
			
			function onListFiles(arr) {		
				for(var i = 0; i < arr.length; i++) {
					var iter = arr[i];
					
					if(iter.name == name) {
						if(iter.isFile) {
							iter.openStream("w", onOpenStream, onFail,"UTF-8");
						}
						else {
							onWriteDone(false, filename);
						}
						
						return;
					}
				}
				
				var file = dir.createFile(name);
				file.openStream("w", onOpenStream, onFail,"UTF-8");
			}
	
			dir.listFiles(onListFiles, onFail);
		}
		
		this.getDirHandle(path, onDone);

		return;
	}
}
////////////////////////////////////////////////////////////////////////////////////

function FileBrowser() {
	this.cwd = "/";
	this.cacheEntries = {};

	this.fs = getDefaultFileSystem();

	this.normalizePath = function(path) {
		var str = path ? path : "";
		var arr = str.split("/");
		arr.remove("");
		arr.remove("");
		arr.remove("");
		
		str = arr.length ? ("/" + arr.join("/") + "/") : "/";
		
		return str;
	}

	this.setVirtualRoot = function(virtualRoot) {
		this.virtualRoot = this.fs.setVirtualRoot(this.normalizePath(virtualRoot));

		return;
	}

	this.initForSave = function(initPath, initFileName, content, onDone, fs) {
		if(fs) {
			this.fs = fs;
		}

		this.content = content;
		this.cwd = this.fs.setInitPath(this.normalizePath(initPath));
		this.initFileName = initFileName;
		this.onDone = onDone;

		this.cacheEntries = {};

		return;
	}

	this.initForOpen = function(initPath, onContent, fs) {
		if(fs) {
			this.fs = fs;
		}

		this.cwd = this.fs.setInitPath(this.normalizePath(initPath));
		this.onContent = onContent;
		this.cacheEntries = {};

		return;
	}

	this.filteItemByExtNames = function(extNames) {
		function filter(item) {
			for(var i = 0; i < extNames.length; i++) {
				var ext = extNames[i];
				if(item.name.indexOf(ext) > 0) {
					return true;
				}
			}

			return false;
		}

		if(extNames) {
			this.setItemFilter(filter);
		}
		else {
			this.setItemFilter(null);
		}
	}
	
	this.setItemFilter = function(filter) {
		this.filter = filter;

		return;
	}

	this.getSizeStr = function(item) {
		var str = "";
		var sizeStr = "";
		var size = item.size;

		if(item.type === "file") {
			if(size > 1024 * 1024) {
				size = size/(1024*1024);
				sizeStr = size + "";
				sizeStr = sizeStr.substr(0, 4);
				sizeStr = sizeStr + "MB";
			}
			else if(size > 1024) {
				size = size >> 10;
				sizeStr = size + "";
				sizeStr = sizeStr.substr(0, 4);
				sizeStr = sizeStr + "KB";
			}
			else {
				sizeStr = size + "Bytes";
			}

			str = sizeStr;
		}
		else {
			if(item.items) {
				sizeStr = item.items.length + " Items";
			}
			else {
				sizeStr = 0 + " Items";
			}
			str = sizeStr;
		}

		return str;
	}

	this.getDateInfo = function(item) {
		var dateStr = "";
		var date = item.mtime ? new Date(item.mtime) : new Date();
		dateStr = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " 
			+ date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

		return dateStr;
	}

	this.getMimeIcon = function(item) {
		var url = "";
		var filename = item.name;
		var path = 'drawapp8/images/common/mimetypes/';

		if(item.type === "folder") {
			if(filename === "..") {
				url = path + "goback.png";
			}
			else {
				url = path + "folder.png";
			}
		}
		else 
		{
			if(filename.indexOf(".png") >= 0 || filename.indexOf(".jpg") >= 0) {
				url = path + "image.png";	
			}
			else {
				url = path + "text.png";	
			}
		}

		return url
	}

	this.createItem = function(iter, icon, name, dateStr) {
		var item = {children:[]};
		item.userData = iter;
		item.children.push({children:[]});
		item.children[0].children.push({image:icon});
		item.children[0].children.push({children:[]});
		item.children[0].children[1].children.push({text:name});
		item.children[0].children[1].children.push({text:dateStr});

		return item;
	}

	this.list = function(win) {
		var me = this;
		win.setValueOf("ui-label-cwd", this.cwd);
		console.log("list: " + this.cwd);

		var list = win.findChildByName("ui-list-view", true);

		if(this.cacheEntries[this.cwd]) {
			list.bindData(this.cacheEntries[this.cwd], null, true);
			console.log("list: found cached entries.");
			return;
		}
		
		list.setEnable(false);
		this.fs.list(this.cwd, function(items) {
			var iter = {};
			var icon = null;
			var data = {children:[]};
			var item = {type:"folder", name: "..", children:[]};
		
			if(me.canUp()) {
				iter.name = "..";
				iter.type = "folder";

				icon = me.getMimeIcon(iter);
				item = me.createItem(iter, icon, "Up", "Return To Parent");
				item.userData = null;

				data.children.push(item);
			}

			if(items) {
				items.sort(function(a, b) {
					if(a.name < b.name) {
						return -1;
					}
					else if(a.name > b.name) {
						return 1;
					}
					else {
						return 0;
					}
				});

				for(var i = 0; i < items.length; i++) {
					iter = items[i];

					if(iter.type === "file") {
						continue;
					}
					
					var dateStr = me.getDateInfo(iter);
					icon = me.getMimeIcon(iter);
					item = me.createItem(iter, icon, iter.name, dateStr);
					data.children.push(item);
				}
				
				for(var i = 0; i < items.length; i++) {
					iter = items[i];
			
					if(iter.name.indexOf(".") === 0) {
						continue;
					}

					if(iter.type !== "file") {
						continue;
					}

					if(me.filter && !me.filter(iter)) {
						continue;
					}
					
					var dateStr = me.getDateInfo(iter);
					icon = me.getMimeIcon(iter);
					item = me.createItem(iter, icon, iter.name, dateStr);
					data.children.push(item);
				}
			}

			list.bindData(data, null, true);

			me.cacheEntries[me.cwd] = data;
			list.setEnable(true);
		});

		return;
	}

	this.canUp = function() {
		if(this.virtualRoot && this.virtualRoot == this.cwd) {
			return false;
		}

		if(!this.cwd || this.cwd == "/") {
			return false;
		}
		else {
			return true;
		}
	}

	this.up = function(win) {
		var items = this.cwd.split("/");

		items.remove("", true);
		if(items.length) {
			items.length = items.length - 1;
		}

		if(items.length) {
			this.cwd = "/" + items.join("/") + "/";
		}
		else {
			this.cwd = "/";
		}
		this.list(win);

		return;
	}
	
	this.enter = function(win, item) {
		this.cwd = this.cwd + item.name + "/";
		this.list(win);

		return;
	}

	this.read = function(win, item) {
		var onContent = this.onContent;
		var filename = this.cwd + item.name;
		if(onContent) {
			this.fs.read(filename, 
				function(filename, content) {
					onContent(filename, content);
					win.closeWindow(content);
				});
		}

		return;
	}
	
	this.remove = function(win, item) {
		if(item.type != "file") {
			alert("You Cannot Remove Directory At Here!");
			return;
		}

		var filename = this.cwd + item.name;
		this.fs.remove(filename, function(result, filename) {
			if(!result) {
				alert("Remove File Failed!");
			}
		});

		return;
	}

	this.save = function(win, item) {
		var onDone = this.onDone;
		var filename = this.cwd + item.name;

		if(this.initFileName) {
			var arr = this.initFileName.split(".");
			var extName = arr.pop();

			if(extName && filename.indexOf(extName) < 0) {
				filename = filename + "." + extName;
			}
		}

		this.fs.save(filename, this.content, 
			function(result, filename) {
				if(onDone) {
					onDone(result, filename);
					win.closeWindow(result);
				}
			});
		this.content = null;

		return;
	}
}


var gFileBrowser = null;
function FileBrowserGet() {
	if(!gFileBrowser) {
		cantkPreloadImage("drawapp8/images/common/mimetypes/goback.png");
		cantkPreloadImage("drawapp8/images/common/mimetypes/folder.png");
		cantkPreloadImage("drawapp8/images/common/mimetypes/image.png");
		cantkPreloadImage("drawapp8/images/common/mimetypes/text.png");
		gFileBrowser = new FileBrowser();
	}

	return gFileBrowser;
}


/*!
 * Chart.js
 * http://chartjs.org/
 *
 * Copyright 2013 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */

//Define the global Chart Variable as a class.
window.Chart = function(context, width, height){

	var chart = this;
	
	
	//Easing functions adapted from Robert Penner's easing equations
	//http://www.robertpenner.com/easing/
	
	var animationOptions = {
		linear : function (t){
			return t;
		},
		easeInQuad: function (t) {
			return t*t;
		},
		easeOutQuad: function (t) {
			return -1 *t*(t-2);
		},
		easeInOutQuad: function (t) {
			if ((t/=1/2) < 1) return 1/2*t*t;
			return -1/2 * ((--t)*(t-2) - 1);
		},
		easeInCubic: function (t) {
			return t*t*t;
		},
		easeOutCubic: function (t) {
			return 1*((t=t/1-1)*t*t + 1);
		},
		easeInOutCubic: function (t) {
			if ((t/=1/2) < 1) return 1/2*t*t*t;
			return 1/2*((t-=2)*t*t + 2);
		},
		easeInQuart: function (t) {
			return t*t*t*t;
		},
		easeOutQuart: function (t) {
			return -1 * ((t=t/1-1)*t*t*t - 1);
		},
		easeInOutQuart: function (t) {
			if ((t/=1/2) < 1) return 1/2*t*t*t*t;
			return -1/2 * ((t-=2)*t*t*t - 2);
		},
		easeInQuint: function (t) {
			return 1*(t/=1)*t*t*t*t;
		},
		easeOutQuint: function (t) {
			return 1*((t=t/1-1)*t*t*t*t + 1);
		},
		easeInOutQuint: function (t) {
			if ((t/=1/2) < 1) return 1/2*t*t*t*t*t;
			return 1/2*((t-=2)*t*t*t*t + 2);
		},
		easeInSine: function (t) {
			return -1 * Math.cos(t/1 * (Math.PI/2)) + 1;
		},
		easeOutSine: function (t) {
			return 1 * Math.sin(t/1 * (Math.PI/2));
		},
		easeInOutSine: function (t) {
			return -1/2 * (Math.cos(Math.PI*t/1) - 1);
		},
		easeInExpo: function (t) {
			return (t==0) ? 1 : 1 * Math.pow(2, 10 * (t/1 - 1));
		},
		easeOutExpo: function (t) {
			return (t==1) ? 1 : 1 * (-Math.pow(2, -10 * t/1) + 1);
		},
		easeInOutExpo: function (t) {
			if (t==0) return 0;
			if (t==1) return 1;
			if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
			return 1/2 * (-Math.pow(2, -10 * --t) + 2);
			},
		easeInCirc: function (t) {
			if (t>=1) return t;
			return -1 * (Math.sqrt(1 - (t/=1)*t) - 1);
		},
		easeOutCirc: function (t) {
			return 1 * Math.sqrt(1 - (t=t/1-1)*t);
		},
		easeInOutCirc: function (t) {
			if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1);
			return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1);
		},
		easeInElastic: function (t) {
			var s=1.70158;var p=0;var a=1;
			if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
			if (a < Math.abs(1)) { a=1; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (1/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
		},
		easeOutElastic: function (t) {
			var s=1.70158;var p=0;var a=1;
			if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
			if (a < Math.abs(1)) { a=1; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (1/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*1-s)*(2*Math.PI)/p ) + 1;
		},
		easeInOutElastic: function (t) {
			var s=1.70158;var p=0;var a=1;
			if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
			if (a < Math.abs(1)) { a=1; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (1/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p ));
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*1-s)*(2*Math.PI)/p )*.5 + 1;
		},
		easeInBack: function (t) {
			var s = 1.70158;
			return 1*(t/=1)*t*((s+1)*t - s);
		},
		easeOutBack: function (t) {
			var s = 1.70158;
			return 1*((t=t/1-1)*t*((s+1)*t + s) + 1);
		},
		easeInOutBack: function (t) {
			var s = 1.70158; 
			if ((t/=1/2) < 1) return 1/2*(t*t*(((s*=(1.525))+1)*t - s));
			return 1/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
		},
		easeInBounce: function (t) {
			return 1 - animationOptions.easeOutBounce (1-t);
		},
		easeOutBounce: function (t) {
			if ((t/=1) < (1/2.75)) {
				return 1*(7.5625*t*t);
			} else if (t < (2/2.75)) {
				return 1*(7.5625*(t-=(1.5/2.75))*t + .75);
			} else if (t < (2.5/2.75)) {
				return 1*(7.5625*(t-=(2.25/2.75))*t + .9375);
			} else {
				return 1*(7.5625*(t-=(2.625/2.75))*t + .984375);
			}
		},
		easeInOutBounce: function (t) {
			if (t < 1/2) return animationOptions.easeInBounce (t*2) * .5;
			return animationOptions.easeOutBounce (t*2-1) * .5 + 1*.5;
		}
	};

	//Variables global to the chart
	width = width ? width : context.canvas.width;
	height = height ? height : context.canvas.height;


	//High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
	//if (window.devicePixelRatio) {
	//	context.canvas.style.width = width + "px";
	//	context.canvas.style.height = height + "px";
	//	context.canvas.height = height * window.devicePixelRatio;
	//	context.canvas.width = width * window.devicePixelRatio;
	//	context.scale(window.devicePixelRatio, window.devicePixelRatio);
	//}

	this.PolarArea = function(data,options){
	
		chart.PolarArea.defaults = {
			scaleOverlay : true,
			scaleOverride : false,
			scaleSteps : null,
			scaleStepWidth : null,
			scaleStartValue : null,
			scaleShowLine : true,
			scaleLineColor : "rgba(0,0,0,.1)",
			scaleLineWidth : 1,
			scaleShowLabels : true,
			scaleLabel : "<%=value%>",
			scaleFontFamily : "'Arial'",
			scaleFontSize : 12,
			scaleFontStyle : "normal",
			scaleFontColor : "#666",
			scaleShowLabelBackdrop : true,
			scaleBackdropColor : "rgba(255,255,255,0.75)",
			scaleBackdropPaddingY : 2,
			scaleBackdropPaddingX : 2,
			segmentShowStroke : true,
			segmentStrokeColor : "#fff",
			segmentStrokeWidth : 2,
			animation : true,
			animationSteps : 100,
			animationEasing : "easeOutBounce",
			animateRotate : true,
			animateScale : false,
			onAnimationComplete : null
		};
		
		var config = (options)? mergeChartConfig(chart.PolarArea.defaults,options) : chart.PolarArea.defaults;
		
		return new PolarArea(data,config,context);
	};

	this.Radar = function(data,options){
	
		chart.Radar.defaults = {
			scaleOverlay : false,
			scaleOverride : false,
			scaleSteps : null,
			scaleStepWidth : null,
			scaleStartValue : null,
			scaleShowLine : true,
			scaleLineColor : "rgba(0,0,0,.1)",
			scaleLineWidth : 1,
			scaleShowLabels : false,
			scaleLabel : "<%=value%>",
			scaleFontFamily : "'Arial'",
			scaleFontSize : 12,
			scaleFontStyle : "normal",
			scaleFontColor : "#666",
			scaleShowLabelBackdrop : true,
			scaleBackdropColor : "rgba(255,255,255,0.75)",
			scaleBackdropPaddingY : 2,
			scaleBackdropPaddingX : 2,
			angleShowLineOut : true,
			angleLineColor : "rgba(0,0,0,.1)",
			angleLineWidth : 1,			
			pointLabelFontFamily : "'Arial'",
			pointLabelFontStyle : "normal",
			pointLabelFontSize : 12,
			pointLabelFontColor : "#666",
			pointDot : true,
			pointDotRadius : 3,
			pointDotStrokeWidth : 1,
			datasetStroke : true,
			datasetStrokeWidth : 2,
			datasetFill : true,
			animation : true,
			animationSteps : 60,
			animationEasing : "easeOutQuart",
			onAnimationComplete : null
		};
		
		var config = (options)? mergeChartConfig(chart.Radar.defaults,options) : chart.Radar.defaults;

		return new Radar(data,config,context);
	};
	
	this.Pie = function(data,options){
		chart.Pie.defaults = {
			segmentShowStroke : true,
			segmentStrokeColor : "#fff",
			segmentStrokeWidth : 2,
			animation : true,
			animationSteps : 100,
			animationEasing : "easeOutBounce",
			animateRotate : true,
			animateScale : false,
			onAnimationComplete : null
		};		

		var config = (options)? mergeChartConfig(chart.Pie.defaults,options) : chart.Pie.defaults;
		
		return new Pie(data,config,context);				
	};
	
	this.Doughnut = function(data,options){
	
		chart.Doughnut.defaults = {
			segmentShowStroke : true,
			segmentStrokeColor : "#fff",
			segmentStrokeWidth : 2,
			percentageInnerCutout : 50,
			animation : true,
			animationSteps : 100,
			animationEasing : "easeOutBounce",
			animateRotate : true,
			animateScale : false,
			onAnimationComplete : null
		};		

		var config = (options)? mergeChartConfig(chart.Doughnut.defaults,options) : chart.Doughnut.defaults;
		
		return new Doughnut(data,config,context);			
		
	};

	this.Line = function(data,options){
	
		chart.Line.defaults = {
			scaleOverlay : false,
			scaleOverride : false,
			scaleSteps : null,
			scaleStepWidth : null,
			scaleStartValue : null,
			scaleLineColor : "rgba(0,0,0,.1)",
			scaleLineWidth : 1,
			scaleShowLabels : true,
			scaleLabel : "<%=value%>",
			scaleFontFamily : "'Arial'",
			scaleFontSize : 12,
			scaleFontStyle : "normal",
			scaleFontColor : "#666",
			scaleShowGridLines : true,
			scaleGridLineColor : "rgba(0,0,0,.05)",
			scaleGridLineWidth : 1,
			bezierCurve : true,
			pointDot : true,
			pointDotRadius : 4,
			pointDotStrokeWidth : 2,
			datasetStroke : true,
			datasetStrokeWidth : 2,
			datasetFill : true,
			animation : true,
			animationSteps : 60,
			animationEasing : "easeOutQuart",
			onAnimationComplete : null
		};		
		var config = (options) ? mergeChartConfig(chart.Line.defaults,options) : chart.Line.defaults;
		
		return new Line(data,config,context);
	}
	
	this.Bar = function(data,options){
		chart.Bar.defaults = {
			scaleOverlay : false,
			scaleOverride : false,
			scaleSteps : null,
			scaleStepWidth : null,
			scaleStartValue : null,
			scaleLineColor : "rgba(0,0,0,.1)",
			scaleLineWidth : 1,
			scaleShowLabels : true,
			scaleLabel : "<%=value%>",
			scaleFontFamily : "'Arial'",
			scaleFontSize : 12,
			scaleFontStyle : "normal",
			scaleFontColor : "#666",
			scaleShowGridLines : true,
			scaleGridLineColor : "rgba(0,0,0,.05)",
			scaleGridLineWidth : 1,
			barShowStroke : true,
			barStrokeWidth : 2,
			barValueSpacing : 5,
			barDatasetSpacing : 1,
			animation : true,
			animationSteps : 60,
			animationEasing : "easeOutQuart",
			onAnimationComplete : null
		};		
		var config = (options) ? mergeChartConfig(chart.Bar.defaults,options) : chart.Bar.defaults;
		
		return new Bar(data,config,context);		
	}
	
	var clear = function(c){
		c.clearRect(0, 0, width, height);
	};

	var PolarArea = function(data,config,ctx){
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString;		
		
		
		calculateDrawingSizes();
		
		valueBounds = getValueBounds();

		labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : null;

		//Check and set the scale
		if (!config.scaleOverride){
			
			calculatedScale = calculateScale(scaleHeight,valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
		}
		else {
			calculatedScale = {
				steps : config.scaleSteps,
				stepValue : config.scaleStepWidth,
				graphMin : config.scaleStartValue,
				labels : []
			}
			populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
		}
		
		scaleHop = maxSize/(calculatedScale.steps);

		//Wrap in an animation loop wrapper
		animationLoop(config,drawScale,drawAllSegments,ctx);

		function calculateDrawingSizes(){
			maxSize = (Min([width,height])/2);
			//Remove whatever is larger - the font size or line width.
			
			maxSize -= Max([config.scaleFontSize*0.5,config.scaleLineWidth*0.5]);
			
			labelHeight = config.scaleFontSize*2;
			//If we're drawing the backdrop - add the Y padding to the label height and remove from drawing region.
			if (config.scaleShowLabelBackdrop){
				labelHeight += (2 * config.scaleBackdropPaddingY);
				maxSize -= config.scaleBackdropPaddingY*1.5;
			}
			
			scaleHeight = maxSize;
			//If the label height is less than 5, set it to 5 so we don't have lines on top of each other.
			labelHeight = Default(labelHeight,5);
		}
		function drawScale(){
			for (var i=0; i<calculatedScale.steps; i++){
				//If the line object is there
				if (config.scaleShowLine){
					ctx.beginPath();
					ctx.arc(width/2, height/2, scaleHop * (i + 1), 0, (Math.PI * 2), true);
					ctx.strokeStyle = config.scaleLineColor;
					ctx.lineWidth = config.scaleLineWidth;
					ctx.stroke();
				}

				if (config.scaleShowLabels){
					ctx.textAlign = "center";
					ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
 					var label =  calculatedScale.labels[i];
					//If the backdrop object is within the font object
					if (config.scaleShowLabelBackdrop){
						var textWidth = ctx.measureText(label).width;
						ctx.fillStyle = config.scaleBackdropColor;
						ctx.beginPath();
						ctx.rect(
							Math.round(width/2 - textWidth/2 - config.scaleBackdropPaddingX),     //X
							Math.round(height/2 - (scaleHop * (i + 1)) - config.scaleFontSize*0.5 - config.scaleBackdropPaddingY),//Y
							Math.round(textWidth + (config.scaleBackdropPaddingX*2)), //Width
							Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY*2)) //Height
						);
						ctx.fill();
					}
					ctx.textBaseline = "middle";
					ctx.fillStyle = config.scaleFontColor;
					ctx.fillText(label,width/2,height/2 - (scaleHop * (i + 1)));
				}
			}
		}
		function drawAllSegments(animationDecimal){
			var startAngle = -Math.PI/2,
			angleStep = (Math.PI*2)/data.length,
			scaleAnimation = 1,
			rotateAnimation = 1;
			if (config.animation) {
				if (config.animateScale) {
					scaleAnimation = animationDecimal;
				}
				if (config.animateRotate){
					rotateAnimation = animationDecimal;
				}
			}

			for (var i=0; i<data.length; i++){

				ctx.beginPath();
				ctx.arc(width/2,height/2,scaleAnimation * calculateOffset(data[i].value,calculatedScale,scaleHop),startAngle, startAngle + rotateAnimation*angleStep, false);
				ctx.lineTo(width/2,height/2);
				ctx.closePath();
				ctx.fillStyle = data[i].color;
				ctx.fill();

				if(config.segmentShowStroke){
					ctx.strokeStyle = config.segmentStrokeColor;
					ctx.lineWidth = config.segmentStrokeWidth;
					ctx.stroke();
				}
				startAngle += rotateAnimation*angleStep;
			}
		}
		function getValueBounds() {
			var upperValue = Number.MIN_VALUE;
			var lowerValue = Number.MAX_VALUE;
			for (var i=0; i<data.length; i++){
				if (data[i].value > upperValue) {upperValue = data[i].value;}
				if (data[i].value < lowerValue) {lowerValue = data[i].value;}
			};

			var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight*0.5));
			
			return {
				maxValue : upperValue,
				minValue : lowerValue,
				maxSteps : maxSteps,
				minSteps : minSteps
			};
			

		}
	}

	var Radar = function (data,config,ctx) {
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString;	
			
		//If no labels are defined set to an empty array, so referencing length for looping doesn't blow up.
		if (!data.labels) data.labels = [];
		
		calculateDrawingSizes();

		var valueBounds = getValueBounds();

		labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : null;

		//Check and set the scale
		if (!config.scaleOverride){
			
			calculatedScale = calculateScale(scaleHeight,valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
		}
		else {
			calculatedScale = {
				steps : config.scaleSteps,
				stepValue : config.scaleStepWidth,
				graphMin : config.scaleStartValue,
				labels : []
			}
			populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
		}
		
		scaleHop = maxSize/(calculatedScale.steps);
		
		animationLoop(config,drawScale,drawAllDataPoints,ctx);
		
		//Radar specific functions.
		function drawAllDataPoints(animationDecimal){
			var rotationDegree = (2*Math.PI)/data.datasets[0].data.length;

			ctx.save();
			//translate to the centre of the canvas.
			ctx.translate(width/2,height/2);
			
			//We accept multiple data sets for radar charts, so show loop through each set
			for (var i=0; i<data.datasets.length; i++){
				ctx.beginPath();

				ctx.moveTo(0,animationDecimal*(-1*calculateOffset(data.datasets[i].data[0],calculatedScale,scaleHop)));
				for (var j=1; j<data.datasets[i].data.length; j++){
					ctx.rotate(rotationDegree);	
					ctx.lineTo(0,animationDecimal*(-1*calculateOffset(data.datasets[i].data[j],calculatedScale,scaleHop)));
			
				}
				ctx.closePath();
				
				
				ctx.fillStyle = data.datasets[i].fillColor;
				ctx.strokeStyle = data.datasets[i].strokeColor;
				ctx.lineWidth = config.datasetStrokeWidth;
				ctx.fill();
				ctx.stroke();
				
								
				if (config.pointDot){
					ctx.fillStyle = data.datasets[i].pointColor;
					ctx.strokeStyle = data.datasets[i].pointStrokeColor;
					ctx.lineWidth = config.pointDotStrokeWidth;
					for (var k=0; k<data.datasets[i].data.length; k++){
						ctx.rotate(rotationDegree);
						ctx.beginPath();
						ctx.arc(0,animationDecimal*(-1*calculateOffset(data.datasets[i].data[k],calculatedScale,scaleHop)),config.pointDotRadius,2*Math.PI,false);
						ctx.fill();
						ctx.stroke();
					}					
					
				}
				ctx.rotate(rotationDegree);
				
			}
			ctx.restore();
			
			
		}
		function drawScale(){
			var rotationDegree = (2*Math.PI)/data.datasets[0].data.length;
			ctx.save();
		    ctx.translate(width / 2, height / 2);	
			
			if (config.angleShowLineOut){
				ctx.strokeStyle = config.angleLineColor;		    	    
				ctx.lineWidth = config.angleLineWidth;
				for (var h=0; h<data.datasets[0].data.length; h++){
					
				    ctx.rotate(rotationDegree);
					ctx.beginPath();
					ctx.moveTo(0,0);
					ctx.lineTo(0,-maxSize);
					ctx.stroke();
				}
			}

			for (var i=0; i<calculatedScale.steps; i++){
				ctx.beginPath();
				
				if(config.scaleShowLine){
					ctx.strokeStyle = config.scaleLineColor;
					ctx.lineWidth = config.scaleLineWidth;
					ctx.moveTo(0,-scaleHop * (i+1));					
					for (var j=0; j<data.datasets[0].data.length; j++){
					    ctx.rotate(rotationDegree);
						ctx.lineTo(0,-scaleHop * (i+1));
					}
					ctx.closePath();
					ctx.stroke();			
							
				}
				
				if (config.scaleShowLabels){				
					ctx.textAlign = 'center';
					ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily; 
					ctx.textBaseline = "middle";
					
					if (config.scaleShowLabelBackdrop){
						var textWidth = ctx.measureText(calculatedScale.labels[i]).width;
						ctx.fillStyle = config.scaleBackdropColor;
						ctx.beginPath();
						ctx.rect(
							Math.round(- textWidth/2 - config.scaleBackdropPaddingX),     //X
							Math.round((-scaleHop * (i + 1)) - config.scaleFontSize*0.5 - config.scaleBackdropPaddingY),//Y
							Math.round(textWidth + (config.scaleBackdropPaddingX*2)), //Width
							Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY*2)) //Height
						);
						ctx.fill();
					}						
					ctx.fillStyle = config.scaleFontColor;
					ctx.fillText(calculatedScale.labels[i],0,-scaleHop*(i+1));
				}

			}
			for (var k=0; k<data.labels.length; k++){				
			ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize+"px " + config.pointLabelFontFamily;
			ctx.fillStyle = config.pointLabelFontColor;
				var opposite = Math.sin(rotationDegree*k) * (maxSize + config.pointLabelFontSize);
				var adjacent = Math.cos(rotationDegree*k) * (maxSize + config.pointLabelFontSize);
				
				if(rotationDegree*k == Math.PI || rotationDegree*k == 0){
					ctx.textAlign = "center";
				}
				else if(rotationDegree*k > Math.PI){
					ctx.textAlign = "right";
				}
				else{
					ctx.textAlign = "left";
				}
				
				ctx.textBaseline = "middle";
				
				ctx.fillText(data.labels[k],opposite,-adjacent);
				
			}
			ctx.restore();
		};
		function calculateDrawingSizes(){
			maxSize = (Min([width,height])/2);

			labelHeight = config.scaleFontSize*2;
			
			var labelLength = 0;
			for (var i=0; i<data.labels.length; i++){
				ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize+"px " + config.pointLabelFontFamily;
				var textMeasurement = ctx.measureText(data.labels[i]).width;
				if(textMeasurement>labelLength) labelLength = textMeasurement;
			}
			
			//Figure out whats the largest - the height of the text or the width of what's there, and minus it from the maximum usable size.
			maxSize -= Max([labelLength,((config.pointLabelFontSize/2)*1.5)]);				
			
			maxSize -= config.pointLabelFontSize;
			maxSize = CapValue(maxSize, null, 0);
			scaleHeight = maxSize;
			//If the label height is less than 5, set it to 5 so we don't have lines on top of each other.
			labelHeight = Default(labelHeight,5);
		};
		function getValueBounds() {
			var upperValue = Number.MIN_VALUE;
			var lowerValue = Number.MAX_VALUE;
			
			for (var i=0; i<data.datasets.length; i++){
				for (var j=0; j<data.datasets[i].data.length; j++){
					if (data.datasets[i].data[j] > upperValue){upperValue = data.datasets[i].data[j]}
					if (data.datasets[i].data[j] < lowerValue){lowerValue = data.datasets[i].data[j]}
				}
			}

			var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight*0.5));
			
			return {
				maxValue : upperValue,
				minValue : lowerValue,
				maxSteps : maxSteps,
				minSteps : minSteps
			};
			

		}
	}

	var Pie = function(data,config,ctx){
		var segmentTotal = 0;
		
		//In case we have a canvas that is not a square. Minus 5 pixels as padding round the edge.
		var pieRadius = Min([height/2,width/2]) - 5;
		
		for (var i=0; i<data.length; i++){
			segmentTotal += data[i].value;
		}
		
		
		animationLoop(config,null,drawPieSegments,ctx);
				
		function drawPieSegments (animationDecimal){
			var cumulativeAngle = -Math.PI/2,
			scaleAnimation = 1,
			rotateAnimation = 1;
			if (config.animation) {
				if (config.animateScale) {
					scaleAnimation = animationDecimal;
				}
				if (config.animateRotate){
					rotateAnimation = animationDecimal;
				}
			}
			for (var i=0; i<data.length; i++){
				var segmentAngle = rotateAnimation * ((data[i].value/segmentTotal) * (Math.PI*2));
				ctx.beginPath();
				ctx.arc(width/2,height/2,scaleAnimation * pieRadius,cumulativeAngle,cumulativeAngle + segmentAngle);
				ctx.lineTo(width/2,height/2);
				ctx.closePath();
				ctx.fillStyle = data[i].color;
				ctx.fill();
				
				if(config.segmentShowStroke){
					ctx.lineWidth = config.segmentStrokeWidth;
					ctx.strokeStyle = config.segmentStrokeColor;
					ctx.stroke();
				}
				cumulativeAngle += segmentAngle;
			}			
		}		
	}

	var Doughnut = function(data,config,ctx){
		var segmentTotal = 0;
		
		//In case we have a canvas that is not a square. Minus 5 pixels as padding round the edge.
		var doughnutRadius = Min([height/2,width/2]) - 5;
		
		var cutoutRadius = doughnutRadius * (config.percentageInnerCutout/100);
		
		for (var i=0; i<data.length; i++){
			segmentTotal += data[i].value;
		}
		
		
		animationLoop(config,null,drawPieSegments,ctx);
		
		
		function drawPieSegments (animationDecimal){
			var cumulativeAngle = -Math.PI/2,
			scaleAnimation = 1,
			rotateAnimation = 1;
			if (config.animation) {
				if (config.animateScale) {
					scaleAnimation = animationDecimal;
				}
				if (config.animateRotate){
					rotateAnimation = animationDecimal;
				}
			}
			for (var i=0; i<data.length; i++){
				var segmentAngle = rotateAnimation * ((data[i].value/segmentTotal) * (Math.PI*2));
				ctx.beginPath();
				ctx.arc(width/2,height/2,scaleAnimation * doughnutRadius,cumulativeAngle,cumulativeAngle + segmentAngle,false);
				ctx.arc(width/2,height/2,scaleAnimation * cutoutRadius,cumulativeAngle + segmentAngle,cumulativeAngle,true);
				ctx.closePath();
				ctx.fillStyle = data[i].color;
				ctx.fill();
				
				if(config.segmentShowStroke){
					ctx.lineWidth = config.segmentStrokeWidth;
					ctx.strokeStyle = config.segmentStrokeColor;
					ctx.stroke();
				}
				cumulativeAngle += segmentAngle;
			}			
		}			
		
		
		
	}

	var Line = function(data,config,ctx){
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop,widestXLabel, xAxisLength,yAxisPosX,xAxisPosY, rotateLabels = 0;
			
		calculateDrawingSizes();
		
		valueBounds = getValueBounds();
		//Check and set the scale
		labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : "";
		if (!config.scaleOverride){
			
			calculatedScale = calculateScale(scaleHeight,valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
		}
		else {
			calculatedScale = {
				steps : config.scaleSteps,
				stepValue : config.scaleStepWidth,
				graphMin : config.scaleStartValue,
				labels : []
			}
			populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
		}
		
		scaleHop = Math.floor(scaleHeight/calculatedScale.steps);
		calculateXAxisSize();
		animationLoop(config,drawScale,drawLines,ctx);		
		
		function drawLines(animPc){
			for (var i=0; i<data.datasets.length; i++){
				ctx.strokeStyle = data.datasets[i].strokeColor;
				ctx.lineWidth = config.datasetStrokeWidth;
				ctx.beginPath();
				ctx.moveTo(yAxisPosX, xAxisPosY - animPc*(calculateOffset(data.datasets[i].data[0],calculatedScale,scaleHop)))

				for (var j=1; j<data.datasets[i].data.length; j++){
					if (config.bezierCurve){
						ctx.bezierCurveTo(xPos(j-0.5),yPos(i,j-1),xPos(j-0.5),yPos(i,j),xPos(j),yPos(i,j));
					}
					else{
						ctx.lineTo(xPos(j),yPos(i,j));
					}
				}
				ctx.stroke();
				if (config.datasetFill){
					ctx.lineTo(yAxisPosX + (valueHop*(data.datasets[i].data.length-1)),xAxisPosY);
					ctx.lineTo(yAxisPosX,xAxisPosY);
					ctx.closePath();
					ctx.fillStyle = data.datasets[i].fillColor;
					ctx.fill();
				}
				else{
					ctx.closePath();
				}
				if(config.pointDot){
					ctx.fillStyle = data.datasets[i].pointColor;
					ctx.strokeStyle = data.datasets[i].pointStrokeColor;
					ctx.lineWidth = config.pointDotStrokeWidth;
					for (var k=0; k<data.datasets[i].data.length; k++){
						ctx.beginPath();
						ctx.arc(yAxisPosX + (valueHop *k),xAxisPosY - animPc*(calculateOffset(data.datasets[i].data[k],calculatedScale,scaleHop)),config.pointDotRadius,0,Math.PI*2,true);
						ctx.fill();
						ctx.stroke();
					}
				}
			}
			
			function yPos(dataSet,iteration){
				return xAxisPosY - animPc*(calculateOffset(data.datasets[dataSet].data[iteration],calculatedScale,scaleHop));			
			}
			function xPos(iteration){
				return yAxisPosX + (valueHop * iteration);
			}
		}
		function drawScale(){
			//X axis line
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.beginPath();
			ctx.moveTo(width-widestXLabel/2+5,xAxisPosY);
			ctx.lineTo(width-(widestXLabel/2)-xAxisLength-5,xAxisPosY);
			ctx.stroke();
			
			
			if (rotateLabels > 0){
				ctx.save();
				ctx.textAlign = "right";
			}
			else{
				ctx.textAlign = "center";
			}
			ctx.fillStyle = config.scaleFontColor;
			for (var i=0; i<data.labels.length; i++){
				ctx.save();
				if (rotateLabels > 0){
					ctx.translate(yAxisPosX + i*valueHop,xAxisPosY + config.scaleFontSize);
					ctx.rotate(-(rotateLabels * (Math.PI/180)));
					ctx.fillText(data.labels[i], 0,0);
					ctx.restore();
				}
				
				else{
					ctx.fillText(data.labels[i], yAxisPosX + i*valueHop,xAxisPosY + config.scaleFontSize+3);					
				}

				ctx.beginPath();
				ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY+3);
				
				//Check i isnt 0, so we dont go over the Y axis twice.
				if(config.scaleShowGridLines && i>0){
					ctx.lineWidth = config.scaleGridLineWidth;
					ctx.strokeStyle = config.scaleGridLineColor;					
					ctx.lineTo(yAxisPosX + i * valueHop, 5);
				}
				else{
					ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY+3);				
				}
				ctx.stroke();
			}
			
			//Y axis
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.beginPath();
			ctx.moveTo(yAxisPosX,xAxisPosY+5);
			ctx.lineTo(yAxisPosX,5);
			ctx.stroke();
			
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for (var j=0; j<calculatedScale.steps; j++){
				ctx.beginPath();
				ctx.moveTo(yAxisPosX-3,xAxisPosY - ((j+1) * scaleHop));
				if (config.scaleShowGridLines){
					ctx.lineWidth = config.scaleGridLineWidth;
					ctx.strokeStyle = config.scaleGridLineColor;
					ctx.lineTo(yAxisPosX + xAxisLength + 5,xAxisPosY - ((j+1) * scaleHop));					
				}
				else{
					ctx.lineTo(yAxisPosX-0.5,xAxisPosY - ((j+1) * scaleHop));
				}
				
				ctx.stroke();
				
				if (config.scaleShowLabels){
					ctx.fillText(calculatedScale.labels[j],yAxisPosX-8,xAxisPosY - ((j+1) * scaleHop));
				}
			}
			
			
		}
		function calculateXAxisSize(){
			var longestText = 1;
			//if we are showing the labels
			if (config.scaleShowLabels){
				ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
				for (var i=0; i<calculatedScale.labels.length; i++){
					var measuredText = ctx.measureText(calculatedScale.labels[i]).width;
					longestText = (measuredText > longestText)? measuredText : longestText;
				}
				//Add a little extra padding from the y axis
				longestText +=10;
			}
			xAxisLength = width - longestText - widestXLabel;
			valueHop = Math.floor(xAxisLength/(data.labels.length-1));	
				
			yAxisPosX = width-widestXLabel/2-xAxisLength;
			xAxisPosY = scaleHeight + config.scaleFontSize/2;				
		}		
		function calculateDrawingSizes(){
			maxSize = height;

			//Need to check the X axis first - measure the length of each text metric, and figure out if we need to rotate by 45 degrees.
			ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
			widestXLabel = 1;
			for (var i=0; i<data.labels.length; i++){
				var textLength = ctx.measureText(data.labels[i]).width;
				//If the text length is longer - make that equal to longest text!
				widestXLabel = (textLength > widestXLabel)? textLength : widestXLabel;
			}
			if (width/data.labels.length < widestXLabel){
				rotateLabels = 45;
				if (width/data.labels.length < Math.cos(rotateLabels) * widestXLabel){
					rotateLabels = 90;
					maxSize -= widestXLabel; 
				}
				else{
					maxSize -= Math.sin(rotateLabels) * widestXLabel;
				}
			}
			else{
				maxSize -= config.scaleFontSize;
			}
			
			//Add a little padding between the x line and the text
			maxSize -= 5;
			
			
			labelHeight = config.scaleFontSize;
			
			maxSize -= labelHeight;
			//Set 5 pixels greater than the font size to allow for a little padding from the X axis.
			
			scaleHeight = maxSize;
			
			//Then get the area above we can safely draw on.
			
		}		
		function getValueBounds() {
			var upperValue = Number.MIN_VALUE;
			var lowerValue = Number.MAX_VALUE;
			for (var i=0; i<data.datasets.length; i++){
				for (var j=0; j<data.datasets[i].data.length; j++){
					if ( data.datasets[i].data[j] > upperValue) { upperValue = data.datasets[i].data[j] };
					if ( data.datasets[i].data[j] < lowerValue) { lowerValue = data.datasets[i].data[j] };
				}
			};
	
			var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight*0.5));
			
			return {
				maxValue : upperValue,
				minValue : lowerValue,
				maxSteps : maxSteps,
				minSteps : minSteps
			};
			
	
		}

		
	}
	
	var Bar = function(data,config,ctx){
		var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop,widestXLabel, xAxisLength,yAxisPosX,xAxisPosY,barWidth, rotateLabels = 0;
			
		calculateDrawingSizes();
		
		valueBounds = getValueBounds();
		//Check and set the scale
		labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : "";
		if (!config.scaleOverride){
			
			calculatedScale = calculateScale(scaleHeight,valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
		}
		else {
			calculatedScale = {
				steps : config.scaleSteps,
				stepValue : config.scaleStepWidth,
				graphMin : config.scaleStartValue,
				labels : []
			}
			populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
		}
		
		scaleHop = Math.floor(scaleHeight/calculatedScale.steps);
		calculateXAxisSize();
		animationLoop(config,drawScale,drawBars,ctx);		
		
		function drawBars(animPc){
			ctx.lineWidth = config.barStrokeWidth;
			for (var i=0; i<data.datasets.length; i++){
					ctx.fillStyle = data.datasets[i].fillColor;
					ctx.strokeStyle = data.datasets[i].strokeColor;
				for (var j=0; j<data.datasets[i].data.length; j++){
					var barOffset = yAxisPosX + config.barValueSpacing + valueHop*j + barWidth*i + config.barDatasetSpacing*i + config.barStrokeWidth*i;
					
					ctx.beginPath();
					ctx.moveTo(barOffset, xAxisPosY);
					ctx.lineTo(barOffset, xAxisPosY - animPc*calculateOffset(data.datasets[i].data[j],calculatedScale,scaleHop)+(config.barStrokeWidth/2));
					ctx.lineTo(barOffset + barWidth, xAxisPosY - animPc*calculateOffset(data.datasets[i].data[j],calculatedScale,scaleHop)+(config.barStrokeWidth/2));
					ctx.lineTo(barOffset + barWidth, xAxisPosY);
					if(config.barShowStroke){
						ctx.stroke();
					}
					ctx.closePath();
					ctx.fill();
				}
			}
			
		}
		function drawScale(){
			//X axis line
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.beginPath();
			ctx.moveTo(width-widestXLabel/2+5,xAxisPosY);
			ctx.lineTo(width-(widestXLabel/2)-xAxisLength-5,xAxisPosY);
			ctx.stroke();
			
			
			if (rotateLabels > 0){
				ctx.save();
				ctx.textAlign = "right";
			}
			else{
				ctx.textAlign = "center";
			}
			ctx.fillStyle = config.scaleFontColor;
			for (var i=0; i<data.labels.length; i++){
				ctx.save();
				if (rotateLabels > 0){
					ctx.translate(yAxisPosX + i*valueHop,xAxisPosY + config.scaleFontSize);
					ctx.rotate(-(rotateLabels * (Math.PI/180)));
					ctx.fillText(data.labels[i], 0,0);
					ctx.restore();
				}
				
				else{
					ctx.fillText(data.labels[i], yAxisPosX + i*valueHop + valueHop/2,xAxisPosY + config.scaleFontSize+3);					
				}

				ctx.beginPath();
				ctx.moveTo(yAxisPosX + (i+1) * valueHop, xAxisPosY+3);
				
				//Check i isnt 0, so we dont go over the Y axis twice.
					ctx.lineWidth = config.scaleGridLineWidth;
					ctx.strokeStyle = config.scaleGridLineColor;					
					ctx.lineTo(yAxisPosX + (i+1) * valueHop, 5);
				ctx.stroke();
			}
			
			//Y axis
			ctx.lineWidth = config.scaleLineWidth;
			ctx.strokeStyle = config.scaleLineColor;
			ctx.beginPath();
			ctx.moveTo(yAxisPosX,xAxisPosY+5);
			ctx.lineTo(yAxisPosX,5);
			ctx.stroke();
			
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
			for (var j=0; j<calculatedScale.steps; j++){
				ctx.beginPath();
				ctx.moveTo(yAxisPosX-3,xAxisPosY - ((j+1) * scaleHop));
				if (config.scaleShowGridLines){
					ctx.lineWidth = config.scaleGridLineWidth;
					ctx.strokeStyle = config.scaleGridLineColor;
					ctx.lineTo(yAxisPosX + xAxisLength + 5,xAxisPosY - ((j+1) * scaleHop));					
				}
				else{
					ctx.lineTo(yAxisPosX-0.5,xAxisPosY - ((j+1) * scaleHop));
				}
				
				ctx.stroke();
				if (config.scaleShowLabels){
					ctx.fillText(calculatedScale.labels[j],yAxisPosX-8,xAxisPosY - ((j+1) * scaleHop));
				}
			}
			
			
		}
		function calculateXAxisSize(){
			var longestText = 1;
			//if we are showing the labels
			if (config.scaleShowLabels){
				ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
				for (var i=0; i<calculatedScale.labels.length; i++){
					var measuredText = ctx.measureText(calculatedScale.labels[i]).width;
					longestText = (measuredText > longestText)? measuredText : longestText;
				}
				//Add a little extra padding from the y axis
				longestText +=10;
			}
			xAxisLength = width - longestText - widestXLabel;
			valueHop = Math.floor(xAxisLength/(data.labels.length));	
			
			barWidth = (valueHop - config.scaleGridLineWidth*2 - (config.barValueSpacing*2) - (config.barDatasetSpacing*data.datasets.length-1) - ((config.barStrokeWidth/2)*data.datasets.length-1))/data.datasets.length;
			
			yAxisPosX = width-widestXLabel/2-xAxisLength;
			xAxisPosY = scaleHeight + config.scaleFontSize/2;				
		}		
		function calculateDrawingSizes(){
			maxSize = height;

			//Need to check the X axis first - measure the length of each text metric, and figure out if we need to rotate by 45 degrees.
			ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
			widestXLabel = 1;
			for (var i=0; i<data.labels.length; i++){
				var textLength = ctx.measureText(data.labels[i]).width;
				//If the text length is longer - make that equal to longest text!
				widestXLabel = (textLength > widestXLabel)? textLength : widestXLabel;
			}
			if (width/data.labels.length < widestXLabel){
				rotateLabels = 45;
				if (width/data.labels.length < Math.cos(rotateLabels) * widestXLabel){
					rotateLabels = 90;
					maxSize -= widestXLabel; 
				}
				else{
					maxSize -= Math.sin(rotateLabels) * widestXLabel;
				}
			}
			else{
				maxSize -= config.scaleFontSize;
			}
			
			//Add a little padding between the x line and the text
			maxSize -= 5;
			
			
			labelHeight = config.scaleFontSize;
			
			maxSize -= labelHeight;
			//Set 5 pixels greater than the font size to allow for a little padding from the X axis.
			
			scaleHeight = maxSize;
			
			//Then get the area above we can safely draw on.
			
		}		
		function getValueBounds() {
			var upperValue = Number.MIN_VALUE;
			var lowerValue = Number.MAX_VALUE;
			for (var i=0; i<data.datasets.length; i++){
				for (var j=0; j<data.datasets[i].data.length; j++){
					if ( data.datasets[i].data[j] > upperValue) { upperValue = data.datasets[i].data[j] };
					if ( data.datasets[i].data[j] < lowerValue) { lowerValue = data.datasets[i].data[j] };
				}
			};
	
			var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
			var minSteps = Math.floor((scaleHeight / labelHeight*0.5));
			
			return {
				maxValue : upperValue,
				minValue : lowerValue,
				maxSteps : maxSteps,
				minSteps : minSteps
			};
			
	
		}
	}
	
	function calculateOffset(val,calculatedScale,scaleHop){
		var outerValue = calculatedScale.steps * calculatedScale.stepValue;
		var adjustedValue = val - calculatedScale.graphMin;
		var scalingFactor = CapValue(adjustedValue/outerValue,1,0);
		return (scaleHop*calculatedScale.steps) * scalingFactor;
	}
	
	function animationLoop(config,drawScale,drawData,ctx){
		var animFrameAmount = (config.animation)? 1/CapValue(config.animationSteps,Number.MAX_VALUE,1) : 1,
			easingFunction = animationOptions[config.animationEasing],
			percentAnimComplete =(config.animation)? 0 : 1;
		
	
		
		if (typeof drawScale !== "function") drawScale = function(){};
		
		
		function animateFrame(){
			var easeAdjustedAnimationPercent =(config.animation)? CapValue(easingFunction(percentAnimComplete),null,0) : 1;
			clear(ctx);
			if(config.scaleOverlay){
				drawData(easeAdjustedAnimationPercent);
				drawScale();
			} else {
				drawScale();
				drawData(easeAdjustedAnimationPercent);
			}				
		}
		function animLoop(){
			//We need to check if the animation is incomplete (less than 1), or complete (1).
				percentAnimComplete += animFrameAmount;
				animateFrame();	
				//Stop the loop continuing forever
				if (percentAnimComplete <= 1){
					requestAnimFrame(animLoop);
				}
				else{
					if (typeof config.onAnimationComplete == "function") config.onAnimationComplete();
				}
			
		}

		config.animation = 0;
		if(config.animation) {
			requestAnimFrame(animLoop);
		}
		else {
			animateFrame();	
		}
	}

	//Declare global functions to be called within this namespace here.
	
	
	// shim layer with setTimeout fallback
	var requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	function calculateScale(drawingHeight,maxSteps,minSteps,maxValue,minValue,labelTemplateString){
			var graphMin,graphMax,graphRange,stepValue,numberOfSteps,valueRange,rangeOrderOfMagnitude,decimalNum;
			
			valueRange = maxValue - minValue;
			
			rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);

        	graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
            
            graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
            
            graphRange = graphMax - graphMin;
            
            stepValue = Math.pow(10, rangeOrderOfMagnitude);
            
	        numberOfSteps = Math.round(graphRange / stepValue);
	        
	        //Compare number of steps to the max and min for that size graph, and add in half steps if need be.	        
	        while(numberOfSteps < minSteps || numberOfSteps > maxSteps) {
	        	if (numberOfSteps < minSteps){
			        stepValue /= 2;
			        numberOfSteps = Math.round(graphRange/stepValue);
		        }
		        else{
			        stepValue *=2;
			        numberOfSteps = Math.round(graphRange/stepValue);
		        }
	        };

	        var labels = [];
	        populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue);
		
	        return {
		        steps : numberOfSteps,
				stepValue : stepValue,
				graphMin : graphMin,
				labels : labels		        
		        
	        }
		
			function calculateOrderOfMagnitude(val){
			  return Math.floor(Math.log(val) / Math.LN10);
			}		


	}

    //Populate an array of all the labels by interpolating the string.
    function populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue) {
        if (labelTemplateString) {
            //Fix floating point errors by setting to fixed the on the same decimal as the stepValue.
            for (var i = 1; i < numberOfSteps + 1; i++) {
                labels.push(tmpl(labelTemplateString, {value: (graphMin + (stepValue * i)).toFixed(getDecimalPlaces(stepValue))}));
            }
        }
    }
	
	//Max value from array
	function Max( array ){
		return Math.max.apply( Math, array );
	};
	//Min value from array
	function Min( array ){
		return Math.min.apply( Math, array );
	};
	//Default if undefined
	function Default(userDeclared,valueIfFalse){
		if(!userDeclared){
			return valueIfFalse;
		} else {
			return userDeclared;
		}
	};
	//Is a number function
	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	//Apply cap a value at a high or low number
	function CapValue(valueToCap, maxValue, minValue){
		if(isNumber(maxValue)) {
			if( valueToCap > maxValue ) {
				return maxValue;
			}
		}
		if(isNumber(minValue)){
			if ( valueToCap < minValue ){
				return minValue;
			}
		}
		return valueToCap;
	}
	function getDecimalPlaces (num){
		var numberOfDecimalPlaces;
		if (num%1!=0){
			return num.toString().split(".")[1].length
		}
		else{
			return 0;
		}
		
	} 
	
	function mergeChartConfig(defaults,userDefined){
		var returnObj = {};
	    for (var attrname in defaults) { returnObj[attrname] = defaults[attrname]; }
	    for (var attrname in userDefined) { returnObj[attrname] = userDefined[attrname]; }
	    return returnObj;
	}
	
	//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
	  var cache = {};
	 
	  function tmpl(str, data){
	    // Figure out if we're getting a template, or if we need to
	    // load the template - and be sure to cache the result.
	    var fn = !/\W/.test(str) ?
	      cache[str] = cache[str] ||
	        tmpl(document.getElementById(str).innerHTML) :
	     
	      // Generate a reusable function that will serve as a template
	      // generator (and which will be cached).
	      new Function("obj",
	        "var p=[],print=function(){p.push.apply(p,arguments);};" +
	       
	        // Introduce the data as local variables using with(){}
	        "with(obj){p.push('" +
	       
	        // Convert the template into pure JavaScript
	        str
	          .replace(/[\r\t\n]/g, " ")
	          .split("<%").join("\t")
	          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
	          .replace(/\t=(.*?)%>/g, "',$1,'")
	          .split("\t").join("');")
	          .split("%>").join("p.push('")
	          .split("\r").join("\\'")
	      + "');}return p.join('');");
	   
	    // Provide some basic currying to the user
	    return data ? fn( data ) : fn;
	  };
}



/*
 * File: cantk_chart.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: wrap chart.js for mobile toolkit.
 * 
 * Copyright (c) 2011 - 2013  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIChartLegendItem() {
	return;
}

UIChartLegendItem.prototype = new UIElement();
UIChartLegendItem.prototype.isUIChartLegendItem = true;

UIChartLegendItem.prototype.initUIChartLegendItem = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_INPUT);

	return this;
}

UIChartLegendItem.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIChartLegendItem.prototype.drawText = function(canvas) {
}

UIChartLegendItem.prototype.paintSelfOnly = function(canvas) {
	if(this.h > this.w) {
		var size = Math.min(this.w, this.h);
		canvas.fillRect(0, 0, size, size);
	}
	else {
		var size = this.h - 8;
		canvas.fillStyle = this.style.fillColor;
		canvas.fillRect(4, 4, size, size);

		canvas.textAlign = "left";
		canvas.textBaseline = "middle";
		canvas.font = this.style.getFont();
		canvas.fillStyle = this.style.textColor;

		var x = size + 8;
		var y = this.h >> 1;
		canvas.fillText(this.text, x, y);
	}

	return;
}

function UIChartLegendItemCreator() {
	var args = ["ui-chart-legend-item", "ui-chart-legend-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIChartLegendItem();
		return g.initUIChartLegendItem(this.type, 200, 40);
	}
	
	return;
}

//////////////////////////////////////////////////////

function UIChartLegendCreator() {
	var args = ["ui-chart-legend", "ui-chart-legend", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGrid();

		g.isUIChartLegend = true;
		g.initUIGrid(this.type, 5, 100, null);;
		g.shapeCanBeChild = function(shape) { 
			return shape.isUIChartLegendItem;
		}
		return g;
	}
	
	return;
}

//////////////////////////////////////////////////////

function UIChart() {
	return;
}

UIChart.prototype = new UIElement();
UIChart.prototype.isUIChart = true;

UIChart.prototype.initUIChart = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.images.display = CANTK_IMAGE_DISPLAY_CENTER;

	this.options = {};

	return this;
}

UIChart.prototype.setValue = function(data) {
	try {
		this.data = JSON.parse(data);
	}
	catch(e) {
		console.log("UIChart.prototype.setValue:" + e.message);
	}

	return;
}

UIChart.prototype.getValue = function() {
	var data = this.data ? this.data : this.getDefaultData();

	return data ? JSON.stringify(data, null, '\t') : "";
}

UIChart.prototype.getDefaultData = function() {
	var data = {
		labels : ["1","2","3"],
		datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : [28,48,40]
			}
		]
	}

	return data;
}

UIChart.prototype.shapeCanBeChild = function(shape) {
	return shape.isUILabel || shape.isUIImage;
}

UIChart.prototype.getOptions = function() {
	return null;
}

UIChart.prototype.paintChart = function(ctx, data, options) {
	return;
}

UIChart.prototype.getData = function() {
	return this.data ? this.data : this.getDefaultData();
}

UIChart.prototype.paintSelfOnly = function(canvas) {
	var tcanvas = cantkGetTempCanvas(this.w, this.h);
	var ctx = tcanvas.getContext("2d");
	this.paintChart(ctx, this.getData(), this.getOptions());
	canvas.drawImage(tcanvas, 0, 0);

	return;
}

////////////////////////////////////////////////////////////////////////

function UIBarChart() {
	return;
}

UIBarChart.prototype = new UIChart();
UIBarChart.prototype.isUIBarChart = true;

UIBarChart.prototype.initUIBarChart = function(type) {
	return this.initUIChart(type, 200, 200);
}

UIBarChart.prototype.getCustomProp = function() {
	var content = '\
		<label class="description" for="fontsize">' + dappGetText("Font Size") + ':</label>\
		<input id="fontsize"  class="element text small" type="number" value="0"/> \
		<label class="description" for="textcolor">' + dappGetText("Text Color") + ':</label>\
		<input id="textcolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="scalelinecolor">' + dappGetText("Scale Line Color") + ':</label>\
		<input id="scalelinecolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="gridlinecolor">' + dappGetText("Grid Line Color") + ':</label>\
		<input id="gridlinecolor"  class="element text small" type="text" value="0"/> \
		<input id="showgridlines" class="checkbox_i"  type="checkbox" >' + dappGetText("Show Grid Lines") + '</input> \
		<label class="description" for="data">' + dappGetText("Data") + ':</label>\
		<textarea id="data"  rows="8" cols="60" type="text" value=""></textarea>';

	return content;
}

UIBarChart.prototype.loadCustomProp = function(form) {
	var chart = this;
	
	form.fontsize.value = this.style.fontSize;
	form.fontsize.onchange = function(e) {
		var fontSize = parseInt(this.value);
		chart.style.setFontSize(fontSize);
		return;
	}
	
	form.textcolor.value = this.style.textColor;
	form.textcolor.onchange = function(e) {
		chart.style.setTextColor(this.value);
		return;
	}
	
	form.scalelinecolor.value = this.style.lineColor;
	form.scalelinecolor.onchange = function(e) {
		chart.style.setLineColor(this.value);
		return;
	}
	
	form.gridlinecolor.value = this.style.fillColor;
	form.gridlinecolor.onchange = function(e) {
		chart.setFillColor(this.value);
		return;
	}
	
	form.showgridlines.checked = this.showGridLines;
	form.showgridlines.onchange = function(e) {
		chart.showGridLines = this.checked;
		return;
	}

	form.data.value = this.getValue();
	form.data.onchange = function(e) {
		chart.setValue(this.value);
		return;
	}

	return;
}

UIBarChart.prototype.getOptions = function() {
	this.options.scaleLineColor = this.style.lineColor;
	this.options.scaleFontSize = this.isIcon? 12 : this.style.fontSize;
	this.options.scaleFontColor = this.style.textColor;
	this.options.scaleGridLineColor = this.style.fillColor;
	this.options.scaleShowGridLines = this.isIcon? true : this.showGridLines;

	return this.options;
}

UIBarChart.prototype.paintChart = function(ctx, data, options) {
	var chart = null;
	if(this.type === "ui-bar-chart") {
		chart = new Chart(ctx).Bar(data, options);
	}
	else {
		chart = new Chart(ctx).Line(data, options);
	}
	delete chart;

	return;
}

function UIBarChartCreator(type) {
	var args = [type, "ui-bar-chart", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBarChart();
		return g.initUIBarChart(this.type);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////////
function UIRadarChart() {
	return;
}

UIRadarChart.prototype = new UIChart();
UIRadarChart.prototype.isUIRadarChart = true;

UIRadarChart.prototype.initUIRadarChart = function(type) {
	return this.initUIChart(type, 200, 200);
}

UIRadarChart.prototype.getCustomProp = function() {
	var content = '\
		<label class="description" for="fontsize">' + dappGetText("Font Size") + ':</label>\
		<input id="fontsize"  class="element text small" type="number" value="0"/> \
		<label class="description" for="textcolor">' + dappGetText("Text Color") + ':</label>\
		<input id="textcolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="scalelinecolor">' + dappGetText("Scale Line Color") + ':</label>\
		<input id="scalelinecolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="backdropcolor">' + dappGetText("Backdrop Color") + ':</label>\
		<input id="backdropcolor"  class="element text small" type="text" value="0"/> \
		<input id="showscalelabels" class="checkbox_i"  type="checkbox" >' + dappGetText("Show Scale Labels") + '</input> \
		<label class="description" for="data">' + dappGetText("Data") + ':</label>\
		<textarea id="data"  rows="8" cols="60" type="text" value=""></textarea>';

	return content;
}

UIRadarChart.prototype.loadCustomProp = function(form) {
	var chart = this;
	
	form.fontsize.value = this.style.fontSize;
	form.fontsize.onchange = function(e) {
		var fontSize = parseInt(this.value);
		chart.style.setFontSize(fontSize);
		return;
	}
	
	form.textcolor.value = this.style.textColor;
	form.textcolor.onchange = function(e) {
		chart.style.setTextColor(this.value);
		return;
	}
	
	form.scalelinecolor.value = this.style.lineColor;
	form.scalelinecolor.onchange = function(e) {
		chart.style.setLineColor(this.value);
		return;
	}
	
	form.backdropcolor.value = this.style.fillColor;
	form.backdropcolor.onchange = function(e) {
		chart.setFillColor(this.value);
		return;
	}
	
	form.showscalelabels.checked = this.showScaleLabels;
	form.showscalelabels.onchange = function(e) {
		chart.showScaleLabels = this.checked;
		return;
	}
	
	form.data.value = this.getValue();
	form.data.onchange = function(e) {
		chart.setValue(this.value);
		return;
	}

	return;
}

UIRadarChart.prototype.getOptions = function() {
	this.options.scaleLineColor = this.style.lineColor;
	this.options.scaleShowLabels = this.showScaleLabels;
	this.options.scaleFontSize = this.style.fontSize;
	this.options.pointLabelFontSize = this.options.scaleFontSize;
	this.options.scaleFontColor = this.style.textColor;
	this.options.scaleBackdropColor = this.style.fillColor;
	this.options.angleLineColor = this.options.scaleLineColor;

	if(this.isIcon) {
		this.options.scaleShowLabels = false;
		this.options.scaleFontSize = 8;
		this.options.pointLabelFontSize = 6;
	}

	return this.options;
}

UIRadarChart.prototype.paintChart = function(ctx, data, options) {
	var chart = new Chart(ctx).Radar(data, options);
	delete chart;

	return;
}

UIRadarChart.prototype.getDefaultData = function() {
	var data = {
		labels : ["1","2","3","4","5","6","7"],
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : [65,59,90,81,56,55,40]
			},
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : [28,48,40,19,96,27,100]
			}
		]
	}
	return data;
}


function UIRadarChartCreator(type) {
	var args = [type, "ui-radar-chart", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIRadarChart();
		return g.initUIRadarChart(this.type);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////////
function UIPolarAreaChart() {
	return;
}

UIPolarAreaChart.prototype = new UIChart();
UIPolarAreaChart.prototype.isUIPolarAreaChart = true;

UIPolarAreaChart.prototype.initUIPolarAreaChart = function(type) {
	return this.initUIChart(type, 200, 200);
}

UIPolarAreaChart.prototype.getCustomProp = function() {
	var content = '\
		<label class="description" for="fontsize">' + dappGetText("Font Size") + ':</label>\
		<input id="fontsize"  class="element text small" type="number" value="0"/> \
		<label class="description" for="textcolor">' + dappGetText("Text Color") + ':</label>\
		<input id="textcolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="scalelinecolor">' + dappGetText("Scale Line Color") + ':</label>\
		<input id="scalelinecolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="backdropcolor">' + dappGetText("Backdrop Color") + ':</label>\
		<input id="backdropcolor"  class="element text small" type="text" value="0"/> \
		<input id="showscalelabels" class="checkbox_i"  type="checkbox" >' + dappGetText("Show Scale Labels") + '</input> \
		<label class="description" for="data">' + dappGetText("Data") + ':</label>\
		<textarea id="data"  rows="8" cols="60" type="text" value=""></textarea>';

	return content;
}

UIPolarAreaChart.prototype.loadCustomProp = function(form) {
	var chart = this;
	
	form.fontsize.value = this.style.fontSize;
	form.fontsize.onchange = function(e) {
		var fontSize = parseInt(this.value);
		chart.style.setFontSize(fontSize);
		return;
	}
	
	form.textcolor.value = this.style.textColor;
	form.textcolor.onchange = function(e) {
		chart.style.setTextColor(this.value);
		return;
	}
	
	form.scalelinecolor.value = this.style.lineColor;
	form.scalelinecolor.onchange = function(e) {
		chart.style.setLineColor(this.value);
		return;
	}
	
	form.backdropcolor.value = this.style.fillColor;
	form.backdropcolor.onchange = function(e) {
		chart.setFillColor(this.value);
		return;
	}
	
	form.showscalelabels.checked = this.showScaleLabels;
	form.showscalelabels.onchange = function(e) {
		chart.showScaleLabels = this.checked;
		return;
	}
	
	form.data.value = this.getValue();
	form.data.onchange = function(e) {
		chart.setValue(this.value);
		return;
	}

	return;
}

UIPolarAreaChart.prototype.getOptions = function() {
	this.options.scaleLineColor = this.style.lineColor;
	this.options.scaleShowLabels = this.showScaleLabels;
	this.options.scaleFontSize = this.style.fontSize;
	this.options.pointLabelFontSize = this.options.scaleFontSize;
	this.options.scaleFontColor = this.style.textColor;
	this.options.scaleBackdropColor = this.style.fillColor;
	this.options.angleLineColor = this.options.scaleLineColor;

	if(this.isIcon) {
		this.options.scaleShowLabels = false;
		this.options.scaleFontSize = 8;
		this.options.pointLabelFontSize = 6;
	}

	return this.options;
}

UIPolarAreaChart.prototype.paintChart = function(ctx, data, options) {
	var chart = new Chart(ctx).PolarArea(data, options);
	delete chart;

	return;
}

UIPolarAreaChart.prototype.getDefaultData = function() {
var data = [
	{
		value : 30,
		color: "#D97041"
	},
	{
		value : 90,
		color: "#C7604C"
	},
	{
		value : 24,
		color: "#21323D"
	},
	{
		value : 58,
		color: "#9D9B7F"
	},
	{
		value : 82,
		color: "#7D4F6D"
	},
	{
		value : 8,
		color: "#584A5E"
	}
]
	return data;
}


function UIPolarAreaChartCreator(type) {
	var args = [type, "ui-polar-area-chart", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPolarAreaChart();
		return g.initUIPolarAreaChart(this.type);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////////
function UIPieChart() {
	return;
}

UIPieChart.prototype = new UIChart();
UIPieChart.prototype.isUIPieChart = true;

UIPieChart.prototype.initUIPieChart = function(type) {
	return this.initUIChart(type, 200, 200);
}

UIPieChart.prototype.getCustomProp = function() {
	var content = '\
		<label class="description" for="fontsize">' + dappGetText("Font Size") + ':</label>\
		<input id="fontsize"  class="element text small" type="number" value="0"/> \
		<label class="description" for="textcolor">' + dappGetText("Text Color") + ':</label>\
		<input id="textcolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="scalelinecolor">' + dappGetText("Scale Line Color") + ':</label>\
		<input id="scalelinecolor"  class="element text small" type="text" value="0"/> \
		<label class="description" for="backdropcolor">' + dappGetText("Backdrop Color") + ':</label>\
		<input id="backdropcolor"  class="element text small" type="text" value="0"/> \
		<input id="showscalelabels" class="checkbox_i"  type="checkbox" >' + dappGetText("Show Scale Labels") + '</input> \
		<label class="description" for="data">' + dappGetText("Data") + ':</label>\
		<textarea id="data"  rows="8" cols="60" type="text" value=""></textarea>';

	return content;
}

UIPieChart.prototype.loadCustomProp = function(form) {
	var chart = this;
	
	form.fontsize.value = this.style.fontSize;
	form.fontsize.onchange = function(e) {
		var fontSize = parseInt(this.value);
		chart.style.setFontSize(fontSize);
		return;
	}
	
	form.textcolor.value = this.style.textColor;
	form.textcolor.onchange = function(e) {
		chart.style.setTextColor(this.value);
		return;
	}
	
	form.scalelinecolor.value = this.style.lineColor;
	form.scalelinecolor.onchange = function(e) {
		chart.style.setLineColor(this.value);
		return;
	}
	
	form.backdropcolor.value = this.style.fillColor;
	form.backdropcolor.onchange = function(e) {
		chart.setFillColor(this.value);
		return;
	}
	
	form.showscalelabels.checked = this.showScaleLabels;
	form.showscalelabels.onchange = function(e) {
		chart.showScaleLabels = this.checked;
		return;
	}
	
	form.data.value = this.getValue();
	form.data.onchange = function(e) {
		chart.setValue(this.value);
		return;
	}

	return;
}

UIPieChart.prototype.getOptions = function() {
	this.options.scaleLineColor = this.style.lineColor;
	this.options.scaleShowLabels = this.showScaleLabels;
	this.options.scaleFontSize = this.style.fontSize;
	this.options.pointLabelFontSize = this.options.scaleFontSize;
	this.options.scaleFontColor = this.style.textColor;
	this.options.scaleBackdropColor = this.style.fillColor;
	this.options.angleLineColor = this.options.scaleLineColor;

	if(this.isIcon) {
		this.options.scaleShowLabels = false;
		this.options.scaleFontSize = 8;
		this.options.pointLabelFontSize = 6;
	}

	return this.options;
}

UIPieChart.prototype.paintChart = function(ctx, data, options) {
	var chart = null;
	if(this.type === "ui-doughnut-chart") {
		chart = new Chart(ctx).Pie(data, options);
	}
	else {
		chart = new Chart(ctx).Doughnut(data, options);
	}
	delete chart;

	return;
}

UIPieChart.prototype.getDefaultData = function() {
	var data = [
		{
			value: 30,
			color:"#F38630"
		},
		{
			value : 50,
			color : "#E0E4CC"
		},
		{
			value : 100,
			color : "#69D2E7"
		}			
	];

	return data;
}


function UIPieChartCreator(type) {
	var args = [type, "ui-pie-chart", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPieChart();
		return g.initUIPieChart(this.type);
	}
	
	return;
}

var shapeFactory = ShapeFactoryGet();
shapeFactory.addShapeCreator(new UIBarChartCreator("ui-bar-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIBarChartCreator("ui-line-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIRadarChartCreator("ui-radar-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIPolarAreaChartCreator("ui-polar-area-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIPieChartCreator("ui-pie-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIPieChartCreator("ui-doughnut-chart"), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIChartLegendItemCreator(), C_UI_ELEMENTS);
shapeFactory.addShapeCreator(new UIChartLegendCreator(), C_UI_ELEMENTS);



/*
 * File: webapp.js
 * Author:	Li XianJing <xianjimli@hotmail.com>
 * Brief: web app.
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function webappInit(type) {
	cantkRegisterUIElements();

	if(type === C_APP_TYPE_PREVIEW) {
		document.body.style.overflow = "scroll";
	}
	else {
		document.body.style.overflow = "hidden";
	}

	return;
}

function WebApp(type) {
	var args = ["idraw_canvas", type];
	AppBase.apply(this, args);

	webappInit(type);

	this.onSizeChanged = function() {
		var viewPort = getViewPort();

		if(viewPort.width === this.viewPort.width && viewPort.height === this.viewPort.height) {
			console.log("onSizeChanged: size is not changed.");
			return;
		}

		this.adjustCanvasSize();
		
		var w = this.canvas.width;
		var h = this.canvas.height;
		
		console.log("onSizeChanged: w=" + w + " h=" + h);

		this.manager.resize(w, h);
		this.win.resize(w, h);
		this.view.resize(w, h);
		this.view.resizeWindowManager(w, h);
		this.view.moveEditor();

		this.viewPort = viewPort;
	}

	this.exitApp = function() {
		if(isTizen()) {
			tizen.application.getCurrentApplication().exit();
		}
		else if(navigator.app) {
			navigator.app.exitApp();
		}
		console.log("exitApp");
		return;
	}

	this.viewPort = getViewPort();

	return this;
}

WebApp.prototype.runWithURL = function(dataURL) {
	var rInfo = {};
	var app = this;

	rInfo.url = dataURL;
	rInfo.headers = {};
	rInfo.method = "GET";
	rInfo.noCache = true;
	rInfo.onDone = function(result, xhr, respContent) {
		var jsonStr = xhr.responseText;
		app.runWithData(jsonStr);
		
		return;
	}
	httpDoRequest(rInfo);	
	console.log("dataURL:" + dataURL);

	return;
}

WebApp.prototype.createWindow = function() {
	var x = 0;
	var y = 0;

	var w = this.canvas.width;
	var h = this.canvas.height;

	this.win = new Window(this.manager, 0, 0, w, h);
	this.win.theme[0].bg = "White";
	
	this.view = new AppView(this.win, x, y, w, h, this);
	this.view.forPreview = this.type === C_APP_TYPE_PREVIEW;
	
	var view = this.view;

	if(!this.view.forPreview) {
		this.win.paintBackground = function(canvas) {
		}
	}

	this.win.onGesture = function(gesture) {
		return view.onGesture(gesture);
	}

	return;
}

WebApp.prototype.showWindow = function() {
	this.view.showIt();
	this.win.showAll(1);

	return;
}

WebApp.prototype.runWithData = function(jsonStr) {
	this.createWindow();
	this.view.loadFromJson(jsonStr);
	this.showWindow();	

	return;
}

WebApp.prototype.previewWithDeviceData = function(deviceJson) {
	this.createWindow();

	this.view.beforeLoad(deviceJson);
	this.view.fixDeviceConfig(deviceJson);
	this.view.meta = deviceJson.meta;
	this.view.device = ShapeFactoryGet().createShape(deviceJson.type, C_CREATE_FOR_PROGRAM)
	this.view.deviceJson = deviceJson;
	this.view.afterLoad(deviceJson);

	this.showWindow();

	return;
}

WebApp.prototype.runWithDeviceData = function(deviceJson) {
	this.createWindow();

	this.view.fixDeviceConfig(deviceJson);
	this.view.device = deviceJson;
	this.view.meta = deviceJson.meta;

	this.view.createWindowManager = function() {
		var js = null;
		var wm = this.getWindowManager();

		js = wm;
		this.beforeLoad(deviceJson);
		wm = ShapeFactoryGet().createShape(js.type, C_CREATE_FOR_PROGRAM);
		wm.fromJson(js);
		this.afterLoad(deviceJson);

		return wm;
	}

	this.showWindow();

	return;
}

function webappRunWithData(jsonStr) {
	var app = new WebApp(C_APP_TYPE_WEBAPP);
	
	app.runWithData(jsonStr);

	return app;
}

function webappRunWithDeviceData(deviceJson) {
	var app = new WebApp(C_APP_TYPE_WEBAPP);
	
	app.runWithDeviceData(deviceJson);

	return app;
}

function webappPreviewWithDeviceData(deviceJson) {
	var app = new WebApp(C_APP_TYPE_PREVIEW);
	
	app.previewWithDeviceData(deviceJson);

	return app;
}

function webappPreviewWithData(jsonStr) {
	var app = new WebApp(C_APP_TYPE_PREVIEW);
	
	app.runWithData(jsonStr);

	return app;
}

function webappRunWithURL(dataURL) {
	var app = new WebApp(C_APP_TYPE_WEBAPP);
	
	app.runWithURL(dataURL);

	return app;
}

function webappPreviewWithURL(dataURL) {
	var app = new WebApp(C_APP_TYPE_PREVIEW);
	
	app.runWithURL(dataURL);

	return app;
}

function shapeFixImagePath(shape, oldConfig, newConfig) {
	var oldVersion	= oldConfig.version;
	var oldPlatform = oldConfig.platform;
	var oldDensity	= oldConfig.lcdDensity;
	var newVersion	= newConfig.version;
	var newPlatform = newConfig.platform;
	var newDensity	= newConfig.lcdDensity;

	for(var key in shape.images) {
		var value = shape.images[key];
		if(key === "display") {
			continue;
		}
		
		var src = value;
		if(src) {
			src = src.replaceAll("/" + oldVersion + "/", "/" + newVersion + "/");
			src = src.replaceAll("/" + oldPlatform + "/", "/" + newPlatform + "/");
			src = src.replaceAll("/" + oldDensity + "/", "/" + newDensity + "/");
			shape.images[key] = src;
		}
	}

	if(shape.children) {
		for(var i = 0; i < shape.children.length; i++) {
			shapeFixImagePath(shape.children[i], oldConfig, newConfig);
		}
	}

	return;
}

function AppView(parent, x, y, w, h, app) {
	ViewBase.apply(this, arguments);

	this.allUserAppScriptsLoaded = false;

	this.forPreview = false;

	this.postRedraw =	 function(rect) {
		if(!this.allUserAppScriptsLoaded) {
			return;
		}

		var p = this.getAbsPosition();
		
		if(!rect) {
			rect = {x:0, y:0, w:this.rect.w, h:this.rect.h};
		}

		rect.x = p.x + rect.x;
		rect.y = p.y + rect.y;
		
		this.getManager().postRedraw(rect);
	}

	this.init = function() {

		this.platform = "windowphone";
		if(browser.versions.android) {
			this.platform = "android";
		}
		else if(browser.versions.iPhone) {
			this.platform = "iphone";
		}

		return;
	}
	
	this.showPageIndicator = function(canvas) {
		return;
	}
	
	this.showLogo = function(canvas) {
		return;
	}

	this.drawGrid = function(canvas) {
		return;
	}
	
	this.onGesture = function(gesture) {
		if(this.windowManager) {
			var curWin = this.windowManager.getCurrentFrame();
			if(curWin) {
				curWin.onGesture(gesture);
			}
		}

		return;
	}

	this.setTarget = function(shape) {
		for(var i = this.allShapes.length - 1; i >= 0; i--) {
			var g = this.allShapes[i];

			if(shape !== g) {
				g.setSelected(false);
			}
		}					
		
		this.targetShape = shape;	
		
		return;
	}
	
	this.onPointerDown = function(p) { 
		var point = this.translatePoint(p);

		this.pointerDownPosition.x = point.x;
		this.pointerDownPosition.y = point.y;
		this.lastPointerPosition.x = point.x;
		this.lastPointerPosition.y = point.y;
		
		this.updateLastPointerPoint(point);
		for(var i = this.allShapes.length - 1; i >= 0; i--) {
			var shape = this.allShapes[i];
			if(shape.onPointerDown(point)) {
				this.setTarget(shape);
				break;
			}
		}

		this.postRedraw();

		return;
	}
	
	this.onPointerMove = function(p) {
		var point = this.translatePoint(p);
		
		this.updateLastPointerPoint(point);
		if(this.targetShape) {
			this.targetShape.onPointerMove(point);
		
			if(this.targetShape.pointerDown) {
				this.postRedraw();
			}
			
			return;
		}

		return;
	}
	
	this.onPointerUp = function(p) {
		var point = this.translatePoint(p);

		this.updateLastPointerPoint(point);
		if(this.targetShape) {
			this.targetShape.onPointerUp(point);
			this.postRedraw();
		}

		return;
	}
	
	this.onKeyDown = function(code) {		
		if(!this.targetShape && this.allShapes && this.allShapes.length) {
			this.targetShape = this.allShapes[0];
		}

		if(this.targetShape) {
			this.targetShape.onKeyDown(code);
			this.postRedraw();
		}
		
		return;
	}

	this.onKeyUp = function(code) {
		if(this.targetShape) {
			this.targetShape.onKeyUp(code);
			this.postRedraw();
		}
		
		return;
	}

	this.extractDevices = function(js) {
		this.devices = new Array();

		for(var pageIndex = 0; pageIndex < js.pages.length; pageIndex++) {
			var page = js.pages[pageIndex];
			for(var i = 0; i < page.shapes.length; i++) {
				var shape = page.shapes[i];

				if(shape.type === "ui-device") {
					if(!this.forPreview) {
						shape.images = {display:0};
						this.fixDeviceConfig(shape);
					}

					var device = ShapeFactoryGet().createShape(shape.type, C_CREATE_FOR_PROGRAM);
					if(device) {
						device.fromJson(shape);
					}
					this.devices.push(device);
				}
			}
		}

		return this.devices.length;
	}

	this.getDevice = function() {
		if(!this.device) {
			for(var i = 0; i < this.devices.length; i++) {
				var device = this.devices[i];
				var config = device.config;

				if(!device.config) continue;
				if(config.platform != this.platform) continue;

				this.device = device;
			}

			if(!this.device) {
				this.device = this.devices[0];
			}
		}

		return this.device;
	}
	
	this.getScreen = function() {
		if(!this.screen) {
			var device = this.getDevice();
			for(var i = 0; i < device.children.length; i++) {
				var child = device.children[i];
				if(child.isUIScreen) {
					this.screen = child;
				}
			}
		}

		return this.screen;
	}
	
	this.getWindowManager = function(detach) {
		if(!this.windowManager) {
			var screen = this.getScreen();
			for(var i = 0; i < screen.children.length; i++) {
				var child = screen.children[i];
				if(child.isUIWindowManager) {
					this.windowManager = child;
					if(detach) {
						screen.children.remove(child);
						child.parentShape = null;
					}
					break;
				}
			}
		}

		return this.windowManager;
	}

	this.detectDeviceConfig = function() {
		if(this.detectedDeviceConfig) {
			return this.detectedDeviceConfig;
		}

		var deviceConfig = cantkDetectDeviceConfig();
			
		deviceConfig.screenW = this.rect.w;
		deviceConfig.screenH = this.rect.h; 

		this.detectedDeviceConfig = deviceConfig;

		console.log("deviceConfig.lcdDensity:" + deviceConfig.lcdDensity);
		console.log("deviceConfig.platform:" + deviceConfig.platform);
		console.log("deviceConfig.screenW:" + deviceConfig.screenW);
		console.log("deviceConfig.screenH:" + deviceConfig.screenH);

		return deviceConfig;
	}

	this.showIt = function() {
		if(this.forPreview) {
			this.showDevice();
		}
		else {
			this.showWindowManager();
		}

		this.targetShape = this.getWindowManager();
		console.log("Set targetShape: " + this.targetShape.type);

		var view = this;
		setTimeout(function() {
			view.postRedraw();
		}, 500);
		
		setTimeout(function() {
			view.postRedraw();
		}, 1000);

		setTimeout(function() {
			view.postRedraw();
		}, 2000);

		setTimeout(function() {
			view.postRedraw();
		}, 3000);

		return;
	}

	this.showDevice = function() {
		var x = 0;
		var y = 0;
		var w = this.rect.w;
		var h = this.rect.h;

		var device = this.getDevice();
		var js = this.deviceJson ? this.deviceJson : device.toJson();
	
		var screen = null;
		for(var i = 0; i < js.children.length; i++) {
			var child = js.children[i];
			if(child.type === "ui-screen") {
				screen = child;
			}
		}
		js.children.clear();
		js.children.push(screen);

		this.device = device = ShapeFactoryGet().createShape(js.type, C_CREATE_FOR_PROGRAM);
		device.fromJson(js);

		var viewPort = getViewPort();
		if(device.h < viewPort.height && device.w < viewPort.width) {
			y = (viewPort.height - device.h)/2;
			document.body.style.overflow = "hidden";
		}

		x = (w - device.w)/2;
		device.move(x, y);
		device.setMode(C_MODE_RUNNING, true);
		this.addShape(device);

		var wm = this.getWindowManager();
		this.runApp(wm);

		return;
	}

	this.getDeviceConfig = function() {
		var device = this.getDevice();

		return device ? device.config : null;
	}
	
	this.resizeWindowManager = function(w, h) {
		if(this.windowManager) {
			this.windowManager.setSizeLimit(w, h, w, h);
			this.windowManager.resize(w, h);
			console.log("this.windowManager.x=" + this.windowManager.x);
			console.log("this.windowManager.y=" + this.windowManager.y);
			console.log("this.windowManager.w=" + this.windowManager.w);
			console.log("this.windowManager.h=" + this.windowManager.h);
			
			var wm = this.windowManager;

			setTimeout(function() {
				wm.relayoutChildren();
				wm.postRedraw();
			}, 200);
		}

		return;
	}

	this.moveEditor = function() {
		setTimeout(function() {
			cantkMoveEditorWhenResize();
		}, 300);
		cantkMoveEditorWhenResize();

		return;
	}

	this.createWindowManager = function() {
		return this.getWindowManager(true);
	}
	
	this.fixDeviceConfig = function(device) {
		var oldConfig = device.config;
		var newConfig = this.detectDeviceConfig();
		
		if(app.type === C_APP_TYPE_PREVIEW) {
			newConfig.lcdDensity = oldConfig.lcdDensity;
			console.log("run in preview mode.");
		}

		if(newConfig.platform !== oldConfig.platform 
			&& newConfig.version !== oldConfig.version 
			&& newConfig.lcdDensity !== oldConfig.lcdDensity) {
			shapeFixImagePath(device, oldConfig, newConfig);
		}

		return;
	}

	this.getUserAppScripts = function() {
		if(this.meta) {
			return this.meta.extlibs;
		}
		return null;
	}

	this.runApp = function(wm) {
		var view = this;
		var scripts = this.getUserAppScripts();
	
		if(!scripts || !scripts.length) {
			view.allUserAppScriptsLoaded = true;

			wm.systemInit();
			wm.showInitWindow();
			wm.postRedraw();

			return;
		}

		for(var i = 0; i < scripts.length; i++) {
			addUserAppScript(scripts[i]);
		}

		loadUserAppScripts(function() {
			console.log("All User App Scripts Loaded");
			view.allUserAppScriptsLoaded = true;

			wm.systemInit();
			wm.showInitWindow();
			wm.postRedraw();
		});

		return;
	}

	this.showWindowManager = function() {
		var wm = null;
		var w = this.rect.w;
		var h = this.rect.h;
		var newConfig = this.detectDeviceConfig();

		wm = this.createWindowManager();
		wm.deviceConfig = this.getDeviceConfig();

		if(app.type === C_APP_TYPE_PREVIEW) {
			newConfig.lcdDensity = wm.deviceConfig.lcdDensity;
		}

		wm.setDeviceConfig(newConfig);
		wm.setSizeLimit(w, h, w, h);
		wm.setSize(w, h);
		wm.move(0, 0);
		wm.setMode(C_MODE_RUNNING, true);
		this.addShape(wm);
		this.runApp(wm);
		
		this.windowManager = wm;	

		console.log("w:" + w + " h:" + h);
		return;
	}

	this.loadJson = function(js) {
		this.meta = js.meta;
		this.beforeLoad(js);

		if(!js || !js.pages || !this.extractDevices(js)) {
			console.log("It is not a valid webapp.");
			return;
		}
		this.afterLoad(js);

		return;
	}

	this.init();

	return this;
}

function dappGetText(text) {
	return text;
}

function dappIsEditorApp() {
	return false;
}


if(isWeiXin()) {
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	//	WeixinJSBridge.call('hideToolbar');
	});
}


	CanTK.isOldIE = isOldIE;
	CanTK.isTizen = isTizen;
	CanTK.isMobile = isMobile;
	CanTK.isAndroid = isAndroid;
	CanTK.isFirefoxOS = isFirefoxOS;
	window.isOldIE = isOldIE;
	window.isTizen = isTizen;
	window.isMobile = isMobile;
	window.isAndroid = isAndroid;
	window.isFirefoxOS = isFirefoxOS;
	CanTK.isRightMouseEvent = isRightMouseEvent;
	CanTK.delayLoadScripts = delayLoadScripts;
	CanTK.initViewPort = cantkInitViewPort;
	CanTK.restoreViewPort = cantkRestoreViewPort;
	CanTK.httpDoRequest = httpDoRequest;	

	CanTK.LinearInterpolator = LinearInterpolator;
	CanTK.BounceInterpolator = BounceInterpolator;
	CanTK.AccelerateInterpolator = AccelerateInterpolator;
	CanTK.AccDecelerateInterpolator = AccDecelerateInterpolator;
	CanTK.DecelerateInterpolator = DecelerateInterpolator;
	CanTK.detectDeviceConfig = cantkDetectDeviceConfig;

	window.cantkGetLocale = cantkGetLocale;
	window.cantkInitViewPort = cantkInitViewPort;
	window.cantkRestoreViewPort = cantkRestoreViewPort;
	window.cantkRegisterUIElements = cantkRegisterUIElements;	

	window.webappSetLocaleStrings = webappSetLocaleStrings;
	window.webappPreviewWithURL = webappPreviewWithURL;
	window.webappPreviewWithData = webappPreviewWithData;
	window.webappPreviewWithDeviceData = webappPreviewWithDeviceData;
	window.webappRunWithURL = webappRunWithURL;
	window.webappRunWithData = webappRunWithData;
	window.webappRunWithDeviceData = webappRunWithDeviceData;


	CanTK.UIElement = UIElement;
	CanTK.init = function () {
		return cantkRegisterUIElements();
	}

	CanTK.createElement = function(type) {
		return ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);
	}
	
	CanTK.createElementWithJson = function(data) {
		var type = data.type;
		var el = ShapeFactoryGet().createShape(type, C_CREATE_FOR_PROGRAM);

		if(el) {
			el.fromJson(data);
			el.setMode(C_MODE_RUNNING, true);
		}

		return el;
	}

	CanTK.UIElement.RUNNING = C_MODE_RUNNING;
	CanTK.UIElement.DEFAULT_IMAGE = CANTK_IMAGE_DEFAULT;

	CanTK.setResRoot = function(resRoot) {
		return CanTkImage.setResRoot(resRoot);
	}

	window.httpDoRequest = httpDoRequest;

	root.CanTK = CanTK;

}).call(this);




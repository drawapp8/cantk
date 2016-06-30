Ext.data.JsonP.Global({
  "tagname": "class",
  "name": "Global",
  "autodetected": {
  },
  "files": [
    {
      "filename": "ui-misc-api.js",
      "href": null
    }
  ],
  "members": [
    {
      "name": "httpGetJSON",
      "tagname": "method",
      "owner": "Global",
      "id": "method-httpGetJSON",
      "meta": {
      }
    },
    {
      "name": "httpGetJSONP",
      "tagname": "method",
      "owner": "Global",
      "id": "method-httpGetJSONP",
      "meta": {
      }
    },
    {
      "name": "httpGetURL",
      "tagname": "method",
      "owner": "Global",
      "id": "method-httpGetURL",
      "meta": {
      }
    },
    {
      "name": "httpPostURL",
      "tagname": "method",
      "owner": "Global",
      "id": "method-httpPostURL",
      "meta": {
      }
    },
    {
      "name": "isAndroid",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isAndroid",
      "meta": {
      }
    },
    {
      "name": "isBlackBerry",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isBlackBerry",
      "meta": {
      }
    },
    {
      "name": "isFirefoxOS",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isFirefoxOS",
      "meta": {
      }
    },
    {
      "name": "isHolaPlay",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isHolaPlay",
      "meta": {
      }
    },
    {
      "name": "isIPad",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isIPad",
      "meta": {
      }
    },
    {
      "name": "isIPhone",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isIPhone",
      "meta": {
      }
    },
    {
      "name": "isMacOSX",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isMacOSX",
      "meta": {
      }
    },
    {
      "name": "isWebAudioSupported",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isWebAudioSupported",
      "meta": {
      }
    },
    {
      "name": "isWinPhone",
      "tagname": "method",
      "owner": "Global",
      "id": "method-isWinPhone",
      "meta": {
      }
    },
    {
      "name": "webappGetText",
      "tagname": "method",
      "owner": "Global",
      "id": "method-webappGetText",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Global",
  "short_doc": "Global is no a class, it a global functions set. ...",
  "component": false,
  "superclasses": [

  ],
  "subclasses": [

  ],
  "mixedInto": [

  ],
  "mixins": [

  ],
  "parentMixins": [

  ],
  "requires": [

  ],
  "uses": [

  ],
  "html": "<div><div class='doc-contents'><p>Global is no a class, it a global functions set. You can call them by window object or call it directly.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-httpGetJSON' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-httpGetJSON' class='name expandable'>httpGetJSON</a>( <span class='pre'>url, onDone, [autoProxy], [withCredentials]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Uses AJAX to request a URL, and returns data as a JSON object. ...</div><div class='long'><p>Uses AJAX to request a URL, and returns data as a JSON object.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>onDone</span> : Function<div class='sub-desc'><p>Callback function on completion.</p>\n</div></li><li><span class='pre'>autoProxy</span> : Boolean (optional)<div class='sub-desc'><p>Whether to use a proxy when previewing in Studio.</p>\n</div></li><li><span class='pre'>withCredentials</span> : Boolean (optional)<div class='sub-desc'><p>Whether to send credentials (cookies, HTTP certificate, and client SSL certificate) when visiting cross-domain sites.</p>\n\n<p>For cross-domain visits see: <a href=\"//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS\">https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS</a></p>\n\n<p>Example:</p>\n\n<pre class='inline-example small frame'><code>httpGetJSON(\"http://bcs.duapp.com/demogames/games/warrior/weapon2-pro.json\", function(jsObject) {\n   console.log(jsObject);\n},true);\n</code></pre>\n</div></li></ul></div></div></div><div id='method-httpGetJSONP' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-httpGetJSONP' class='name expandable'>httpGetJSONP</a>( <span class='pre'>url, onDone, [options]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Uses JSONP to request a URL. ...</div><div class='long'><p>Uses JSONP to request a URL.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>onDone</span> : Function<div class='sub-desc'><p>Callback function on completion.</p>\n</div></li><li><span class='pre'>options</span> : Object (optional)<div class='sub-desc'><p>options.jsonp can set keyword for the callback function (the default is \"callback\").</p>\n\n<p>Example:</p>\n\n<pre class='inline-example small frame'><code>function onDone(data) {\n   console.log(\"data:\" + JSON.stringify(data));\n}\n\nhttpGetJSONP(\"http://192.168.8.100:8000\", onDone);\n\nfunction onDone(data) {\n    console.log(\"data:\" + JSON.stringify(data));\n}\n\nhttpGetJSONP(\"http://192.168.8.100:8000\", onDone, {jsonp:\"fn\"});\n</code></pre>\n</div></li></ul></div></div></div><div id='method-httpGetURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-httpGetURL' class='name expandable'>httpGetURL</a>( <span class='pre'>url, onDone, [autoProxy], [withCredentials]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Uses AJAX to request a URL. ...</div><div class='long'><p>Uses AJAX to request a URL.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>onDone</span> : Function<div class='sub-desc'><p>Callback function on completion.</p>\n</div></li><li><span class='pre'>autoProxy</span> : Boolean (optional)<div class='sub-desc'><p>Whether to use a proxy when previewing in Studio.</p>\n</div></li><li><span class='pre'>withCredentials</span> : Boolean (optional)<div class='sub-desc'><p>Whether to send credentials (cookies, HTTP certificate, and client SSL certificate) when visiting cross-domain sites.</p>\n\n<p>For cross-domain visits see:  <a href=\"//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS\">https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS</a></p>\n\n<p>Example:</p>\n\n<pre class='inline-example small frame'><code>httpGetURL(\"http://bcs.duapp.com/demogames/games/warrior/weapon2-pro.json\", function(result, xhr, content) {\n    console.log(content);\n},true);\n</code></pre>\n</div></li></ul></div></div></div><div id='method-httpPostURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-httpPostURL' class='name expandable'>httpPostURL</a>( <span class='pre'>url, data, onDone, [autoProxy], [withCredentials]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Uses AJAX to request a URL. ...</div><div class='long'><p>Uses AJAX to request a URL.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>data</span> : String<div class='sub-desc'><p>POST data.</p>\n</div></li><li><span class='pre'>onDone</span> : Function<div class='sub-desc'><p>Callback function on completion.</p>\n</div></li><li><span class='pre'>autoProxy</span> : Boolean (optional)<div class='sub-desc'><p>Whether to use a proxy when previewing in Studio.</p>\n</div></li><li><span class='pre'>withCredentials</span> : Boolean (optional)<div class='sub-desc'><p>Whether to send credentials (cookies, HTTP certificate, and client SSL certificate) when visiting cross-domain sites.</p>\n\n<p>For cross-domain visits see: <a href=\"//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS\">https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS</a></p>\n\n<p>Example:</p>\n\n<pre class='inline-example small frame'><code>var win = this.getWindow();\nvar name = win.getValueOf(\"name\");\nvar tel = win.getValueOf(\"tel\");\nvar address = win.getValueOf(\"address\");\n\nvar formData = new FormData();\nformData.append(\"name\", name);\nformData.append(\"tel\", tel);\nformData.append(\"address\", address);\n\nhttpPostURL(\"http://xxxxx\", formData, function(result, xhr, content) {\n    console.log(\"httpPostURL:\" + content);\n})\n</code></pre>\n</div></li></ul></div></div></div><div id='method-isAndroid' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isAndroid' class='name expandable'>isAndroid</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current is Android system. ...</div><div class='long'><p>Determines if the current is Android system.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current is Android system. false means not.</p>\n</div></li></ul></div></div></div><div id='method-isBlackBerry' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isBlackBerry' class='name expandable'>isBlackBerry</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current is Black Berry system. ...</div><div class='long'><p>Determines if the current is Black Berry system.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current is Black Berry system. false means not.</p>\n</div></li></ul></div></div></div><div id='method-isFirefoxOS' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isFirefoxOS' class='name expandable'>isFirefoxOS</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current is FirefoxOS system. ...</div><div class='long'><p>Determines if the current is FirefoxOS system.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current is FirefoxOS system. false means not.</p>\n</div></li></ul></div></div></div><div id='method-isHolaPlay' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isHolaPlay' class='name expandable'>isHolaPlay</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current is Hola Play system. ...</div><div class='long'><p>Determines if the current is Hola Play system.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current is Hola Play system. false means not.</p>\n</div></li></ul></div></div></div><div id='method-isIPad' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isIPad' class='name expandable'>isIPad</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current is IPad system. ...</div><div class='long'><p>Determines if the current is IPad system.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current is IPad system. false means not.</p>\n</div></li></ul></div></div></div><div id='method-isIPhone' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isIPhone' class='name expandable'>isIPhone</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current is IPhone system. ...</div><div class='long'><p>Determines if the current is IPhone system.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current is IPhone system. false means not.</p>\n</div></li></ul></div></div></div><div id='method-isMacOSX' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isMacOSX' class='name expandable'>isMacOSX</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current is MacOSX system. ...</div><div class='long'><p>Determines if the current is MacOSX system.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current is MacOSX system. false means not.</p>\n</div></li></ul></div></div></div><div id='method-isWebAudioSupported' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isWebAudioSupported' class='name expandable'>isWebAudioSupported</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current system supports WebAudio. ...</div><div class='long'><p>Determines if the current system supports WebAudio. If both isHolaPlay() and isWebAudioSupported() returns ture, the sound will be completely supported.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current supports WebAudio, false means not.</p>\n</div></li></ul></div></div></div><div id='method-isWinPhone' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isWinPhone' class='name expandable'>isWinPhone</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Determines if the current is Windows Phone system. ...</div><div class='long'><p>Determines if the current is Windows Phone system.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true means current is Windows Phone system. false means not.</p>\n</div></li></ul></div></div></div><div id='method-webappGetText' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-webappGetText' class='name expandable'>webappGetText</a>( <span class='pre'>text</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Get the coresponding localization text. ...</div><div class='long'><p>Get the coresponding localization text.</p>\n\n<p>In Hola Studio，Tool menu has localization settings, put the translated text in it, usually the engine will automatically setting the text on element to localization text.</p>\n\n<p>Sometimes text needs to be modified dynamicly, for example: Show player's score, you can get text by webappGetText first, then replace the score.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>text</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>the localization text</p>\n\n<p>Example：</p>\n\n<pre class='inline-example small frame'><code>var str = webappGetText(\"Your Scores Is {score}\");\nstr = str.replace(/{score}/, 100);\nthis.win.find(\"score\", true).setText(str)；\n</code></pre>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});
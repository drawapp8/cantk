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
  "html": "<div><div class='doc-contents'><p>Global并不是一个类，只是一些全局函数的集合，可以通过window对象或直接使用。</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-httpGetJSON' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-httpGetJSON' class='name expandable'>httpGetJSON</a>( <span class='pre'>url, onDone, autoProxy, withCredentials</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>通过AJAX去请求一个URL，并把返回数据解析为JSON对象。 ...</div><div class='long'><p>通过AJAX去请求一个URL，并把返回数据解析为JSON对象。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>onDone</span> : Function<div class='sub-desc'><p>完成时的回调函数。</p>\n</div></li><li><span class='pre'>autoProxy</span> : Boolean<div class='sub-desc'><p>(可选) 在Studio中预览时是否启用代理。</p>\n</div></li><li><span class='pre'>withCredentials</span> : Boolean<div class='sub-desc'><p>(可选) 跨域访问时是否发送凭据(cookie、HTTP认证及客户端SSL证明等)。</p>\n\n<p>跨域访问请参考: <a href=\"//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS\">https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS</a></p>\n\n<p>示例：</p>\n\n<pre class='inline-example small frame'><code>httpGetJSON(\"http://bcs.duapp.com/demogames/games/warrior/weapon2-pro.json\", function(jsObject) {\n   console.log(jsObject);\n},true);\n</code></pre>\n</div></li></ul></div></div></div><div id='method-httpGetJSONP' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-httpGetJSONP' class='name expandable'>httpGetJSONP</a>( <span class='pre'>url, onDone, options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>通过JSONP去请求一个URL。 ...</div><div class='long'><p>通过JSONP去请求一个URL。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>onDone</span> : Function<div class='sub-desc'><p>完成时的回调函数。</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>(可选) options.jsonp可以指定回调函数的关键字(缺省为\"callback\")。</p>\n\n<p>示例：</p>\n\n<pre class='inline-example small frame'><code>function onDone(data) {\n   console.log(\"data:\" + JSON.stringify(data));\n}\n\nhttpGetJSONP(\"http://192.168.8.100:8000\", onDone);\n\nfunction onDone(data) {\n    console.log(\"data:\" + JSON.stringify(data));\n}\n\nhttpGetJSONP(\"http://192.168.8.100:8000\", onDone, {jsonp:\"fn\"});\n</code></pre>\n</div></li></ul></div></div></div><div id='method-httpGetURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-httpGetURL' class='name expandable'>httpGetURL</a>( <span class='pre'>url, onDone, autoProxy, withCredentials</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>通过AJAX去请求一个URL。 ...</div><div class='long'><p>通过AJAX去请求一个URL。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>onDone</span> : Function<div class='sub-desc'><p>完成时的回调函数。</p>\n</div></li><li><span class='pre'>autoProxy</span> : Boolean<div class='sub-desc'><p>(可选) 在Studio中预览时是否启用代理。</p>\n</div></li><li><span class='pre'>withCredentials</span> : Boolean<div class='sub-desc'><p>(可选) 跨域访问时是否发送凭据(cookie、HTTP认证及客户端SSL证明等)。</p>\n\n<p>跨域访问请参考: <a href=\"//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS\">https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS</a></p>\n\n<p>示例：</p>\n\n<pre class='inline-example small frame'><code>httpGetURL(\"http://bcs.duapp.com/demogames/games/warrior/weapon2-pro.json\", function(result, xhr, content) {\n    console.log(content);\n},true);\n</code></pre>\n</div></li></ul></div></div></div><div id='method-httpPostURL' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-httpPostURL' class='name expandable'>httpPostURL</a>( <span class='pre'>url, data, onDone, autoProxy, withCredentials</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>通过AJAX去请求一个URL。 ...</div><div class='long'><p>通过AJAX去请求一个URL。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>URL</p>\n</div></li><li><span class='pre'>data</span> : String<div class='sub-desc'><p>POST的数据。</p>\n</div></li><li><span class='pre'>onDone</span> : Function<div class='sub-desc'><p>完成时的回调函数。</p>\n</div></li><li><span class='pre'>autoProxy</span> : Boolean<div class='sub-desc'><p>(可选) 在Studio中预览时是否启用代理。</p>\n</div></li><li><span class='pre'>withCredentials</span> : Boolean<div class='sub-desc'><p>(可选) 跨域访问时是否发送凭据(cookie、HTTP认证及客户端SSL证明等)。</p>\n\n<p>跨域访问请参考: <a href=\"//developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS\">https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS</a></p>\n\n<p>示例：</p>\n\n<pre class='inline-example small frame'><code>var win = this.getWindow();\nvar name = win.getValueOf(\"name\");\nvar tel = win.getValueOf(\"tel\");\nvar address = win.getValueOf(\"address\");\n\nvar formData = new FormData();\nformData.append(\"name\", name);\nformData.append(\"tel\", tel);\nformData.append(\"address\", address);\n\nhttpPostURL(\"http://xxxxx\", formData, function(result, xhr, content) {\n    console.log(\"httpPostURL:\" + content);\n})\n</code></pre>\n</div></li></ul></div></div></div><div id='method-isAndroid' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isAndroid' class='name expandable'>isAndroid</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否是android系统。 ...</div><div class='long'><p>判断当前是否是android系统。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前是android系统, false表示不是。</p>\n</div></li></ul></div></div></div><div id='method-isBlackBerry' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isBlackBerry' class='name expandable'>isBlackBerry</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否是black berry 系统。 ...</div><div class='long'><p>判断当前是否是black berry 系统。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前是black berry系统, false表示不是。</p>\n</div></li></ul></div></div></div><div id='method-isFirefoxOS' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isFirefoxOS' class='name expandable'>isFirefoxOS</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否是firefox os系统。 ...</div><div class='long'><p>判断当前是否是firefox os系统。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前是firefox os系统, false表示不是。</p>\n</div></li></ul></div></div></div><div id='method-isHolaPlay' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isHolaPlay' class='name expandable'>isHolaPlay</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否是hola play系统。 ...</div><div class='long'><p>判断当前是否是hola play系统。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前是hola play系统, false表示不是。</p>\n</div></li></ul></div></div></div><div id='method-isIPad' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isIPad' class='name expandable'>isIPad</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否是ipad系统。 ...</div><div class='long'><p>判断当前是否是ipad系统。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前是ipad系统, false表示不是。</p>\n</div></li></ul></div></div></div><div id='method-isIPhone' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isIPhone' class='name expandable'>isIPhone</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否是iphone系统。 ...</div><div class='long'><p>判断当前是否是iphone系统。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前是iphone系统, false表示不是。</p>\n</div></li></ul></div></div></div><div id='method-isMacOSX' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isMacOSX' class='name expandable'>isMacOSX</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否是mac os系统。 ...</div><div class='long'><p>判断当前是否是mac os系统。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前是mac os系统, false表示不是。</p>\n</div></li></ul></div></div></div><div id='method-isWebAudioSupported' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isWebAudioSupported' class='name expandable'>isWebAudioSupported</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否支持WebAudio。isHolaPlay()或isWebAudioSupported()为true时，声音有完整的支持。 ...</div><div class='long'><p>判断当前是否支持WebAudio。isHolaPlay()或isWebAudioSupported()为true时，声音有完整的支持。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前支持WebAudio, false不支持WebAudio</p>\n</div></li></ul></div></div></div><div id='method-isWinPhone' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-isWinPhone' class='name expandable'>isWinPhone</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>判断当前是否是windows phone系统。 ...</div><div class='long'><p>判断当前是否是windows phone系统。</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>true表示当前是windows phone系统, false表示不是。</p>\n</div></li></ul></div></div></div><div id='method-webappGetText' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Global'>Global</span><br/></div><a href='#!/api/Global-method-webappGetText' class='name expandable'>webappGetText</a>( <span class='pre'>text</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>获取文本对应与当前语言的翻译的文本。 ...</div><div class='long'><p>获取文本对应与当前语言的翻译的文本。</p>\n\n<p>在Hola Studio中，工具菜单里有国际化设置，把翻译数据放在里面即可，通常引擎会根据这些设置自动翻译控件上的文字。</p>\n\n<p>但有的文本是需要动态修改的，比如提示玩家的分数，此时可以webappGetText通过获取文本，替换调成实际的分数，再显示出来。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>text</span> : String<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>翻译后的文本。</p>\n\n<p>示例：</p>\n\n<pre class='inline-example small frame'><code>var str = webappGetText(\"Your Scores Is {score}\");\nstr = str.replace(/{score}/, 100);\nthis.win.find(\"score\", true).setText(str)；\n</code></pre>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});
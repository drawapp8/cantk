Ext.data.JsonP.HolaSDK({
  "tagname": "class",
  "name": "HolaSDK",
  "autodetected": {
  },
  "files": [
    {
      "filename": "hola.js",
      "href": null
    }
  ],
  "members": [
    {
      "name": "closeAd",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-closeAd",
      "meta": {
      }
    },
    {
      "name": "exit",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-exit",
      "meta": {
      }
    },
    {
      "name": "gameOver",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-gameOver",
      "meta": {
      }
    },
    {
      "name": "gamePaused",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-gamePaused",
      "meta": {
      }
    },
    {
      "name": "gameResumed",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-gameResumed",
      "meta": {
      }
    },
    {
      "name": "gameStarted",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-gameStarted",
      "meta": {
      }
    },
    {
      "name": "ping",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-ping",
      "meta": {
      }
    },
    {
      "name": "sendBarrage",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-sendBarrage",
      "meta": {
      }
    },
    {
      "name": "share",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-share",
      "meta": {
      }
    },
    {
      "name": "showAd",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-showAd",
      "meta": {
      }
    },
    {
      "name": "whenPaused",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-whenPaused",
      "meta": {
      }
    },
    {
      "name": "whenRestarted",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-whenRestarted",
      "meta": {
      }
    },
    {
      "name": "whenResumed",
      "tagname": "method",
      "owner": "HolaSDK",
      "id": "method-whenResumed",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-HolaSDK",
  "short_doc": "HolaSDK. ...",
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
  "html": "<div><div class='doc-contents'><p>HolaSDK. Ad, sharing, and statistics APIs.</p>\n\n<p>All functions are directly called with the HolaSDK Example:</p>\n\n<pre class='inline-example small frame'><code><a href=\"#!/api/HolaSDK-method-exit\" rel=\"HolaSDK-method-exit\" class=\"docClass\">HolaSDK.exit</a>()\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-closeAd' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-closeAd' class='name expandable'>closeAd</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Close ad (typically doesn't need to be called directly). ...</div><div class='long'><p>Close ad (typically doesn't need to be called directly).</p>\n</div></div></div><div id='method-exit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-exit' class='name expandable'>exit</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Exits game and returns to lobby. ...</div><div class='long'><p>Exits game and returns to lobby.</p>\n</div></div></div><div id='method-gameOver' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-gameOver' class='name expandable'>gameOver</a>( <span class='pre'>score, level, duration</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Called when the game ends (used to update statistic information). ...</div><div class='long'><p>Called when the game ends (used to update statistic information).</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>score</span> : Number<div class='sub-desc'><p>Current number of points.</p>\n</div></li><li><span class='pre'>level</span> : Number<div class='sub-desc'><p>Current level.</p>\n</div></li><li><span class='pre'>duration</span> : Number<div class='sub-desc'><p>Game time (in ms).</p>\n</div></li></ul></div></div></div><div id='method-gamePaused' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-gamePaused' class='name expandable'>gamePaused</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Called when the game is paused (used to update statistic information). ...</div><div class='long'><p>Called when the game is paused (used to update statistic information).</p>\n</div></div></div><div id='method-gameResumed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-gameResumed' class='name expandable'>gameResumed</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Called when the game is unpaused (used to update statistic information). ...</div><div class='long'><p>Called when the game is unpaused (used to update statistic information).</p>\n</div></div></div><div id='method-gameStarted' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-gameStarted' class='name expandable'>gameStarted</a>( <span class='pre'>level</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Called when the game begins (used to update statistic information). ...</div><div class='long'><p>Called when the game begins (used to update statistic information).</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>level</span> : Number<div class='sub-desc'><p>Current level.</p>\n</div></li></ul></div></div></div><div id='method-ping' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-ping' class='name expandable'>ping</a>( <span class='pre'>score, level, duration</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Update game status. ...</div><div class='long'><p>Update game status.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>score</span> : Number<div class='sub-desc'><p>Current number of points.</p>\n</div></li><li><span class='pre'>level</span> : Number<div class='sub-desc'><p>Current level.</p>\n</div></li><li><span class='pre'>duration</span> : Number<div class='sub-desc'><p>Game time (in ms).</p>\n</div></li></ul></div></div></div><div id='method-sendBarrage' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-sendBarrage' class='name expandable'>sendBarrage</a>( <span class='pre'>score, level, duration</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Post comment. ...</div><div class='long'><p>Post comment.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>score</span> : Number<div class='sub-desc'><p>Current number of points.</p>\n</div></li><li><span class='pre'>level</span> : Number<div class='sub-desc'><p>Current level.</p>\n</div></li><li><span class='pre'>duration</span> : Number<div class='sub-desc'><p>Game time (in ms).</p>\n</div></li></ul></div></div></div><div id='method-share' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-share' class='name expandable'>share</a>( <span class='pre'>title, description, link, icon</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Share (all you need to do is fill out the corresponding parameters in the Share button's Click event). ...</div><div class='long'><p>Share (all you need to do is fill out the corresponding parameters in the Share button's Click event).</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>title</span> : String<div class='sub-desc'><p>Title.</p>\n</div></li><li><span class='pre'>description</span> : String<div class='sub-desc'><p>Desc.</p>\n</div></li><li><span class='pre'>link</span> : String<div class='sub-desc'><p>Link.</p>\n</div></li><li><span class='pre'>icon</span> : String<div class='sub-desc'><p>Icon.</p>\n</div></li></ul></div></div></div><div id='method-showAd' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-showAd' class='name expandable'>showAd</a>( <span class='pre'>placementID, placementType, impressionTime, closable</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Show ad (typically doesn't need to be called directly). ...</div><div class='long'><p>Show ad (typically doesn't need to be called directly).</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>placementID</span> : String<div class='sub-desc'><p>Position ID.</p>\n</div></li><li><span class='pre'>placementType</span> : Number<div class='sub-desc'><p>Class.</p>\n</div></li><li><span class='pre'>impressionTime</span> : Number<div class='sub-desc'><p>Display time.</p>\n</div></li><li><span class='pre'>closable</span> : Boolean<div class='sub-desc'><p>Whether it can be closed.</p>\n</div></li></ul></div></div></div><div id='method-whenPaused' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-whenPaused' class='name expandable'>whenPaused</a>( <span class='pre'>callback</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Callback function to register a pause event. ...</div><div class='long'><p>Callback function to register a pause event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-whenRestarted' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-whenRestarted' class='name expandable'>whenRestarted</a>( <span class='pre'>callback</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Callback function to register a replay event. ...</div><div class='long'><p>Callback function to register a replay event. This event is fired when the \"replay\" button on the console is pressed.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-whenResumed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-whenResumed' class='name expandable'>whenResumed</a>( <span class='pre'>callback</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Callback function to register an unpause event. ...</div><div class='long'><p>Callback function to register an unpause event.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});
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
  "short_doc": "HolaSDK。广告，分享和统计等API。 ...",
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
  "html": "<div><div class='doc-contents'><p>HolaSDK。广告，分享和统计等API。</p>\n\n<p>所有函数通过HolaSDK直接调用。示例：</p>\n\n<pre class='inline-example small frame'><code><a href=\"#!/api/HolaSDK-method-exit\" rel=\"HolaSDK-method-exit\" class=\"docClass\">HolaSDK.exit</a>()\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-closeAd' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-closeAd' class='name expandable'>closeAd</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>关闭广告(一般不需要直接调用)。 ...</div><div class='long'><p>关闭广告(一般不需要直接调用)。</p>\n</div></div></div><div id='method-exit' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-exit' class='name expandable'>exit</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>退出游戏，返回游戏大厅。 ...</div><div class='long'><p>退出游戏，返回游戏大厅。</p>\n</div></div></div><div id='method-gameOver' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-gameOver' class='name expandable'>gameOver</a>( <span class='pre'>score, level, duration</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>游戏结束时调用(用于更新统计信息)。 ...</div><div class='long'><p>游戏结束时调用(用于更新统计信息)。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>score</span> : Number<div class='sub-desc'><p>当前分数。</p>\n</div></li><li><span class='pre'>level</span> : Number<div class='sub-desc'><p>当前关数。</p>\n</div></li><li><span class='pre'>duration</span> : Number<div class='sub-desc'><p>游戏时间(毫秒)。</p>\n</div></li></ul></div></div></div><div id='method-gamePaused' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-gamePaused' class='name expandable'>gamePaused</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>游戏暂停时调用(用于更新统计信息)。 ...</div><div class='long'><p>游戏暂停时调用(用于更新统计信息)。</p>\n</div></div></div><div id='method-gameResumed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-gameResumed' class='name expandable'>gameResumed</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>游戏恢复时调用(用于更新统计信息)。 ...</div><div class='long'><p>游戏恢复时调用(用于更新统计信息)。</p>\n</div></div></div><div id='method-gameStarted' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-gameStarted' class='name expandable'>gameStarted</a>( <span class='pre'>level</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>游戏开始时调用(用于更新统计信息)。 ...</div><div class='long'><p>游戏开始时调用(用于更新统计信息)。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>level</span> : Number<div class='sub-desc'><p>当前关数。</p>\n</div></li></ul></div></div></div><div id='method-ping' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-ping' class='name expandable'>ping</a>( <span class='pre'>score, level, duration</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>更新游戏状态。 ...</div><div class='long'><p>更新游戏状态。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>score</span> : Number<div class='sub-desc'><p>当前分数。</p>\n</div></li><li><span class='pre'>level</span> : Number<div class='sub-desc'><p>当前关数。</p>\n</div></li><li><span class='pre'>duration</span> : Number<div class='sub-desc'><p>游戏时间(毫秒)。</p>\n</div></li></ul></div></div></div><div id='method-sendBarrage' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-sendBarrage' class='name expandable'>sendBarrage</a>( <span class='pre'>score, level, duration</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>发送弹幕。 ...</div><div class='long'><p>发送弹幕。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>score</span> : Number<div class='sub-desc'><p>当前分数。</p>\n</div></li><li><span class='pre'>level</span> : Number<div class='sub-desc'><p>当前关数。</p>\n</div></li><li><span class='pre'>duration</span> : Number<div class='sub-desc'><p>游戏时间(毫秒)。</p>\n</div></li></ul></div></div></div><div id='method-share' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-share' class='name expandable'>share</a>( <span class='pre'>title, description, link, icon</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>分享(在分享按钮的Click事件中填写相应参数即可)。 ...</div><div class='long'><p>分享(在分享按钮的Click事件中填写相应参数即可)。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>title</span> : String<div class='sub-desc'><p>标题。</p>\n</div></li><li><span class='pre'>description</span> : String<div class='sub-desc'><p>描述。</p>\n</div></li><li><span class='pre'>link</span> : String<div class='sub-desc'><p>链接。</p>\n</div></li><li><span class='pre'>icon</span> : String<div class='sub-desc'><p>图标。</p>\n</div></li></ul></div></div></div><div id='method-showAd' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-showAd' class='name expandable'>showAd</a>( <span class='pre'>placementID, placementType, impressionTime, closable</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>显示广告(一般不需要直接调用)。 ...</div><div class='long'><p>显示广告(一般不需要直接调用)。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>placementID</span> : String<div class='sub-desc'><p>位置ID。</p>\n</div></li><li><span class='pre'>placementType</span> : Number<div class='sub-desc'><p>类型。</p>\n</div></li><li><span class='pre'>impressionTime</span> : Number<div class='sub-desc'><p>显示时间。</p>\n</div></li><li><span class='pre'>closable</span> : Boolean<div class='sub-desc'><p>是否可关闭。</p>\n</div></li></ul></div></div></div><div id='method-whenPaused' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-whenPaused' class='name expandable'>whenPaused</a>( <span class='pre'>callback</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>注册暂停事件的回调函数。 ...</div><div class='long'><p>注册暂停事件的回调函数。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-whenRestarted' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-whenRestarted' class='name expandable'>whenRestarted</a>( <span class='pre'>callback</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>注册重玩事件的回调函数。游戏盒子上的Replay按钮被按下时触发本事件。 ...</div><div class='long'><p>注册重玩事件的回调函数。游戏盒子上的Replay按钮被按下时触发本事件。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-whenResumed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='HolaSDK'>HolaSDK</span><br/></div><a href='#!/api/HolaSDK-method-whenResumed' class='name expandable'>whenResumed</a>( <span class='pre'>callback</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>注册恢复事件的回调函数。 ...</div><div class='long'><p>注册恢复事件的回调函数。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});
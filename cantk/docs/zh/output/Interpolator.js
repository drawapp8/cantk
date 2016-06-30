Ext.data.JsonP.Interpolator({
  "tagname": "class",
  "name": "Interpolator",
  "autodetected": {
  },
  "files": [
    {
      "filename": "animation.js",
      "href": null
    },
    {
      "filename": "animation.js",
      "href": null
    }
  ],
  "members": [
    {
      "name": "create",
      "tagname": "method",
      "owner": "Interpolator",
      "id": "method-create",
      "meta": {
      }
    },
    {
      "name": "get",
      "tagname": "method",
      "owner": "Interpolator",
      "id": "method-get",
      "meta": {
      }
    }
  ],
  "alternateClassNames": [

  ],
  "aliases": {
  },
  "id": "class-Interpolator",
  "extends": null,
  "singleton": null,
  "private": null,
  "mixins": [

  ],
  "requires": [

  ],
  "uses": [

  ],
  "component": false,
  "superclasses": [

  ],
  "subclasses": [

  ],
  "mixedInto": [

  ],
  "parentMixins": [

  ],
  "html": "<div><div class='doc-contents'><p>插值算法接口。它的基本功能就是将时间进度(0-1)变换成任务实际进度(0,1)，重而实现加速，减速，先加速再减速和回弹等效果。</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-create' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Interpolator'>Interpolator</span><br/></div><a href='#!/api/Interpolator-method-create' class='name expandable'>create</a>( <span class='pre'>name</span> ) : <a href=\"#!/api/Interpolator\" rel=\"Interpolator\" class=\"docClass\">Interpolator</a><span class=\"signature\"></span></div><div class='description'><div class='short'>创建插值算法对象。 ...</div><div class='long'><p>创建插值算法对象。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>插值算法的名称。</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Interpolator\" rel=\"Interpolator\" class=\"docClass\">Interpolator</a></span><div class='sub-desc'><p>返回插值算法对象。</p>\n\n<pre class='inline-example small frame'><code>//创建线形插值算法（l|linear):\nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('l');\n//创建回弹插值算法 (b|bounce)\nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('b');\n//创建加速插值算法 (a|accelerate)\nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('a');\n//创建先加速再加速插值算法(ad|accelerate-decelerate)\nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('ad');\n//创建减速插值算法(d|decelerate)\nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('d');\n</code></pre>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Interpolator'>Interpolator</span><br/></div><a href='#!/api/Interpolator-method-get' class='name expandable'>get</a>( <span class='pre'>percent</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>获取任务实际进度。 ...</div><div class='long'><p>获取任务实际进度。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>percent</span> : Number<div class='sub-desc'><p>时间进度(0-1)。</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>返回任务实际进度。</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});
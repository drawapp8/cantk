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
  "short_doc": "Interpolation algorithm interface  Its basic function is to transform the time progress (0-1) to actual mission progr...",
  "component": false,
  "superclasses": [

  ],
  "subclasses": [

  ],
  "mixedInto": [

  ],
  "parentMixins": [

  ],
  "html": "<div><div class='doc-contents'><p>Interpolation algorithm interface  Its basic function is to transform the time progress (0-1) to actual mission progress (0,1), to accelerate or decelerate, accelerate then decelerate, or achieve a recoil affect.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-create' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Interpolator'>Interpolator</span><br/></div><a href='#!/api/Interpolator-method-create' class='name expandable'>create</a>( <span class='pre'>name</span> ) : <a href=\"#!/api/Interpolator\" rel=\"Interpolator\" class=\"docClass\">Interpolator</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Creates interpolation algorithm object. ...</div><div class='long'><p>Creates interpolation algorithm object.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Interpolation algorithm name.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Interpolator\" rel=\"Interpolator\" class=\"docClass\">Interpolator</a></span><div class='sub-desc'><p>Returns interpolation algorithm object.</p>\n\n<pre class='inline-example small frame'><code>//Creates linear algorithm (l|linear): \nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('l');\n//Creates bounce algorithm (b|bounce) \nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('b');\n//Creates acceleration algorithm (a|accelerate) \nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('a');\n//Creates acceleration-deceleration interpolation algorithm (ad|accelerate-decelerate) \nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('ad');\n//Creates deceleration interpolation algorithm (d|decelerate) \nvar interpolator = <a href=\"#!/api/Interpolator-method-create\" rel=\"Interpolator-method-create\" class=\"docClass\">Interpolator.create</a>('d');\n</code></pre>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Interpolator'>Interpolator</span><br/></div><a href='#!/api/Interpolator-method-get' class='name expandable'>get</a>( <span class='pre'>percent</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Gets mission progress. ...</div><div class='long'><p>Gets mission progress.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>percent</span> : Number<div class='sub-desc'><p>Time progress (0-1).</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>Returns mission progress.</p>\n</div></li></ul></div></div></div></div></div></div></div>",
  "meta": {
  }
});
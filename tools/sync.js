var fs = require("fs");
var path = require("path");

var files = [
	{"path": "/base/js/", "name": "browser.js"},
	{"path": "/base/js/", "name": "pointer.js"},
	{"path": "/base/js/", "name": "howler.js"},
	{"path": "/base/js/", "name": "module_start.js"},
	{"path": "/base/js/", "name": "config.js"},
	{"path": "/base/js/", "name": "version.js"},
	{"path": "/base/js/", "name": "utils.js"},
	{"path": "/base/js/", "name": "web_storage.js"},
	{"path": "/base/js/", "name": "canvas.js"},
	{"path": "/base/js/", "name": "structs.js"},
	{"path": "/base/js/", "name": "resloader.js"},
	{"path": "/base/js/", "name": "editor_wrapper.js"},
	{"path": "/base/js/", "name": "w_image.js"},
	{"path": "/base/js/", "name": "w_theme.js"},
	{"path": "/base/js/", "name": "w_widget.js"},
	{"path": "/base/js/", "name": "w_window.js"},
	{"path": "/base/js/", "name": "w_view_base.js"},
	{"path": "/base/js/", "name": "w_window_manager.js"},
	{"path": "/base/js/", "name": "app_base.js"},
	{"path": "/shapes/js/", "name": "shape.js"},
	{"path": "/shapes/js/", "name": "r_shape.js"},
	{"path": "/shapes/js/", "name": "l_shape.js"},
	{"path": "/shapes/js/", "name": "basics.js"},
	{"path": "/shapes/js/", "name": "shape_factory.js"},
	{"path": "/shapes/js/", "name": "shape_style.js"},
	{"path": "/controls/js/", "name": "ui-element.js"},
	{"path": "/controls/js/", "name": "ui-layout.js"},
	{"path": "/controls/js/", "name": "ui-window.js"},
	{"path": "/controls/js/", "name": "ui-dialog.js"},
	{"path": "/controls/js/", "name": "ui-window-loading.js"},
	{"path": "/controls/js/", "name": "ui-list.js"},
	{"path": "/controls/js/", "name": "ui-menu.js"},
	{"path": "/controls/js/", "name": "ui-scroll-view.js"},
	{"path": "/controls/js/", "name": "ui-h-scroll-view.js"},
	{"path": "/controls/js/", "name": "ui-v-scroll-view.js"},
	{"path": "/controls/js/", "name": "ui-list-item.js"},
	{"path": "/controls/js/", "name": "ui-button-group.js"},
	{"path": "/controls/js/", "name": "ui-button.js"},
	{"path": "/controls/js/", "name": "ui-canvas.js"},
	{"path": "/controls/js/", "name": "ui-check-box.js"},
	{"path": "/controls/js/", "name": "ui-circle-layout.js"},
	{"path": "/controls/js/", "name": "ui-collapsable.js"},
	{"path": "/controls/js/", "name": "ui-color-bar.js"},
	{"path": "/controls/js/", "name": "ui-color-button.js"},
	{"path": "/controls/js/", "name": "ui-context-menu.js"},
	{"path": "/controls/js/", "name": "ui-device.js"},
	{"path": "/controls/js/", "name": "ui-edit.js"},
	{"path": "/controls/js/", "name": "ui-fan-menu.js"},
	{"path": "/controls/js/", "name": "ui-flash.js"},
	{"path": "/controls/js/", "name": "ui-frames.js"},
	{"path": "/controls/js/", "name": "ui-gauge.js"},
	{"path": "/controls/js/", "name": "ui-grid.js"},
	{"path": "/controls/js/", "name": "ui-grid-view.js"},
	{"path": "/controls/js/", "name": "ui-html.js"},
	{"path": "/controls/js/", "name": "ui-html-view.js"},
	{"path": "/controls/js/", "name": "ui-image.js"},
	{"path": "/controls/js/", "name": "ui-image-value.js"},
	{"path": "/controls/js/", "name": "ui-image-view.js"},
	{"path": "/controls/js/", "name": "ui-image-animation.js"},
	{"path": "/controls/js/", "name": "ui-image-button.js"},
	{"path": "/controls/js/", "name": "ui-image-normal-view.js"},
	{"path": "/controls/js/", "name": "ui-image-slide-view.js"},
	{"path": "/controls/js/", "name": "ui-image-thumb-view.js"},
	{"path": "/controls/js/", "name": "ui-label.js"},
	{"path": "/controls/js/", "name": "ui-led-digits.js"},
	{"path": "/controls/js/", "name": "ui-list-checkable-item.js"},
	{"path": "/controls/js/", "name": "ui-list-item-group.js"},
	{"path": "/controls/js/", "name": "ui-list-view.js"},
	{"path": "/controls/js/", "name": "ui-mledit.js"},
	{"path": "/controls/js/", "name": "ui-page-indicator.js"},
	{"path": "/controls/js/", "name": "ui-page.js"},
	{"path": "/controls/js/", "name": "ui-page-manager.js"},
	{"path": "/controls/js/", "name": "ui-placeholder.js"},
	{"path": "/controls/js/", "name": "ui-progressbar.js"},
	{"path": "/controls/js/", "name": "ui-radio-box.js"},
	{"path": "/controls/js/", "name": "ui-screen.js"},
	{"path": "/controls/js/", "name": "ui-scroll-text.js"},
	{"path": "/controls/js/", "name": "ui-select.js"},
	{"path": "/controls/js/", "name": "ui-shortcut.js"},
	{"path": "/controls/js/", "name": "ui-simple-html.js"},
	{"path": "/controls/js/", "name": "ui-sliding-menu.js"},
	{"path": "/controls/js/", "name": "ui-static-map.js"},
	{"path": "/controls/js/", "name": "ui-status-bar.js"},
	{"path": "/controls/js/", "name": "ui-suggestion.js"},
	{"path": "/controls/js/", "name": "ui-switch.js"},
	{"path": "/controls/js/", "name": "ui-tips.js"},
	{"path": "/controls/js/", "name": "ui-toolbar.js"},
	{"path": "/controls/js/", "name": "ui-videio.js"},
	{"path": "/controls/js/", "name": "ui-view-pager.js"},
	{"path": "/controls/js/", "name": "ui-v-scroll-image.js"},
	{"path": "/controls/js/", "name": "ui-wait-bar.js"},
	{"path": "/controls/js/", "name": "ui-window-manager.js"},
	{"path": "/controls/js/", "name": "utils.js"},
	{"path": "/controls/js/", "name": "devices.js"},
	{"path": "/controls/js/", "name": "controls.js"},
	{"path": "/controls/js/", "name": "animation.js"},
	{"path": "/controls/js/", "name": "ui-unkown.js"},
	{"path": "/cantk_third/js/", "name": "chart.js"},
	{"path": "/cantk_third/js/", "name": "cantk_chart.js"},
	{"path": "/cantk/js/", "name": "webapp.js"},
	{"path": "/cantk/js/", "name": "cantk-api.js"},
	{"path": "/cantk-game/js/", "name": "ui-sound-effects.js"},
	{"path": "/cantk-game/js/", "name": "ui-sound-music.js"},
	{"path": "/cantk-game/js/", "name": "ui-sprite.js"},
	{"path": "/cantk-game/js/", "name": "ui-bullet.js"},
	{"path": "/cantk-game/js/", "name": "ui-bitmapfont-text.js"},
	{"path": "/cantk-game/js/", "name": "ui-art-text.js"},
	{"path": "/cantk-game/js/", "name": "ui-skeleton-animation.js"},
	{"path": "/cantk-game/js/", "name": "ui-footprint.js"},
	{"path": "/cantk-game/js/", "name": "ui-scene.js"},
	{"path": "/cantk-game/js/", "name": "ui-circle.js"},
	{"path": "/cantk-game/js/", "name": "ui-box.js"},
	{"path": "/cantk-game/js/", "name": "ui-transform-animation.js"},
	{"path": "/cantk-game/js/", "name": "ui-frame-animation.js"},
	{"path": "/cantk-game/js/", "name": "ui-polygon.js"},
	{"path": "/cantk-game/js/", "name": "ui-point.js"},
	{"path": "/cantk-game/js/", "name": "ui-one-joint.js"},
	{"path": "/cantk-game/js/", "name": "ui-mouse-joint.js"},
	{"path": "/cantk-game/js/", "name": "ui-two-points.js"},
	{"path": "/cantk-game/js/", "name": "ui-two-joint.js"},
	{"path": "/cantk-game/js/", "name": "ui-edge.js"},
	{"path": "/cantk-game/js/", "name": "ui-dragger.js"},
	{"path": "/cantk-game/js/", "name": "ui-four-joint.js"},
	{"path": "/cantk-game/js/", "name": "ui-revolute-joint.js"},
	{"path": "/cantk-game/js/", "name": "ui-distance-joint.js"},
	{"path": "/cantk-game/js/", "name": "ui-pulley-joint.js"},
	{"path": "/cantk-game/js/", "name": "ui-status.js"},
	{"path": "/cantk-game/js/", "name": "ui-timer.js"},
	{"path": "/cantk-game/js/", "name": "ui-image-line.js"},
	{"path": "/cantk-game/js/", "name": "proton.js"},
	{"path": "/cantk-game/js/", "name": "ui-particles.js"},
	{"path": "/cantk-game/js/", "name": "utils.js"},
	{"path": "/cantk-game/js/", "name": "matrix.js"},
	{"path": "/cantk-game/js/", "name": "dragonBones.js"},
	{"path": "/cantk-game/js/", "name": "dragonBonesGeneral.js"},
	{"path": "/cantk-game/js/", "name": "cantk-game-ext.js"},
	{"path": "/cantk-game/js/", "name": "physics-box2d.js"},
	{"path": "/weixin/js/", "name": "ui-weixin.js"},
	{"path": "/weixin/js/", "name": "weixin-init.js"},
	{"path": "/weixin/js/", "name": "weixin-register.js"},
	{"path": "/controls/js/", "name": "ui-call-events-handler.js"},
	{"path": "/cantk-game/js/", "name": "cantk-game-register.js"},
	{"path": "/game-physics/box2d/", "name": "box2d.js"},
	{"path": "/base/js/", "name": "module_end.js"}
];

var srcRoot = '/opt/work/drawapp8/app8';

function mkpathsync(dirpath, mode) {
    dirpath = path.resolve(dirpath);

    if (typeof mode === 'undefined') {
        mode = 0777 & (~process.umask());
    }

    try {
        if (!fs.statSync(dirpath).isDirectory()) {
            throw new Error(dirpath + ' exists and is not a directory');
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            mkpathsync(path.dirname(dirpath), mode);
            fs.mkdirSync(dirpath, mode);
        } else {
            throw err;
        }
    }
};

for(var i = 0; i < files.length; i++) {
	var iter = files[i];
	var src = "/opt/work/drawapp8/app8" + iter.path + iter.name;
	var dstPath = "." + iter.path;
	var dst = dstPath + iter.name;
	var content = fs.readFileSync(src);

	console.log("copy " + src + " to " + dst);
	
	mkpathsync(dstPath);
	fs.writeFileSync(dst, content);
}


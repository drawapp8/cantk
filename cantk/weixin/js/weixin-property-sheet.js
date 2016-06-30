/*
 * File:   weixin-property-sheet.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  WeiXin Property Sheet.
 * 
 * Copyright (c) 2015 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

UIWeixin.prototype.updateCustomProperties = function(vLayout) {
	var me = this;
	var widget = WKeyValue.create(vLayout, 0, 0, 0, 40).addEdit(dappGetTitle("Config URL"), 100, this.configURL);
	widget.onChanged = function(text) {
		me.exec(AttributeCommand.create(me, "configURL", null, text));
	}

	widget = WKeyValue.create(vLayout, 0, 0, 0, 40).addEdit(dappGetTitle("Share Title"), 100, this.shareTitle);
	widget.onChanged = function(text) {
		me.exec(AttributeCommand.create(me, "shareTitle", null, text));
	}

	widget = WKeyValue.create(vLayout, 0, 0, 0, 40).addEdit(dappGetTitle("Share Desc"), 100, this.shareDesc);
	widget.onChanged = function(text) {
		me.exec(AttributeCommand.create(me, "shareDesc", null, text));
	}

	widget = WKeyValue.create(vLayout, 0, 0, 0, 40).addEdit(dappGetTitle("Share Link"), 100, this.shareLink);
	widget.onChanged = function(text) {
		me.exec(AttributeCommand.create(me, "shareLink", null, text));
	}
	
	widget = WKeyValue.create(vLayout, 0, 0, 0, 40).addEdit(dappGetTitle("Share Image"), 100, this.shareImage);
	widget.onChanged = function(text) {
		me.exec(AttributeCommand.create(me, "shareImage", null, text));
	}
	
	widget = WLabel.create(vLayout, 0, 0, 0, 40).setText(dappGetTitle("Api List")).setTextAlignH("left");
	widget = WTextArea.create(vLayout, 0, 0, 0, 120).setText(this.apiList ? this.apiList : UIWeixin.jsApiList.join("\n")); 
	widget.onChanged = function(text) {
		me.exec(AttributeCommand.create(me, "apiList", null, text));
	}

	widget = WCheckButton.create(vLayout, 20, 0, 0, 40).setText(dappGetText("Debug")).setValue(this.debug);
	widget.onChanged = function(value) {
		me.exec(AttributeCommand.create(me, "debug", null, value));
	}

	return;
}

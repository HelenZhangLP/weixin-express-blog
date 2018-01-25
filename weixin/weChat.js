

const util = require('util'), //引入工具包
			fs = require('fs');

const config = require('../config'),
			//accessTokenJson = require('./access_token'),
			wechatUtils = require('../utils/wechatUtils'),
			{requestPost, requestGet} = require('../utils/http'),
			menus = require('./menus');


function Wechat() {
	this.apiURL = config.apiURL;
}

Wechat.prototype.createMenu = function() {
	// 引入 menus
	var that = this;
	
	wechatUtils.getAccessToken().then(function(data){
		//格式化请求连接
		var url = util.format(that.apiURL.createMenu,config.apiDomain,data);
		//使用 Post 请求创建微信菜单
		requestPost(url,JSON.stringify(menus)).then(function(data){
			//将结果打印
			console.log(data,'==menu==data');
		});
	});
}

module.exports = Wechat;
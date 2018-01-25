

const util = require('util'), //引入工具包
			fs = require('fs');


const {requestPost, requestGet} = require('../utils/http'),
			config = require('../config'),
			accessTokenJson = require('./access_token'),
			menus = require('./menus');


function Wechat() {
	this.apiURL = config.apiURL;
}

Wechat.prototype.createMenu = function() {
	// 引入 menus
	var that = this;
	this.getAccessToken().then(function(data){
		//格式化请求连接
		var url = util.format(that.apiURL.createMenu,that.apiDomain,data);
		//使用 Post 请求创建微信菜单
		requestPost(url,JSON.stringify(menus)).then(function(data){
			//将结果打印
			console.log(data);
		});
	});
}

Wechat.prototype.getAccessToken = function() {
	var that = this;
	return new Promise(function(resolve, reject){
		//获取当前时间
		var currentTime = new Date().getTime();

		//格式化请求地址
    var url = util.format(that.apiURL.accessTokenApi,that.apiDomain,that.appID,that.appScrect);
    //判断 本地存储的 access_token 是否有效
    if(accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime){
        requestGet(url).then(function(data){
          var result = JSON.parse(data); 
          if(data.indexOf("errcode") < 0){
              accessTokenJson.access_token = result.access_token;
              accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
              //更新本地存储的
              fs.writeFile('./access_token.json',JSON.stringify(accessTokenJson));
              //将获取后的 access_token 返回
              resolve(accessTokenJson.access_token);
          }else{
              //将错误返回
              resolve(result);
          } 
        });
    }else{
        //将本地存储的 access_token 返回
        resolve(accessTokenJson.access_token);  
    }
	})
}

module.exports = Wechat;
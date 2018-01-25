
var crypto = require('crypto'),
		express = require('express'),
		util = require('util'),
		{requestPost, requestGet} = require('../utils/http'),
		fs = require('fs'),
		accessTokenJson = require('./access_token');

console.log(accessTokenJson,'====');
var config = require('../config');

module.exports = {
	weChatSignature: function(req, res, next) {
		/*
		 * 微信签名认证中间件
		 * 1. 将 token / timestamp / nonce 三个参数进行字典排序
		 * 2. 将 token / timestamp / nonce 拼接成字符串，用 sha1 加密
		 * 3. 加密字符串与 signature 对比，true 时，返回 echostr 给微信服务器
		**/

		//request.query 获取 url 中，？之后的参数
		var token = config.token,
				echostr = req.query.echostr,
				signature = req.query.signature,
				timestamp = req.query.timestamp,
				nonce = req.query.nonce;

		//1.
		var tempstr = [token,timestamp,nonce].sort().join('');

		//2.
		const hashCode = crypto.createHash('sha1'); //创建加密类型
    var resultCode = hashCode.update(tempstr,'utf8').digest('hex'); //对传入的字符串进行加密

   	//3.
		var result = (resultCode === signature) ? echostr : 'failed';
		return res.send(result);
	},
	getAccessToken: function() {
		const _this = this;
		// 返回一个 promise 用于判断处理拿到 token 后的请求
		return new Promise(function(resolve, reject) {
			const currentTime = (new Date()).getTime(),
						url = util.format(config.apiURL.accessTokenApi,config.apiDomain,config.appID,config.appScrect);

			//判断本地存储的 accessToken 是否有效（access_token 未存到本地；或 access_token 失效）
			if(accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
				//本地存储 access_token 无效
				requestGet(url).then(function(data){
					const result = JSON.parse(data);
					
					if(JSON.stringify(result).indexOf('errcode') !== -1){
						resolve(result);
					} else {
						accessTokenJson.access_token = result.access_token;
						accessTokenJson.expires_time = result.expires_time;
						
						fs.writeFile('access_token.json',JSON.stringify(accessTokenJson));
						resolve(accessTokenJson.access_token);
					}
				})

			} else {
				//本地址存在的 access_token 有效
				resolve(accessTokenJson.access_token);
			}
		})
	}

}
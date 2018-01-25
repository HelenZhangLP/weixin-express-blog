
var crypto = require('crypto'),
		express = require('express');

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
	}
}
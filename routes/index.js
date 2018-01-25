var express = require('express'),
		crypto = require('crypto'),
		router = express.Router();

var wechatUtils = require('../utils/wechatUtils');

/* GET home page. */
router.get('/', function(req, res, next) {
	//签名验证
	wechatUtils.weChatSignature(req,res,next);
  //res.render('index', { title: 'Express' });
});

//处理微信消息
router.post('/', (req, res, next) => {
	try {
		let bodyData;
		req.on('data', function(data){
			bodyData = data.toString("utf-8")
		})

		req.on('end', () => {
			var ToUserName = getXMLNodeValue('ToUserName',bodyData);
			var FromUserName = getXMLNodeValue('FromUserName',bodyData);
			var CreateTime = getXMLNodeValue('CreateTime',bodyData);
			var MsgType = getXMLNodeValue('MsgType',bodyData);
			var Content = getXMLNodeValue('Content',bodyData);
			var MsgId = getXMLNodeValue('MsgId',bodyData);
			console.log(ToUserName);
			console.log(FromUserName);
			console.log(CreateTime);
			console.log(MsgType);
			console.log(Content);
			console.log(MsgId);
			var xml = '<xml><ToUserName>'+FromUserName+'</ToUserName><FromUserName>'+ToUserName+'</FromUserName><CreateTime>'+CreateTime+'</CreateTime><MsgType>'+MsgType+'</MsgType><Content>'+Content+'</Content></xml>';
      		return res.send(xml);
		})
	} catch(e) {
		console.log('error:' + error);
	}
})

function getXMLNodeValue(node_name,xml){
    var str = xml.split("<"+node_name+">");
    var tempStr = str[1].split("</"+node_name+">");
    return tempStr[0];
}

module.exports = router;

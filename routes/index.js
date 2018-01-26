var express = require('express'),
		crypto = require('crypto'),
		parser = require('xml2json'),
		router = express.Router();

var wechatUtils = require('../utils/wechatUtils'),
		weChat = require('../weixin/weChat'),
		wxMsg = require('../weixin/msg');

/* GET home page. */
router.get('/', function(req, res, next) {
	(new weChat()).createMenu();
	//签名验证
	wechatUtils.weChatSignature(req,res,next);
});

//处理微信消息
router.post('/', (req, res, next) => {
	try {
		let dataJson;
		req.on('data', (data) => {
			dataJson = parser.toJson(data.toString('utf-8'),{object:true});
			console.log('data',typeof dataJson.xml);
			console.log('data',dataJson);
		})

		req.on('end', function(){
			let xml = msgHandle(dataJson.xml.MsgType, dataJson.xml.Event, dataJson);
			
			console.log(xml);
			return res.send(xml);
		})
	} catch(e) {
		console.log('error:' + error);
	} 
})

function msgHandle(mType, eType, json) {
	if(mType == 'event') {
		switch(eType) {
			case 'subscribe':
			return createResMsg(json, wxMsg.subscribe);
			break;
		}
	} else if(mType == 'text') {
		return createResMsg(json,json.xml.Content);
	}
}

function createResMsg(json, msg){
	var res = {},xml=[];
  res.ToUserName = json.xml.FromUserName;
  res.FromUserName  = json.xml.ToUserName;
  res.CreateTime = new Date().getTime();
  res.MsgType = 'text';
  res.Content = msg;

  xml.push("<xml>");
  xml.push(jsonToXml(res));
  xml.push("</xml>");
  return xml.join('');
}

function jsonToXml(json) {
	let xml = [];
	for (var i in json) {
		if (typeof json[i] == 'number') {
			xml.push('<'+i+'>'+ json[i] +'</'+i+'>')
		} else if(typeof json[i] == 'string') {
			//这个 bug 值得记念，错误暂时注释掉，耗时一天。
			//xml.push('<'+i+'>'+ '< ![CDATA['+ json[i] + '] ]>' +'</'+i+'>')
			xml.push('<'+i+'><![CDATA['+ json[i] +']]></'+i+'>')
		} else if(typeof json[i] === 'object'){
        xml.push('<'+i+'>' + jsonToXml(json[i] + '</'+i+'>'));
    }
	}

	return xml.join('');
}

module.exports = router;

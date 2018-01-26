var express = require('express'),
		parser = require('xml2json'),
		router = express.Router();

var wechatUtils = require('../utils/wechatUtils'),
		weChat = require('../weixin/weChat'),
		MessageHandle = require('../weixin/MessageHandle'),
		wxMsg = require('../weixin/msg');

/* GET home page. */
router.get('/', function(req, res, next) {
	(new weChat()).createMenu();
	//签名验证
	wechatUtils.weChatSignature(req,res,next);
});

//处理微信消息
router.post('/', (req, res, next) => {
	let MsgHandle = new MessageHandle();
	try {
		let dataJson;
		req.on('data', (data) => {
			dataJson = parser.toJson(data.toString('utf-8'),{object:true});
		})

		req.on('end', function(){
			let xml = MsgHandle.requirestHandle(dataJson);
			
			return res.send(xml);
		})
	} catch(e) {
		console.log('error:' + error);
	} 
})

module.exports = router;

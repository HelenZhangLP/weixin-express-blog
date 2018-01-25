
var config = require('./config');
var fs = require('fs');
var path = require('path');
var express = require('express');

function initRouters(app) {
	  // node fs 模块，fs.readdirSync 返回一个包含指定目录所有文件名称的数组对象
    var files = fs.readdirSync(path.join(__dirname, 'routes'));
    files.forEach(function(file){
        var name = path.basename(file, '.js');
        var routeMap = require('./routes/'+name);
        //创建模块化，可挂载的路由句柄
        var router = express.Router();
        var r_path;
        for(r_path in routeMap){
            //ROUTERSMAP["/"+name+r_path] = routeMap[r_path];
            //handRouter(router, r_path, routeMap[r_path]);
        }

        //挂载路径的中间件
        app.use("/"+name, router);
        if(name === 'home'){
            app.use("/", router);
        }
    });
		app.use('/*', (req, res, next) => {
			var excepts = config.EXCEPTURLS;
	    for( var i in excepts){
	        var except = excepts[i];
	        if(req.originalUrl === except){
	        	debugger;
	            next();
	            return false;
	        }
	        var reg = new RegExp(except);
	        if(reg.test(req.originalUrl)){
	        		debugger;
	            next();
	            return false;
	        }
	    }
		});
}

function handRouter(router, r_path, handler){
    router.all(r_path, function(req, res, next){
        //var ctx = new CtxPvd(req, res);
        //handler.apply(ctx, []);
    });
}

exports.initRouters = initRouters;
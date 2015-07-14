// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var AV = require('leanengine');

var APP_ID ='k3nd81u9ze5gwxxhx0mrwt8bcmce9k55lxn8vny9o27n88tr'; // your app id
var APP_KEY ='pbvztq1cktzh2i3hauk5h50uudwxe8t2uxuo1pggom1bvt8m'; // your app key
var MASTER_KEY =''; // your app master key

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(AV.Cloud);

// 加载 cookieSession 以支持 AV.User 的会话状态
app.use(AV.Cloud.CookieSession({secret: 'JYH secret', maxAge: 3600000, fetchUser: true}));

//query all the chat rooms
var query = new AV.Query('_Conversation');
query.equalTo("tr", true);

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/login', function(req, res) {
	res.render('login.ejs');
});

//点击登录页面的提交将出发下列函数
app.post('/login', function(req, res) {
	AV.User.logIn(req.body.username, req.body.password).then(function(user) {
		query.find({
			success:function(results) {
				//chatRooms = [{"tr":true,"name":"OpenConf","objectId":"559e314ae4b0796c1960d7f4","createdAt":"2015-07-09T08:31:06.043Z","updatedAt":"2015-07-09T08:31:06.043Z"},{"tr":true,"name":"股票","objectId":"559e37a1e4b0796c196157c7","createdAt":"2015-07-09T08:58:09.104Z","updatedAt":"2015-07-09T08:58:09.104Z"},{"tr":true,"name":"期货","objectId":"559e37bce4b0796c196159a3","createdAt":"2015-07-09T08:58:36.434Z","updatedAt":"2015-07-09T08:58:36.434Z"},{"tr":true,"name":"外汇","objectId":"559e37cbe4b0796c19615afe","createdAt":"2015-07-09T08:58:51.463Z","updatedAt":"2015-07-09T08:58:51.463Z"}];
				//var userinfo = {"username":"fu65748","emailVerified":false,"mobilePhoneVerified":false,"objectId":"559e2843e4b07a1ae5770125","createdAt":"2015-07-09T07:52:35.684Z","updatedAt":"2015-07-09T07:52:35.684Z"};
				var rooms = [];
				for(var i = 0; i < results.length; i++) {
					rooms[i] = results[i].toJSON();
				}
				console.log("login user is: %j", user);
				var loginUser = user.username;
				console.log("login name is: " + loginUser);
				console.log(loginUser);
				res.render('chat.ejs', {chatRooms: rooms, username: loginUser});
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	},function(error) {
		res.redirect('/hello');
	});
});

//查看用户profile信息
app.get('/profile', function(req,res) {
	if(req.AV.user) {
		res.send(req.AV.user);
	}
	else {
		res.redirect('/login');
	}
});

//调用此url来登出帐号
app.get('/logout', function(req, res) {
	// AV.Cloud.CookieSession 将自动清除登录 cookie 信息
	AV.User.logOut();
	res.redirect('/profile');
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
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

// error router
/*
app.get('/loginError', function(req, res) {
  res.render('Error', { message: '用户名密码输入有误，请重新输入！' });
});

app.get('/registerError', function(req, res) {
	res.render('Error', {message: '用户名或密码不能为空！'});
})
*/

app.get('/chatrooms', function(req, res) {
	if(req.AV.user) {
		var user = req.AV.user;
		query.find({
			success:function(results) {
				var rooms = [];
				for(var i = 0; i < results.length; i++) {
					rooms[i] = results[i].toJSON();
				}
				var loginUser = user.get("username");
				res.render('chat.ejs', {chatRooms: rooms, username: loginUser});
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});		
	}
	else {
		res.redirect('/login');
	}
});

app.get('/login', function(req, res) {
	res.render('index');
});

//点击登录页面的提交将出发下列函数
app.post('/login', function(req, res) {
	AV.User.logIn(req.body.username, req.body.password).then(function(user) {
		res.redirect('/chatRooms');
	},function(error) {
		res.render('Error', { message: '用户名密码输入有误，请重新输入！' });
	});
});

//注册用户
app.get('/signup_form', function(req, res) {
	res.render('signup_form.ejs');
});
app.post('/signup_form', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var sex = req.body.sex;
	if(!username || username.trim().length ==0 || !password || password.trim().length ==0) {
		res.render('Error', {message: '用户名或密码不能为空！'});
	}
	var user = new AV.User();
	user.set("username", username);
	user.set("password", password);
	user.set("sex", sex);
	user.signUp(null, {
		success: function(user) {
			res.redirect('/login');
		},
		error: function(user, err) {
			res.render('Error', {message: '用户注册失败！'});
		}
	})
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
	res.redirect('/login');
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
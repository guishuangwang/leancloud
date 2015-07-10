// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var AV = require('leanengine');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(AV.Cloud);

// 加载 cookieSession 以支持 AV.User 的会话状态
app.use(AV.Cloud.CookieSession({secret: 'JYH secret', maxAge: 3600000, fetchUser: true}));

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/login', function(req, res) {
	res.render('login.ejs');
});

//点击登录页面的提交将出发下列函数
app.post('/login', function(req, res) {
	AV.User.logIn(req.body.username, req.body.password).then(function() {
		//登录成功，AV.Cloud.CookieSession 会自动将登录用户信息存储到 cookie跳转到profile页面。
		console.log('signin successfully: %j', req.AV.user);
    	res.redirect('/profile');
	},function(error) {
		res.redirect('/login');
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
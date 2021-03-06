var appId = 'k3nd81u9ze5gwxxhx0mrwt8bcmce9k55lxn8vny9o27n88tr';
var roomId, clientId, rt, room;
var connected = false;
var historyFlag = false;
var msgTime;
var chatWindow;
var hasMore = false;

function encodeHTML (source) {
	return String(source)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
}

function formatTime(time) {
	var date = new Date(time);
	var month = date.getMonth() + 1 < 10? '0'+(date.getMonth()+1): date.getMonth()+1;
	var currentDate = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
	var hh = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
	var mm = date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes();
	var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return date.getFullYear() + '-' + month + '-' + currentDate + ' ' + hh + ':' + mm + ':' + ss;
}

function init () {
	msgTime = undefined;
	hasMore = false;
	showTips('正在连接服务器，请等待。。。');
	if(connected) {
		rt.close();
	}
	
	//创建实时通信实例
	rt = AV.realtime({
		appId: appId,
		clientId: clientId
	});
	
	rt.on('open', function() {
		connected = true;
		showTips('服务器连接成功！');
		
		//获取房间实例
		rt.room(roomId, function(object) {
			if(object) {
				room = object;
				//join this room
				room.join(function() {
					showTips('您已经加入本聊天室，可以开始聊天。');
				});
				
				// loading the history
				loadChatHistory();
				
				//receive the message
				room.receive(function(data) {
					if(!msgTime) {
						msgTime = data.timestamp;
					}
					var text = '';
					var from = data.fromPeerId;
					if(data.msg.type) {
						text = data.msg.text;
					}
					else {
						text = data.msg;
					}
					//showMsg(formatTime(data.timestamp) + " " + encodeHTML(from) + ": " + text, false);
					showMessages(from, text, formatTime(data.timestamp), false);
				});

			}
			else {
				
			}
		});
	});
	
	rt.on('reuse', function() {
		showTips('服务器正在重连，请耐心等待。。。');
	});
	
	rt.on('error', function() {
		showTips('连接遇到错误。。。');
	});
}

function chatWithMe(chatRoom){

	// hide intro stuff
	$('.intro').remove();
	
	// getting users'stuff
	var roomname = $(chatRoom).attr('data-roomname');
	var info = $(chatRoom).attr('data-info');
	roomId = $(chatRoom).attr('data-id');
	clientId = $(chatRoom).attr('data-client');
	var pic = $(chatRoom).find('img.img-thumbnail').clone().addClass('pull-right').removeClass('pull-left');
	
	// hide inbox
	$('.inbox_container').hide();
	
	// inserting info in chat
	$('.chat_messages .panel .panel-body h4').html(roomname);
	$('.chat_messages .panel .panel-body span').html(info);
	$('.chat_messages .panel .panel-body .user_pic').html('').append(pic);
	
	// hide ads & show chatbox
	$('.body_ads').hide();
	$('.toggle').hide();
	$('.chat_container, .chat_messages').removeClass('hideme').show();
	
	$('input[type=text].msg_content').focus();
	
	//clear the chat rooms messages
	$("#messages_container").html("");
	
	chatWindow = $("#messages_container");
	//initialize the chat room
	init();

	//bind the scroll event to the chat window.
	chatWindow.scroll(function() {
		if(chatWindow.scrollTop() <= 1) {
			if(hasMore) return;
			else {
				var more = $("<p class='more' style='text-align: center;'><a style='cursor: pointer; text-decoration: none; font-size: 12px;'>查看更多消息</a></p>");
				$('#messages_container').prepend(more);
				hasMore = true;	
				more.click(loadChatHistory);							
			}

		}
	});
}

function loadChatHistory() {
	if(historyFlag) {
		return;
	}
	else {
		historyFlag = true;
	}
	room.log({
		t: msgTime
	},function(data) {
		historyFlag = false;
		var len = data.length;
		if(len) msgTime = data[0].timestamp;
		for(var i = len-1; i>=0; i--) {
			var text = '';
			var from = data[i].fromPeerId;
			if(data[i].msg.type) {
				text = data[i].msg.text;
			}
			else {
				text = data[i].msg;
			}
			//showMsg(formatTime(data[i].timestamp) + " " + encodeHTML(from) + ": " + text, true);
			showMessages(from, text, formatTime(data[i].timestamp), true);
			$(".more").remove();
			hasMore = false;	
		}
	});
}

function sendMsg(){
	if(!connected) {
		return;
	}
	var msg = $('#msg_content').val();
	// sending the message to the server and display the msg we sent.
	room.send({
		text: msg
	}, {
		type: 'text'
	}, function(data) {
		//callback when msg sent successfully
		// clear input
		$('#msg_content').val("");
		//showMsg(formatTime(data.t) + " " + msg, false);
		showMessages(clientId, msg, formatTime(data.t), false);
	});
}

function showMsg(msg, isBefore) {
	var p = document.createElement('p');
	p.innerHTML = msg;
	if(isBefore) {
		$('#messages_container').prepend(p);
		
	}
	else {
		$('#messages_container').append(p);
		//adjust the chat window's scroll bar
		chatWindow.scrollTop(chatWindow[0].scrollHeight - chatWindow.height());
	}
}

function showTips(msg) {
	var tips = $("<p style='color: #999; text-align: center; font-size: 12px;'></p>").text(msg);
	$('#messages_container').append(tips);
	//adjust the chat window's scroll bar
	chatWindow.scrollTop(chatWindow[0].scrollHeight - chatWindow.height());
}

function showMessages(from, msg, timestamp, isBefore) {
	var message;
	if(from === clientId) {
		message = $("<div class='message-wrapper'><img class='profile-pic right' src='/img/avatar.jpg' ><div class='chat-bubble right'><div class='message'>"+msg+"</div><div class='message-detail-self'><span class='tips'>"+from+"</span>&nbsp&nbsp<span class='tips'>"+timestamp+"</span></div></div></div>")
	}
	else {
		message = message = $("<div class='message-wrapper'><img class='profile-pic left' src='/img/avatar.jpg' ><div class='chat-bubble left'><div class='message'>"+msg+"</div><div class='message-detail-others'><span class='tips'>"+from+"</span>&nbsp&nbsp<span class='tips'>"+timestamp+"</span></div></div></div>")
	}
	if(isBefore) {
		$('#messages_container').prepend(message);
		
	}
	else {
		$('#messages_container').append(message);
		//adjust the chat window's scroll bar
		chatWindow.scrollTop(chatWindow[0].scrollHeight - chatWindow.height());
	}
}
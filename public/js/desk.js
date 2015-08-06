var appId = 'k3nd81u9ze5gwxxhx0mrwt8bcmce9k55lxn8vny9o27n88tr';
var roomId, clientId, rt, room;
var connected = false;
var historyFlag = false;
var msgTime;

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
	showMsg('正在连接服务器，请等待。。。');
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
		showMsg('服务器连接成功！');
		
		//获取房间实例
		rt.room(roomId, function(object) {
			if(object) {
				room = object;
				//join this room
				room.join(function() {
					showMsg('已经加入，可以开始聊天。');
				});
				
				//receive the message
				room.receive(function(data) {
					if(!msgTime) {
						msgTime = data.timestamp;
					}
					showMsg(data);
				});

			}
			else {
				
			}
		});
	});
	
	rt.on('reuse', function() {
		showMsg('服务器正在重连，请耐心等待。。。');
	});
	
	rt.on('error', function() {
		showMsg('连接遇到错误。。。');
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
	
	//initialize the chat room
	init();
	
	// loading the history
	loadChatHistory(roomId);
}

function loadChatHistory(roomId) {
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
			showMsg(data[i], true);
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
		showMsg(data.t + msg, false);
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
	}
}

function loadConnectedUsers(page,auto){
	
}




/*
function getInbox(){
	active = 'inbox';
	$('.toggle, .intro').hide();
	$('.inbox_container').html('<br/><br/><div class="text-center"><img src="'+root+'img/myloader_2.gif"/></div>').show();
	$('.inbox_container').load(root+'user/getInboxDesk/');
}

function getHistory(){
	active = 'history';
	$('.toggle, .intro').hide();
	$('.inbox_container').html('<br/><br/><div class="text-center"><img src="'+root+'img/myloader_2.gif"/></div>').show();
	$('.inbox_container').load(root+'user/getHistoryDesk/');
}

function searchNow(){
		var country = $('select[name=pays] option:selected').val();
		var gender  = $('input[name=sexe]:checked').val()
		var username= $('#username').val();
		
		
		if (country=='')
		{
			country = '0';
		}
		
	
		if (username == '' || username == undefined)
		username = '0';
		
		active = 'search';
		$('.bottom-controls').hide();
 		$('.connected_users').load(root+'user/getSearchResults/'+gender+"/"+country+"/"+username);
}

function getSearchForm(){
	$('.toggle').hide();
	$('.search_form_container').html('<br/><br/><div class="text-center"><img src="'+root+'img/myloader_2.gif"/></div>').show().load(root+'user/getSearchForm/');
}
*/
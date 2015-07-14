function chatWithMe(partner){

	// hide intro stuff
	$('.intro').remove();
	
	// getting users'stuff
	var id_partner 	 = $(partner).attr('data-id');
	var sexe = $(partner).attr('data-sexe');
	var username = $(partner).attr('data-username');
	var city = $(partner).attr('data-city');
	var country = $(partner).attr('data-country');
	var age = $(partner).attr('data-age');
	var pic = $(partner).find('img.img-thumbnail').clone().addClass('pull-right').removeClass('pull-left');
	
	// hide inbox
	$('.inbox_container').hide();
	
	if (sexe == 'homme') sexe = 'male';
	else if (sexe == 'femme') sexe = 'female';
	
	// inserting info in chat
	$('.chat_messages .panel .panel-body h4').html(username);
	$('.chat_messages .panel .panel-body span').html(sexe+", "+age+" Years old, from "+city+", "+country);
	$('.chat_messages .panel .panel-body span').attr('data-id',id_partner);
	$('.chat_messages .panel .panel-body .user_pic').html('').append(pic);
	
	// hide ads & show chatbox
	$('.body_ads').hide();
	$('.toggle').hide();
	$('.chat_container, .chat_messages').removeClass('hideme').show();
	
	
	
	$('input[type=text].msg_content').focus();
	
	// gestion des classes : active/femme/homme
	$('.connected_users .list-group-item').removeClass('active').each(function(){$(this).addClass($(this).attr('data-sexe'));});
	$(partner).removeClass(sexe).addClass('active');
	
	// loading the history
	loadChatHistory(id_partner);
	
	/*
if (active == 'inbox')
		getInbox();
*/
}

function loadConnectedUsers(page,auto){
	
	if (active != 'search'){
		//active = 'home';
		if (auto == undefined)
		$('.connected_users').html('<br/><br/><div class="text-center"><img src="'+root+'img/myloader_2.gif"/></div>');
		
		$('.connected_container').load(root+'user/getConnected/'+page, function(response, status, xhr){
			if (response == 'out')
				logout();
				}).css('height','0px');
		console.log('refreshing page '+page+' | updatingActivity'); 	
	}
}

function sendMsg(){
	//e.preventDefault();
	var msg 	    = document.msg.msg_content.value;
	var id_partner  = $('.chat_messages .panel .panel-body span').attr('data-id');
	

	// sending the message
	$.get(root+'user/sendMsg/'+id_partner+'/'+encodeURIComponent(msg),{},function(data){
		//loadChatHistory(id_partner);
		
		// hide form show sucess msg
		/*** disarearing bug  ***/
		//$('form#msg').addClass('hideme').hide();
		//$('.alert.alert-success').removeClass('hideme').show();
		
		// loading the history
		loadChatHistory(id_partner);

		//setTimeout(showAdsBody, 2000);
		// show ads & hide chatbox
	});
	
	// clear input
	document.msg.msg_content.value = "";
	$('.smilies').hide();
	
	// refresh inbox
	/*
if (active == 'inbox'){
		getInbox();
	}
*/
	
	//reloadTopAds();
	//reloadBodyAds();
	//adOrder++; 
}

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